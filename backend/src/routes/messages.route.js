import express from 'express'
import { login, logout, signup } from '../controllers/auth.controller.js';
const router = express.Router()


router.post("/send",login)
router.post("/get",signup)
// router.put("/logout",logout)



export default router;