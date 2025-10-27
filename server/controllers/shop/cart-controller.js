const Cart = require("../../models/Cart");
const Product = require("../../models/product");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate input
    if (!userId || !productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid input", success: false });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
      await cart.save();
    } else {
      const itemIndex = cart.items.findIndex((item) =>
        item.productId.equals(productId)
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      await cart.save();
    }

    // Return populated items like fetchCartItems
    await cart.populate({
      path: "items.productId",
      select: "title price salesPrice image",
    });

    const populatedItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      title: item.productId ? item.productId.title : null,
      price: item.productId ? item.productId.price : null,
      salesPrice: item.productId ? item.productId.salesPrice : null,
      image: item.productId ? item.productId.image : null,
      quantity: item.quantity,
    }));

    return res.status(200).json({
      message: "Item added to cart",
      success: true,
      data: { ...cart._doc, items: populatedItems },
      cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is required", success: false });
    }
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "title price salesPrice image",
    });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not Found", success: false });
    }

    const validItems = cart.items.filter((item) => item.productId);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populatedItems = cart.items.map((item) => ({
      productId: item.productId._id,
      title: item.productId.title,
      price: item.productId.price,
      salesPrice: item.productId.salesPrice,
      image: item.productId.image,
      quantity: item.quantity,
    }));
    
    res
      .status(200)
      .json({ data: { ...cart._doc, items: populatedItems }, cart: cart, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const updateCartItems = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate input
    if (!userId || !productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid input", success: false });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "title price salesPrice image",
    });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });
    }
    const itemIndex = cart.items.findIndex((item) =>
      item.productId.equals(productId)
    );
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ message: "Item not found in cart", success: false });
    }
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "title price salesPrice image",
    });

    const populatedItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      title: item.productId ? item.productId.title : null,
      price: item.productId ? item.productId.price : null,
      salesPrice: item.productId ? item.productId.salesPrice : null,
      image: item.productId ? item.productId.image : null,
      quantity: item.quantity,
    }));
        res
      .status(200)
      .json({ data: { ...cart._doc, items: populatedItems }, success: true });
  

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const deleteCartItems = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Validate input
    if (!userId || !productId) {
      return res.status(400).json({ message: "Invalid input", success: false });
    }
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "title price salesPrice image",
    });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });
    }
    cart.items = cart.items.filter(
      (item) => !item.productId.equals(productId)
    );
    await cart.save();
       await cart.populate({
      path: "items.productId",
      select: "title price salesPrice image",
    });
     const populatedItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      title: item.productId ? item.productId.title : null,
      price: item.productId ? item.productId.price : null,
      salesPrice: item.productId ? item.productId.salesPrice : null,
      image: item.productId ? item.productId.image : null,
      quantity: item.quantity,
    }));
        res
      .status(200)
      .json({ data: { ...cart._doc, items: populatedItems }, success: true });


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItems,
  deleteCartItems,
};
