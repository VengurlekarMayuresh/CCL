const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const {
    // Generic SMTP
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE,
    SMTP_FROM,
    // Gmail OAuth2
    GMAIL_USER,
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN,
  } = process.env;

  // Prefer Gmail OAuth2 if configured
  if (GMAIL_USER && GMAIL_CLIENT_ID && GMAIL_CLIENT_SECRET && GMAIL_REFRESH_TOKEN) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: GMAIL_USER,
        clientId: GMAIL_CLIENT_ID,
        clientSecret: GMAIL_CLIENT_SECRET,
        refreshToken: GMAIL_REFRESH_TOKEN,
      },
    });
    return transporter;
  }

  // Fallback to plain SMTP
  if (!SMTP_HOST || !SMTP_PORT) {
    console.warn("Email not configured: set Gmail OAuth2 or SMTP_* env vars.");
    return null;
  }
  const requireTLS = process.env.SMTP_REQUIRE_TLS === "true" || Number(SMTP_PORT) === 587;
  const debug = process.env.SMTP_DEBUG === "true";
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true" || Number(SMTP_PORT) === 465,
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    requireTLS,
    tls: { minVersion: "TLSv1.2" },
    connectionTimeout: Number(process.env.SMTP_CONN_TIMEOUT || 20000),
    greetingTimeout: Number(process.env.SMTP_GREET_TIMEOUT || 20000),
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT || 20000),
    logger: debug,
    debug,
  });
  return transporter;
}

async function sendMail({ to, subject, text, html }) {
  const tx = getTransporter();
  if (!tx) {
    throw new Error("Email transport not configured (set Gmail OAuth2 or SMTP_* env vars)");
  }
  const from =
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    process.env.GMAIL_USER ||
    "no-reply@example.com";
  try {
    const info = await tx.sendMail({
      from,
      to,
      subject,
      text,
      html: html || text?.replace(/\n/g, "<br/>")
    });
    return info;
  } catch (e) {
    e.message = `sendMail failed: ${e.message}`;
    throw e;
  }
}

async function sendOrderStatusEmail(to, order, status) {
  const statusMessages = {
    confirmed: "has been confirmed and is being processed",
    inProcess: "is currently being prepared",
    shipped: "has been shipped and is on its way",
    delivered: "has been successfully delivered",
    cancelled: "has been cancelled",
    returned: "has been processed for return",
    pending: "is pending and will be updated soon"
  };

  const statusMessage = statusMessages[status.toLowerCase()] || `status has been updated to ${status}`;
  const subject = `Order Update: Your order ${statusMessage}`;
  
  const items = (order.cartItems || [])
    .map((i) => `• ${i.title} (Qty: ${i.quantity}) - $${(i.salePrice || i.price).toFixed(2)}`)
    .join("\n");

  const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });

  const text = `Dear Valued Customer,

We hope this email finds you well!

Your order #${order._id} ${statusMessage}.

📦 ORDER SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order ID: ${order._id}
Order Date: ${orderDate}
Payment Status: ${order.paymentStatus || 'Pending'}
Total Amount: $${order.totalAmount.toFixed(2)}

🛒 ITEMS ORDERED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${items}

🏠 SHIPPING ADDRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${order.addressInfo?.address || 'N/A'}
${order.addressInfo?.city || ''} ${order.addressInfo?.pincode || ''}
${order.addressInfo?.phone ? 'Phone: ' + order.addressInfo.phone : ''}
${order.addressInfo?.notes ? 'Notes: ' + order.addressInfo.notes : ''}

${getStatusSpecificMessage(status)}

If you have any questions or concerns about your order, please don't hesitate to contact our customer support team.

Thank you for choosing us! We appreciate your business.

Best regards,
The E-Commerce Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated message. Please do not reply to this email.
For support, contact us at support@yourstore.com`;

  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Update</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; text-transform: uppercase; }
        .status-confirmed { background: #d4edda; color: #155724; }
        .status-shipped { background: #cce5ff; color: #004085; }
        .status-delivered { background: #d1ecf1; color: #0c5460; }
        .status-default { background: #f8f9fa; color: #495057; }
        .order-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .items-list { list-style: none; padding: 0; }
        .items-list li { padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
        .total { font-size: 18px; font-weight: bold; color: #28a745; text-align: right; margin-top: 10px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛍️ Order Update</h1>
            <p>Your order ${statusMessage}</p>
        </div>
        
        <div class="content">
            <p>Dear Valued Customer,</p>
            <p>We hope this email finds you well! Here's an update on your recent order:</p>
            
            <div class="order-details">
                <h3>📦 Order Summary</h3>
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Order Date:</strong> ${orderDate}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${status.toLowerCase()}">${status}</span></p>
                <p><strong>Payment Status:</strong> ${order.paymentStatus || 'Pending'}</p>
                
                <h4>🛒 Items Ordered:</h4>
                <ul class="items-list">
                    ${(order.cartItems || []).map(item => 
                        `<li><span>${item.title} (Qty: ${item.quantity})</span><span>$${(item.salePrice || item.price).toFixed(2)}</span></li>`
                    ).join('')}
                </ul>
                <div class="total">Total: $${order.totalAmount.toFixed(2)}</div>
                
                <h4>🏠 Shipping Address:</h4>
                <p>
                    ${order.addressInfo?.address || 'N/A'}<br>
                    ${order.addressInfo?.city || ''} ${order.addressInfo?.pincode || ''}<br>
                    ${order.addressInfo?.phone ? 'Phone: ' + order.addressInfo.phone : ''}
                </p>
            </div>
            
            <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                ${getStatusSpecificMessageHtml(status)}
            </div>
            
            <p>If you have any questions or concerns about your order, please don't hesitate to contact our customer support team.</p>
            <p>Thank you for choosing us! We appreciate your business.</p>
            
            <p>Best regards,<br><strong>The E-Commerce Team</strong></p>
        </div>
        
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>For support, contact us at support@yourstore.com</p>
        </div>
    </div>
</body>
</html>`;

  await sendMail({ to, subject, text, html });
}

function getStatusSpecificMessage(status) {
  const messages = {
    confirmed: "🎉 Great news! Your order has been confirmed and we're getting it ready for you.",
    inProcess: "⚙️ Your order is currently being prepared by our team.",
    shipped: "🚚 Exciting news! Your order is on its way and should arrive soon.",
    delivered: "✅ Wonderful! Your order has been delivered. We hope you love your purchase!",
    cancelled: "❌ Your order has been cancelled. If this was unexpected, please contact our support team.",
    returned: "↩️ Your return has been processed. Refund details will follow separately.",
    pending: "⏳ Your order is pending. We'll update you as soon as there's progress."
  };
  return messages[status.toLowerCase()] || `📋 Your order status has been updated to: ${status}.`;
}

function getStatusSpecificMessageHtml(status) {
  const messages = {
    confirmed: "<h4>🎉 Order Confirmed!</h4><p>Great news! Your order has been confirmed and we're getting it ready for you.</p>",
    inProcess: "<h4>⚙️ Order in Progress</h4><p>Your order is currently being prepared by our team.</p>",
    shipped: "<h4>🚚 Order Shipped!</h4><p>Exciting news! Your order is on its way and should arrive soon.</p>",
    delivered: "<h4>✅ Order Delivered!</h4><p>Wonderful! Your order has been delivered. We hope you love your purchase!</p>",
    cancelled: "<h4>❌ Order Cancelled</h4><p>Your order has been cancelled. If this was unexpected, please contact our support team.</p>",
    returned: "<h4>↩️ Return Processed</h4><p>Your return has been processed. Refund details will follow separately.</p>",
    pending: "<h4>⏳ Order Pending</h4><p>Your order is pending. We'll update you as soon as there's progress.</p>"
  };
  return messages[status.toLowerCase()] || `<h4>📋 Status Update</h4><p>Your order status has been updated to: <strong>${status}</strong>.</p>`;
}

module.exports = { sendOrderStatusEmail, sendMail };
