import Razorpay from "razorpay";
import dotenv from "dotenv";
import pool from "../config/db.js";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency,
      receipt: receipt || "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      userEmail:req.user.email
    });
  } catch (err) {
    console.error("❌ Razorpay order error:", err);
    res.status(500).json({ error: "Payment initiation failed" });
  }
};




export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId,razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment details" });
    }

    // ✅ Find the order by razorpay_order_id and update payment details
    const query = `
      UPDATE orders
      SET razorpay_payment_id = $1,
          razorpay_order_id   = $2,
          razorpay_signature  = $3,
          payment_status      = 'paid'
      WHERE id = $4
      RETURNING *;
    `;

    const values = [razorpay_payment_id, razorpay_order_id, razorpay_signature,orderId];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      message: "✅ Payment status updated",
      order: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Razorpay update error:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
};

