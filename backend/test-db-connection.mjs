import dotenv from 'dotenv'
import mongoose from 'mongoose'

// Ensure we load the backend/.env regardless of CWD when running from repo root
dotenv.config({ path: new URL('./.env', import.meta.url).pathname })

const dbUrl = process.env.DATABASE_URL

async function test() {
  if (!dbUrl) {
    console.error('DATABASE_URL is not set in environment. Check backend/.env or environment variables.')
    process.exit(1)
  }

  console.log('Attempting to connect to MongoDB...')

  try {
    // Short timeout for quick failure (in milliseconds)
    const conn = await mongoose.connect(dbUrl, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 })
    console.log('MongoDB connected to', conn.connection.host)
    await mongoose.disconnect()
    console.log('Disconnected cleanly')
    process.exit(0)
  } catch (err) {
    console.error('MongoDB connection failed:', err && err.message ? err.message : err)
    process.exit(2)
  }
}

test()
