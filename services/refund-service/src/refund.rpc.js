const RefundEventModel = require('./models/RefundEvent.model');
const EventBus = require('../../../packages/event-bus/eventBus.service');

async function initializeRefundRPC() {
    await EventBus.respond('rpc_refund_create', async (payload) => {
        const { merchantId, providerRefundId, amount, currency, reason } = payload;
        
        if (!merchantId || !providerRefundId || !amount) {
            throw new Error("Missing required refund parameters");
        }

        const newRefund = await RefundEventModel.create({
            merchantId,
            provider: "stripe",
            providerRefundId,
            amount,
            currency,
            reason,
            metadata: false,
            processed: false
        });

        return newRefund;
    });

    console.log('[Refund RPC] Initialized responders');
}

module.exports = { initializeRefundRPC };
