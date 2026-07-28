const express = require('express');
const router = express.Router();
const payoutController = require('../controller/payout.controller');

router.post('/payouts', payoutController.createPayout);
router.get('/payouts', payoutController.getPayouts);
router.get('/payouts/:id', payoutController.getPayoutById);
router.post('/payouts/:id/cancel', payoutController.cancelPayout);

module.exports = router;
