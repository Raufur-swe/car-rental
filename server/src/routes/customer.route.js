import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { customerController } from "../controllers/Customer.controller.js";

const customerRoute = express.Router()

customerRoute.get("/", authMiddleware , customerController.seeAllcars )


export default customerRoute