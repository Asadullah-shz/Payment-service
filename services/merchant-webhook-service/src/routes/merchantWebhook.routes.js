const express = require('express');
const MerchantWebhookController = require('../controllers/merchantWebhook.controller');
const { authorize } = require('../middlewares/authorization.middleware'); 

const router = express.Router();

router.post('/', authorize('merchant'), MerchantWebhookController.createEndpoint);
router.get('/', authorize('merchant'), MerchantWebhookController.getEndpoints);
router.patch('/:id', authorize('merchant'), MerchantWebhookController.updateEndpoint);
router.delete('/:id', authorize('merchant'), MerchantWebhookController.deleteEndpoint);
router.post('/:id/test', authorize('merchant'), MerchantWebhookController.testEndpoint);

module.exports = router;
