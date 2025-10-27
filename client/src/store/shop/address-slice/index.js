import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

const initialState = {
  isLoading: false,
  addressList: [],
};

export const addNewAddress = createAsyncThunk(
  "/addresses/newAddress",
  async (formData) => {
    const response = await api.post(
      "/api/shop/address/add",
      formData
    );
    return response.data;
  }
);
export const fetchAllAddress = createAsyncThunk(
  "/addresses/fetchAllAddress",
  async (userId) => {
    const response = await api.get(
      `/api/shop/address/get/${userId}`
    );
    return response.data;
  }
);
export const editAddress = createAsyncThunk(
  "/addresses/editAddress",
  async ({ userId, addressId, formData }) => {
    const response = await api.put(
      `/api/shop/address/update/${userId}/${addressId}`,
      { formData }
    );
    return response.data;
  }
);
export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }) => {
    console.log(userId,addressId,'userId,addressId');
    const response = await api.delete(
      `/api/shop/address/delete/${userId}/${addressId}`
    );
    return response.data;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addNewAddress.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
      
    });
    builder.addCase(addNewAddress.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(fetchAllAddress.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllAddress.fulfilled, (state, action) => {
      state.isLoading = false;
      state.addressList = action.payload.data;
    });
    builder.addCase(fetchAllAddress.rejected, (state) => {
      state.isLoading = false;
      state.addressList = [];
    });
    builder.addCase(editAddress.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(editAddress.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.addressList.findIndex(
        (address) => address._id === action.payload.data._id
      );
      if (index !== -1) {
        state.addressList[index] = action.payload.data;
      }
    });
    builder.addCase(editAddress.rejected, (state) => {
      state.isLoading = false;
    });
  },
});


export default addressSlice.reducer;