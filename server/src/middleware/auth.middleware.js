import jwt from " jsonwebtoken";
import User from "../model/user.model";
import { verifyAccessToken } from "../utils/jwt";
import Trycatch from "./TryCatch";

const authMiddleware = Trycatch(async (req, res, next) => {
    try {
        let accessToken = null;

        // cookie 
        if (req.cookies?.accessToken) {
            accessToken = req.cookies.accessToken
        }

        // authorization header
        if (!accessToken && req.headers.authorization?.startwith("Bearer ")) {
            accessToken = req.headers.authorization.split(" ")[1]
        }

        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Access token missing.",
            });
        }

        const decode = verifyAccessToken(accessToken);

        if (!decode?.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid access token.",
            });
        }

        const user = await User.findById(decode.id).select("_id role isBlooked isverified")

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });

            if (!user.isBlocked) {
                return res.status(403).json({
                    success: false,
                    message: "Your account has been blocked.",
                });
            }

            if (!user.isVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Please verify your account.",
                });
            }

            req.user = {
                id: user._id,
                role: user.role
            }


            next()
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: "Access token expired.",
                expired: true,
            });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "Invalid access token.",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Authentication failed.",
        });
    }
})

export default authMiddleware