import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "@/lib/api";


const initialState = {
  cartItems: [],
  isLoading: false,
  cartId: null,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }) => {
    const response = await api.post(
      "/api/shop/cart/add",
      { userId, productId, quantity }
    );
    return response.data;
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async ( userId ) => {
    const response = await api.get(
      `/api/shop/cart/get/${userId}`
    );
    return response.data;
  }
);

export const deleteCartItems = createAsyncThunk(
  "cart/deleteCartItems",
  async ({ userId, productId }) => {
    const response = await api.delete(
      `/api/shop/cart/${userId}/${productId}`,{
        data: { userId, productId }
      }
    );
    return response.data;
  }
);

export const updateCartItems = createAsyncThunk(
  "cart/updateCartItems",
  async ({ userId, productId, quantity }) => {
    const response = await api.put(
      "/api/shop/cart/update",
      { userId, productId, quantity }
    );
    return response.data;
  }
);

const cartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    clearCart : (state) =>{
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToCart.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload.data.items;
      state.cartId = action.payload.cart._id;
    });
    builder.addCase(addToCart.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(fetchCartItems.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCartItems.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload.data.items || [];
      state.cartId = action.payload.cart._id;
    });
    builder.addCase(fetchCartItems.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(deleteCartItems.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteCartItems.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload.data.items || [] ;
    });
    builder.addCase(deleteCartItems.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateCartItems.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateCartItems.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload.data.items || [];
    });
    builder.addCase(updateCartItems.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default cartSlice.reducer;
export const { clearCart } = cartSlice.actions;