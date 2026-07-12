// rate limiter

import rateLimit from "express-rate-limit"
import RedisStore from "rate-limit-redis"
import redisClient from "../config/redis"
import crypto from "crypto"

const createAuthLimiter = ({ windowMs, max, prefix, message }) => {
    return rateLimit({
        windowMs, max,
        standardHeaders: true,
        legacyHeaders: false,

        //redis store

        store: new RedisStore({
            sendCommand: (...arg) => redisClient.sendCommand(arg),
            prefix
        }),

        keyGenerator: (req) => {
            const ip = req.ip;
            const email = req.body?.email?.trim().toLoweerCase() || "unlnown"

            const emailHash = crypto.createHash("sha256").update(email).digest("hex");

            return `${ip}:${emailHash}`
        },
        handler: (req, res) => {
            return res.status(429).json({
                success: false,
                message,
            })
        }
    })
}

// Login

export const loginLimit = createAuthLimiter({
    windowMs : 15 * 60 * 1000,
    max : 5 ,
    prefix : "login",
    message : "to many requiest , try after 15 minutes"
})

export const otpLimit = createAuthLimiter({
    windowMs : 15 *60 *1000 ,
    max : 5 ,
    prefix : "otp",
    message : "to many requiest , try after 15 minutes",
})

const refreshTokenLimit = createAuthLimiter({
    windowMs : 15 * 60 * 1000,
    max : 15 ,
    message : "to many requiest , try after 15 minutes"
})