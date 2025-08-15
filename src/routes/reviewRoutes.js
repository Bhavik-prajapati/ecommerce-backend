import express from "express";
import { addReview, getProductReviews } from "../controllers/reviewController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, addReview);
router.get("/:product_id", getProductReviews);

export default router;
