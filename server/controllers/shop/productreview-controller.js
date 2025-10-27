const ProductReview = require("../../models/Review");
const Order = require("../../models/Order");
const Product = require("../../models/product");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMsg, reviewValue } =
      req.body;
   
   
    //   const order = await Order.findOne({
    //   userId,
    //   productId,
     //   orderStatus: "delivered",
    // });
    // if (!order) {
    //   return res.status(404).json({ message: "You need to purchase product to review", success: false });
    // }


    const existingReview = await ProductReview.findOne({
      productId,
      userId,
    });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product", success: false });
    }
    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage:reviewMsg,
      reviewValue,
    });
    await newReview.save();

    const reviews = await ProductReview.find({ productId });
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((acc, review) => acc + review.reviewValue, 0) / totalReviews;
    await Product.findByIdAndUpdate(productId, {
      averageRating
    });
    res.status(201).json({ message: "Review added successfully", success: true, data: newReview });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

const getProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ProductReview.find({ productId });
    res.status(200).json({ message: "Reviews fetched successfully", success: true, data: reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

module.exports = { addProductReview, getProductReview };
