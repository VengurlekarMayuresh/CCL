const Product = require("../../models/product");
// Inline filterOptions to avoid importing client code on the server
const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
    { id: "home", label: "Home" },
  ],
  brand: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
  ],
};

const getFilteredProducts = async (req, res) => {
  try {
    let { category, brand, sortBy = "price-low-to-high" } = req.query;

    let filters = {};

    // Category filter
    if (category && category.length > 0) {
      const categoryIds = category.split(",");
      const categoryLabels = filterOptions.category
        .filter(opt => categoryIds.includes(opt.id))
        .map(opt => opt.label);

      if (categoryLabels.length > 0) {
        filters.category = { $in: categoryLabels };
      }
    }

    // Brand filter
    if (brand && brand.length > 0) {
      const brandIds = brand.split(",");
      const brandLabels = filterOptions.brand
        .filter(opt => brandIds.includes(opt.id))
        .map(opt => opt.label);

      if (brandLabels.length > 0) {
        filters.brand = { $in: brandLabels };
      }
    }

    // Sorting logic
    let sort = {};
    switch (sortBy) {
      case "price-low-to-high":
        sort.price = 1;
        break;
      case "price-high-to-low":
        sort.price = -1;
        break;
      case "newest-first":
        sort.createdAt = -1;
        break;
      case "oldest-first":
        sort.createdAt = 1;
        break;
      case "title-a-to-z":
        sort.title = 1;
        break;
      case "title-z-to-a":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
    }

    // Fetch products (with or without filters)
    const products = await Product.find(filters).sort(sort);

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getProductDetails = async (req,res)=>{
  try{
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product){
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}

module.exports = { getFilteredProducts, getProductDetails };
