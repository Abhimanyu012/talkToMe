import User from "../models/users.model.js";
import bcrypt from 'bcryptjs'
import { generateToken } from "../config/utils.js";






export const signup = async (req, res) => {
    const { fullName, email, password } = req.body

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }

        const existing = await User.findOne({ email })
        if (existing) return res.status(400).json({ message: "User already exists" })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({ fullName, email, password: hashedPassword })

        // save first so we have a persistent user and a valid _id
        await newUser.save()

        // generate auth token (sets cookie / response as implemented in utils)
        generateToken(newUser._id, res)

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        })

        console.log(`user ${newUser.fullName} created successfully`)
        // continue with signup logic...
    } catch (error) {
        console.log("error in signup controller :",error);
        return res.status(500).json({ message: "Server error" });
    }
}




export const login = (req, res) => {
    res.send("this is login page")
}



export const logout = (req, res) => {
    res.send("this is signup page")
}