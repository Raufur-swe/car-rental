import { createClient } from "redis";


const redisClient = createClient({
    url : `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
})


redisClient.on("connect",()=>{
    console.log("redis conecting")
})

redisClient.on("ready",()=>{
    console.log("redis conected")
})

redisClient.on("error",(error)=>{
    console.error("error.message")
})

redisClient.on("end",()=>{
    console.log("redis disconnected")
})

export default redisClient
