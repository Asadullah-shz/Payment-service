const mongoose = require('mongoose');

const WebhookEndpointSchema = new mongoose.Schema(
    {
        merchantId: {
            type: String,
            required: true,
            index: true,
        },
        url: {
            type: String,
            required: true,
        },
        secret: {
            type: String,
            required: true,
        },
        events: {
            type: [String],
            required: true,
            default: ['*'], 
        },
        description: {
            type: String,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        }
    },
    {
        timestamps: true,
    }
);

const WebhookEndpoint = mongoose.model('WebhookEndpoint', WebhookEndpointSchema);
module.exports = WebhookEndpoint;
