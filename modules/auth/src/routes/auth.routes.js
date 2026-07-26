const express = require("express")
const AuthController = require("../controller/auth.controller")
const { loginRateLimiter } = require("../middleware/rateLimit.middleware")


const router = express.Router()


router.post("/register",AuthController.Register)
router.post("/login",  AuthController.LoginUser)
router.post("/logout", AuthController.Logout)
router.put("/update-role", AuthController.UpdateRole)





module.exports = router