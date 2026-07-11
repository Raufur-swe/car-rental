// auth controllers

import mongoose from "mongoose";
import Trycatch from "../middleware/TryCatch.js";
import User from "../model/user.model.js";
import Owner from "../model/owner.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import redisClient from "../config/redis.js";
import { accessCookieOption, refreshCookieOptions } from "../utils/cookie.js";
import client from "../utils/sms.js";
import crypto from "crypto"


export const authController = {
    register: Trycatch(async (req, res) => {


        //transecction start
        try {

            // console.log("Transaction Started");

            let { name, email, phone, nid, password, role } = req.body;


            // Normalize Input
            // ==========================

            name = name?.trim();
            email = email?.trim().toLowerCase();
            phone = phone?.trim();
            nid = nid?.trim();
            role = role?.trim().toLowerCase();

            // basic validation

            if (!name || !email || !phone || !nid || !password || !role) {

                return res.status(400).json({
                    success: false,
                    message: "all fields are required"
                })
            }

            // pass validation
            if (password.length < 8) {

                return res.status(400).json({
                    success: false,
                    message: "password must be at last 8 carecters"
                })
            }

            // email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email."
                });
            }

            //  Role Validation
            if (!["customer", "owner"].includes(role)) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid role.",
                });
            }

            // duplicate check

            const existingUser = await User.findOne({
                $or: [
                    { email },
                    { phone },
                    { nid }
                ]
            })

            if (existingUser) {


                if (existingUser.email === email) {
                    return res.status(409).json({
                        success: false,
                        message: "email already registered",
                    })
                }
                if (existingUser.nid === nid) {
                    return res.status(409).json({
                        success: false,
                        message: "this nid already registered",
                    })
                }
                if (existingUser.phone === phone) {
                    return res.status(409).json({
                        success: false,
                        message: "this number already registered",
                    })
                }
            }

            // genarate otp
            const otp = Math.floor(100000 + Math.random() * 900000).toString()
            const otpHashed = crypto.createHash("sha256").update(otp).digest("hex")


            // save registration into redis

            await redisClient.set(
                `register:${phone}`,
                JSON.stringify({
                    name,
                    email,
                    phone,
                    nid,
                    password,
                    role,
                    otpHashed,
                    attempts: 0
                }),
                {
                    EX: 300
                }
            )

            // Development e console e OTP dekhao
            console.log("================================");
            console.log("OTP:", otp);
            console.log("================================");

            // Production holei SMS pathabe
            if (process.env.NODE_ENV === "production") {
                await client.messages.create({
                    to: phone,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    body: `Please verify your account.\nYour OTP is ${otp}.\nDon't share this OTP.`
                });
            }

            return res.status(200).json({
                success: true,
                message: "OTP sent successfully."
            });
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                success: false,
                message: error.message,
                stack: error.stack
            });
        }
    }),

    //otp verification
    verifyOtp: Trycatch(async (req, res) => {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const { phone, otp } = req.body

            if (!phone || !otp) {

                await session.abortTransaction();

                return res.status(400).json({
                    success: false,
                    message: "Phone and OTP are required."
                });

            }

            // redis data
            const registerData = await redisClient.get(`register:${phone}`);
            if (!registerData) {
                await session.abortTransaction();

                return res.status(400).json({
                    success: false,
                    message: "OTP expired."
                });
            }
            const data = JSON.parse(registerData);

            // max attepts
            if (data.attempts >= 5) {
                await redisClient.del(`register:${phone}`)
                await session.abortTransaction();

                return res.status(400).json({
                    success: false,
                    message: "Maximum OTP attempts exceeded."
                });
            }
            // hash incoming otp
            const otpHashed = crypto
                .createHash("sha256")
                .update(otp)
                .digest("hex");

            if (otpHashed !== data.otpHashed) {
                data.attempts += 1;

                await redisClient.set(`register:${phone}`, JSON.stringify(data), {
                    EX: 300
                });
                await session.abortTransaction();

                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP."
                });
            }
            // create user

            const user = await User.create(
                [
                    {
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        nid: data.nid,
                        password: data.password,
                        role: data.role,
                        isVerified: true
                    }
                ],
                { session }
            );

            const newUser = user[0];

            // owner profile

            if (newUser.role === "owner") {

                await Owner.create(
                    [
                        {
                            user: newUser._id
                        }
                    ],
                    { session }
                );

            }

            await session.commitTransaction();

            // access token

            const accessToken = generateAccessToken({

                id: newUser._id.toString(),
                role: newUser.role

            });

            // refresh token

            const refreshToken = generateRefreshToken({

                id: newUser._id.toString()

            });

            // save refresh token

            await redisClient.set(

                `refresh:${newUser._id}`,

                refreshToken,

                {

                    EX: 7 * 24 * 60 * 60

                }

            );

            // cookies

            res.cookie(
                "accessToken",
                accessToken,
                accessCookieOption
            );

            res.cookie(
                "refreshToken",
                refreshToken,
                refreshCookieOptions
            );

            // remove pending registration

            await redisClient.del(`register:${phone}`);

            newUser.password = undefined;

            return res.status(201).json({

                success: true,

                message: "Registration successful.",

                user: newUser

            });

        } catch (error) {
            await session.abortTransaction();

            return res.status(500).json({

                success: false,

                message: error.message

            });
        } finally {
            await session.endSession();
        }
    })
}