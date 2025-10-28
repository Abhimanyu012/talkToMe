import jwt from 'jsonwebtoken'
export const generateToken = (userId, res) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is not defined");
    }
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,// expire in 7days
        httpOnly: true, //prevent the xss attack
        sameSite: "strict",
        // secure: process.env.NODE_ENV === "production" ? true : false
    })
    return token
} 