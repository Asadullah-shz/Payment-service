const MerchantModel = require("../model/merchant")
const axios = require('axios');


async function MerchantRegister(req, res) {

    const { businessName, country, currency } = req.body
    try {

        const userId = req.user.id

        const isMerchantAlreadyExist = await MerchantModel.findOne({
            businessName,
        })

        if (isMerchantAlreadyExist) {
            return res.status(409).json({

                message: "Merchant is Already Existing"

            })
        }


        const merchant = await MerchantModel.create({
            userId,
            businessName,
            country,
            currency,
        })

        await axios.put('http://localhost:3000/auth/update-role', {
            userId: userId,
            newRole: 'merchant'
        });

        res.status(200).json({
            message: 'Merchant Registered Sucessfully',
            merchant: {
                businessName,
            }
        })




    } catch (error) {


        if (error == 404) {
            return res.status(404).json({
                message: "Serverside Issue ,Currently fixing try again later"

            })
        }

        console.error("Error in merchantRegister:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message || error
        })

    }

}

async function MerchantDetail(req, res) {

    const userId = req.user.id

    try {
        const detail = await MerchantModel.findOne({
            userId,
        })

        if (!detail) {
            return res.status(404).json({
                message: "Merchant not found"
            });
        }

        res.status(200).json({
            message: "Details Successfully Retrieved",
            detail
        })


    }
    catch (error) {
        console.error("Error fetching merchant details:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

async function UpdateMerchant(req, res) {

    const userId = req.user.id
    const { businessName, currency, country } = req.body

    try {
        const getdetail = await MerchantModel.findOne({
            userId,
        })


        if (!getdetail) {
            return res.status(404).json({
                message: "Merchant not found"
            });
        }


        const update = await MerchantModel.findOneAndUpdate(
            { userId: userId },
            {
                businessName: businessName,
                currency: currency,
                country: country
            },
            { new: true }
        )

        if (!update) {
            return res.status(404).json({
                message: "Merchant not found"
            })
        }



        res.status(200).json({
            message: "Merchant Sucessfully Updated",
            update

        })


    }
    catch (error) {
        console.error("Error updating merchant details:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }

}

async function getMerchantById(req, res) {
    const { id } = req.params;
    try {
        const merchant = await MerchantModel.findById(id);
        if (!merchant) {
            return res.status(404).json({ message: "Merchant not found" });
        }
        res.status(200).json({ merchant });
    } catch (error) {
        console.error("Error fetching merchant by ID:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = { MerchantRegister, MerchantDetail, UpdateMerchant, getMerchantById }