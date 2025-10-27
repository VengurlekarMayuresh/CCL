const mongoose = require("mongoose");

const UserScheme = new mongoose.Schema({
  uid: {
    type: String,
    unique: true,
    sparse: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "user",
  },
}, { timestamps: true });

const User = mongoose.model("User", UserScheme);

module.exports = User;
