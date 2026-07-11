import dotenv from "dotenv/config"
import app from "./app.js";
import connectDb from "./config/db.js";
import redisClient from "./config/redis.js";

const PORT = process.env.PORT || 8000;

const setServer = async()=>{
    try {
        // redis
        await redisClient.connect()

        // database
        await connectDb()

       app.listen(PORT ,()=>{
        console.log(`server running at ${PORT}`)
       }) 
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}

setServer()