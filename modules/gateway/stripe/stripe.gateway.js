const stripe = require('stripe');
const GatewayInterface = require('../gateway.interface');
const StripeMapper = require('./stripe.mapper');
const axios = require('axios');

class StripeGateway extends GatewayInterface {


    async _getStripeClient(merchantId) {
        try {
            const stripeResponse = await axios.get(`http://localhost:7000/stripe/getconfig/${merchantId}`);
            const merchantStripeConfig = stripeResponse.data.result;

            if (!merchantStripeConfig || !merchantStripeConfig.secretKey) {
                throw new Error("Merchant Stripe configuration is missing secret key");
            }

            return {
                stripeClient: stripe(merchantStripeConfig.secretKey),
                configId: merchantStripeConfig._id
            };
        } catch (error) {
            throw new Error(`Failed to initialize Stripe client: ${error.message}`);
        }
    }

    async createPayment(params) {
        const { merchantId } = params;
        const { stripeClient, configId } = await this._getStripeClient(merchantId);

        const stripeParams = StripeMapper.toStripePaymentIntent(params);

        try {
            const paymentIntent = await stripeClient.paymentIntents.create(stripeParams);
            const mappedResponse = StripeMapper.fromStripePaymentIntent(paymentIntent);


            mappedResponse.providerConfigId = configId;
            return mappedResponse;
        } catch (error) {
            throw new Error(`Stripe createPayment failed: ${error.message}`);
        }
    }

    async retrievePayment(id, merchantId) {
        const { stripeClient } = await this._getStripeClient(merchantId);
        try {
            const paymentIntent = await stripeClient.paymentIntents.retrieve(id);
            return StripeMapper.fromStripePaymentIntent(paymentIntent);
        } catch (error) {
            throw new Error(`Stripe retrievePayment failed: ${error.message}`);
        }
    }

    async cancelPayment(id, merchantId) {
        const { stripeClient } = await this._getStripeClient(merchantId);
        try {
            const paymentIntent = await stripeClient.paymentIntents.cancel(id);
            return StripeMapper.fromStripePaymentIntent(paymentIntent);
        } catch (error) {
            throw new Error(`Stripe cancelPayment failed: ${error.message}`);
        }
    }

    async refundPayment(params) {
        const { merchantId } = params;
        const { stripeClient } = await this._getStripeClient(merchantId);

        const stripeParams = StripeMapper.toStripeRefund(params);
        try {
            const refund = await stripeClient.refunds.create(stripeParams);
            return StripeMapper.fromStripeRefund(refund);
        } catch (error) {
            throw new Error(`Stripe refundPayment failed: ${error.message}`);
        }
    }

    async verifyWebhook(req, merchantId) {
        const { stripeClient } = await this._getStripeClient(merchantId);
        const sig = req.headers['stripe-signature'];


        try {
            const stripeResponse = await axios.get(`http://localhost:7000/stripe/getconfig/${merchantId}`);
            const webhookSecret = stripeResponse.data.result.webhookSecret;

            if (!webhookSecret) {
                throw new Error("Webhook secret missing for merchant.");
            }

            const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
            return event;
        } catch (err) {
            throw new Error(`Stripe webhook signature verification failed: ${err.message}`);
        }
    }

    async createCustomer(params) {
        const { merchantId, email, name } = params;
        const { stripeClient } = await this._getStripeClient(merchantId);

        try {
            const customer = await stripeClient.customers.create({ email, name });
            return { providerCustomerId: customer.id };
        } catch (error) {
            throw new Error(`Stripe createCustomer failed: ${error.message}`);
        }
    }
}

module.exports = StripeGateway;