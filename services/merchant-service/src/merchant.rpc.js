const MerchantModel = require('./models/merchant');
const EventBus = require('../../../packages/event-bus/eventBus.service');

async function initializeMerchantRPC() {
    await EventBus.respond('rpc_merchant_get', async (payload) => {
        const merchantId = payload.merchantId;
        if (!merchantId) throw new Error("merchantId is required");

        const merchant = await MerchantModel.findById(merchantId).lean();
        if (!merchant) throw new Error("Merchant not found");
        
        return merchant;
    });

    console.log('[Merchant RPC] Initialized responders');
}

module.exports = { initializeMerchantRPC };
