import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

export interface RecommendedProductDto {
  productId: number;
  title: string;
  image: string ;
  sellingPrice: number;
  mrpPrice: number;
  source: string; // HYBRID, TRENDING, CBF, SIMILAR, FALLBACK...
  score: number ;
}

export interface RecommendationResponse {
  userId: number | null;
  guest: boolean;
  total: number;
  items: RecommendedProductDto[];
}

interface FetchSameProductsParams {
  productId: number;
  topN?: number;
}

interface RecommendationState {
  loading: boolean;
  error: string | null;
  recommendations: RecommendationResponse | null;

  sameProductsLoading: boolean;
  sameProductsError: string | null;
  sameProducts: RecommendationResponse | null;
}

const initialState: RecommendationState = {
  loading: false,
  error: null,
  recommendations: null,

  sameProductsLoading: false,
  sameProductsError: null,
  sameProducts: null,
};

export const fetchRecommendations = createAsyncThunk<
  RecommendationResponse,
  { userId?: number | null; productId?: number | null; topN?: number },
  { rejectValue: string }
>(
  "recommendation/fetchRecommendations",
  async ({ userId, productId, topN = 8 }, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/recommendations", {
        params: {
          ...(userId ? { userId } : {}),
          ...(productId ? { productId } : {}),
          topN,
        },
      });

      console.log("recommendation:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch recommendations"
      );
    }
  }
);

export const fetchSameProducts = createAsyncThunk<
  RecommendationResponse,
  FetchSameProductsParams,
  { rejectValue: string }
>(
  "recommendation/fetchSameProducts",
  async ({ productId, topN = 8 }, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/recommendations/similar", {
        params: { productId, topN },
      });

      console.log("same products:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch similar products"
      );
    }
  }
);

const recommendationSlice = createSlice({
  name: "recommendation",
  initialState,
  reducers: {
    clearRecommendations: (state) => {
      state.recommendations = null;
      state.error = null;
      state.loading = false;
    },
    clearSameProducts: (state) => {
      state.sameProducts = null;
      state.sameProductsError = null;
      state.sameProductsLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch recommendations";
      })

      .addCase(fetchSameProducts.pending, (state) => {
        state.sameProductsLoading = true;
        state.sameProductsError = null;
      })
      .addCase(fetchSameProducts.fulfilled, (state, action) => {
        state.sameProductsLoading = false;
        state.sameProducts = action.payload;
      })
      .addCase(fetchSameProducts.rejected, (state, action) => {
        state.sameProductsLoading = false;
        state.sameProductsError =
          action.payload || "Failed to fetch similar products";
      });
  },
});

export const { clearRecommendations, clearSameProducts } =
  recommendationSlice.actions;

export default recommendationSlice.reducer;