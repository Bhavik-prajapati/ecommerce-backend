import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

/**
 * GET /api/products
 * @summary Get all products
 * @return {array<object>} 200 - success
 */
router.get("/", getProducts);

/**
 * GET /api/products/{id}
 * @summary Get product by ID
 * @param {number} id.path.required - Product ID
 * @return {object} 200 - success
 */
router.get("/:id", getProductById);

/**
 * POST /api/products
 * @summary Create new product
 * @param {object} request.body.required - Product info
 * @return {object} 201 - Created
 */
router.post("/", createProduct);

/**
 * PUT /api/products/{id}
 * @summary Update product
 * @param {number} id.path.required - Product ID
 * @param {object} request.body.required - Updated product info
 * @return {object} 200 - success
 */
router.put("/:id", updateProduct);

/**
 * DELETE /api/products/{id}
 * @summary Delete product
 * @param {number} id.path.required - Product ID
 * @return {object} 200 - success
 */
router.delete("/:id", deleteProduct);

export default router;
