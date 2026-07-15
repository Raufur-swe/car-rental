import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import authorizeMiddleware from "../middleware/authorize.middleware.js"
import { verificationController } from "../controllers/verify.controller.js"
import authorized from "../middleware/authorize.middleware.js"

const varifyRoute = express.Router()

varifyRoute.post("/uploadLisence" , authMiddleware ,authorizeMiddleware("owner") , verificationController.uploadLicence)

varifyRoute.patch("/:id/approve" , authMiddleware , authorizeMiddleware("admin") , verificationController.adminApprove)
varifyRoute.patch("/:id/car-approve" , authMiddleware , authorized("admin") , verificationController.approvedCar)

export default varifyRoute
