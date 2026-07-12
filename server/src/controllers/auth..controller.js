// auth controllers

import mongoose from "mongoose";
import Trycatch from "../middleware/TryCatch.js";
import User from "../model/user.model.js";
import Owner from "../model/owner.model.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import redisClient from "../config/redis.js";
import { accessCookieOption, refreshCookieOptions } from "../utils/cookie.js";
import client from "../utils/sms.js";
import crypto from "crypto"
import bcrypt from "bcrypt"


export const authController = {
    register: Trycatch(async (req, res) => {
        try {
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

            // if the otp is already sent and not expired, return an error
            const pendingRegistration = await redisClient.exists(`register:${phone}`);

            if (pendingRegistration) {
                return res.status(429).json({
                    success: false,
                    message: "OTP already sent. Please wait until it expires.",
                });
            }

            // genarate otp
            const otp = crypto.randomInt(100000, 999999).toString();
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

            // Development e console e OTP show
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
            //console.error(error);
            return res.status(500).json({
                success: false,
                //message: error.message,
                message: "internal server error"
                //stack: error.stack
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

                
                const ttl = await redisClient.ttl(`register:${phone}`);

                await redisClient.set(
                    `register:${phone}`,
                    JSON.stringify(data),
                    {
                        EX: ttl > 0 ? ttl : 300
                    }
                );
                await session.abortTransaction();

                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP."
                });
            }

            // if the verification is successful, check if the user already exists in the database
            const exists = await User.findOne({
                $or: [
                    { email: data.email },
                    { phone: data.phone },
                    { nid: data.nid },
                ],
            }).session(session);

            if (exists) {
                await session.abortTransaction();

                await redisClient.del(`register:${phone}`);

                return res.status(409).json({
                    success: false,
                    message: "Account already exists.",
                });
            }
            // create user
            const hashedPassword = await bcrypt.hash(data.password, 12);

            const user = await User.create(
                [
                    {
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        nid: data.nid,
                        role: data.role,
                        password: hashedPassword,
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
            const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

            await redisClient.set(

                `refresh:${newUser._id}`,

                hashedRefreshToken,

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
    }),

    login: Trycatch(async (req, res) => {
        let { phone, password } = req.body
        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: "phone and password are required"
            })
        }

        const user = await User.findOne({ phone }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "no such user on this account"
            })
        }


        if (user.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "your account has been blocked"
            })
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "user unvarified"
            })
        }

        const isPassword = await bcrypt.compare(password, user.password)

        if (!isPassword) {
            return res.status(401).json({
                success: false,
                message: "invalid credantials"
            })
        }

        const accessToken = generateAccessToken({
            id: user._id.toString(),
            role: user.role

        })

        const refreshToekn = generateRefreshToken({
            id: user._id.toString(),
        })

        // hash refresh token

        const hashedRefreshToken = await bcrypt.hash(refreshToekn, 10)

        // set on redis

        await redisClient.set(`refresh:${user._id}`, hashedRefreshToken,
            { EX: 7 * 24 * 60 * 60 })

        // set cookie

        res.cookie(
            "accessToken",
            accessToken,
            accessCookieOption
        );

        res.cookie(
            "refreshToken",
            refreshToekn,
            refreshCookieOptions
        )

        // hide password
        user.password = undefined

        return res.status(200).json({
            success: true,
            message: "login success",
            user
        })
    }),

    // refresh token

    refreshToekn: Trycatch(async (req, res) => {
        try {
            const oldRefreshToken = req.cookies?.refreshToken;
            if (!oldRefreshToken) {
                return res.status(401).json({
                    success: false,
                    message: "token missing"
                })
            }

            const decode = verifyRefreshToken(oldRefreshToken);

            const storedToken = await redisClient.get(
                `refresh:${decode.id}`
            )

            if (!storedToken) {
                return res.status(401).json({
                    success: false,
                    message: "Session expired"
                })
            }

            // reuse detaction

            const isMatched = await bcrypt.compare(oldRefreshToken, storedToken)

            if (!isMatched) {
                await redisClient.del(`refresh:${decode.id}`);
                res.clearCookie("refreshToken");

                return res.status(403).json({
                    success: false,
                    message: "token reuse detected"
                })
            }

            // genarate new token

            const newAccessToken = generateAccessToken({
                id: decode.id,
                
            })

            const newRefreshToken = generateRefreshToken({
                id: decode.id,
                role: decode.role,
            })

            // rotate refreshTken
            const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

            await redisClient.set(
                `refresh:${decode.id}`,
                hashedRefreshToken,
                {
                    EX: 60 * 60 * 24 * 7,
                }
            )

            //update cookie

            res.cookie(
                "accessToken",
                newAccessToken,
                accessCookieOption
            );

            res.cookie(
                "refreshToken",
                newRefreshToken,
                refreshCookieOptions
            )

            return res.status(200).json({
                success: true,
                message: " token refresh successfully"
            });
        } catch (error) {
            res.clearCookie("refreshToken");

            return res.status(401).json({
                success: false,
                message: "Invalid Refresh Token",
            });
        }
    }),

    logout: Trycatch(async (req, res) => {
        try {

            const refreshToken = req.cookies?.refreshToken;

            if (refreshToken) {

                const decoded = verifyRefreshToken(refreshToken);

                await redisClient.del(`refresh:${decoded.id}`);

            }

        } catch (error) { }

        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");

        return res.status(200).json({
            success: true,
            message: "Logout Successful",
        });
    })
}