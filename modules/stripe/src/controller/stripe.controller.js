const StripeModel = require("../model/stripe")
const stripe = require("stripe");

async function StripeRegister(req, res) {

    const { secretKey, publishableKey, webhookSecret, mode } = req.body
    try {

        const merchantId = req.user.id

        const isStripeAlreadyExist = await StripeModel.findOne({
            merchantId,
        })

        if (isStripeAlreadyExist) {
            return res.status(409).json({

                message: "Stripe is Already Attached"

            })
        }


        const StripeConfig = await StripeModel.create({
            merchantId,
            secretKey,
            publishableKey,
            webhookSecret,
            mode,
        })


        res.status(200).json({
            message: 'Stripe Connected Sucessfully',
        })




    } catch (error) {


        if (error == 404) {
            return res.status(404).json({
                message: "Serverside Issue ,Currently fixing try again later"

            })
        }

        console.error("Error in StripeConnection:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message || error
        })

    }

}



async function UpdateStripe(req, res) {

    const merchantId = req.merchant.id
    const { secretKey, publishableKey, webhookSecret, mode } = req.body

    try {
        const updatedStripe = await StripeModel.findOneAndUpdate(
            { merchantId: merchantId },
            {
                secretKey: secretKey,
                publishableKey: publishableKey,
                webhookSecret: webhookSecret,
                mode: mode
            },
            { new: true }
        )

        if (!updatedStripe) {
            return res.status(404).json({
                message: "Stripe configuration not found"
            })
        }


        res.status(200).json({
            message: "Stripe Config Updated Sucessfully",
            update: updatedStripe
        })


    }
    catch (error) {
        console.error("Error updating stripe details:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }

}

async function GetMerchantconfigbyID(req, res) {
   
    const merchantId = req.params.merchantId;

    try {
        const merchantConfig = await StripeModel.findOne({ merchantId });

        if (!merchantConfig) {
            return res.status(404).json({
                message: "Merchant Stripe Config does not exist"
            });
        }

        res.status(200).json({
            message: "Merchant Config Fetched Successfully",
            result: merchantConfig
        });
    } catch (error) {
        console.error("Error fetching stripe config:", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function createRefund(req, res) {
    const { merchantId, paymentIntentId, amount, reason } = req.body;

    try {
        if (!merchantId || !paymentIntentId) {
            return res.status(400).json({ message: "merchantId and paymentIntentId are required" });
        }

        const stripeConfig = await StripeModel.findOne({ merchantId });
        
        if (!stripeConfig || !stripeConfig.secretKey) {
            return res.status(404).json({ message: "Stripe configuration not found for this merchant" });
        }

        const stripeClient = stripe(stripeConfig.secretKey);

        const refundParams = {
            payment_intent: paymentIntentId,
        };
        
        if (amount) {
            refundParams.amount = amount; 
        }
        
        if (reason) {
            refundParams.reason = reason;
        }

        const refund = await stripeClient.refunds.create(refundParams);
        
        return res.status(200).json({
            message: "Refund initiated successfully",
            refund: refund
        });

    } catch (error) {
        console.error("Error creating stripe refund:", error);
        return res.status(500).json({
            message: "Stripe Error",
            error: error.message
        });
    }
}

module.exports = { StripeRegister, UpdateStripe, GetMerchantconfigbyID, createRefund }