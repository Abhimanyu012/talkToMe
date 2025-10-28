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

// Simple request logger: logs method, path and response status
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const ms = Date.now() - start
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`)
  })
  next()
})
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

// Serve a small empty favicon response to avoid unnecessary 404/503 noise
app.get('/favicon.ico', (req, res) => {
  const favPath = path.join(__dirname, '../frontend/dist', 'favicon.ico')
  // if a favicon exists in the built frontend, serve it; otherwise return 204 No Content
  res.sendFile(favPath, err => {
    if (err) {
      res.status(204).end()
    }
  })
})

// serving frontend here
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

  // Use a RegExp to avoid path-to-regexp parameter parsing issues (matches all routes)
  app.get(/.*/, (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  })
}

// health endpoint (simple)
app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState // 0 = disconnected, 1 = connected
  if (state === 1) return res.json({ ok: true })
  return res.status(503).json({ ok: false })
})

// Start server after DB connects
let server
connectDb()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`server is running at port http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to start server because DB connection failed:', err.message || err)
    process.exit(1)
  })

// Improved graceful shutdown: close HTTP server and DB connection
const shutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down...`)
  try {
    if (server && server.listening) {
      await new Promise((resolve, reject) => {
        server.close(err => (err ? reject(err) : resolve()))
      })
      console.log('HTTP server closed')
    } else {
      console.log('HTTP server not running')
    }

    await disconnectDb()
    console.log('DB disconnected')
    process.exit(0)
  } catch (e) {
    console.error('Error during shutdown', e)
    process.exit(1)
  }
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))



