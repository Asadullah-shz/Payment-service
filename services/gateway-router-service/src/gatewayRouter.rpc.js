const EventBus = require('../../../packages/event-bus/eventBus.service');

async function initializeGatewayRouterRPC() {
    await EventBus.respond('rpc_gateway_route', async (payload) => {
        const { merchantId, amount, currency, paymentMethod } = payload;
        if (!merchantId) throw new Error("merchantId is required");

        let preferredGateway = 'stripe'; 

        try {
          
            const merchant = await EventBus.request('rpc_merchant_get', { merchantId });
            if (merchant && merchant.preferredGateway) {
                preferredGateway = merchant.preferredGateway;
            }
        } catch (error) {
            console.error('[GatewayRouter] Failed to fetch merchant preferences, defaulting to Stripe:', error.message);
        }

      
        const validGateways = ['stripe', 'paypal', 'jazzcash', 'easypaisa'];
        if (!validGateways.includes(preferredGateway.toLowerCase())) {
            preferredGateway = 'stripe';
        }

        console.log(`[GatewayRouter] Routed payment for merchant ${merchantId} to ${preferredGateway}`);

        return {
            gateway: preferredGateway.toLowerCase()
        };
    });

    console.log('[GatewayRouter] Initialized RPC responders');
}

module.exports = { initializeGatewayRouterRPC };
