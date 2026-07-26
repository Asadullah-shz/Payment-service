const express = require("express")
const TransactionController = require("../controller/Transaction.controller")
const { authorize } = require("../middleware/authorization.middleware")

const router = express.Router()

router.post("/config", authorize("merchant"), TransactionController.StripeRegister)
router.post("/update",authorize("merchant"),TransactionController.UpdateStripe)
router.get("/getconfig/:merchantId",TransactionController.GetMerchantconfigbyID)



module.exports = router