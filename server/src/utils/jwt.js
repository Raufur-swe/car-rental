import jwt from "jsonwebtoken"

// genarate accesstoken
export const generateAccessToken = (payload)=>{
    return jwt.sign(payload , process.env.ACCESS_TOKEN,{
        expiresIn : "15m",
    })
};

// genarate refresh token
export const generateRefreshToken = (payload)=>{
    return jwt.sign(payload , process.env.REFRESH_TOKEN,{
        expiresIn : "7d"
    })
};


// verify access token

export const verifyAccessToken = (token)=>{
    return jwt.verify(token , process.env.ACCESS_TOKEN)
}

// verify refresh token

export const verifyRefreshToken = (token)=>{
    return jwt.verify(token , process.env.REFRESH_TOKEN)
}