const express = require("express");

const {
  handleImageUpload,
  addNewProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
} = require("../../controllers/admin/products-controller.js");
const { upload } = require("../../helpers/cloudinary.js");

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);

router.post("/add", addNewProduct);
router.get("/all", fetchAllProducts);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
