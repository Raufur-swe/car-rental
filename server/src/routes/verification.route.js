import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import authorizeMiddleware from "../middleware/authorize.middleware.js"
import { verificationController } from "../controllers/verify.controller.js"

const varifyRoute = express.Router()

varifyRoute.post("/uploadLisence" , authMiddleware ,authorizeMiddleware("owner") , verificationController.uploadLicence)

varifyRoute.patch("/:id/approve" , authMiddleware , authorizeMiddleware("admin") , verificationController.adminApprove)

export default varifyRoute
