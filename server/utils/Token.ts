import jwt from 'jsonwebtoken'

const refreshSecret = process.env.REFRESH_TOKEN_SECRET!
const accessSecret  = process.env.ACCESS_TOKEN_SECRET!

export const generateAccessToken = (userId: number) => {
    return jwt.sign({ userId }, accessSecret, { expiresIn: '15m' })
}

export const generateRefreshToken = (userId: number) => {
    return jwt.sign({ userId }, refreshSecret, { expiresIn: '7d' })
}