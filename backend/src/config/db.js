import mongoose from 'mongoose'

export const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL)
        console.log("MongoDB is connected successfully", conn.connection.host)
    } catch (error) {
        console.error("connection error in connectiondb of MongoDB :", error)
        process.exit(1)
    }
} 