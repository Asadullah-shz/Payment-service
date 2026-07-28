const RefundEventModel = require("../model/RefundEvent.model");
const axios = require("axios");


const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:9000/payment';

class RefundService {
    async processGatewayEvent(event) {
        const eventType = event.type;
        const eventId = event.id;
        const payload = event.data.object || event.payload; 
        const merchantId = payload.metadata?.merchantId || "unknown";

       
        const existingEvent = await RefundEventModel.findOne({ 
            providerRefundId: eventId 
        });
        if (existingEvent) {
            console.log(`[Refund Service] Event ${eventId} already processed. Skipping.`);
            return;
        }
       
        const RefundRecord = await RefundEventModel.create({
            merchantId,
            provider: "stripe",
            providerRefundId: eventId,
            amount: payload.amount || payload.amount_refunded || 0,
            currency: payload.currency === 'usd' ? 1 : 2,
            reason: payload.reason || "requested_by_customer",
            metadata: false,
            processedAt: null
        });

       
        try {
            switch (eventType) {
                case "charge.refunded":
                    await this.handleChargeRefunded(payload);
                    break;
                default:
                    console.log(`[Refund Service] Ignoring unhandled event type: ${eventType}`);
            }

        
            RefundRecord.processedAt = new Date();
            await RefundRecord.save();

        } catch (error) {
            console.error(`[Refund] Failed to process event ${eventId}:`, error);
            throw error;
        }
    }

    async handleChargeRefunded(charge) {
        console.log(`Action for charge.refunded - Intent: ${charge.payment_intent}`);
        try {
          
            await axios.post(`${PAYMENT_SERVICE_URL}/update/${charge.payment_intent}`, {
                status: 'refunded',
                amount_refunded: charge.amount_refunded,
                currency: charge.currency,
                refund_id: charge.refunds?.data[0]?.id || null
            });
            console.log(`[Webhook Service] Successfully forwarded charge.refunded to Payment Service`);
            
           
            const EventBus = require('../../../EventBus/eventBus.service');
            const merchantId = charge.metadata?.merchantId || 'unknown';
            EventBus.publish('refund.succeeded', {
                merchantId: merchantId,
                paymentId: charge.payment_intent,
                refundId: charge.refunds?.data[0]?.id || null,
                amount: charge.amount_refunded,
                status: 'succeeded'
            }).catch(err => console.error("Failed to publish refund.succeeded event:", err));

        } catch (error) {
            console.error(`[Webhook Service] Error forwarding charge.refunded:`, error.message);
            throw error;
        }    }
}

module.exports = new RefundService();



