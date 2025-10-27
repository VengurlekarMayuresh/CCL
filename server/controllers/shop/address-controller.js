const Address = require("../../models/Address");
const mongoose = require("mongoose");
const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;
    if (!userId || !address || !city || !pincode || !phone || !notes) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    const newAddress = new Address({
      userId,
      address,
      city,
      pincode,
      phone,
      notes,
    });
    await newAddress.save();
    res.status(201).json({
      message: "Address added successfully",
      success: true,
      data: newAddress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body.formData || req.body; // ✅ FIXED

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "UserId and AddressId are required",
      });
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId: String(userId) },
      { $set: formData },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      return res
        .status(400)
        .json({ message: "UserId and AddressId are required", success: false });
    }
    const address = await Address.findOneAndDelete({ _id: addressId, userId });
    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found", success: false });
    }
    res
      .status(200)
      .json({ message: "Address deleted successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params; // or req.query depending on your route

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
        data: [],
      });
    }

    const addressList = await Address.find({ userId: String(userId) }).lean();

    return res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      data: addressList,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
};

module.exports = {
  addAddress,
  editAddress,
  deleteAddress,
  fetchAllAddress,
};
