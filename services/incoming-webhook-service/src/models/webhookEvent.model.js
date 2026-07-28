const mongoose = require("mongoose");

const WebhookEventSchema = new mongoose.Schema(
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
        eventId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        eventType: {
            type: String,
            required: true,
            index: true,
        },
        resourceId: {
            type: String,
            required: true,
        },
        payload: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        processed: {
            type: Boolean,
            default: false,
            index: true,
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

const WebhookEventModel = mongoose.model("WebhookEvent", WebhookEventSchema);
module.exports = WebhookEventModel;