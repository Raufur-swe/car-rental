import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { bookingController } from "../controllers/booking.controller.js"

const bookRoute = express.Router()

bookRoute.post("/create" , authMiddleware , bookingController.createBooking)

export default bookRoute