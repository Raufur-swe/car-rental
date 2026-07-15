import express from "express"
import { carController } from "../controllers/car.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"
import authorized from "../middleware/authorize.middleware.js"

const carRoute = express.Router()

carRoute.post("/add-car" , authMiddleware, authorized("owner") , carController.addCar)
carRoute.post("/get-all-car" , authMiddleware, authorized("owner") , carController.getAllCars)
carRoute.post("/update-car" , authMiddleware, authorized("owner") , carController.updateCar)
carRoute.post("/remove-car" , authMiddleware, authorized("owner") , carController.deleteCar)



export default carRoute