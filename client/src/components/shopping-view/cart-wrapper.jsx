import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItemContent from "./cart-items-content";
import { Navigate, useNavigate } from "react-router-dom";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  console.log(cartItems, "cart items in cart wrapper");
  const totalAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce((total, item) => {
          const itemPrice = item.salesPrice > 0 ? item.salesPrice : item.price;
          return total + itemPrice * item.quantity;
        }, 0)
      : 0;
  return (
    <div>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="mb-0 pb-0">
          <SheetTitle className="text-xl">Your cart</SheetTitle>
        </SheetHeader>

        <div className="mx-6 mt-0">
          <div className="mt-5 space-y-4">
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item) => (
                <UserCartItemContent cartItem={item} key={item.productId} />
              ))
            ) : (
              <div>No items in cart</div>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <div className="mx-4 flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => {
            navigate("/shop/checkout  ");
            setOpenCartSheet(false);
          }}
          className="mt-4 mx-4"
        >
          Checkout
        </Button>
      </SheetContent>
    </div>
  );
}

export default UserCartWrapper;
