import express from "express";
import { addShippingAddress, getShippingAddresses } from "../controllers/shippingController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, addShippingAddress);
router.get("/", authenticate, getShippingAddresses);

export default router;
