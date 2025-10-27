const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  userId: String,
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: Number,
      salePrice: Number,
      quantity: Number,
    },
  ],
  addressInfo :{
    addressId :String,
    address:String,
    city:String,
    pincode:String,
    phone:String,
    notes:String,
  },
  orderStatus : String,
  paymentAddress : String,
  paymentStatus : String,
  totalAmount : Number,
  orderDate :Date,
  orderUpdateDate :Date,
  paymentId: String,
  payerId: String,
    });


    module.exports = mongoose.model("Order", OrderSchema);