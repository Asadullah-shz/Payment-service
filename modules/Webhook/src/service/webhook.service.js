const WebhookEvent = require("../model/webhookEvent.model");
const axios = require("axios");


const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:9000/payment';
const TRANSACTION_SERVICE_URL = process.env.TRANSACTION_SERVICE_URL || 'http://localhost:11000/transaction/transactions/:id';

class WebhookService {
    async processGatewayEvent(event) {
        const eventId = event.id;
        const eventType = event.type;
        const payload = event.data?.object || event.payload || {}; 
        const resourceId = payload.id;
        const merchantId = payload.metadata?.merchantId || "unknown";

       
        const existingEvent = await WebhookEvent.findOne({ eventId });
        if (existingEvent) {
            console.log(`[Webhook Service] Event ${eventId} already processed. Skipping.`);
            return;
        }

       
        const webhookRecord = await WebhookEvent.create({
            merchantId,
            provider: "stripe",
            eventId,
            eventType,
            resourceId,
            payload: event,
            processed: false
        });

       
        try {
            switch (eventType) {
                case "payment_intent.succeeded":
                    await this.handlePaymentIntentSucceeded(payload);
                    break;
                case "payment_intent.payment_failed":
                    await this.handlePaymentIntentFailed(payload);
                    break;
                case "charge.refunded":
                    await this.handleChargeRefunded(payload);
                    break;
                default:
                    console.log(`[Webhook Service] Ignoring unhandled event type: ${eventType}`);
            }

        
            webhookRecord.processed = true;
            webhookRecord.processedAt = new Date();
            await webhookRecord.save();

        } catch (error) {
            console.error(`[Webhook Service] Failed to process event ${eventId}:`, error);
            throw error;
        }
    }

    async handlePaymentIntentSucceeded(paymentIntent) {
        try {
          
            await axios.post(`${PAYMENT_SERVICE_URL}/update/${paymentIntent.id}`, {
                status: 'succeeded',
                amount: paymentIntent.amount_received,
                currency: paymentIntent.currency,
                latest_charge: paymentIntent.latest_charge
            });
            console.log(`[Webhook Service] Successfully forwarded payment_intent.succeeded to Payment Service`);
        } catch (error) {
            console.error(`[Webhook Service] Error forwarding payment_intent.succeeded:`, error.message);
            throw error;
        }
    }

    async handlePaymentIntentFailed(paymentIntent) {
        console.log(`[Webhook Service] Actions for payment_intent.payment_failed - ID: ${paymentIntent.id}`);
        try {
           
            await axios.post(`${PAYMENT_SERVICE_URL}/update/${paymentIntent.id}`, {
                status: 'failed'
            });
            console.log(`[Webhook Service] Successfully forwarded payment_intent.payment_failed to Payment Service`);
        } catch (error) {
            console.error(`[Webhook Service] Error forwarding payment_intent.payment_failed:`, error.message);
            throw error;
        }
    }

    async handleChargeRefunded(charge) {
        console.log(`[Webhook Service] Actions for charge.refunded - Intent: ${charge.payment_intent}`);
        try {
          
            await axios.post(`${PAYMENT_SERVICE_URL}/update/${charge.payment_intent}`, {
                status: 'refunded',
                amount_refunded: charge.amount_refunded,
                currency: charge.currency,
                refund_id: charge.refunds?.data[0]?.id || null
            });
            console.log(`[Webhook Service] Successfully forwarded charge.refunded to Payment Service`);
        } catch (error) {
            console.error(`[Webhook Service] Error forwarding charge.refunded:`, error.message);
            throw error;
        }    }
}

module.exports = new WebhookService();