const express = require('express');
const refundController = require('../controllers/refund.controller');
const verifyGatewaySignature = require('../middlewares/verifyGatewaySignature');
const {authorize}=require('../middlewares/authorization.middleware')

const router = express.Router();


router.post('/refund/:paymentId',verifyGatewaySignature,authorize("merchant"),refundController.HandleGatewayRefund);
router.get('/refunds', authorize("merchant"), refundController.RefundsDetails);
router.get('/refunds/:id', authorize("merchant"), refundController.RefundsDetailsById);
router.post('/create', refundController.CreateRefundRecord);


module.exports = router;