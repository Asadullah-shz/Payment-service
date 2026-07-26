const mongoose = require("mongoose")

const PaymentSchema = new mongoose.Schema({
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "merchants",
        required: true
    },
    stripeConfigId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stripe",
    },
    paymentIntentId: {
        type: String,
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'usd'
    },
    customer: {
        type: String
    },
    description: {
        type: String
    },
    metadata: {
        type: Object
    },
    successUrl: {
        type: String
    },
    cancelUrl: {
        type: String
    },
    clientSecret: {
        type: String
    },
    status: {
        type: String
    }
}, {
    timestamps: true
})

const PaymentModel = mongoose.model("payments", PaymentSchema)

module.exports = PaymentModel
