import mongoose from "mongoose";
import Trycatch from "../middleware/TryCatch.js";
import carModel from "../model/car.model.js";
import Booking from "../model/booking.model.js";
import { updateCustomer } from "../utils/customerUpdater.js";
import { UpdateOwner } from "../utils/ownerUpdater.js";
import Customer from "../model/customer.model.js";
import Owner from "../model/owner.model.js";
import redisClient from "../config/redis.js";

export const bookingController = {

    createBooking: Trycatch(async (req, res) => {
        const session = await mongoose.startSession()

        session.startTransaction()

        try {
            const userId = req.user.id;

            const role = req.user.role;

            if (role !== "customer") {

                await session.abortTransaction();
                session.endSession();

                return res.status(403).json({
                    success: false,
                    message: "Only customer can book a car."
                });

            }

            const customer = await Customer.findOne({ user: userId }).session(session);

            if (!customer) {

                await session.abortTransaction();
                session.endSession();

                return res.status(404).json({
                    success: false,
                    message: "Customer profile not found."
                });

            }

            const { carId, pickupDate, returnDate } = req.body

            if (
                !carId ||
                !pickupDate ||
                !returnDate
            ) {

                await session.abortTransaction();
                session.endSession();

                return res.status(400).json({
                    success: false,
                    message: "All fields are required."
                });

            }

            const pickup = new Date(pickupDate);
            const drop = new Date(returnDate);

            if (isNaN(pickup) || isNaN(drop)) {

                await session.abortTransaction();
                session.endSession();

                return res.status(400).json({
                    success: false,
                    message: "Invalid booking date."
                });

            }
            if (drop <= pickup) {

                await session.abortTransaction();
                session.endSession();

                return res.status(400).json({
                    success: false,
                    message: "Return date must be after pickup date."
                });

            }

            const today = new Date()
            today.setHours(0, 0, 0, 0);

            if (pickup < today) {
                await session.abortTransaction();
                session.endSession();

                return res.status(400).json({
                    success: false,
                    message: "Pickup date cannot be in past."
                });
            }

            const car = await carModel.findOne({
                _id: carId,
                status: "active"
            }).session(session)

            if (!car) {

                await session.abortTransaction();
                session.endSession();

                return res.status(404).json({

                    success: false,
                    message: "Car not found."

                });

            }

            if (!car.isAvailable) {

                await session.abortTransaction();
                session.endSession();

                return res.status(400).json({

                    success: false,
                    message: "this car not available at this moment."

                });

            }

            const owner = await Owner.findOne({

                user: car.owner

            }).session(session);

            if (!owner) {

                await session.abortTransaction();
                session.endSession();

                return res.status(404).json({

                    success: false,
                    message: "Owner profile not found."

                });

            }

            if (owner.verificationStatus !== "approved") {

                await session.abortTransaction();
                session.endSession();

                return res.status(403).json({

                    success: false,
                    message: "Owner is not verified."

                });

            }


            const alreadyBooked = await Booking.findOne({
                car: car._id,
                status: {
                    $in: ["pending", "approved", "active"]
                },
                $or: [
                    {
                        pickupDate: {
                            $lte: drop
                        },
                        returnDate: {
                            $gte: pickup
                        }
                    }
                ]
            }).session(session)
            if (alreadyBooked) {
                await session.abortTransaction();
                session.endSession();

                return res.status(400).json({
                    success: false,
                    message: "Car is already booked for the selected dates.",
                });
            }

            
              const totalDays = Math.ceil(
                (drop - pickup) / (1000 * 60 * 60 * 24)
            );
            const totalPrice = totalDays * car.rentPerDay;
          

            const booking = await Booking.create([
                {
                    customer: userId,
                    owner: car.owner,
                    car: car._id,

                    pickupDate: pickup,
                    returnDate: drop,

                    totalDays,
                    rentPerDay: car.rentPerDay,
                    totalPrice,

                    status: "pending",
                    paymentStatus: "unpaid",
                    bookingType: "upcoming",
                }
            ], { session })

            car.isAvailable = false;

            await car.save({ session })

            await Promise.all([
                updateCustomer(userId),
                UpdateOwner(car.owner)
            ],{session})

            await Promise.all([
                redisClient.del(`ownerCars:${car.owner}`),
                redisClient.del(`customerBookings:${userId}`),
                redisClient.del(`ownerBookings:${car.owner}`),
            ]);

            await session.commitTransaction()

            session.endSession();

            return res.status(201).json({
                success: true,
                message: "Booking request submitted successfully.",

                booking: booking[0],
            });

        } catch (error) {
            await session.abortTransaction();

            session.endSession();

            throw error;
        }
    })

}