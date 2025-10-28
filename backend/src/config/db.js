import mongoose from 'mongoose'

export const connectDb = async () => {
    try {
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error("DATABASE_URL environment variable is not defined");
        }
        const conn = await mongoose.connect(dbUrl);
        console.log("MongoDB is connected successfully", conn.connection.host);
    } catch (error) {
        console.error("connection error in connectiondb of MongoDB :", error)
        process.exit(1)
    }
} 