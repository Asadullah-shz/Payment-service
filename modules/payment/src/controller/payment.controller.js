const PaymentModel = require("../model/payment")
const stripe = require('stripe');
const axios = require('axios');

async function PaymentCreation(req, res) {


    const { merchantId, amount, description } = req.body

    try {
        if (!merchantId || !amount) {
            return res.status(400).json({ message: "merchantId and amount are required" })
        }


        let merchantStripeConfig;
        try {
            console.log(`Making request to Stripe Service for merchant: ${merchantId}`);
            const stripeResponse = await axios.get(`http://localhost:7000/stripe/getconfig/${merchantId}`);
            merchantStripeConfig = stripeResponse.data.result;
            console.log("Successfully fetched from Stripe Service:", merchantStripeConfig);
        } catch (error) {
            if (error.response) {

                console.error("Stripe Service returned an error status:", error.response.status);
                console.error("Stripe Service error data:", error.response.data);
                return res.status(error.response.status).json({
                    message: "Error from Stripe Microservice",
                    details: error.response.data
                });
            } else if (error.request) {

                console.error("No response received from Stripe Service. Is it running on port 7000?", error.message);
                return res.status(503).json({ message: "Stripe Microservice is unreachable" });
            } else {
                console.error("Axios request setup error:", error.message);
                return res.status(500).json({ message: "Internal Server Error setting up Axios" });
            }
        }

        if (!merchantStripeConfig || !merchantStripeConfig.secretKey) {
            return res.status(404).json({ message: "Merchant Stripe configuration is missing secret key" });
        }


        const stripeClient = stripe(merchantStripeConfig.secretKey);


        const paymentIntent = await stripeClient.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            description: description,
            metadata: { merchantId: merchantId }
        });


        const PaymentConfig = await PaymentModel.create({
            merchantId,
            stripeConfigId: merchantStripeConfig._id,
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
            amount,
            description,
            status: "pending",
        })


        res.status(200).json({
            message: 'Payment Successfully Initiated',
            clientSecret: paymentIntent.client_secret,
            payment: PaymentConfig
        })

    } catch (error) {
        console.error("Error in Payment Processing:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message || error
        })
    }
}


async function getAllPayments(req, res) {
    try {
        let query = {};
        if (req.user) {
            if (req.user.role === 'merchant') {
                query.merchantId = req.user.id;
            } else if (req.user.role === 'user') {
                query.userId = req.user.id;
            } else {
                return res.status(403).json({ message: "Access denied." });
            }
        } else {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const paymentRecords = await PaymentModel.find(query).populate("succeeded").limit(10);

        res.status(200).json({
            message: "Payment Records Fetched Successfully",
            payments: paymentRecords,
        })

    } catch (error) {
        console.error("Error in Payments Fetching :", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message || error
        })
    }
}


async function getPaymentById(req, res) {

    const paymentId = req.params.id;

    try {
        if (!paymentId) {
            return res.status(400).json({ message: "Payment ID is required" })
        }

        const paymentRecord = await PaymentModel.findById(paymentId);

        if (!paymentRecord) {
            return res.status(404).json({
                message: "Payment record not found"
            })
        }

        // Security check: ensure the requester owns this payment record
        if (req.user) {
            if (req.user.role === 'user' && paymentRecord.userId?.toString() !== req.user.id) {
                return res.status(403).json({ message: "Access denied. You can only view your own payments." });
            }
            if (req.user.role === 'merchant' && paymentRecord.merchantId?.toString() !== req.user.id) {
                return res.status(403).json({ message: "Access denied. You can only view payments made to your merchant account." });
            }
        }

        res.status(200).json({
            message: "Payment Record Fetched Successfully",
            payment: paymentRecord,
        })

    } catch (error) {
        console.error("Error in Payment record Fetching :", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message || error
        })
    }
}

async function cancelPayment(req, res) {
    const paymentId = req.body.paymentId;

    try {
        if (!paymentId) {
            return res.status(400).json({ message: "paymentId is required in the request body" });
        }

        const paymentvalidation = await PaymentModel.findById(paymentId);

        if (!paymentvalidation) {
            return res.status(404).json({
                message: "No Payment Exist in Database"
            })
        }

        if (paymentvalidation.status === "cancelled") {
            return res.status(400).json({ message: "Payment is already cancelled" });
        }


        let merchantStripeConfig;
        try {
            const stripeResponse = await axios.get(`http://localhost:7000/stripe/getconfig/${paymentvalidation.merchantId}`);
            merchantStripeConfig = stripeResponse.data.result;
        } catch (error) {
            console.error("Stripe Service error during cancel:", error.message);
            return res.status(404).json({ message: "Merchant Stripe configuration not found in Stripe Microservice" });
        }

        if (!merchantStripeConfig || !merchantStripeConfig.secretKey) {
            return res.status(404).json({ message: "Merchant Stripe configuration is missing secret key" });
        }


        const stripeClient = stripe(merchantStripeConfig.secretKey);

        try {

            await stripeClient.paymentIntents.cancel(paymentvalidation.paymentIntentId);
        } catch (stripeError) {
            console.error("Stripe API failed to cancel:", stripeError.message);
            return res.status(400).json({ message: "Failed to cancel payment in Stripe", error: stripeError.message });
        }


        const payment = await PaymentModel.findByIdAndUpdate(
            paymentId,
            { status: "cancelled" },
            { new: true }
        );

        res.status(200).json({
            message: "Payment Successfully Cancelled",
            payment
        })

    } catch (error) {
        console.error("Error in Payment Cancellation:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message || error
        })
    }
}

async function PaymentStatusById(req, res) {

    const paymentId = req.params.id;

    try {
        if (!paymentId) {
            return res.status(400).json({ message: "paymentId is required in the URL" });
        }

        const payment = await PaymentModel.findById(paymentId);

        if (!payment) {
            return res.status(404).json({
                message: "No Payment Exist in Database"
            })
        }

        res.status(200).json({
            message: "Payment Status Received",
            paymentStatus: payment.status,
        })

    } catch (error) {
        console.error("Error in Payment Status:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message || error
        })
    }
}

async function PaymentStatusUpdateById(req, res) {
    const { status } = req.body;
    
    const paymentIntentId = req.params.paymentIntentId; 
    try {
        if (!paymentIntentId) {
            return res.status(400).json({ message: "paymentIntentId is required" });
        }
      
        const paymentUpdater = await PaymentModel.findOneAndUpdate(
            { paymentIntentId: paymentIntentId },
            { status: status },
            { new: true } 
        );
        if (!paymentUpdater) {
            return res.status(404).json({
                message: "No Payment Exist in Database"
            });
        }
        if (status === 'succeeded') {
            try {
                await axios.post('http://localhost:11000/transaction/create', { 
                    paymentId: paymentUpdater._id,
                    userId: paymentUpdater.userId,
                    merchantId: paymentUpdater.merchantId,
                    amount: req.body.amount,
                    currency: req.body.currency,
                    providerTransactionId: req.body.latest_charge,
                    status: 'completed'
                });
            } catch (err) {
                console.error("Failed to notify transaction service:", err.message);
            }
        }

        res.status(200).json({
            message: "Payment Status Updated",
            paymentUpdaterStatus: paymentUpdater.status,
        });
    } catch (error) {
        console.error("Error in Payment Status:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message || error
        });
    }
}


module.exports = { PaymentCreation, getAllPayments, getPaymentById, cancelPayment, PaymentStatusById,PaymentStatusUpdateById }