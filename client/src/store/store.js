import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index"
import AdminProductSlice from "./admin/products-slice/index"
import shoppingProductSlice from "./shop/products-slice/index"
import shoppingCart from "./shop/cart-slice/index"
import shopAddressSlice from "./shop/address-slice/index"
import shopOrderSlice from "./shop/order-slice/index"
import adminOrderSlice from "./admin/order-slice/index"
import shopSearchSlice from "./shop/search-slice/index"
import shopReviewSlice from "./shop/review-slice/index"
import commonFeatureSlice from "./commonSlice/index"
import paymentSlice from "./shop/payment-slice/index"
const store = configureStore({
    reducer:{
        auth:authReducer,
        adminProducts:AdminProductSlice,
        adminOrder: adminOrderSlice,
        commonFeature: commonFeatureSlice,
        shoppingProducts: shoppingProductSlice,
        shoppingCart: shoppingCart,
        shopAddress: shopAddressSlice,
        shoppingOrder: shopOrderSlice,
        shopSearch: shopSearchSlice,
        shopReview: shopReviewSlice,
        shopPayment: paymentSlice
    }
})

export default store;