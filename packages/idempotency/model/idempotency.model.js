const mongoose = require("mongoose");

const IdempotencyKeySchema = new mongoose.Schema(
    {
        merchantId: {
            type: String,
            required: true,
            index: true,
        },
        apiKeyId: {
            type: String,
            default: null,
        },
        key: {
            type: String,
            required: true,
            maxlength: 255, 
        },
        requestHash: {
            type: String,
            required: true,
        },
        method: {
            type: String,
            required: true,
        },
        endpoint: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['PROCESSING', 'COMPLETED', 'FAILED', 'EXPIRED','Refunded'],
            default: 'PROCESSING',
        },
        statusCode: {
            type: Number,
            default: null,
        },
        responseHeaders: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        responseBody: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },
        resourceType: {
            type: String,
            default: null,
        },
        resourceId: {
            type: String,
            default: null,
        },
        executionTimeMs: {
            type: Number,
            default: null,
        },
        completedAt: {
            type: Date,
            default: null,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 },
        },
    },
    {
        timestamps: true,
    }
);


IdempotencyKeySchema.index({ merchantId: 1, key: 1 }, { unique: true });

const IdempotencyKeyModel = mongoose.model("IdempotencyKey", IdempotencyKeySchema);
module.exports = IdempotencyKeyModel;
