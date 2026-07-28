const mongoose = require('mongoose');

const subscriptionPaymentSchema = new mongoose.Schema({
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'SubscriptionInvoice'
    },
    paymentId: {
        type: String, 
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('SubscriptionPayment', subscriptionPaymentSchema);
