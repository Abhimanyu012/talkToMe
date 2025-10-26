import express from 'express'
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/messages.route.js';
import * as dotenv from 'dotenv';
import path from 'path'
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000
const __dirname = path.resolve()

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

  // Use a RegExp to avoid path-to-regexp parameter parsing issues (matches all routes)
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  })
}


app.listen(PORT, () => {
  console.log(`server is running at port http://localhost:${PORT}`)
})




