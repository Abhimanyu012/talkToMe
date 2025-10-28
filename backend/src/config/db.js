import mongoose from 'mongoose'

/**
 * Connect to MongoDB with a small retry/backoff strategy.
 * Throws an error if DATABASE_URL is not set or all attempts fail.
 * @param {Object} [opts]
 * @param {number} [opts.maxAttempts=5]
 * @param {number} [opts.baseDelay=1000] - base delay in ms for exponential backoff
 */
export const connectDb = async ({ maxAttempts = 5, baseDelay = 1000 } = {}) => {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        throw new Error('DATABASE_URL environment variable is not defined');
    }

    let attempt = 0;
    while (attempt < maxAttempts) {
        try {
            const conn = await mongoose.connect(dbUrl);
            console.log('MongoDB is connected successfully', conn.connection.host);
            return conn;
        } catch (error) {
            attempt++;
            console.error(`MongoDB connect attempt ${attempt} failed:`, error.message || error);
            if (attempt >= maxAttempts) {
                throw error;
            }
            const wait = Math.min(30000, baseDelay * 2 ** attempt);
            await new Promise((res) => setTimeout(res, wait));
        }
    }
}

export const disconnectDb = async () => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    } catch (err) {
        console.error('Error during mongoose.disconnect()', err);
    }
}
