const express = require('express');
const webhookController = require('../controllers/webhook.controller');
const verifyGatewaySignature = require('../middlewares/verifyGatewaySignature');

const router = express.Router();


router.post(
  '/gateway/:merchantId',
  express.raw({ type: 'application/json' }), 
  verifyGatewaySignature,
  webhookController.HandleGatewayWebhook
);

module.exports = router;