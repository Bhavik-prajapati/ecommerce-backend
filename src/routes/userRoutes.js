import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.get("/profile", authenticate, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}!`, user: req.user });
});

export default router;
