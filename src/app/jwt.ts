import crypto from "crypto";
import jwt from 'jsonwebtoken'


export const generateAccessToken = function (user){
    return jwt.sign({userId: user.id}, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '5m',
    })
}



export const generateRefreshToken = function (user, jti){
    return jwt.sign({userId: user.id,jti}, process.env.JWT_REFRESH_SECRET, {expiresIn: '8h'})
}

export const generateTokens = function (user, jti){
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user, jti)

    return {
        accessToken,
        refreshToken
    }
}


export const hashToken = function (token: string) {
  return crypto.createHash("sha512").update(token).digest("hex");
};
