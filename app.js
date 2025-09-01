import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import { swaggerServe, swaggerSetup } from "./src/config/swagger.js";
import expressJSDocSwagger from "express-jsdoc-swagger";
import cartRoutes from "./src/routes/cartRoutes.js";
import shippingRoutes from "./src/routes/shippingRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

const options = {
  info: {
    version: "1.0.0",
    title: "E-commerce API",
    description: "Auto-generated API docs with express-jsdoc-swagger",
  },
  baseDir: process.cwd(),
  filesPattern: "./src/routes/*.js", // where to look for docs
  swaggerUIPath: "/api-docs",
  exposeSwaggerUI: true,
  exposeApiDocs: false,
};

const app = express();
dotenv.config();    

app.use(cors({
  origin: [
    "http://localhost:5173", // local dev,
    "https://shop-ecom-ease.netlify.app",
    "https://ecommerce-frontend-4imw.onrender.com", // deployed frontend
    "http://localhost:5174", // admin dev,
  ],
  credentials: true
}));

app.use(express.json());
expressJSDocSwagger(app)(options);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api-docs", swaggerServe, swaggerSetup);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
