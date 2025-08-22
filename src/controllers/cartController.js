import pool from "../config/db.js";

// ✅ Add to cart (returns updated cart)
export const addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    const existing = await pool.query(
      `SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2`,
      [req.user.id, product_id]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE cart_items 
         SET quantity = quantity + $1 
         WHERE user_id = $2 AND product_id = $3`,
        [quantity, req.user.id, product_id]
      );
    } else {
      await pool.query(
        `INSERT INTO cart_items (user_id, product_id, quantity) 
         VALUES ($1, $2, $3)`,
        [req.user.id, product_id, quantity]
      );
    }

    const result = await pool.query(
      `SELECT c.id, c.product_id, p.name, p.price, c.quantity
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.product_id, p.name, p.price, c.quantity,p.image_url
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  try {
    await pool.query(
      `UPDATE cart_items 
       SET quantity = $1 
       WHERE id = $2 AND user_id = $3`,
      [quantity, req.params.id, req.user.id]
    );

    const result = await pool.query(
      `SELECT c.id, c.product_id, p.name, p.price, p.image_url,c.quantity
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM cart_items 
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    const result = await pool.query(
      `SELECT c.id, c.product_id, p.name, p.price,p.image_url, c.quantity
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM cart_items WHERE user_id = $1`,
      [req.user.id]
    );
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
