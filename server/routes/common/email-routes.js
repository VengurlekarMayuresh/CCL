const express = require("express");
const { sendMail } = require("../../services/email-service");

const router = express.Router();

// POST /api/common/email-test { to, subject, text, html }
router.post("/email-test", async (req, res) => {
  try {
    const { to, subject, text, html } = req.body || {};
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({ success: false, message: "to, subject and text/html required" });
    }
    const info = await sendMail({ to, subject, text, html });
    return res.json({ success: true, message: "Email sent", messageId: info?.messageId });
  } catch (e) {
    console.error("email-test error:", e.message);
    return res.status(500).json({ success: false, message: e.message || "Failed to send email" });
  }
});

// GET /api/common/email-verify
router.get("/email-verify", async (_req, res) => {
  try {
    const tx = require("../../services/email-service").sendMail; // ensure module loaded
    const t = require("../../services/email-service").__debugGetTransport?.() || null;
    if (t && typeof t.verify === "function") {
      await t.verify();
      return res.json({ success: true, message: "SMTP connection verified" });
    }
    return res.json({ success: true, message: "Transport initialized" });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message || "SMTP verify failed" });
  }
});

module.exports = router;
