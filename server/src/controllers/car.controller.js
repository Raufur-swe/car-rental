import redisClient from "../config/redis.js";
import Trycatch from "../middleware/TryCatch.js";
import carModel from "../model/car.model.js";
import Owner from "../model/owner.model.js";
import { UpdateOwner } from "../utils/ownerUpdater.js";


export const carController = {

    // add car

    addCar: Trycatch(async (req, res) => {

        // search user id and role
        const userId = req.user.id;
        const role = req.user.role;

        // owner or not
        if (role !== 'owner') {
            return res.status(403).json({
                success: false,
                message: "only verified owner can add car"
            })
        }

        // check owner in db

        const owner = await Owner.findOne({ user: userId });

        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "owner profile not found"
            })
        }

        if (owner.verificationStatus !== 'approved') {
            return res.status(403).json({
                success: false,
                message: "Your account is not verified yet.",
            })
        }

        // taking details about cars

        const { title, model, brand, category, description, images, rentPerDay, transmission, fuelType, seat, location } = req.body;

        if (
            !title ||
            !model ||
            !brand ||
            !category ||
            !description ||
            !images ||
            !rentPerDay ||
            !transmission ||
            !fuelType ||
            !seat ||
            !location
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        // imaages must be an array

        if (!Array.isArray(images) || images.length === 0) {
            return res.status(404).json({
                success: false,
                message: "At least one images is required"
            })
        }

        const car = await carModel.create({
            owner: userId,
            title,
            model,
            brand,
            category,
            description,
            images,
            rentPerDay,
            transmission,
            fuelType,
            seat,
            location,

            // Admin approval pending
            status: "inactive",
            isAvailable: true,
        });

        await redisClient.del(`ownerCars:${userId}`);

        await UpdateOwner(userId)

        return res.status(201).json({
            success: true,
            message:
                "Car submitted successfully. Waiting for admin approval.",
            car,
        });

    }),

    // get all cars

    myAllCars: Trycatch(async (req, res) => {

        const userId = req.user.id;
        const role = req.user.role;

        //redis cache key

        const cacheCars = `ownerCars:${userId}`

        // check cache

        const cache = await redisClient.get(cacheCars)

           if (cache) {
        return res.status(200).json({
            success: true,
            source: "redis",
            cars: JSON.parse(cache)
        });
    }

        const cars = await carModel.find({
            owner: userId,
            status: "active"
        }).sort({ createdAt: -1 })

          // Save Cache for 10 Minutes
            await redisClient.setEx(
        cacheCars,
        600,
        JSON.stringify(cars)
    );

        return res.status(200).json({
            success: true,
            total: cars.length,
            cars
        })
    }),

    // update cars

    updateCar : Trycatch(async(req , res)=>{

        const userId = req.user.id;
        const role = req.user.role;
        const {id} = req.params;

        if (role !== "owner") {
             return res.status(403).json({
            success: false,
            message: "Only owner can update car."
        });
        }

        const cars = await carModel.findOne({
            _id : id,
            owner: userId ,
            status : {$ne : "deleted"}
        })

         if (!cars) {
        return res.status(404).json({
            success: false,
            message: "Car not found."
        });
    }
    // // Update only provided fields
    Object.assign(cars , req.body)
    await cars.save()

    await redisClient.del(`ownerCars:${userId}`);
    await UpdateOwner(userId)

       return res.status(200).json({
        success: true,
        message: "Car updated successfully.",
        cars
    });
    }),

    // delete cars
    deleteCar: Trycatch(async (req, res) => {

    const userId = req.user.id;
    const role = req.user.role;
    const { id } = req.params;

    if (role !== "owner") {
        return res.status(403).json({
            success: false,
            message: "Only owner can delete car."
        });
    }

    const car = await carModel.findOne({
        _id: id,
        owner: userId,
        status: { $ne: "deleted" }
    });

    if (!car) {
        return res.status(404).json({
            success: false,
            message: "Car not found."
        });
    }

    // Soft Delete
    car.status = "deleted";
    car.isAvailable = false;

    await car.save();

    await redisClient.del(`ownerCars:${userId}`);
    // Real time owner update
    await UpdateOwner(userId);

    return res.status(200).json({
        success: true,
        message: "Car deleted successfully."
    });

}),

}