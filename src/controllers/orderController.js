import pool from "../config/db.js";

export const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // transaction start

    const orderData = req.body;
    console.log("📦 Order received from frontend:", orderData);
    
    const {
      receivername,
      mobile_no,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
    } = orderData.shippingAddress;

    // ⚠️ user_id from auth
    const userId = req.user?.id || null;

    // ✅ Insert shipping address
    const insertAddressQuery = `
      INSERT INTO shipping_addresses
      (user_id, receivername, mobile_no, address_line1, address_line2, city, state, postal_code, country)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *;
    `;
    const addressValues = [
      userId,
      receivername,
      mobile_no,
      address_line1,
      address_line2 || null,
      city,
      state,
      postal_code,
      country,
    ];

    const addressResult = await client.query(insertAddressQuery, addressValues);
    const savedAddress = addressResult.rows[0];

    // ✅ Insert order
    const insertOrderQuery = `
      INSERT INTO orders
      (product_id, quantity, total_price, shipping_address_id)
      VALUES ($1,$2,$3,$4)
      RETURNING *;
    `;
    const orderValues = [
      orderData.productId,
      orderData.quantity,
      orderData.total,
      savedAddress.id,
    ];

    const orderResult = await client.query(insertOrderQuery, orderValues);
    const savedOrder = orderResult.rows[0];

    await client.query("COMMIT"); // success

    res.status(201).json({
      message: "Order received successfully",
      order: {
        ...savedOrder,
        shippingAddress: savedAddress,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK"); // rollback on error
    console.error("❌ Error creating order:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

    
export const getOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderResult = await pool.query(
      `SELECT * FROM orders WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const itemsResult = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [req.params.id]
    );

    res.json({
      order: orderResult.rows[0],
      items: itemsResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
