const StripeModel = require('./models/stripe');
const EventBus = require('../../../packages/event-bus/eventBus.service');

async function initializeStripeRPC() {
    await EventBus.respond('rpc_stripe_config_get', async (payload) => {
        const merchantId = payload.merchantId;
        if (!merchantId) throw new Error("merchantId is required");

        const config = await StripeModel.findOne({ merchantId }).lean();
        if (!config) throw new Error("Stripe configuration not found for this merchant");
        
        return config;
    });

    console.log('[Stripe RPC] Initialized responders');
}

module.exports = { initializeStripeRPC };
