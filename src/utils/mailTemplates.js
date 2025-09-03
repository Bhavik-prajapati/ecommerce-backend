export const orderPlacedTemplate = (order) => `
  <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px; color:#333;">
    <!-- Header -->
    <div style="background:#111827; padding:30px; border-radius:12px 12px 0 0; text-align:center;">
      <h2 style="color:#fff; margin:0;">🎉 Thank you for your order!</h2>
      <p style="color:#d1d5db; font-size:14px; margin:8px 0 0;">
        Order <b>#${order.id}</b> has been placed successfully
      </p>
    </div>

    <!-- Body -->
    <div style="background:#fff; padding:25px; border:1px solid #e5e7eb; border-top:none; border-radius:0 0 12px 12px;">
      
      <p style="font-size:16px;">Hi <b>${order.customerName}</b>,</p>
      <p style="font-size:14px; margin-bottom:20px;">
        Thanks for shopping with us! Here’s a summary of your order:
      </p>

      <!-- Order Summary -->
      <h3 style="margin:0 0 12px; font-size:16px; color:#111;">Order Summary</h3>
      <table style="border-collapse:collapse; width:100%; margin:10px 0; font-size:14px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="border:1px solid #ddd; padding:8px; text-align:left;">Product</th>
            <th style="border:1px solid #ddd; padding:8px; text-align:center;">Qty</th>
            <th style="border:1px solid #ddd; padding:8px; text-align:right;">Price</th>
            <th style="border:1px solid #ddd; padding:8px; text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.products
            .map(
              (p) => `
              <tr>
                <td style="border:1px solid #ddd; padding:8px;">${p.product_name}</td>
                <td style="border:1px solid #ddd; padding:8px; text-align:center;">${p.quantity}</td>
                <td style="border:1px solid #ddd; padding:8px; text-align:right;">₹${p.price}</td>
                <td style="border:1px solid #ddd; padding:8px; text-align:right;">₹${p.total}</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>

      <!-- Total -->
      <p style="font-size:16px; font-weight:bold; text-align:right; margin:15px 0;">
        Total Paid: ₹${order.total}
      </p>

      <!-- CTA -->
      <div style="text-align:center; margin:25px 0;">
        <a href="https://yourshop.com/orders/${order.id}" 
           style="background:#2563eb; color:#fff; padding:12px 28px; text-decoration:none; border-radius:6px; font-size:15px; font-weight:bold; display:inline-block;">
          View Your Order
        </a>
      </div>

      <p style="margin-top:20px; font-size:14px; color:#555;">We’ll notify you once your order is shipped 🚚</p>
      <p style="font-size:14px;">– Team ShopEase</p>
    </div>
  </div>
`;


// 📦 Order Shipped
export const orderShippedTemplate = (order) => {
  const formattedDate = new Date(order.expected_delivery_date).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const productsHTML = order.products
    .map(
      (p) => `
      <tr>
        <td style="padding:8px; border:1px solid #e5e7eb;">${p.product_name}</td>
        <td style="padding:8px; border:1px solid #e5e7eb;">${p.quantity}</td>
        <td style="padding:8px; border:1px solid #e5e7eb;">₹${p.price.toFixed(2)}</td>
        <td style="padding:8px; border:1px solid #e5e7eb;">₹${p.total.toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  return `
  <div style="font-family:Arial, sans-serif; background:#f9fafb; padding:20px; color:#333;">
    <div style="background:#3b82f6; padding:30px; border-radius:12px 12px 0 0; text-align:center;">
      <h2 style="color:#fff; margin:0;">🚚 Your order is on the way!</h2>
    </div>
    <div style="background:#fff; padding:25px; border:1px solid #e5e7eb; border-top:none; border-radius:0 0 12px 12px;">
      <p>Hi <b>${order.customer_name}</b>,</p>
      <p>Your order <b>#${order.order_id}</b> has been shipped.</p>
      <p>Expected Delivery Date: <b>${formattedDate}</b></p>
      
      <h3 style="margin-top:20px;">📦 Order Summary</h3>
      <table style="width:100%; border-collapse:collapse; margin-top:10px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:8px; border:1px solid #e5e7eb;">Product</th>
            <th style="padding:8px; border:1px solid #e5e7eb;">Qty</th>
            <th style="padding:8px; border:1px solid #e5e7eb;">Price</th>
            <th style="padding:8px; border:1px solid #e5e7eb;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${productsHTML}
        </tbody>
      </table>
      <p style="margin-top:15px;"><b>Grand Total: ₹${order.total_price}</b></p>

      <p style="font-size:14px; margin-top:20px;">– Team ShopEase</p>
    </div>
  </div>
`;
};

// ✅ Order Delivered
export const orderDeliveredTemplate = (order) => {
  const productsHTML = order.products
    .map(
      (p) => `
      <tr>
        <td style="padding:8px; border:1px solid #e5e7eb;">${p.product_name}</td>
        <td style="padding:8px; border:1px solid #e5e7eb;">${p.quantity}</td>
        <td style="padding:8px; border:1px solid #e5e7eb;">₹${p.price.toFixed(2)}</td>
        <td style="padding:8px; border:1px solid #e5e7eb;">₹${p.total.toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  return `
  <div style="font-family:Arial, sans-serif; background:#f9fafb; padding:20px; color:#333;">
    <div style="background:#22c55e; padding:30px; border-radius:12px 12px 0 0; text-align:center;">
      <h2 style="color:#fff; margin:0;">📦 Order Delivered!</h2>
    </div>
    <div style="background:#fff; padding:25px; border:1px solid #e5e7eb; border-top:none; border-radius:0 0 12px 12px;">
      <p>Hi <b>${order.customer_name}</b>,</p>
      <p>Your order <b>#${order.order_id}</b> has been successfully delivered.</p>

      <h3 style="margin-top:20px;">📦 Order Summary</h3>
      <table style="width:100%; border-collapse:collapse; margin-top:10px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:8px; border:1px solid #e5e7eb;">Product</th>
            <th style="padding:8px; border:1px solid #e5e7eb;">Qty</th>
            <th style="padding:8px; border:1px solid #e5e7eb;">Price</th>
            <th style="padding:8px; border:1px solid #e5e7eb;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${productsHTML}
        </tbody>
      </table>
      <p style="margin-top:15px;"><b>Grand Total: ₹${order.total_price}</b></p>

      <div style="text-align:center; margin:20px 0;">
        <a href="https://yourshop.com/orders/${order.order_id}/review" target="_blank"
           style="background:#22c55e; color:#fff; padding:12px 28px; border-radius:6px; font-size:15px; text-decoration:none; font-weight:bold; display:inline-block;">
          Leave a Review
        </a>
      </div>

      <p style="font-size:14px; margin-top:20px;">– Team ShopEase</p>
    </div>
  </div>
`;
};
