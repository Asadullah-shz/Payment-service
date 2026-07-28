const express = require("express")
const merchantController = require('../controllers/merchant.controller')
const { authorize } = require('../middlewares/authorization.middleware')

const router = express.Router()

router.post("/register", authorize("user"), merchantController.MerchantRegister)
router.post("/me",authorize("merchant"),merchantController.MerchantDetail)
router.post("/update",authorize("merchant"),merchantController.UpdateMerchant)
router.get("/:id", merchantController.getMerchantById)
module.exports = router