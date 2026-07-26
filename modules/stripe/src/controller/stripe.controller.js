const StripeModel = require("../model/stripe.model")


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

    const merchantId = req.user.id
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

module.exports = { StripeRegister, UpdateStripe}