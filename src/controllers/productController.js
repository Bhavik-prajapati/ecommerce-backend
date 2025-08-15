import pool from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching product" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image_url, category_id } = req.body;
    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock, image_url, category_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, price, stock, image_url, category_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image_url, category_id } = req.body;
    const result = await pool.query(
      `UPDATE products SET name=$1, description=$2, price=$3, stock=$4, image_url=$5, category_id=$6, updated_at=NOW() 
       WHERE id=$7 RETURNING *`,
      [name, description, price, stock, image_url, category_id, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting product" });
  }
};
