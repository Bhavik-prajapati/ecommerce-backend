import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} from "../controllers/orderController.js";

import { authenticate } from "../middlewares/authMiddleware.js"; // ensure user is logged in

const router = express.Router();

// Create a new order
router.post("/", authenticate, createOrder);

// Get all orders for logged-in user
router.get("/", authenticate, getOrders);

// Get single order (with items)
router.get("/:id", authenticate, getOrderById);

// Update order status (admin or owner)
router.put("/:id/status", authenticate, updateOrderStatus);

export default router;
