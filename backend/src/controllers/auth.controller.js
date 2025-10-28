import User from "../models/users.model.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../config/utils.js";
import { sendResendEmail, resendEnabled } from "../config/resend.js";
import { renderWelcomeEmail } from "../templates/welcomeEmail.js";






export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Validate required fields
        if (!fullName?.trim() || !email?.trim() || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address." });
        }

        const existing = await User.findOne({ email })
        if (existing) return res.status(400).json({ message: "User already exists" })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({ fullName, email, password: hashedPassword })

        // save first so we have a persistent user and a valid _id
        await newUser.save();

        // Send welcome email (async, don't block response)
        const sendWelcomeEmail = async () => {
            try {
                await sendResendEmail({
                    from: 'Acme <onboarding@resend.dev>',
                    to: [newUser.email],
                    subject: 'Welcome to TalkToMe!',
                    html: renderWelcomeEmail(newUser.fullName),
                });
                console.log(`Welcome email sent to ${newUser.email}`);
            } catch (e) {
                console.error('Failed to send welcome email:', e);
            }
        };
        if (resendEnabled) {
          sendWelcomeEmail();
        } else {
          console.log('Resend disabled - skipping welcome email');
        }

        // generate auth token (sets cookie / response as implemented in utils)
        try {
            generateToken(newUser._id, res);
        } catch (e) {
            console.error("Failed to generate token:", e);
        }

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

        console.log(`user ${newUser.fullName} created successfully`);

    } catch (error) {
        console.log("error in signup controller :", error);
        return res.status(500).json({ message: "Server error" });
    }
}




export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "Invalid credentials" })
        // generate auth token (sets cookie / response as implemented in utils)
        try {
            generateToken(user._id, res);
        } catch (e) {
            console.error("Failed to generate token:", e);
        }

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

        console.log(`user ${user.fullName} logged in successfully`)
    } catch (error) {
        console.log("error in login controller :", error);
        return res.status(500).json({ message: "Server error" });
    }
}
export const logout = (_req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    });
    return res.status(200).json({ message: "Logged out" });
}

