import { Input } from "@/components/ui/input";
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ShoppingProductTile from "./product-tile";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "../../store/shop/cart-slice";
import { toast } from "sonner";
import ProductDetails from "@/components/shopping-view/product-details";


export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const { productDetails } = useSelector(
    (state) => state.shoppingProducts
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;
  const { cartItems } = useSelector((state) => state.shoppingCart);

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
    }else{
         setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(resetSearchResults());
    }
  }, [keyword]);


    function handleAddToCart(productId,getTotalStock) {
    let getCartItems = cartItems || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === productId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem]?.quantity;
        if (getQuantity + 1 > getTotalStock) {
          return toast.error(`Only ${getTotalStock} items in stock`);
        }
      }
    }
    dispatch(addToCart({ userId, productId, quantity: 1 }))
      .then((data) => {
        if (data?.payload.success) {
          console.log(data, "Mayu");
          dispatch(fetchCartItems(user?.id));
          toast.success("Item added to cart");
        }
      })
      .catch((err) => console.error("Add to cart error:", err));
  }

    function handleGetProductDetails(productId) {
      dispatch(fetchProductDetails(productId));
    }

  useEffect(() => {
    if (productDetails !== null) setOpen(true);
    
  }, [productDetails]);


  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            className="py-6"
            placeholder="Search products..."
            value={keyword}
            name="keyword"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>
       {
        !searchResults.length ? <h1 className="text-2xl font-semibold">No results Found</h1> : null
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {
            searchResults && searchResults.length > 0 ? 
                searchResults.map((product) => (<ShoppingProductTile product={product} key={product.id} handleAddToCart={handleAddToCart} handleGetProductDetails={handleGetProductDetails}/>))
             : null
        }
      </div>
      <ProductDetails
        open={open}
        setOpen={setOpen}
        ProductDetails={productDetails}
      />
    </div>
  );
}
