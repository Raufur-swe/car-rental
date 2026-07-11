// auth controllers

import mongoose from "mongoose";
import Trycatch from "../middleware/TryCatch.js";
import User from "../model/user.model.js";
import Owner from "../model/owner.model.js";


export const authController = {
    register : Trycatch(async(req , res)=>{

       const session = await mongoose.startSession();
         //transecction start
       try {
         session.startTransaction()
        // console.log("Transaction Started");

        let {name , email , phone , nid , password , role} = req.body

        // basic validation

        if (!name || !email || !phone || !nid || !password || !role) {
            return res.status(400).json({
                success : false ,
                message : "all fields are required"
            })
        }

        // pass validation
        if (password.length < 8) {
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
        role = role ==="owner" ? "owner" : "customer"

        if( role === " admin"){
            return res.status(403).json({
                success : false ,
                message : "Invalid role"
            })
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
       
         
        newUser.password = undefined;

        return res.status(201).json({
            success: true,
            message: "Registration successful.",
            
            user: newUser,
        });
       } catch (error) {
        console.error(error)
       }finally{
          await session.endSession() 
       }
    })
}