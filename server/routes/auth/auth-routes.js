const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  loginWithFirebase,
} = require("../../controllers/auth-controller");
const { firebaseAuth } = require("../../routes/helpers/firebase-auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({ success: true, user, message: "User Authenticated" });
});

// Firebase endpoints
router.get("/firebase/check", firebaseAuth, (req, res) => {
  const user = req.user;
  res.status(200).json({ success: true, user, message: "Firebase User Authenticated" });
});
router.post("/firebase/login", firebaseAuth, loginWithFirebase);

module.exports = router;
