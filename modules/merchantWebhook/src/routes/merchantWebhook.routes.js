const express = require('express');
const MerchantWebhookController = require('../controller/merchantWebhook.controller');
const { authorize } = require('../middleware/authorization.middleware'); 

const router = express.Router();

router.post('/', authorize('merchant'), MerchantWebhookController.createEndpoint);
router.get('/', authorize('merchant'), MerchantWebhookController.getEndpoints);
router.patch('/:id', authorize('merchant'), MerchantWebhookController.updateEndpoint);
router.delete('/:id', authorize('merchant'), MerchantWebhookController.deleteEndpoint);
router.post('/:id/test', authorize('merchant'), MerchantWebhookController.testEndpoint);

module.exports = router;
