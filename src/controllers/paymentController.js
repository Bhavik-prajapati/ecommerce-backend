import Razorpay from "razorpay";
import dotenv from "dotenv";
import pool from "../config/db.js";
import { orderPlacedTemplate } from "../utils/mailTemplates.js";
import { sendMail } from "../utils/mailer.js";
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
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment details" });
    }

    const { rows } = await pool.query(
      "SELECT * FROM update_order_payment($1, $2, $3, $4)",
      [orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = rows[0];

    console.log(rows)
    console.log(order,"_+_____________")


    await sendMail(
      order.customer_email, // send to user instead of hardcoding
      "Your Order has been Placed! 🎉",
      orderPlacedTemplate({
        id: order.order_id,
        customerName: order.customer_name,
        products: order.products,
        total: order.total_price,
      })
    );

    res.status(200).json({
      success: true,
      message: "✅ Payment status updated & mail sent",
      order,
    });
  } catch (err) {
    console.error("❌ Razorpay update error:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
};


