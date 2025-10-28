import mongoose from 'mongoose'

// Simple DB helper: connect and disconnect. Keep it small and clear.
export async function connectDb() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  const conn = await mongoose.connect(url)
  console.log('MongoDB connected:', conn.connection.host)
  return conn
}

export async function disconnectDb() {
  await mongoose.disconnect()
  console.log('MongoDB disconnected')
}
