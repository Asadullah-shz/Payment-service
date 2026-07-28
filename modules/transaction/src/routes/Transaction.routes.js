const express = require("express")
const TransactionController = require("../controller/Transaction.controller")
const { authorize } = require("../middleware/authorization.middleware")

const router = express.Router()

router.get("/transactions", authorize("merchant"), TransactionController.Transactions)
router.get("/transactions/:id",authorize("merchant"),TransactionController.TransactionById)
router.post("/create", TransactionController.TransactionCreation)




module.exports = router