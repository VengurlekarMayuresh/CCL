const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Centralized cookie options to avoid mismatches between set/clear
function buildCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  const opts = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax", // required for cross-site cookies in prod (Vercel/Render, etc.)
    path: "/",
    maxAge: 3600 * 1000, // keep in sync with JWT expiresIn
  };
  if (process.env.COOKIE_DOMAIN) {
    opts.domain = process.env.COOKIE_DOMAIN;
  }
  return opts;
}

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      console.log("User Already Exists");
      return res.json({ message: "User Already Exists", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });
    await newUser
      .save()
      .then(() => {
        console.log("User Registered Successfully");
      })
      .catch((err) => {
        console.log(err);
      });
    res
      .status(201)
      .json({ message: "User Registered Successfully", success: true });
  } catch (error) {
    console.log("Error During registration" + error);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.json({ message: "User Not Found", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "Invalid credentials", success: false });
    }
    const payLoad = {
      email: user.email,
      id: user._id,
      role: user.role,
      userName: user.userName,
    };
    const token = jwt.sign(payLoad, process.env.SECRET_KEY, { expiresIn: 3600 });
    const cookieOpts = buildCookieOptions();
    return res
      .cookie("token", token, cookieOpts)
      .json({
        success: true,
        message: "Login Successfully",
        user: {
          id: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
          username: user.userName,
        },
      });
  } catch (error) {
    console.log("Error During Login" + error);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
};

const logoutUser = (req, res) => {
  const cookieOpts = buildCookieOptions();
  return res
    .clearCookie("token", cookieOpts)
    .json({
      success: true,
      message: "Logout Successfully",
    });
};

//authMiddleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized User",
    });
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
   return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized User ",
    } )
  }
};

// Login/Sync with Firebase (expects firebaseAuth middleware to set req.user)
const loginWithFirebase = async (req, res) => {
  try {
    const fb = req.user; // from firebaseAuth
    if (!fb || !fb.uid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    let user = await User.findOne({ uid: fb.uid });
    if (!user && fb.email) {
      user = await User.findOne({ email: fb.email });
    }
    if (!user) {
      const baseUserName = fb.name || (fb.email ? fb.email.split("@")[0] : fb.uid.substring(0, 8));
      user = new User({
        uid: fb.uid,
        email: fb.email || `${fb.uid}@no-email.local`,
        userName: baseUserName,
        role: "user",
      });
      try {
        await user.save();
        console.log("[firebase login] created user:", user._id, user.email);
      } catch (err) {
        if (err && err.code === 11000) {
          // Handle duplicate key (userName/email). Try linking by email else adjust username.
          const existingByEmail = fb.email ? await User.findOne({ email: fb.email }) : null;
          if (existingByEmail) {
            existingByEmail.uid = fb.uid;
            await existingByEmail.save();
            user = existingByEmail;
          } else {
            user.userName = `${baseUserName}-${fb.uid.substring(0,4)}`;
            await user.save();
          }
        } else {
          throw err;
        }
      }
    } else if (!user.uid) {
      user.uid = fb.uid;
      await user.save();
    }

    const payLoad = {
      email: user.email,
      id: user._id,
      role: user.role,
      userName: user.userName,
    };
    const token = jwt.sign(payLoad, process.env.SECRET_KEY, { expiresIn: 3600 });
    const cookieOpts = buildCookieOptions();
    return res
      .cookie("token", token, cookieOpts)
      .json({
        success: true,
        message: "Logged in with Firebase",
        user: {
          id: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
          username: user.userName,
        },
      });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Failed to login with Firebase" });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware, loginWithFirebase };
