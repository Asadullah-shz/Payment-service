class EasyPaisaGateway {
    async createPayment(details) {
        console.log('[EasyPaisa Gateway] createPayment:', details);
        return {
            providerConfigId: 'mock-easypaisa-config',
            providerPaymentId: 'ep_' + Date.now(),
            clientSecret: 'secret_easypaisa_' + Date.now(),
            amount: details.amount,
            currency: details.currency || 'pkr',
            gateway: 'easypaisa'
        };
    }

    async capturePayment(paymentIntentId, merchantId, amountToCapture = null) {
        return { providerPaymentId: paymentIntentId, status: 'succeeded' };
    }

    async refundPayment(details) {
        return { providerRefundId: 'ref_ep_' + Date.now(), amount: details.amount, currency: 'pkr' };
    }

    async cancelPayment(paymentIntentId, merchantId) {
        return { providerPaymentId: paymentIntentId, status: 'canceled' };
    }
}
module.exports = EasyPaisaGateway;
