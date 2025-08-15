import express from "express";
import { createPayment, getPaymentByOrderId } from "../controllers/paymentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", authenticate, createPayment);
router.get("/:order_id", authenticate, getPaymentByOrderId);

export default router;
