const User = require("../../models/user");

async function linkFirebaseUser(req, res, next) {
  try {
    const fb = req.user; // from firebaseAuth: { uid, email, name, picture, claims }
    if (!fb || !fb.uid) return res.status(401).json({ success: false, message: "Unauthorized" });
    let user = await User.findOne({ uid: fb.uid });
    if (!user) {
      // Try link by email if exists
      if (fb.email) {
        user = await User.findOne({ email: fb.email });
      }
      if (!user) {
        user = new User({
          uid: fb.uid,
          email: fb.email || `${fb.uid}@no-email.local`,
          userName: fb.name || (fb.email ? fb.email.split("@")[0] : fb.uid.substring(0, 8)),
          role: "user",
        });
      } else if (!user.uid) {
        user.uid = fb.uid;
      }
      await user.save();
    }
    req.mongoUser = user;
    next();
  } catch (e) {
    console.error("linkFirebaseUser error:", e.message);
    return res.status(500).json({ success: false, message: "Failed to link user" });
  }
}

module.exports = { linkFirebaseUser };