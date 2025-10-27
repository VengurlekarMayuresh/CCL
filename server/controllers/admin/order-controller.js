const Order = require("../../models/Order");
const User = require("../../models/user");
const { sendOrderStatusEmail } = require("../../services/email-service");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});
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

const getOrderDetailsForAdmin = async (req, res) => {
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

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found", success: false });
    }

    order.orderStatus = orderStatus;
    await order.save();

    // Try to lookup user's email
    let toEmail = null;
    try {
      if (order.userId) {
        const user = await User.findById(order.userId);
        if (user && user.email) toEmail = user.email;
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
        console.log("[email] Sending status update to:", toEmail, "status:", orderStatus);
        await sendOrderStatusEmail(toEmail, order, orderStatus);
      } catch (e) {
        console.error("Failed to send status email:", e.message);
      }
    } else {
      console.warn("[email] No recipient email found for order:", order._id);
    }

    res.status(200).json({ message: "Order status updated", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};
