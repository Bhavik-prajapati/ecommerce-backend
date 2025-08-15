import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../controllers/cartController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, addToCart);
router.get("/", authenticate, getCart);
router.put("/:id", authenticate, updateCartItem);
router.delete("/:id", authenticate, removeCartItem);
router.delete("/", authenticate, clearCart);

export default router;
