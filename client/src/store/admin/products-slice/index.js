import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";

export const addNewProduct = createAsyncThunk(
  "/products/addNewProduct",
  async (formData) => {
    const result = await api.post(
      "/api/admin/products/add",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result.data;
  }
);

export const fetchProducts = createAsyncThunk(
  "/products/fetchProduct",
  async () => {
    const result = await api.get(
      "/api/admin/products/all"
    );
    return result.data;
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ formData, id }) => {
    const result = await api.put(
      `/api/admin/products/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await api.delete(
      `/api/admin/products/delete/${id}`
    );
    return result.data;
  }
);
const initialState = {
  isLoading: false,
  products: [],
};

const AdminProductSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.isLoading = false;
      state.products = action.payload.products;
    });
    builder.addCase(fetchProducts.rejected, (state) => {
      state.isLoading = false;
      state.products = [];
    });
  },
});

export default AdminProductSlice.reducer;