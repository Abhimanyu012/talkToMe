import express from 'express'
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/messages.route.js';
import * as dotenv from 'dotenv';
import path from 'path'
import { connectDb, disconnectDb } from './config/db.js';
import mongoose from 'mongoose'
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

// health endpoint for readiness probes
app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState // 0 = disconnected, 1 = connected
  res.json({ ok: state === 1, mongooseState: state })
})

// establishing the connection then server is listening
let server
const startServer = async () => {
  try {
    await connectDb()
    server = app.listen(PORT, () => {
      console.log(`server is running at port http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server because DB connection failed:', err)
    process.exit(1)
  }
}
startServer()

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`)
  try {
    if (server) {
      await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())) )
    }
    await disconnectDb()
    console.log('Shutdown complete')
    process.exit(0)
  } catch (err) {
    console.error('Error during graceful shutdown', err)
    process.exit(1)
  }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))



