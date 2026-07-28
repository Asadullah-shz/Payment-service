class JazzCashGateway {
    async createPayment(details) {
        console.log('[JazzCash Gateway] createPayment:', details);
        return {
            providerConfigId: 'mock-jazzcash-config',
            providerPaymentId: 'jc_' + Date.now(),
            clientSecret: 'secret_jazzcash_' + Date.now(),
            amount: details.amount,
            currency: details.currency || 'pkr',
            gateway: 'jazzcash'
        };
    }

    async capturePayment(paymentIntentId, merchantId, amountToCapture = null) {
        return { providerPaymentId: paymentIntentId, status: 'succeeded' };
    }

    async refundPayment(details) {
        return { providerRefundId: 'ref_jc_' + Date.now(), amount: details.amount, currency: 'pkr' };
    }

    async cancelPayment(paymentIntentId, merchantId) {
        return { providerPaymentId: paymentIntentId, status: 'canceled' };
    }
}
module.exports = JazzCashGateway;
