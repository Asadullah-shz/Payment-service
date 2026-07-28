class StripeMapper {
   
    static toStripePaymentIntent(params) {
        const stripeParams = {
            amount: params.amount,
            currency: params.currency || 'usd',
        };

        if (params.description) {
            stripeParams.description = params.description;
        }

        if (params.metadata) {
            stripeParams.metadata = params.metadata;
        }

        return stripeParams;
    }

   
    static fromStripePaymentIntent(stripeResponse) {
        return {
            providerPaymentId: stripeResponse.id,
            clientSecret: stripeResponse.client_secret,
            amount: stripeResponse.amount,
            currency: stripeResponse.currency,
            status: stripeResponse.status
        };
    }

   
    static toStripeRefund(params) {
        const stripeParams = {
            payment_intent: params.paymentId
        };

        if (params.amount) {
            stripeParams.amount = params.amount;
        }

        if (params.reason) {
            stripeParams.reason = params.reason;
        }

        return stripeParams;
    }

   
    static fromStripeRefund(stripeRefund) {
        return {
            providerRefundId: stripeRefund.id,
            providerPaymentId: stripeRefund.payment_intent,
            amount: stripeRefund.amount,
            currency: stripeRefund.currency,
            status: stripeRefund.status,
            reason: stripeRefund.reason
        };
    }
}

module.exports = StripeMapper;
