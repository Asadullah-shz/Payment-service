const express = require('express');
const refundController = require('../controller/refund.controller');
const verifyGatewaySignature = require('../middleware/verifyGatewaySignature');
const {authorize}=require("../middleware/authorization.middleware")

const router = express.Router();


router.post('/refund/:paymentId',verifyGatewaySignature,authorize("merchant"),refundController.HandleGatewayRefund);
router.get('/refunds', authorize("merchant"), refundController.RefundsDetails);
router.get('/refunds/:id', authorize("merchant"), refundController.RefundsDetailsById);
router.post('/create', refundController.CreateRefundRecord);


module.exports = router;