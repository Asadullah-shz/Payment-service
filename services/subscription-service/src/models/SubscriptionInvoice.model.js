const mongoose = require('mongoose');

const subscriptionInvoiceSchema = new mongoose.Schema({
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subscription'
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'open', 'paid', 'void', 'uncollectible'],
        default: 'open'
    },
    dueDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('SubscriptionInvoice', subscriptionInvoiceSchema);
