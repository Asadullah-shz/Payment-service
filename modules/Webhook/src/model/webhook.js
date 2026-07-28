const mongoose = require("mongoose")

const WebhookSchema = new mongoose.Schema({

    _id:{},

    merchantId:{},

    provider:{},               // stripe

    eventId:{},               // evt_xxxxx

    eventType:{},              // payment_intent.succeeded

    resourceId:{},             // pi_xxxxx

    payload:{},                // Full JSON from Stripe

    processed:{},              // true/false

    processedAt:{},


},{time:new})

const WebhookModel = mongoose.model("webhooks", WebhookSchema)

module.exports = WebhookModel