import express from 'express'
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/messages.route.js';
const app = express();
import * as dotenv from 'dotenv';
dotenv.config();

app.use(express.json())

const PORT = process.env.PORT || 5000

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes )


app.listen(PORT, () => {
  console.log(`server is running at port http://localhost:${PORT}`)
})




