import pool from "../config/db.js";

export const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const orderData = req.body;
    console.log("📦 Order received from frontend:", orderData);

    // ✅ Extract address
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

    const userId = req.user?.id || null;

    // ✅ Insert address once
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

    // ✅ Insert orders
    const insertOrderQuery = `
      INSERT INTO orders
      (product_id, quantity, total_price, shipping_address_id, user_id)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
    `;

    let savedOrders = [];

    if (orderData.products && orderData.products.length > 0) {
      // Multiple products
      for (const product of orderData.products) {
        const values = [
          product.productId,
          product.quantity,
          (parseFloat(product.price) * product.quantity).toFixed(2), // per-product total
          savedAddress.id,
          userId,
        ];
        const result = await client.query(insertOrderQuery, values);
        savedOrders.push(result.rows[0]);
      }
    } else {
      // Single product
      const values = [
        orderData.productId,
        orderData.quantity,
        orderData.total,
        savedAddress.id,
        userId,
      ];
      const result = await client.query(insertOrderQuery, values);
      savedOrders.push(result.rows[0]);
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Order(s) received successfully",
      orders: savedOrders,
      shippingAddress: savedAddress,
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error creating order:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};



    
export const getOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT od.*,ps.* FROM orders od left join products ps on ps.id=od.product_id WHERE user_id = $1 ORDER BY ps.created_at DESC`,
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
