const express = require("express")
const merchantController = require("../controller/merchant.controller")
const { authorize } = require("../middleware/authorization.middleware")

const router = express.Router()

router.post("/register", authorize("user"), merchantController.MerchantRegister)
router.post("/me",authorize("merchant"),merchantController.MerchantDetail)
router.post("/update",authorize("merchant"),merchantController.UpdateMerchant)


module.exports = router