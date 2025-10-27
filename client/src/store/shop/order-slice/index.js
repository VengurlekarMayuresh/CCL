import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

// const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

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
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
  orderData: persistedOrderData,
};

export const createNewOrder = createAsyncThunk(
  "/order/create",
  async (orderData) => {
    const response = await api.post(
      "/api/shop/order/create",
      orderData
    );
    return response.data;
  }
);

export const postPayment = createAsyncThunk(
  "payment/postPayment",
  async (orderData, thunkAPI) => {
    const response = await api.post(
      "/api/shop/order/post",
      { orderData }
    )
    console.log(response.data);
    return response.data;
  }
);

export const capturePayment = createAsyncThunk(
  "/order/capture",
  async ({ paymentId, payerId, orderId }) => {
    const response = await api.post(
      "/api/shop/order/capture",
      { paymentId, payerId, orderId }
    );
    return response.data;
  }
);

export const getAllOrders = createAsyncThunk("/all/orders", async (userId) => {
  const response = await api.get(
    `/api/shop/order/list/${userId}`
  );
  return response.data;
});

export const getOrderDetails = createAsyncThunk(
  "/order/details",
  async (id) => {
    const response = await api.get(
      `/api/shop/order/details/${id}`
    );
    return response.data;
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrder",
  initialState,
  reducers: {
    resetOrderDetails(state) {
      state.orderDetails = null;
    },
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
    builder.addCase(createNewOrder.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createNewOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.approvalURL = action.payload.approvalURL;
      state.orderId = action.payload.orderId;
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(action.payload.orderId)
      );
    });
    builder.addCase(createNewOrder.rejected, (state) => {
      state.isLoading = false;
      state.approvalURL = null;
      state.orderId = null;
    });
    builder.addCase(getAllOrders.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllOrders.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orderList = action.payload.data;
    });
    builder.addCase(getAllOrders.rejected, (state) => {
      state.isLoading = false;
      state.orderList = [];
    });
    builder.addCase(getOrderDetails.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getOrderDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orderDetails = action.payload.data;
    });
    builder.addCase(getOrderDetails.rejected, (state) => {
      state.isLoading = false;
      state.orderDetails = null;
    });
    builder.addCase(postPayment.pending, (state) => {
      state.isLoading = true;
    });
   builder.addCase(postPayment.fulfilled, (state, action) => {
  state.isLoading = false;
  const order = action.payload.data;
  console.log(order);
  state.orderId = order._id;
  console.log(state.orderId, "orderid in postpayment fulfilled");
  state.approvalURL = null; // Not applicable for postPayment

  sessionStorage.setItem("currentOrderId", JSON.stringify(order._id));
  state.orderData = order;
  try {
    localStorage.setItem("orderData", JSON.stringify(order));
  } catch (e) {}
});
    builder.addCase(postPayment.rejected, (state) => {
      state.isLoading = false;
      state.approvalURL = null;
      state.orderId = null;
    });
  },
});

export const { resetOrderDetails, setOrderData, clearOrderData} = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;
