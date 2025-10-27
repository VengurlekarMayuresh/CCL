const { admin, initFirebaseAdmin } = require("../../helpers/firebaseAdmin");

// Middleware to verify Firebase ID token from Authorization header
async function firebaseAuth(req, res, next) {
  try {
    const app = initFirebaseAdmin();
    if (!app) {
      return res.status(500).json({ success: false, message: "Firebase not configured on server" });
    }
    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    const idToken = match ? match[1] : null;
    if (!idToken) {
      return res.status(401).json({ success: false, message: "Missing Authorization Bearer token" });
    }
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      claims: decoded,
    };
    return next();
  } catch (err) {
    console.error("firebaseAuth error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid Firebase token" });
  }
}

module.exports = { firebaseAuth };