import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Wishlist, WishlistState } from "../../types/WishlisType";
import { api } from "../../config/Api";

const initialState: WishlistState = {
  wishlist: null,
  loading: false,
  error: null,
};

export const getWishlistByUser = createAsyncThunk(
  "wishlist/getWishlistByUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/wishlist");
      console.log("wishlist: ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error: ", error);
      return rejectWithValue(
        error.response.data.message || "Failed to fetch wishlist"
      );
    }
  }
);

export const addProductToWishlist = createAsyncThunk(
  "wishlist/addProductToWishlist",
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/wishlist/add-product/${productId}`);
      console.log("add to wishlist:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error adding product to wishlist:", error);

      // ✅ Có phản hồi từ backend
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        switch (status) {
          case 400:
            return rejectWithValue(message || "Invalid product data.");
          case 401:
            return rejectWithValue(
              "You must be logged in to add products to your wishlist."
            );
          case 403:
            return rejectWithValue(
              "You do not have permission to modify this wishlist."
            );
          case 404:
            return rejectWithValue("Product not found or unavailable.");
          case 409:
            return rejectWithValue("This product is already in your wishlist.");
          case 500:
            return rejectWithValue("Server error. Please try again later.");
          default:
            return rejectWithValue(
              message || "An unexpected backend error occurred."
            );
        }
      }

      // ❌ Không có phản hồi (timeout, mất kết nối, v.v.)
      if (error.request) {
        return rejectWithValue(
          "No response from server. Please check your internet connection."
        );
      }

      // ❗ Lỗi khác (frontend)
      return rejectWithValue(error.message || "An unknown error occurred.");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlistState: (state: WishlistState) => {
      state.wishlist = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWishlistByUser.pending, (state: WishlistState) => {
        state.loading = true;
        state.error = null;
        state.wishlist = null;
      })
      .addCase(
        getWishlistByUser.fulfilled,
        (state: WishlistState, action: PayloadAction<Wishlist>) => {
          state.loading = false;
          state.wishlist = action.payload;
          state.error = null;
        }
      )
      .addCase(
        getWishlistByUser.rejected,
        (state: WishlistState, action: any) => {
          state.loading = false;
          state.error = action.payload;
          state.wishlist = null;
        }
      )
      .addCase(addProductToWishlist.pending, (state: WishlistState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addProductToWishlist.fulfilled,
        (state: WishlistState, action: PayloadAction<Wishlist>) => {
          state.loading = false;
          state.error = null;
          state.wishlist = action.payload;
        }
      )
      .addCase(
        addProductToWishlist.rejected,
        (state: WishlistState, action: any) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { resetWishlistState } = wishlistSlice.actions;

export default wishlistSlice.reducer;
