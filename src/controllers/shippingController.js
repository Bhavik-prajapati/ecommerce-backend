import pool from "../config/db.js";

export const addShippingAddress = async (req, res) => {
  const { address_line1, address_line2, city, state, postal_code, country } = req.body;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO shipping_addresses (user_id, address_line1, address_line2, city, state, postal_code, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [user_id, address_line1, address_line2, city, state, postal_code, country]
    );

    res.status(201).json({ message: "Shipping address added", address: result.rows[0] });
  } catch (error) {
    console.error("Add shipping error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getShippingAddresses = async (req, res) => { 
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      `SELECT * FROM shipping_addresses WHERE user_id = $1`,
      [user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get shipping error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
