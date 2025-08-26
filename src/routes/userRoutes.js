import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import pool from "../config/db.js";

const router = express.Router();

router.get("/profile", authenticate, async (req, res) => {
  const client = await pool.connect();
  try {
    // Call the function with the user ID
    const query = `SELECT * FROM get_user_with_orders($1);`;
    const result = await client.query(query, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // Add invoice_url to each order
    if (user.orders && user.orders.length > 0) {
      user.orders = user.orders.map((order) => ({
        ...order,
      }));
    }

    res.json(user); // returns user with nested orders + invoice link
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
});

export default router;
