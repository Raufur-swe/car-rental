import express from "express"
import { authController } from "../controllers/auth..controller.js"
import { loginLimit, otpLimit, refreshTokenLimit } from "../middleware/rateLimiter.js"

const authRoute = express.Router()

authRoute.post("/register" , authController.register)
authRoute.post("/otp" , otpLimit  ,authController.verifyOtp)
authRoute.post("/login" , loginLimit ,authController.login )
authRoute.post("/refresh" , refreshTokenLimit , authController.refreshToekn)


export default authRoute