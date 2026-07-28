const WebhookService = require("../service/webhook.service");


async function HandleStripeWebhook(req, res) {

    const event = req.stripeEvent;


    res.status(200).json({ received: true });

    WebhookService.processStripeEvent(event).catch((error) => {

        console.error(`[Webhook Controller] Background processing failed:`, error);
    });
}

module.exports = { HandleStripeWebhook };