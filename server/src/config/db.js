// database

import mongoose from "mongoose"

const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL,{
            dbName : "car-rental"
        })
        console.log("Database connected")
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}

export default connectDb