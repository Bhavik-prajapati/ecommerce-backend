import pool from "../config/db.js";

// Add to wishlist
export const addToWishlist = async (req, res) => {
  const { product_id } = req.body;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO wishlist (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING
       RETURNING *`,
      [user_id, product_id]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "Already in wishlist" });
    }

    res.status(201).json({ message: "Added to wishlist", item: result.rows[0] });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getWishlist = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT w.id, w.product_id, p.name, p.price, p.image_url, w.created_at
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2 RETURNING *`,
      [user_id, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    res.json({ message: "Removed from wishlist", item: result.rows[0] });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
