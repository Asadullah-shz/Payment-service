const WebhookEndpoint = require('../model/webhookEndpoint.model');
const WebhookDelivery = require('../model/webhookDelivery.model');
const DeliveryService = require('./delivery.service');
const { generatePayload } = require('../utils/payload.util');
const EventBus = require('../../../EventBus/eventBus.service');

class MerchantWebhookService {

   
    static async startConsumer() {
        await EventBus.subscribe('merchant_webhook_queue', '*.*', async (payload, msg) => {
            
            if (!payload.type || !payload.merchantId) {
                console.warn('[MerchantWebhookService] Ignored invalid event payload:', payload);
                return; 
            }

            console.log(`[MerchantWebhookService] Received event '${payload.type}' for merchant ${payload.merchantId}`);
            
        
            const eventId = `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            const webhookPayload = generatePayload(eventId, payload.type, payload.merchantId, payload.data);

            
            const endpoints = await WebhookEndpoint.find({
                merchantId: payload.merchantId,
                isActive: true,
                events: { $in: [payload.type, '*'] }
            });

            if (endpoints.length === 0) {
                console.log(`[MerchantWebhookService] No endpoints configured for merchant ${payload.merchantId} for event ${payload.type}`);
                return;
            }

          
            for (const endpoint of endpoints) {
                const delivery = await WebhookDelivery.create({
                    merchantId: payload.merchantId,
                    webhookEndpointId: endpoint._id,
                    eventId: eventId,
                    eventType: payload.type,
                    payload: webhookPayload,
                    status: 'PENDING'
                });

             
                DeliveryService.processDelivery(delivery._id).catch(err => {
                    console.error('[MerchantWebhookService] Unhandled delivery error:', err);
                });
            }
        });
    }

    
    static async createEndpoint(merchantId, data) {
        return await WebhookEndpoint.create({
            merchantId,
            url: data.url,
            secret: data.secret,
            events: data.events || ['*'],
            description: data.description || ''
        });
    }

    
    static async getEndpoints(merchantId) {
        return await WebhookEndpoint.find({ merchantId });
    }

   
    static async updateEndpoint(merchantId, endpointId, updates) {
        return await WebhookEndpoint.findOneAndUpdate(
            { _id: endpointId, merchantId },
            { $set: updates },
            { new: true }
        );
    }

    
    static async deleteEndpoint(merchantId, endpointId) {
        return await WebhookEndpoint.findOneAndDelete({ _id: endpointId, merchantId });
    }
}

module.exports = MerchantWebhookService;
