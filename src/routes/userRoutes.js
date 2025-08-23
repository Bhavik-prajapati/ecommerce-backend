import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import pool from "../config/db.js";

const router = express.Router();

router.get("/profile", authenticate, async (req, res) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        COALESCE(json_agg(o.*) FILTER (WHERE o.id IS NOT NULL), '[]') AS orders
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.name, u.email, u.role;
    `;
    const result = await client.query(query, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
});

export default router;
