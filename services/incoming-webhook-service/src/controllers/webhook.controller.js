const WebhookService = require('../services/webhook.service');


async function HandleGatewayWebhook(req, res) {

    const event = req.gatewayEvent;


    res.status(200).json({ received: true });

    WebhookService.processGatewayEvent(event).catch((error) => {

        console.error(`[Webhook Controller] Background processing failed:`, error);
    });
}

module.exports = { HandleGatewayWebhook };