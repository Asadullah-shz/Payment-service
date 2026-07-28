const express = require("express")
const AuthController = require('../controllers/auth.controller')
const { loginRateLimiter } = require('../middlewares/rateLimit.middleware')


const router = express.Router()


router.post("/register",AuthController.Register)
router.post("/login",  AuthController.LoginUser)
router.post("/logout", AuthController.Logout)
router.put("/update-role", AuthController.UpdateRole)





module.exports = router
