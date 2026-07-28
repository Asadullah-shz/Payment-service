const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Merchant'
    },
    planName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'usd'
    },
    interval: {
        type: String,
        enum: ['monthly', 'yearly'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'cancelled', 'past_due'],
        default: 'active'
    },
    trialEnd: {
        type: Date,
        default: null
    },
    nextBillingDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
