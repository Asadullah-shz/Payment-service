const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Merchant'
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'usd'
    },
    destination: {
        type: String, 
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    providerPayoutId: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Payout', payoutSchema);
