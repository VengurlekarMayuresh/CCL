const { imageUploadUtils } = require("../../helpers/cloudinary.js");
const Product = require("../../models/product.js");

const handleImageUpload = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Convert file buffer to Base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await imageUploadUtils(dataUri);
    console.log("Cloudinary upload result:", result);
    return res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id, // optional
      format: result.format, // optional
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Image upload error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

// add a new product
const addNewProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      price,
      brand,
      category,
      salesPrice,
      totalStock,
    } = req.body;
    const newProduct = new Product({
      image,
      title,
      description,
      price,
      brand,
      category,
      salesPrice,
      totalStock,
    });
    await newProduct.save();
    return res
      .status(201)
      .json({
        success: true,
        message: "Product added successfully",
        product: newProduct,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
};
//fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find();
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products: listOfProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// edit a product

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      price,
      brand,
      category,
      salesPrice,
      totalStock,
    } = req.body;
    const updatedProduct = await Product.findById(id);
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    updatedProduct.image = image || updatedProduct.image;
    updatedProduct.title = title || updatedProduct.title;
    updatedProduct.description = description || updatedProduct.description;
    updatedProduct.price = price || updatedProduct.price;
    updatedProduct.brand = brand || updatedProduct.brand;
    updatedProduct.category = category || updatedProduct.category;
    updatedProduct.salesPrice = salesPrice || updatedProduct.salesPrice;
    updatedProduct.totalStock = totalStock || updatedProduct.totalStock;
    await updatedProduct.save();
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to edit product",
      error: error.message,
    });
  }
};

// delete a product

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  handleImageUpload,
  addNewProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
