const mongoose = require("mongoose")

const MerchantSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    businessName: {

        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    preferredGateway: {
        type: String,
        default: 'stripe'
    }
})

const MerchantModel = mongoose.model("merchants", MerchantSchema)

module.exports = MerchantModel