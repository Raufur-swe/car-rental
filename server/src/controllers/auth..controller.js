// auth controllers

import mongoose from "mongoose";
import Trycatch from "../middleware/TryCatch.js";
import User from "../model/user.model.js";
import Owner from "../model/owner.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import redisClient from "../config/redis.js";
import { accessCookieOption, refreshCookieOptions } from "../utils/cookie.js";


export const authController = {
    register : Trycatch(async(req , res)=>{

       const session = await mongoose.startSession();
         //transecction start
       try {
        await session.startTransaction()
        // console.log("Transaction Started");

        let {name , email , phone , nid , password , role} = req.body;


             // Normalize Input
      // ==========================

      name = name?.trim();
      email = email?.trim().toLowerCase();
      phone = phone?.trim();
      nid = nid?.trim();
      role = role?.trim().toLowerCase();

        // basic validation

        if (!name || !email || !phone || !nid || !password || !role) {
              await session.abortTransaction();
            return res.status(400).json({
                success : false ,
                message : "all fields are required"
            })
        }

        // pass validation
        if (password.length < 8) {
              await session.abortTransaction();
            return res.status(400).json({
                success : false ,
                message : "password must be at last 8 carecters"
            })
        }

        // email validation
                const emailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email."
            });
        }

        //  Role Validation
      if(!["customer" , "owner"].includes(role)){
          return res.status(403).json({
          success: false,
          message: "Invalid role.",
        });
      }

        // duplicate check

        const existingUser = await User.findOne({
            $or:[
                {email},
                {phone},
                {nid}
            ]
        }).session(session)

        if (existingUser) {
            await session.abortTransaction();
             
            if (existingUser.email === email) {
                return res.status(409).json({
                    success : false,
                    message : "email already registered",
                })
            }
            if (existingUser.nid === nid) {
                return res.status(409).json({
                    success : false,
                    message : "this nid already registered",
                })
            }
            if (existingUser.phone === phone) {
                return res.status(409).json({
                    success : false,
                    message : "this number already registered",
                })
            }
        }

        const user = await User.create(
            [
                {
                    name ,
                    email,
                    phone,
                    nid ,
                    password ,
                    role,
                }
            ], {session}
        )

        const newUser = user[0]

        if(role === "owner"){
            await Owner.create (
                [
                    {
                        user : newUser._id,
                    },
                ], {session}
            )
        }

         await session.commitTransaction();

         //console.log("Transaction Committed");

         // genarate token

         const accessToken = generateAccessToken({
            id : newUser._id.toString(),
            role : newUser.role,
         })

         const refreshToken = generateRefreshToken({
            id : newUser._id.toString()
         })


         // await refresh token in redis

         await redisClient.set(`refresh:${newUser._id}` , refreshToken,{
            EX : 7 *24 *60 *60 , // 7d
         })
        
         res.cookie("accessToken" , accessToken , accessCookieOption)
         res.cookie("refreshToken" , refreshToken , refreshCookieOptions)

        newUser.password = undefined;

        return res.status(201).json({
            success: true,
            message: "Registration successful.",
            
            user: newUser,
        });
       } catch (error) {
           await session.abortTransaction();

      console.error("Register Error:", error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error.",
      });
        
       }finally{
          await session.endSession() 
       }
    })
}