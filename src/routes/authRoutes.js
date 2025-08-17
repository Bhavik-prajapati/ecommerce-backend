import express from "express";
import { register, login, refreshAccessToken, verifyToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/verify", verifyToken);

export default router;
