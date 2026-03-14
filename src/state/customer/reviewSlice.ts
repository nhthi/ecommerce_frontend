import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

// 1️⃣ Thunk: fetch reviews theo product
export const fetchReviewsByProduct = createAsyncThunk<any, any>(
  "/reviews/fetchByProduct",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/reviews`, {
        params: { productId: params.productId },
      });
      console.log("fetch reviews---", response.data);
      return response.data;
    } catch (error: any) {
      console.error("fetch reviews error---", error);
      return rejectWithValue(error.response?.data || "Failed to fetch reviews");
    }
  }
);

// 2️⃣ Thunk: tạo review mới
export const createReview = createAsyncThunk<any, any>(
  "/reviews/createReview",
  async (reviewData, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;

      const response = await api.post("/api/reviews", reviewData);
      console.log("create review---", response.data);
      return response.data;
    } catch (error: any) {
      console.error("create review error---", error);
      return rejectWithValue(error.response?.data || "Failed to create review");
    }
  }
);

// 3️⃣ Slice
const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    items: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetch reviews
    builder
      .addCase(fetchReviewsByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReviewsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // create review
    builder
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default reviewSlice.reducer;
