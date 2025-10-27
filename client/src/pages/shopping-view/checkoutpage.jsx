import React, { useEffect, useState } from "react";
import img from "../../assets/image.png";
import Address from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "sonner";
import PaypalPayment from "./paypal-payment";
import { useNavigate } from "react-router-dom";
import { setOrderData } from "@/store/shop/order-slice/index";

export default function ShoppingCheckoutPage() {
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);
  // const { approvalURL } = useSelector((state) => state.shoppingOrder);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { cartId } = useSelector((state) => state.shoppingCart);
  const navigate = useNavigate();

  const totalAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce((total, item) => {
          const itemPrice = item.salesPrice > 0 ? item.salesPrice : item.price;
          return total + itemPrice * item.quantity;
        }, 0)
      : 0;
  function handleInitiatePayment() {
    if (!currentAddress) {
      toast.error("Please select an address");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items to proceed.");
      return;
    }
    const orderData = {
      userId: user?.id,
      cartId: cartId,
      cartItems: cartItems.map((singleItem) => ({
        productId: singleItem.productId,
        title: singleItem.title,
        price:
          singleItem.salesPrice > 0 ? singleItem.salesPrice : singleItem.price,
        quantity: singleItem.quantity,
        image: singleItem.image,
      })),
      addressInfo: {
        addressId: currentAddress?._id,
        address: currentAddress?.address,
        city: currentAddress?.city,
        pincode: currentAddress?.pincode,
        phone: currentAddress?.phone,
        notes: currentAddress?.notes,
      },
      orderStatus: "Pending",
      paymentMethod: "PayPal",
      paymentStatus: "Pending",
      totalAmount: totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    // dispatch(createNewOrder(orderData)).then((data) => {
    //   if (data?.payload?.success) {
    //     console.log(data, "Mayu");
    //   }
    // });
    dispatch(setOrderData(orderData));
    navigate("/shop/paypal-payment");
  }
  // if(approvalURL){
  //     window.location.href = approvalURL;
  // }
  console.log("currentAddress", currentAddress);
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          alt="Checkout Banner"
          className="object-cover object-center w-full h-full"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5  mt-5 p-5 ">
        <Address
          selectedId={currentAddress}
          setCurrentAddress={setCurrentAddress}
        />
        <div className="flex flex-col gap-3">
          {cartItems ? (
            cartItems.map((item) => (
              <UserCartItemContent cartItem={item} key={item._id} />
            ))
          ) : (
            <h1 className="text-2xl font-semibold">No items in cart</h1>
          )}

          <div className="mt-8 space-y-4">
            <div className="mx-4 flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiatePayment} className="w-full">
              CheckOut
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
