import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // or smtp config if using custom provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"ShopEase" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📩 Mail sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("❌ Mail send failed:", err);
    return false;
  }
};
