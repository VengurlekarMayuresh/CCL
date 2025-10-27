import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { useActionState } from "react";

const initialState = {
    orderList: [],
    orderDetails: null,
    isLoading: false
}

export const getAllOrdersForAdmin = createAsyncThunk("/all/orders", async () => {
  const response = await api.get(
    `/api/admin/orders/get-all`
  );
  return response.data;
});

export const getOrderDetailsForAdmin = createAsyncThunk("/order/details", async (id) => {
    const response = await api.get(`/api/admin/orders/details/${id}`);
    return response.data;
})

export const updateOrderStatusForAdmin = createAsyncThunk('/order/update-status', async ({id, orderStatus}) => {
    const response = await api.put(`/api/admin/orders/update/${id}`, {orderStatus});
    return response.data;
})


const adminOrderSlice = createSlice({
    name: "adminOrderSlice",
    initialState,
    reducers : {
        resetOrderDetails: (state) => {
            state.orderDetails = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllOrdersForAdmin.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderList = action.payload.data;
        });
        builder.addCase(getAllOrdersForAdmin.rejected, (state) => {
            state.isLoading = false;
            state.orderList = [];
        });
        builder.addCase(getOrderDetailsForAdmin.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderDetails = action.payload.data;
        });
        builder.addCase(getOrderDetailsForAdmin.rejected, (state) => {
            state.isLoading = false;
            state.orderDetails = null;
        });
    }
})
export const { resetOrderDetails } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;