const express = require('express');
const webhookController = require('../controller/webhook.controller');
const verifyGatewaySignature = require('../middleware/verifyGatewaySignature');

const router = express.Router();


router.post(
  '/gateway/:merchantId',
  express.raw({ type: 'application/json' }), 
  verifyGatewaySignature,
  webhookController.HandleGatewayWebhook
);

module.exports = router;