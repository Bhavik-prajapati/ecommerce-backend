import express from "express";
import { createRazorpayOrder, updateOrderStatus } from "../controllers/paymentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/razorpay",authenticate, createRazorpayOrder);
router.post("/updateorderStatus", updateOrderStatus);

export default router;
