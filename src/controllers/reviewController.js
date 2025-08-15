import pool from "../config/db.js";

// Add review


export const addReview = async (req, res) => {
  const { product_id, rating, comment } = req.body;
  const user_id = req.user.id;

  try {
    // 1. Insert the review
    const result = await pool.query(
      `INSERT INTO reviews (user_id, product_id, rating, comment)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, product_id, rating, comment]
    );

    // 2. Recalculate avg + count for that product
    await pool.query(
      `UPDATE products
       SET rating_count = sub.count,
           average_rating = sub.avg
       FROM (
         SELECT product_id,
                COUNT(*)::int AS count,
                ROUND(AVG(rating)::numeric, 2) AS avg
         FROM reviews
         WHERE product_id = $1
         GROUP BY product_id
       ) AS sub
       WHERE products.id = sub.product_id`,
      [product_id]
    );

    res.status(201).json({ message: "Review added", review: result.rows[0] });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get reviews for a product
export const getProductReviews = async (req, res) => {
  const { product_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT r.*, u.name as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [product_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
