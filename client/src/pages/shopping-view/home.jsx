import React, { useEffect, useState } from "react";
import bannerone from "../../assets/banner-1.jpg";
import bannertwo from "../../assets/banner-2.jpg";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "./product-tile";
import puma from "../../assets/brands/puma.png";
import nike from "../../assets/brands/nike.png";
import adidas from "../../assets/brands/adidas.png";
import zara from "../../assets/brands/zara .png";
import hm from "../../assets/brands/hm.png";
import men from "../../assets/categories/man.png";
import women from "../../assets/categories/woman.png";
import kids from "../../assets/categories/kid.png";
import accessories from "../../assets/categories/accessories.png";
import electronics from "../../assets/categories/electronics.png";
import { useNavigate } from "react-router-dom";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ProductDetails from "@/components/shopping-view/product-details";
import { toast } from "sonner";
import { getFeatureImages } from "@/store/commonSlice";


const categories = [
  { id: "men", label: "Men", icon: men },
  { id: "women", label: "Women", icon: women },
  { id: "kids", label: "Kids", icon: kids },
  { id: "accessories", label: "Accessories", icon: accessories },
  { id: "electronics", label: "Electronics", icon: electronics },
];

const brands = [
  { id: "nike", label: "Nike", icon: nike },
  { id: "adidas", label: "Adidas", icon: adidas },
  { id: "puma", label: "Puma", icon: puma },
  { id: "zara", label: "Zara", icon: zara },
  { id: "h&m", label: "H&M", icon: hm },
];

export default function ShoppingHome() {
  // const userId = useSelector((state) => state.auth.user?.id);
  const { productDetails } = useSelector((state) => state.shoppingProducts);
  const { featureImages } = useSelector((state) => state.commonFeature);
  const [open, setOpen] = useState(false);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const dispatch = useDispatch();
  const slides = [bannerone, bannertwo];
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;
  function handleGetProductDetails(productId) {
    console.log("Get product details for:", productId);
    dispatch(fetchProductDetails(productId));
  }

  console.log("Feature Images:", featureImages);

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
          dispatch(fetchCartItems(user?.id));
          toast.success("Item added to cart");
        }
      })
      .catch((err) => console.error("Add to cart error:", err));
  }

  const shopProducts = useSelector((state) => state.shoppingProducts.products);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  function handleIconClick(getCurrentItem, section) {
    sessionStorage.removeItem("productFilters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("productFilters", JSON.stringify(currentFilter));
    navigate(`/shop/listings`);
  }

  useEffect(() => {
    const slidesCount = (featureImages && featureImages.length) || 2; // fallback
    if (!slidesCount) return;

    // ensure currentSlide in range when slidesCount changes
    setCurrentSlide((prev) => prev % slidesCount);

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
    }, 4000);

    return () => clearInterval(timer);
  }, [featureImages]);


  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-low-to-high",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    if (productDetails !== null) {
      setOpen(true);
    }
  }, [productDetails]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImages && featureImages.length > 0
          ? featureImages.map((slide, index) => (
              <img
                src={slide.image}
                key={index}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  currentSlide === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 hover:bg-white"
          onClick={() =>
            setCurrentSlide((prev) =>
              prev === 0 ? featureImages.length - 1 : prev - 1
            )
          }
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 hover:bg-white"
          onClick={() =>
            setCurrentSlide((prev) =>
              prev === featureImages.length - 1 ? 0 : prev + 1
            )
          }
        >
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </div>
      <section className="pt-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop By Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Card
                onClick={() => handleIconClick(category, "category")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <img
                    src={category.icon}
                    alt={category.label}
                    className="w-12 h-12 mb-2 text-primary"
                  />
                  <span className="text-xl font-bold">{category.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="pt-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop By Brands
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {brands.map((brand) => (
              <Card
                onClick={() => handleIconClick(brand, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <img
                    src={brand.icon}
                    alt={brand.label}
                    className="w-12 h-12 mb-2 text-primary"
                  />
                  <span className="text-xl font-bold">{brand.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shopProducts &&
              shopProducts.map((product) => (
                <ShoppingProductTile
                  key={product.id}
                  product={product}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddToCart={handleAddToCart}
                />
              ))}
          </div>
        </div>
      </section>
      <ProductDetails
        open={open}
        setOpen={setOpen}
        ProductDetails={productDetails}
      />
    </div>
  );
}
