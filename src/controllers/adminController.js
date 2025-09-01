import pool from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

export const getAdminDashboardData = async (req, res) => {
  try {
    const query = `SELECT * FROM get_admin_dashboard_data();`;
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


export const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const { payment_status, expected_delivery_date } = req.body;

  try {
    const updateQuery = `
      UPDATE orders
      SET payment_status = $1,
          expected_delivery_date = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING *;
    `;
    const result = await pool.query(updateQuery, [payment_status, expected_delivery_date, orderId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order updated successfully", order: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update order" });
  }
};

export const allproducts=async(req,res)=>{

    try {
    const query = `select p.*,cs.name as category_name from products p LEFT JOIN categories cs ON cs.id=p.category_id;`;
    const { rows } = await pool.query(query);
    if (rows.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }


}

export const addproducts = async (req, res) => {
  try {
    const { name, description, price, stock, image_url, category_id } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }

    const query = `
      INSERT INTO products (name, description, price, stock, image_url, category_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *;
    `;

    const values = [name, description, price, stock || 0, image_url, category_id];
    const { rows } = await pool.query(query, values);

    return res.status(201).json(rows[0]); // return the created product
  } catch (err) {
    console.error("Error adding product:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, image_url, category_id } = req.body;

    const query = `
      UPDATE products
      SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        price = COALESCE($3, price),
        stock = COALESCE($4, stock),
        image_url = COALESCE($5, image_url),
        category_id = COALESCE($6, category_id),
        updated_at = NOW()
      WHERE id = $7
      RETURNING *;
    `;

    const values = [name, description, price, stock, image_url, category_id, id];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(rows[0]); // return the updated product
  } catch (err) {
    console.error("Error updating product:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



export const categories=async(req,res)=>{
    try {
    const query = `select * from categories`;
    const { rows } = await pool.query(query);
    if (rows.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }


}