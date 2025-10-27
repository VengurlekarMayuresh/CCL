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
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true" || Number(SMTP_PORT) === 465,
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
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
  const subject = `Your order ${order._id} is ${status}`;
  const items = (order.cartItems || [])
    .map((i) => `- ${i.title} x ${i.quantity}`)
    .join("\n");
  const text = `Hello,

Your order (${order._id}) status changed to: ${status}.

Total: $${order.totalAmount}
Items:\n${items}

Shipping to: ${order.addressInfo?.address}, ${order.addressInfo?.city} ${order.addressInfo?.pincode}

Thanks for shopping with us!`;
  await sendMail({ to, subject, text });
}

module.exports = { sendOrderStatusEmail, sendMail };
