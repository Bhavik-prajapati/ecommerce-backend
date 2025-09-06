import express from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlistController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add product to wishlist
router.post("/", authenticate, addToWishlist);

// Get all wishlist items for logged-in user    
router.get("/", authenticate, getWishlist);

// Remove a product from wishlist
router.delete("/:productId", authenticate, removeFromWishlist);

export default router;
