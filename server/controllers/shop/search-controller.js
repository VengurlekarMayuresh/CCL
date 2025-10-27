const Product = require("../../models/product.js");

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex special chars
};

const searchProducts = async (req, res) => {
  try {
    let { keyword } = req.params;

    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({ success: false, message: "Invalid search keyword" });
    }

    keyword = keyword.trim();
    if (keyword.length === 0) {
      return res.status(400).json({ success: false, message: "Search keyword cannot be empty" });
    }

    const safeKeyword = escapeRegex(keyword);
    const regex = new RegExp(safeKeyword, "i");

    const products = await Product.find({
      $or: [
        { title: regex },
        { description: regex },
        { category: regex },
        { brand: regex },
      ],
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Search products error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { searchProducts };
