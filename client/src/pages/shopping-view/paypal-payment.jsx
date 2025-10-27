// PaypalPaymentMock.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { capturePayment, clearOrderData, postPayment } from "@/store/shop/order-slice/index";
import { toast } from "sonner";
import { clearCart } from "@/store/shop/cart-slice";

const fmt = (v) => {
  if (v == null) return "-";
  if (typeof v === "number") return v.toLocaleString();
  const n = Number(v);
  return isNaN(n) ? v : n.toFixed(2);
};

export default function PaypalPaymentMock() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderData } = useSelector((state) => state.shoppingOrder || {});
//   console.log(orderData, "orderdata in paypalpaymentmock");

  const data = orderData;

const handleMockPaySuccess = async () => {
  try {
    const completed = {
      ...orderData,
      paymentStatus: "Paid",
      paymentMethod: "PayPal",
      paymentId: "MOCK_PAY_ID_" + Date.now(),
      payerId: "MOCK_PAYER_" + Math.random().toString(36).slice(2, 9),
      orderStatus: "Confirmed",
      orderUpdateDate: new Date(),
    };

    // 1. Save order (postPayment)
    const result = await dispatch(postPayment(completed));

    // 2. Get the real _id returned by backend
    const savedOrder = result?.payload?.data;
    if (!savedOrder?._id) throw new Error("Order ID not returned from server.");

    // 3. Capture the payment
    await dispatch(
      capturePayment({
        paymentId: completed.paymentId,
        payerId: completed.payerId,
        orderId: savedOrder._id,
      })
    );

    // 4. Clear cart and order data
    dispatch(clearCart());
    dispatch(clearOrderData());

    // 5. Navigate to success
    toast?.success?.("Payment successful");
    navigate("/shop/payment-success", { state: { order: completed } });

  } catch (error) {
    console.error("Error in handleMockPaySuccess:", error);
    toast?.error?.("Payment failed. Please try again.");
  }
};


  const handleMockPayFail = () => {
    toast?.error?.("Payment failed or cancelled");
  };

  if (!data) {
    return <div className="p-4">Loading order...</div>;
  }

  return (
    <div className="p-6 flex justify-center">
        
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-4">PAYPAL Checkout</h3>
        <section className="flex gap-6 items-start">
          {/* Left section */}
          <div className="flex-1">
            {/* <h2 className="text-lg font-semibold mb-2">Shipping Address</h2> */}
            <div className="bg-gray-100 p-3 rounded border border-gray-200">
              <div><strong>Address:</strong> {data.addressInfo?.address}</div>
              <div>
                <strong>City:</strong> {data.addressInfo?.city}
                <br />
                <strong>Pincode:</strong> {data.addressInfo?.pincode}
              </div>
              <div><strong>Phone:</strong> {data.addressInfo?.phone}</div>
              {data.addressInfo?.notes && <div><small>{data.addressInfo.notes}</small></div>}
            </div>

            <h2 className="text-lg font-semibold mt-5 mb-2">Order Details</h2>
            <div>
              {Array.isArray(data.cartItems) && data.cartItems.length ? (
                data.cartItems.map((it) => (
                  <div key={it.productId} className="flex items-center gap-3 py-2 border-b border-gray-200">
                    <img
                      src={it.image || "https://via.placeholder.com/80"}
                      alt={it.title}
                      className="w-18 h-18 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="font-bold">{it.title}</div>
                      <div>Qty: {it.quantity}</div>
                      <div>Price: {fmt(it.price)}</div>
                    </div>
                    <div className="font-bold">{fmt((it.price || 0) * (it.quantity || 1))}</div>
                  </div>
                ))
              ) : (
                <div>No items in the cart</div>
              )}
            </div>
          </div>

          {/* Right summary section */}
          <aside className="w-80">
            <div className="border border-gray-200 p-4 rounded bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
              <div className="flex justify-between pt-1">{/* Subtotal */}<span>Subtotal</span><span>{fmt(data.totalAmount)}</span></div>
              <div className="flex justify-between pt-1"><span>Shipping</span><span>—</span></div>
              <div className="flex justify-between pt-1"><span>Tax</span><span>—</span></div>
              <div className="flex justify-between pt-3 border-t border-dashed border-gray-300 font-bold text-lg">
                <span>Total</span>
                <span>{fmt(data.totalAmount)}</span>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={handleMockPaySuccess}
                  className="w-full py-2 rounded bg-yellow-400 font-bold hover:bg-yellow-500 transition"
                >
                  Pay with Mock PayPal
                </button>
                <button
                  onClick={handleMockPayFail}
                  className="w-full py-2 rounded border border-gray-300 bg-white hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>

             
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
