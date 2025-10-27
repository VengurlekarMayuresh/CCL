import api from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  products: [],
  productDetails: null
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchProduct",
  async ({ filterParams = {}, sortParams }) => {
    const normalizedFilters = {};

    Object.keys(filterParams).forEach((key) => {
      if (Array.isArray(filterParams[key])) {
        normalizedFilters[key] = filterParams[key].join(",");
      } else {
        normalizedFilters[key] = filterParams[key];
      }
    });

    const query = new URLSearchParams({
      ...normalizedFilters,
      sortBy: sortParams,
    }).toString();

    const result = await api.get(
      `/api/shop/products/get?${query}`
    );

    return result.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await api.get(
      `/api/shop/products/get/${id}`
    );
    return result.data;
  }
);



const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails :(state, action) => {
      state.productDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.isLoading = false;
        state.products = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.products = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;
