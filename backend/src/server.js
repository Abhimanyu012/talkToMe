import express from 'express'
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/messages.route.js';
import * as dotenv from 'dotenv';
import path from 'path'
import { connectDb } from './config/db.js';
dotenv.config();


const app = express();

const PORT = process.env.PORT || 3000
const __dirname = path.resolve()

app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

// serving frontend here
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

  // Use a RegExp to avoid path-to-regexp parameter parsing issues (matches all routes)
  app.get(/.*/, (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  })
}

// establishing the connection then server is listening
const startServer = async () => {
  try {
    await connectDb()
    let server = app.listen(PORT, () => {
      console.log(`server is running at port http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server because DB connection failed:', err)
    process.exit(1)
  }
}
startServer()



