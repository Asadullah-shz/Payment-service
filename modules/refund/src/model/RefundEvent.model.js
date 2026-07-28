const mongoose = require("mongoose");

const RefundSchema = new mongoose.Schema(
    {
        merchantId: {
            type: String,
            default: "unknown",
            index: true,
        },
        provider: {
            type: String,
            default: "stripe",
            required: true,
        },
       providerRefundId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
        },
        reason: {
            type:String,
            required: true,
        },
        metadata: {
            type: Boolean,
            default: false,
        },
        processedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);









const RefundModel = mongoose.model("RefundEvent", RefundSchema);
module.exports = RefundModel;