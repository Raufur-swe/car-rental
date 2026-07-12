// rate limiter

import rateLimit from "express-rate-limit"
import RedisStore from "rate-limit-redis"
import redisClient from "../config/redis.js"
import crypto from "crypto"
import { ipKeyGenerator } from "express-rate-limit"

const createStore = (prefix) => {
    if (!redisClient.isReady) {
        console.warn("⚠ Redis is not ready. Using Memory Store.");
        return undefined; // express-rate-limit এর default Memory Store
    }

    return new RedisStore({
        prefix,
        sendCommand: (...args) => redisClient.sendCommand(args),
    });
};

const createAuthLimiter = ({ windowMs, max, prefix, message , skipSuccessfulRequests = false }) => {
    return rateLimit({
        windowMs, max,
        standardHeaders: true,
        legacyHeaders: false,

        //redis store

        store: createStore(prefix),
        skipSuccessfulRequests,

        keyGenerator: (req) => {
            const ip = ipKeyGenerator(req);
            const email = req.body?.email?.trim().toLoweerCase() || "unknown"

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

export const refreshTokenLimit = createAuthLimiter({
    windowMs : 15 * 60 * 1000,
    max : 15 ,
    prefix : "refresh",
    message : "to many requiest , try after 15 minutes"
})