const express = require('express');
const webhookController = require('../controller/webhook.controller');
const verifyStripeSignature = require('../middleware/verifyStripeSignature');

const router = express.Router();


router.post(
  '/stripe/:merchantId',
  express.raw({ type: 'application/json' }), 
  verifyStripeSignature,
  webhookController.HandleStripeWebhook
);

module.exports = router;