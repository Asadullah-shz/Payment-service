const PaymentModel = require("../model/payment")
const GatewayFactory = require('../../../gateway/gateway.factory');
const axios = require('axios');
const EventBus = require('../../../EventBus/eventBus.service');

async function PaymentCreation(req, res) {


    const { merchantId, amount, description } = req.body

    try {
        if (!merchantId || !amount) {
            return res.status(400).json({ message: "merchantId and amount are required" })
        }


        let preferredGateway = 'stripe';
        try {
            const merchantResponse = await axios.get(`http://localhost:5000/merchant/${merchantId}`);
            const merchant = merchantResponse.data.merchant;
            preferredGateway = merchant?.preferredGateway || 'stripe';
        } catch (error) {
            console.error("Warning: Could not fetch merchant details, defaulting to stripe.", error.message);
        }

        const gateway = GatewayFactory.get(preferredGateway);

        let gatewayResponse;
        try {
            gatewayResponse = await gateway.createPayment({
                merchantId,
                amount,
                currency: 'usd',
                description,
                metadata: { merchantId }
            });
        } catch (error) {
            console.error("Gateway createPayment error:", error.message);
            return res.status(500).json({ message: "Failed to create payment via Gateway", details: error.message });
        }


        const PaymentConfig = await PaymentModel.create({
            merchantId,
            stripeConfigId: gatewayResponse.providerConfigId,
            paymentIntentId: gatewayResponse.providerPaymentId,
            clientSecret: gatewayResponse.clientSecret,
            amount,
            description,
            status: "pending",
        })

  
        EventBus.publish('payment.created', {
            merchantId,
            paymentId: PaymentConfig._id,
            amount,
            status: "pending"
        }).catch(err => console.error("Failed to publish payment.created event:", err));

        res.status(200).json({
            message: 'Payment Successfully Initiated',
            clientSecret: gatewayResponse.clientSecret,
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
        let preferredGateway = 'stripe';
        try {
            const merchantResponse = await axios.get(`http://localhost:5000/merchant/${paymentvalidation.merchantId}`);
            const merchant = merchantResponse.data.merchant;
            preferredGateway = merchant?.preferredGateway || 'stripe';
        } catch (error) {
            console.error("Warning: Could not fetch merchant details, defaulting to stripe.", error.message);
        }

        const gateway = GatewayFactory.get(preferredGateway);

        let gatewayResponse;
        try {
            gatewayResponse = await gateway.cancelPayment(paymentvalidation.paymentIntentId, paymentvalidation.merchantId);
        } catch (error) {
            return res.status(500).json({ message: "Failed to cancel payment with Gateway", details: error.message });
        }

        const payment = await PaymentModel.findByIdAndUpdate(
            paymentId,
            { status: "cancelled" },
            { new: true }
        );

        EventBus.publish('payment.cancelled', {
            merchantId: payment.merchantId,
            paymentId: payment._id,
            status: "cancelled"
        }).catch(err => console.error("Failed to publish payment.cancelled event:", err));

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
        if (status === 'succeeded' || status === 'refunded') {
            try {

                const txStatus = status === 'succeeded' ? 'completed' : status;

                await axios.post('http://localhost:11000/transaction/create', {
                    paymentId: paymentUpdater._id,
                    userId: paymentUpdater.userId,
                    merchantId: paymentUpdater.merchantId,
                    amount: req.body.amount || paymentUpdater.amount,
                    currency: req.body.currency || 'USD',
                    providerTransactionId: req.body.latest_charge,
                    status: txStatus
                });
            } catch (err) {
                console.error("Failed to notify transaction service:", err.message);
            }
        }

       
        if (status === 'succeeded' || status === 'failed') {
            EventBus.publish(`payment.${status}`, {
                merchantId: paymentUpdater.merchantId,
                paymentId: paymentUpdater._id,
                amount: paymentUpdater.amount,
                status: status
            }).catch(err => console.error(`Failed to publish payment.${status} event:`, err));
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


async function initiateRefund(req, res) {
    const { paymentId, amount, reason } = req.body;

    try {
        if (!paymentId) {
            return res.status(400).json({ message: "paymentId is required" });
        }

        const payment = await PaymentModel.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        if (payment.status !== 'succeeded' && payment.status !== 'completed' && payment.status !== 'pending') {

            return res.status(400).json({ message: `Payment cannot be refunded. Current status: ${payment.status}` });
        }

        const merchantId = req.user?.id || payment.merchantId;


        let preferredGateway = 'stripe';
        try {
            const merchantResponse = await axios.get(`http://localhost:5000/merchant/${merchantId}`);
            const merchant = merchantResponse.data.merchant;
            preferredGateway = merchant?.preferredGateway || 'stripe';
        } catch (error) {
            console.error("Warning: Could not fetch merchant details, defaulting to stripe.", error.message);
        }

        const gateway = GatewayFactory.get(preferredGateway);

        let gatewayResponse;
        try {
            gatewayResponse = await gateway.refundPayment({
                merchantId: merchantId,
                paymentId: payment.paymentIntentId,
                amount: amount,
                reason: reason
            });
        } catch (error) {
            console.error("Failed to initiate refund via Gateway:", error.message);
            return res.status(500).json({ message: "Failed to initiate refund with Gateway", details: error.message });
        }


        try {
            await axios.post(`http://localhost:13000/refund/create`, {
                merchantId: merchantId,
                providerRefundId: gatewayResponse.providerRefundId,
                amount: gatewayResponse.amount,
                currency: gatewayResponse.currency,
                reason: reason || "requested_by_customer"
            });
        } catch (error) {
            console.error("Failed to save initial refund record in Refund Service:", error.message);
        }

        EventBus.publish('refund.created', {
            merchantId: merchantId,
            paymentId: payment.paymentIntentId,
            amount: gatewayResponse.amount,
            status: "pending"
        }).catch(err => console.error("Failed to publish refund.created event:", err));

        res.status(200).json({
            message: "Refund Initiated Successfully",
            refund: gatewayResponse
        });

    } catch (error) {
        console.error("Error initiating refund:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

module.exports = { PaymentCreation, getAllPayments, getPaymentById, cancelPayment, PaymentStatusById, PaymentStatusUpdateById, initiateRefund }