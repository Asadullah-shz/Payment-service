const mongoose = require('mongoose');

const WebhookDeliverySchema = new mongoose.Schema(
    {
        merchantId: {
            type: String,
            required: true,
            index: true,
        },
        webhookEndpointId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'WebhookEndpoint',
            required: true,
        },
        eventId: {
            type: String,
            required: true,
            index: true,
        },
        eventType: {
            type: String,
            required: true,
        },
        payload: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        status: {
            type: String,
            enum: ['PENDING', 'PROCESSING', 'DELIVERED', 'FAILED', 'RETRYING'],
            default: 'PENDING',
            index: true,
        },
        responseCode: {
            type: Number,
            default: null,
        },
        responseBody: {
            type: String,
            default: null,
        },
        attempts: {
            type: Number,
            default: 0,
        },
        deliveredAt: {
            type: Date,
            default: null,
        },
        lastAttemptAt: {
            type: Date,
            default: null,
        },
        nextRetryAt: {
            type: Date,
            default: null,
            index: true, 
        },
        errorMessage: {
            type: String,
            default: null,
        }
    },
    {
        timestamps: true,
    }
);

const WebhookDelivery = mongoose.model('WebhookDelivery', WebhookDeliverySchema);
module.exports = WebhookDelivery;
