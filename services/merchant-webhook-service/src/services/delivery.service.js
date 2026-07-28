const axios = require('axios');
const WebhookDelivery = require('../models/webhookDelivery.model');
const WebhookEndpoint = require('../models/webhookEndpoint.model');
const SignatureService = require('./signature.service');
const { getNextRetryDate, isRetryableError } = require('../utils/retry.util');

class DeliveryService {
    
    static async processDelivery(deliveryId) {
        const delivery = await WebhookDelivery.findById(deliveryId).populate('webhookEndpointId');
        if (!delivery) return;

        const endpoint = delivery.webhookEndpointId;
        if (!endpoint || !endpoint.isActive) {
            delivery.status = 'FAILED';
            delivery.errorMessage = 'Endpoint deleted or deactivated.';
            await delivery.save();
            return;
        }

        delivery.status = 'PROCESSING';
        delivery.attempts += 1;
        delivery.lastAttemptAt = new Date();
        await delivery.save();

        const headers = SignatureService.getWebhookHeaders(endpoint.secret, delivery.payload, delivery._id.toString());

        try {
           
            
            const response = await axios.post(endpoint.url, delivery.payload, {
                headers,
                timeout: 5000
            });

          
            delivery.status = 'DELIVERED';
            delivery.responseCode = response.status;
            delivery.responseBody = typeof response.data === 'string' 
                ? response.data.substring(0, 500) 
                : JSON.stringify(response.data).substring(0, 500);
            delivery.deliveredAt = new Date();
            delivery.errorMessage = null;

            console.log(`[DeliveryService] Successfully delivered webhook ${delivery._id} to ${endpoint.url}`);

        } catch (error) {
            
            const responseCode = error.response ? error.response.status : null;
            const responseBody = error.response && error.response.data 
                ? (typeof error.response.data === 'string' ? error.response.data.substring(0, 500) : JSON.stringify(error.response.data).substring(0, 500))
                : null;
            const errorMessage = error.message;

            delivery.responseCode = responseCode;
            delivery.responseBody = responseBody;
            delivery.errorMessage = errorMessage;

            if (delivery.attempts >= 5) {
               
                delivery.status = 'FAILED';
                console.error(`[DeliveryService] Webhook ${delivery._id} failed permanently after 5 attempts.`);
            } else if (isRetryableError(responseCode)) {
           
                delivery.status = 'RETRYING';
                delivery.nextRetryAt = getNextRetryDate(delivery.attempts);
                console.warn(`[DeliveryService] Webhook ${delivery._id} failed (${responseCode || 'Timeout'}). Retrying at ${delivery.nextRetryAt}`);
            } else {
               
                delivery.status = 'FAILED';
                console.error(`[DeliveryService] Webhook ${delivery._id} failed permanently due to terminal status code ${responseCode}.`);
            }
        }

        await delivery.save();
    }
}

module.exports = DeliveryService;
