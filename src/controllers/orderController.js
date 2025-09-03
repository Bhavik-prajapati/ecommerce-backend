import pool from "../config/db.js";

// ✅ Create Order

// ✅ Create Order using Postgres functions
// ✅ Create Order Controller
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

    // ✅ Call insert_shipping_address function
    const addressResult = await client.query(
      `SELECT * FROM insert_shipping_address(
        $1::INT, $2::VARCHAR, $3::VARCHAR, $4::VARCHAR, $5::VARCHAR,
        $6::VARCHAR, $7::VARCHAR, $8::VARCHAR, $9::VARCHAR
      )`,
      [
        userId,
        receivername,
        mobile_no,
        address_line1,
        address_line2 || null,
        city,
        state,
        postal_code,
        country,
      ]
    );
    const savedAddress = addressResult.rows[0];

    // ✅ Calculate total order price
    let totalOrderPrice = 0;
    if (orderData.products && orderData.products.length > 0) {
      totalOrderPrice = orderData.products.reduce(
        (sum, p) => sum + parseFloat(p.price) * p.quantity,
        0
      );
    } else {
      totalOrderPrice = parseFloat(orderData.price) * orderData.quantity;
    }

    // ✅ Call insert_order function
    const orderResult = await client.query(
      `SELECT * FROM insert_order($1::INT, $2::INT, $3::NUMERIC, $4::VARCHAR)`,
      [userId, savedAddress.id, totalOrderPrice.toFixed(2), "pending"]
    );
    const savedOrder = orderResult.rows[0];

    let savedItems = [];

    // ✅ Call insert_order_item for each product
    if (orderData.products && orderData.products.length > 0) {
      for (const product of orderData.products) {
        const itemResult = await client.query(
          `SELECT * FROM insert_order_item($1::INT, $2::INT, $3::INT, $4::NUMERIC)`,
          [savedOrder.id, product.productId, product.quantity, product.price]
        );
        savedItems.push(itemResult.rows[0]);
      }
    } else {
      const itemResult = await client.query(
        `SELECT * FROM insert_order_item($1::INT, $2::INT, $3::INT, $4::NUMERIC)`,
        [savedOrder.id, orderData.productId, orderData.quantity, orderData.price]
      );
      savedItems.push(itemResult.rows[0]);
    }

    // ✅ Commit transaction
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

// export const updateOrderStatus = async (req, res) => {
//   const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");

//     // ✅ Update payment details
//     const orderResult = await client.query(
//       `UPDATE orders 
//        SET payment_status = 'paid',
//            razorpay_payment_id = $1,
//            razorpay_order_id = $2,
//            razorpay_signature = $3,
//            updated_at = CURRENT_TIMESTAMP
//        WHERE id = $4
//        RETURNING *`,
//       [razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId]
//     );

//     if (orderResult.rows.length === 0) {
//       throw new Error("Order not found");
//     }

//     // ✅ Reduce stock for each product in this order
//     const itemsResult = await client.query(
//       `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
//       [orderId]
//     );

//     for (const item of itemsResult.rows) {
//       await client.query(
//         `SELECT reduce_stock($1::INT, $2::INT)`,
//         [item.product_id, item.quantity]
//       );
//     }

//     await client.query("COMMIT");

//     res.json({
//       message: "✅ Payment successful & stock updated",
//       order: orderResult.rows[0],
//     });
//   } catch (err) {
//     await client.query("ROLLBACK");
//     console.error("❌ Error updating order status:", err);
//     res.status(500).json({ error: err.message });
//   } finally {
//     client.release();
//   }
// };

