import express from "express";
import { addproducts, allproducts, categories, getAdminDashboardData, updateOrder, updateProduct } from "../controllers/adminController.js";


const router = express.Router();

router.get("/", getAdminDashboardData);
router.put("/orders/:orderId",updateOrder);
router.get("/products",allproducts);
router.post("/products",addproducts);
router.get("/categories",categories);
router.put("/products/:id", updateProduct); 



export default router;
