import express from "express";
import { createRazorpayOrder, updateOrderStatus } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/razorpay", createRazorpayOrder);
router.post("/updateorderStatus", updateOrderStatus);

export default router;
