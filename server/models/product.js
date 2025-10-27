const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    price: Number,
    brand: String,
    category: String,
    salesPrice: Number,
    totalStock: Number,
  },
  { timestamps: true }
);
module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);