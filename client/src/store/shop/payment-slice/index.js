import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

// Try to load orderData from localStorage
const persistedOrderData = (() => {
  try {
    const data = localStorage.getItem("orderData");
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
})();

const initialState = {
  isLoading: false,
  orderData: persistedOrderData, // use persisted data on init
};

// Async thunk for posting payment
export const postPayment = createAsyncThunk(
  "payment/postPayment",
  async (orderData, thunkAPI) => {
    const response = await api.post("/api/shop/order/post", {orderData});
    return response.data;
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setOrderData: (state, action) => {
      state.orderData = action.payload;
      try {
        localStorage.setItem("orderData", JSON.stringify(action.payload)); // persist
      } catch (e) {}
    },
    clearOrderData: (state) => {
      state.orderData = null;
      try {
        localStorage.removeItem("orderData"); // remove on clear
      } catch (e) {}
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postPayment.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(postPayment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orderData = action.payload.data;
      try {
        localStorage.setItem("orderData", JSON.stringify(action.payload.data)); // persist
      } catch (e) {}
    });
    builder.addCase(postPayment.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default paymentSlice.reducer;
export const { setOrderData, clearOrderData } = paymentSlice.actions;
