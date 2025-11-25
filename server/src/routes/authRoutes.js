// routes/authRoutes.js
import express from "express";
import { register,loginUserMongo,getCurrentUser } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", loginUserMongo);



router.get("/me", authMiddleware,getCurrentUser);
export default router;
