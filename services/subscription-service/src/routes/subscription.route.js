const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');

router.post('/subscriptions', subscriptionController.createSubscription);
router.get('/subscriptions', subscriptionController.getSubscriptions);
router.get('/subscriptions/:id', subscriptionController.getSubscriptionById);
router.patch('/subscriptions/:id', subscriptionController.updateSubscription);
router.post('/subscriptions/:id/pause', subscriptionController.pauseSubscription);
router.post('/subscriptions/:id/resume', subscriptionController.resumeSubscription);
router.post('/subscriptions/:id/cancel', subscriptionController.cancelSubscription);

module.exports = router;
