import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

const initialState = {
  isLoading: false,
  reviews: [],
  message : null,
};

export const addReview = createAsyncThunk(
  "review/addReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/api/shop/review/add",
        reviewData
      );
      return response.data; // success case
    } catch (error) {
      // If the backend sent a structured error response
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        // Fallback for network or unexpected errors
        return rejectWithValue({ message: error.message || "Something went wrong" });
      }
    }
  }
);

export const getReviews = createAsyncThunk('review/getReviews', async (productId) => {
    const response = await api.get(`/api/shop/review/${productId}`);
    return response.data;
})
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(addReview.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(addReview.fulfilled, (state, action) => {
            state.isLoading = false;
            state.reviews.push(action.payload.data);
        })
        .addCase(addReview.rejected, (state,action) => {
            state.isLoading = false;   
            state.message = action.payload?.message || "Failed to add review";
            console.error("Add review error:", action.payload);

        });
        builder
        .addCase(getReviews.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getReviews.fulfilled, (state, action) => {
            state.isLoading = false;
            state.reviews = action.payload.data;
        })
        .addCase(getReviews.rejected, (state) => {
            state.isLoading = false;
            state.reviews = [];
        });
    }
});


export default reviewSlice.reducer;
