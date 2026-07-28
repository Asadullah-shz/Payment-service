const express = require("express")
const PaymentController = require('../controllers/payment.controller')
const { authorize } = require('../middlewares/authorization.middleware')
const idempotencyMiddleware = require("../../../Idempotency/middleware/idempotency.middleware")

const router = express.Router()


router.post("/create", authorize("user",), idempotencyMiddleware, PaymentController.PaymentCreation)
router.post("/cancel", authorize("user",), PaymentController.cancelPayment)
router.get("/record", authorize("merchant","users"), PaymentController.getAllPayments)
router.get("/record/:id", authorize("merchant","user"), PaymentController.getPaymentById)
router.get("/status/:id", authorize("user", "merchant"), PaymentController.PaymentStatusById)
router.post("/update/:paymentIntentId",PaymentController.PaymentStatusUpdateById)
router.post("/refund", authorize("merchant"), idempotencyMiddleware, PaymentController.initiateRefund)


module.exports = router