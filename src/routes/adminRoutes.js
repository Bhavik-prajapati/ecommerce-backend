import express from "express";
import { addcategory, addproducts, allproducts, categories, getAdminDashboardData, updateOrder, updateProduct } from "../controllers/adminController.js";


const router = express.Router();

router.get("/", getAdminDashboardData);
router.put("/orders/:orderId",updateOrder);



export default router;
