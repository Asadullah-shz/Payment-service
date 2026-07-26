const express = require("express")
const StripeController = require("../controller/stripe.controller")
const { authorize } = require("../middleware/authorization.middleware")

const router = express.Router()

router.post("/config", authorize("merchant"), StripeController.StripeRegister)
router.post("/update",authorize("merchant"),StripeController.UpdateStripe)



module.exports = router