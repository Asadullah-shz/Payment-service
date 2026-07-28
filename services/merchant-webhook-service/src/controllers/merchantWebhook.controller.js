const MerchantWebhookService = require('../services/merchantWebhook.service');
const crypto = require('crypto');
const WebhookEndpoint = require('../models/webhookEndpoint.model');
const WebhookDelivery = require('../models/webhookDelivery.model');
const { generatePayload } = require('../utils/payload.util');
const DeliveryService = require('../services/delivery.service');

class MerchantWebhookController {

    static async createEndpoint(req, res) {
        try {
            const merchantId = req.user.id;
            const { url, events, description } = req.body;
            
            if (!url) {
                return res.status(400).json({ message: "Webhook URL is required." });
            }

          
            const secret = req.body.secret || `whsec_${crypto.randomBytes(32).toString('hex')}`;

            const endpoint = await MerchantWebhookService.createEndpoint(merchantId, {
                url, secret, events, description
            });

            res.status(201).json({ message: "Webhook endpoint created", endpoint });
        } catch (error) {
            console.error("Create Webhook Error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getEndpoints(req, res) {
        try {
            const merchantId = req.user.id;
            const endpoints = await MerchantWebhookService.getEndpoints(merchantId);
            res.status(200).json({ endpoints });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async updateEndpoint(req, res) {
        try {
            const merchantId = req.user.id;
            const endpointId = req.params.id;
            const updates = req.body;

            const endpoint = await MerchantWebhookService.updateEndpoint(merchantId, endpointId, updates);
            if (!endpoint) return res.status(404).json({ message: "Endpoint not found" });

            res.status(200).json({ message: "Endpoint updated", endpoint });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async deleteEndpoint(req, res) {
        try {
            const merchantId = req.user.id;
            const endpointId = req.params.id;

            const endpoint = await MerchantWebhookService.deleteEndpoint(merchantId, endpointId);
            if (!endpoint) return res.status(404).json({ message: "Endpoint not found" });

            res.status(200).json({ message: "Endpoint deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async testEndpoint(req, res) {
        try {
            const merchantId = req.user.id;
            const endpointId = req.params.id;

            const endpoint = await WebhookEndpoint.findOne({ _id: endpointId, merchantId });
            if (!endpoint) return res.status(404).json({ message: "Endpoint not found" });

          
            const eventId = `evt_test_${Date.now()}`;
            const payload = generatePayload(eventId, 'ping', merchantId, { message: "Test webhook" });

            
            const delivery = await WebhookDelivery.create({
                merchantId,
                webhookEndpointId: endpoint._id,
                eventId,
                eventType: 'ping',
                payload,
                status: 'PENDING'
            });

           
            await DeliveryService.processDelivery(delivery._id);

            const updatedDelivery = await WebhookDelivery.findById(delivery._id);
            res.status(200).json({
                message: "Test webhook dispatched",
                delivery: updatedDelivery
            });
        } catch (error) {
            console.error("Test Webhook Error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = MerchantWebhookController;
