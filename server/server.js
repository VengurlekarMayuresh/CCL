require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRouter = require("./routes/auth/auth-routes");
const adminProductRouter = require("./routes/admin/products-routes");
const shopProductRouter = require("./routes/shop/products-routes");
const cartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const reviewRouter = require("./routes/shop/review-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");
const emailTestRouter = require("./routes/common/email-routes");
const app = express();

// Ensure correct client IP and Secure cookie behavior behind proxies/CDNs
app.set("trust proxy", 1);

// ✅ Middlewares should come first
const rawOrigins = (process.env.CLIENT_URL || "").split(",").map((o) => o.trim()).filter(Boolean);
// Include Render public URL if available
if (process.env.RENDER_EXTERNAL_URL) rawOrigins.push(process.env.RENDER_EXTERNAL_URL);
// In dev, allow Vite default port
if (process.env.NODE_ENV !== "production") rawOrigins.push("http://localhost:5173");
// Normalize and de-dup
const allowedOrigins = Array.from(new Set(rawOrigins.map((o) => o.replace(/\/$/, "").toLowerCase())));

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server or same-origin requests without Origin header
      if (!origin) return callback(null, true);
      const norm = origin.replace(/\/$/, "").toLowerCase();
      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(norm)
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
      "X-Requested-With",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// ✅ Routes after middleware
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/products", shopProductRouter);
app.use("/api/shop/cart", cartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use('/api/shop/order', shopOrderRouter);
app.use('/api/shop/search', shopSearchRouter);
app.use('/api/shop/review', reviewRouter);
app.use('/api/common/feature', commonFeatureRouter);
app.use('/api/common', emailTestRouter);

// Serve client build (SPA) from ../client/dist
const clientDist = path.join(__dirname, "../client/dist");
// Do not auto-serve index.html here; allow explicit SPA fallback below
app.use(express.static(clientDist, { index: false, fallthrough: true }));

// SPA fallback for non-API, HTML-accepting, non-asset routes
app.get(/^\/(?!api).*/, (req, res, next) => {
  // If request is for a file (has an extension) or not accepting HTML, skip fallback
  if (req.path.includes(".") || !req.accepts("html")) return next();
  res.sendFile(path.join(clientDist, "index.html"));
});

// ✅ Database connection after routes
mongoose
  .connect(process.env.MONGO_DBURL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is Running on port :" + PORT);
});
