class PaypalGateway {
    async createPayment(details) {
        console.log('[Paypal Gateway] createPayment:', details);
        return {
            providerConfigId: 'mock-paypal-config',
            providerPaymentId: 'pay_' + Date.now(),
            clientSecret: 'secret_paypal_' + Date.now(),
            amount: details.amount,
            currency: details.currency || 'usd',
            gateway: 'paypal'
        };
    }

    async capturePayment(paymentIntentId, merchantId, amountToCapture = null) {
        console.log('[Paypal Gateway] capturePayment:', paymentIntentId);
        return {
            providerPaymentId: paymentIntentId,
            status: 'succeeded'
        };
    }

    async refundPayment(details) {
        console.log('[Paypal Gateway] refundPayment:', details);
        return {
            providerRefundId: 'ref_' + Date.now(),
            amount: details.amount,
            currency: 'usd'
        };
    }

    async cancelPayment(paymentIntentId, merchantId) {
        console.log('[Paypal Gateway] cancelPayment:', paymentIntentId);
        return {
            providerPaymentId: paymentIntentId,
            status: 'canceled'
        };
    }
}

module.exports = PaypalGateway;
