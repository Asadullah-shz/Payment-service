const mongoose = require('mongoose');

const payoutTransactionSchema = new mongoose.Schema({
    payoutId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Payout'
    },
    transactionRef: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['initiated', 'completed', 'failed'],
        default: 'initiated'
    }
}, { timestamps: true });

module.exports = mongoose.model('PayoutTransaction', payoutTransactionSchema);
