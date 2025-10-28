import User from "../models/users.model.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../config/utils.js";
import { sendResendEmail, resendEnabled } from "../config/resend.js";






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
        // Send welcome email (async, don't block response)
        const sendWelcomeEmail = async () => {
            try {
                await sendResendEmail({
                    from: 'Acme <onboarding@resend.dev>',
                    to: [newUser.email],
                    subject: 'Welcome to TalkToMe!',
                    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Welcome to TalkToMe</title>
    <style>
      /* Reset and simple responsive styles */
      body { margin:0; padding:0; -webkit-text-size-adjust:none; -ms-text-size-adjust:none; font-family: "Helvetica Neue", Arial, sans-serif; background:#f5f7fa; color:#333; }
      .container { width:100%; max-width:600px; margin:24px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 8px 30px rgba(30,40,60,0.08); }
      .hero { background: linear-gradient(135deg,#6c5ce7 0%,#00b4d8 100%); color:#fff; padding:28px 24px; text-align:center; }
      .logo { font-weight:700; letter-spacing:0.6px; font-size:20px; }
      .title { font-size:22px; margin:12px 0 0; }
      .body { padding:24px; line-height:1.6; color:#444; }
      .greeting { font-weight:600; margin-bottom:8px; }
      .card { background:#f6f8fb; padding:16px; border-radius:8px; margin:16px 0; }
      .cta { display:inline-block; margin-top:12px; background:#6c5ce7; color:#fff; text-decoration:none; padding:12px 18px; border-radius:8px; font-weight:600; }
      .footer { font-size:12px; color:#9aa3b2; text-align:center; padding:18px 12px; }
      @media (max-width:420px){ .title{ font-size:18px } .hero{ padding:20px 16px } }
    </style>
  </head>
  <body>
    <center>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center">
            <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td class="hero">
                  <div class="logo">TalkToMe</div>
                  <div class="title">Welcome aboard, ${newUser.fullName}!</div>
                </td>
              </tr>

              <tr>
                <td class="body">
                  <div class="greeting">Hi ${newUser.fullName},</div>
                  <div>We're thrilled you joined TalkToMe — a place to share ideas, learn, and connect. Below are a few things to get you started.</div>

                  <div class="card" role="article">
                    <strong>What's next?</strong>
                    <ul style="margin:8px 0 0; padding-left:18px;">
                      <li>Complete your profile to help others find you.</li>
                      <li>Join conversations and create your first post.</li>
                      <li>Invite friends and grow your network.</li>
                    </ul>

                    <a href="https://talktome-16mp4.sevalla.app/" class="cta" target="_blank" rel="noopener">Get started</a>
                  </div>

                  <div>If you ever need help, reply to this email — we read every message.</div>
                  <div style="margin-top:12px; color:#6b7280; font-size:13px;">Happy chatting,<br>The TalkToMe Team</div>
                </td>
              </tr>

              <tr>
                <td class="footer">
                  TalkToMe • 123 Conversation Ave • If you didn't create an account, please ignore this email.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>`
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

