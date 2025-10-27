const express = require("express");
const { addToCart, fetchCartItems, updateCartItems, deleteCartItems} = require("../../controllers/shop/cart-controller");

const router = express.Router();

router.post("/add", addToCart);
router.get("/get/:userId", fetchCartItems);
router.put("/update", updateCartItems);
router.delete("/:userId/:productId", deleteCartItems);

module.exports = router;
