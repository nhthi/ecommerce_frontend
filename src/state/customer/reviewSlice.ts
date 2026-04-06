import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { MyReview, Review } from "../../types/OrderType";

export const fetchReviewsByProduct = createAsyncThunk<
  Review[],
  { productId: number },
  { rejectValue: string }
>("/reviews/fetchByProduct", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get(`/api/reviews`, {
      params: { productId: params.productId },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Không thể tải danh sách đánh giá"
    );
  }
});

export const createReview = createAsyncThunk<
  Review,
  any,
  { rejectValue: string }
>("/reviews/createReview", async (reviewData, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/reviews", reviewData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Không thể tạo đánh giá"
    );
  }
});

export const fetchMyReviews = createAsyncThunk<
  MyReview[],
  void,
  { rejectValue: string }
>("/reviews/fetchMyReviews", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/users/reviews");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Không thể tải đánh giá của tôi"
    );
  }
});

export const fetchMyReviewById = createAsyncThunk<
  Review,
  number,
  { rejectValue: string }
>("/reviews/fetchMyReviewById", async (reviewId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/users/reviews/${reviewId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Không thể tải chi tiết đánh giá"
    );
  }
});

export const deleteReview = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("/reviews/deleteReview", async (reviewId, { rejectWithValue }) => {
  try {
    await api.delete(`/api/reviews/${reviewId}`);
    console.log('Xoa review: ',reviewId);
    
    return reviewId;
  } catch (error: any) {
    console.log(error);
    
    return rejectWithValue(
      error.response?.data?.message || "Không thể xóa đánh giá"
    );
  }
});

interface ReviewState {
  items: Review[];
  myReviews: MyReview[];
  currentReview: Review | null;
  loading: boolean;
  myReviewsLoading: boolean;
  currentReviewLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ReviewState = {
  items: [],
  myReviews: [],
  currentReview: null,
  loading: false,
  myReviewsLoading: false,
  currentReviewLoading: false,
  error: null,
  successMessage: null,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearReviewState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearMyReviews: (state) => {
      state.myReviews = [];
    },
    clearCurrentReview: (state) => {
      state.currentReview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchReviewsByProduct.fulfilled,
        (state, action: PayloadAction<Review[]>) => {
          state.loading = false;
          state.items = action.payload || [];
        }
      )
      .addCase(fetchReviewsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể tải danh sách đánh giá";
      })

      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        createReview.fulfilled,
        (state, action: PayloadAction<Review>) => {
          state.loading = false;
          state.items.unshift(action.payload);
          // state.myReviews.unshift(action.payload);
          state.successMessage = "Đánh giá thành công";
        }
      )
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể tạo đánh giá";
      })

      .addCase(fetchMyReviews.pending, (state) => {
        state.myReviewsLoading = true;
        state.error = null;
      })
      .addCase(
        fetchMyReviews.fulfilled,
        (state, action: PayloadAction<MyReview[]>) => {
          state.myReviewsLoading = false;
          state.myReviews = action.payload || [];
        }
      )
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.myReviewsLoading = false;
        state.error = action.payload || "Không thể tải đánh giá của tôi";
      })

      .addCase(fetchMyReviewById.pending, (state) => {
        state.currentReviewLoading = true;
        state.error = null;
      })
      .addCase(
        fetchMyReviewById.fulfilled,
        (state, action: PayloadAction<Review>) => {
          state.currentReviewLoading = false;
          state.currentReview = action.payload;
        }
      )
      .addCase(fetchMyReviewById.rejected, (state, action) => {
        state.currentReviewLoading = false;
        state.error = action.payload || "Không thể tải chi tiết đánh giá";
      })

      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        deleteReview.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.items = state.items.filter((item) => item.id !== action.payload);
          state.myReviews = state.myReviews.filter(
            (item) => item.reviewId !== action.payload
          );

          if (state.currentReview?.id === action.payload) {
            state.currentReview = null;
          }

          state.successMessage = "Đã xóa đánh giá";
        }
      )
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể xóa đánh giá";
      });
  },
});

export const {
  clearReviewState,
  clearMyReviews,
  clearCurrentReview,
} = reviewSlice.actions;

export default reviewSlice.reducer;