import pool from "../config/db.js";

// ✅ Create Order
export const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
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

    // ✅ Calculate total price
    let totalOrderPrice = 0;
    if (orderData.products && orderData.products.length > 0) {
      totalOrderPrice = orderData.products.reduce(
        (sum, p) => sum + parseFloat(p.price) * p.quantity,
        0
      );
    } else {
      totalOrderPrice = parseFloat(orderData.price) * orderData.quantity;
    }

    // ✅ Insert order (default expected delivery = 5 days)
    const insertOrderQuery = `
      INSERT INTO orders
      (user_id, shipping_address_id, total_price, payment_status, expected_delivery_date)
      VALUES ($1,$2,$3,$4, NOW() + INTERVAL '5 days')
      RETURNING *;
    `;
    const orderValues = [
      userId,
      savedAddress.id,
      totalOrderPrice.toFixed(2),
      "pending",
    ];
    const orderResult = await client.query(insertOrderQuery, orderValues);
    const savedOrder = orderResult.rows[0];

    // ✅ Insert order items
    const insertItemQuery = `
      INSERT INTO order_items
      (order_id, product_id, quantity, price)
      VALUES ($1,$2,$3,$4)
      RETURNING *;
    `;
    let savedItems = [];

    if (orderData.products && orderData.products.length > 0) {
      for (const product of orderData.products) {
        const itemValues = [
          savedOrder.id,
          product.productId,
          product.quantity,
          product.price,
        ];
        const itemResult = await client.query(insertItemQuery, itemValues);
        savedItems.push(itemResult.rows[0]);
      }
    } else {
      const itemValues = [
        savedOrder.id,
        orderData.productId,
        orderData.quantity,
        orderData.price,
      ];
      const itemResult = await client.query(insertItemQuery, itemValues);
      savedItems.push(itemResult.rows[0]);
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "✅ Order placed successfully",
      order: savedOrder,
      items: savedItems,
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

// ✅ Get all orders of logged-in user
export const getOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.image_url, o.*, ot.quantity, ot.price as item_price
       FROM orders o
       LEFT JOIN order_items ot ON o.id = ot.order_id
       LEFT JOIN products p ON p.id = ot.product_id 
       WHERE o.user_id=$1 
       ORDER BY o.id DESC;`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get order by ID (with items)
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
      `SELECT oi.*, p.name, p.description, p.image_url 
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1`,
      [req.params.id]
    );

    res.json({
      order: orderResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update order status (with expected delivery update)
export const updateOrderStatus = async (req, res) => {
  const { status, expectedDays } = req.body; // expectedDays optional
  try {
    let query;
    let values;

    if (status === "shipped") {
      // if shipped, calculate expected delivery
      query = `
        UPDATE orders 
        SET payment_status = $1,
            expected_delivery_date = NOW() + INTERVAL '${process.env.DEFAULT_DELIVERY_DAYS} days',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *;
      `;
      values = [status, req.params.id];
    } else {
      query = `
        UPDATE orders 
        SET payment_status = $1, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *;
      `;
      values = [status, req.params.id];
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      message: "✅ Order status updated",
      order: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error updating order:", err);
    res.status(500).json({ error: err.message });
  }
};
