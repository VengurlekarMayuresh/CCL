const express = require("express");
const router = express.Router();
const { addProductReview, getProductReview } = require("../../controllers/shop/productreview-controller");

router.post("/add", addProductReview);
router.get("/:productId", getProductReview);

module.exports = router;