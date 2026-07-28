const express = require("express")
const PaymentController = require("../controller/payment.controller")
const { authorize } = require("../middleware/authorization.middleware")

const router = express.Router()


router.post("/create", authorize("user",), PaymentController.PaymentCreation)
router.post("/cancel", authorize("user",), PaymentController.cancelPayment)
router.get("/record", authorize("merchant","users"), PaymentController.getAllPayments)
router.get("/record/:id", authorize("merchant","user"), PaymentController.getPaymentById)
router.get("/status/:id", authorize("user", "merchant"), PaymentController.PaymentStatusById)
router.post("/update/:paymentIntentId",PaymentController.PaymentStatusUpdateById)


module.exports = router