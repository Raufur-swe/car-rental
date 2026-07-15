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

        if(!Array.isArray(images) || images.length === 0){
            return res.status(404).json({
                success : false,
                message : "At least one images is required"
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

    await UpdateOwner(userId)

    return res.status(201).json({
      success: true,
      message:
        "Car submitted successfully. Waiting for admin approval.",
      car,
    });

    })

    

}