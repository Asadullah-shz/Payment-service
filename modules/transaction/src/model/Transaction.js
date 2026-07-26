const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema({

    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "merchants",
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "payments",
    },
    provider: {
        type: String,
    },
    providerTransactionId: {
        type: String,
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'], 
        default: 'pending'
    },
    fee: {
        type: Number,
    },
    netAmount: {
        type: Number,
    },
    receiptUrl: {
        type: String,
    }
})

const TransactionModel = mongoose.model("transaction", TransactionSchema)

module.exports = TransactionModel