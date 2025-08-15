// controllers/paymentController.js
import pool from "../config/db.js";

export const createPayment = async (req, res) => {

    console.log(req.body,"")
  const { order_id, payment_method, amount } = req.body;
  const user_id = req.user.id; // from auth middleware

  try {
    // Check if order exists and belongs to user
    const orderCheck = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [order_id, user_id]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Insert payment record
    const payment = await pool.query(
      `INSERT INTO payments (order_id, user_id, payment_method, amount, status, transaction_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [order_id, user_id, payment_method, amount, "paid", `TXN-${Date.now()}`]
    );

    // Update order status
    await pool.query(
      "UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      ["paid", order_id]
    );

    res.status(201).json({
      message: "Payment successful",
      payment: payment.rows[0],
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPaymentByOrderId = async (req, res) => {
  const { order_id } = req.params;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      "SELECT * FROM payments WHERE order_id = $1 AND user_id = $2",
      [order_id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
