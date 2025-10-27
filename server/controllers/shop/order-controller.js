const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Address = require("../../models/Address");
const Cart = require("../../models/Cart");
const Product = require("../../models/product");
const User = require("../../models/user");
const { sendOrderStatusEmail } = require("../../services/email-service");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_URL}/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.salePrice
                ? item.salePrice.toFixed(2)
                : item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "Order Description",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async function (error, payment) {
      if (error) {
        console.error(error);
        res
          .status(500)
          .json({ message: "Error creating PayPal payment", success: false });
      } else {
        // Ensure we store a fallback email so confirmation can be sent post-capture
        let enrichedAddress = addressInfo || {};
        if (!enrichedAddress.email && userId) {
          try {
            const u = await User.findById(userId);
            if (u && u.email) enrichedAddress.email = u.email;
          } catch (_) {}
        }
        const newOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo: enrichedAddress,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
        });

        await newOrder.save();

        const approvalURL = payment.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(200).json({
          message: "Order created successfully",
          success: true,
          approvalURL,
          orderId: newOrder._id,
        });
      }
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const postOrder = async (req, res) => {
  try {
    const { orderData } = req.body;
    if (!orderData) {
      return res
        .status(400)
        .json({ message: "Order data is required", success: false });
    }
    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    } = orderData;

    // Enrich address with fallback email from user record if missing
    let enrichedAddress = addressInfo || {};
    if (!enrichedAddress.email && userId) {
      try {
        const u = await User.findById(userId);
        if (u && u.email) enrichedAddress.email = u.email;
      } catch (_) {}
    }

    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo: enrichedAddress,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    });
    await newOrder.save();
    res
      .status(200)
      .json({ message: "Order data received", data: newOrder, success: true });
  } catch (error) {
    console.error("Error posting order:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found", success: false });
    }
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    // Decrease product stock based on cart items
    for (const item of order.cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        res
          .status(404)
          .json({
            message: `Not enough stock for this product ${item.title}`,
            success: false,
          });
        return;
      }
      if (product) {
        product.totalStock -= item.quantity;
        await product.save();
      }
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    // Email user on confirmation
    let toEmail = null;
    let emailMeta = { attempted: false, sent: false };
    try {
      if (order.userId) {
        console.log("Fetching user for order confirmation email:", order.userId);
        const user = await User.findById(order.userId);
        if (user && user.email) toEmail = user.email;
      }
      if (!toEmail) {
        console.log("[email] No user email found for order:", order._id);
      }
    } catch (_) {}
    // Fallback to email captured in order shipping details, if any
    if (!toEmail) {
      const maybeEmail = order.addressInfo && order.addressInfo.email;
      if (maybeEmail && /.+@.+\..+/.test(maybeEmail)) {
        toEmail = maybeEmail;
      }
    }
    if (toEmail) {
      try {
        emailMeta.attempted = true;
        console.log("[email] Sending confirmation to:", toEmail, "status:", order.orderStatus);
        await sendOrderStatusEmail(toEmail, order, order.orderStatus);
        emailMeta.sent = true;
      } catch (e) {
        console.error("Failed to send confirmation email:", e.message);
      }
    } else {
      console.warn("[email] No recipient email found for order:", order._id);
    }

    res
      .status(200)
      .json({ message: "Order Confirmed", data: order, success: true, email: emailMeta });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });
    if (!orders) {
      return res
        .status(404)
        .json({ message: "Orders not found", success: false });
    }
    res
      .status(200)
      .json({ message: "Orders fetched", data: orders, success: true });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found", success: false });
    }
    res
      .status(200)
      .json({ message: "Order fetched", data: order, success: true });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
module.exports = {
  createOrder,
  capturePayment,
  getAllOrders,
  getOrderDetails,
  postOrder,
};
