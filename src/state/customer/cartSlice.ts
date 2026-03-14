import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Cart, CartItem } from "../../types/CartType";
import { api } from "../../config/Api";
import {
  sumCartItemMrpPrice,
  sumCartItemSellingPrice,
} from "../../utils/sumCartPrice";

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

export const fetchUserCart = createAsyncThunk<Cart, void>(
  "cart/fetchUserCart",
  async (_arg, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/cart");
      console.log("fetch user cart: ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue("Failed to fetch user cart");
    }
  }
);

interface AddItemRequest {
  productId: number;
  sizeId: number;
  quantity: number;
}

export const addItemToCart = createAsyncThunk<Cart, AddItemRequest>(
  "cart/addItemToCart",
  async (itemDetails, { rejectWithValue }) => {
    try {
      const response = await api.put("/api/cart/add", itemDetails);
      console.log("add item to cart:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error adding item to cart:", error);

      // ✅ Có phản hồi từ server (backend có trả status)
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        switch (status) {
          case 400:
            return rejectWithValue(message || "Invalid request data.");
          case 401:
            return rejectWithValue(
              "You must be logged in to add items to the cart."
            );
          case 403:
            return rejectWithValue(
              "You do not have permission to perform this action."
            );
          case 404:
            return rejectWithValue(
              "The product you’re trying to add was not found."
            );
          case 500:
            return rejectWithValue("Server error. Please try again later.");
          default:
            return rejectWithValue(
              message || "An unexpected backend error occurred."
            );
        }
      }

      // ❌ Không có phản hồi (ví dụ: mất kết nối, timeout)
      if (error.request) {
        return rejectWithValue(
          "No response from server. Please check your connection."
        );
      }

      // ❗ Lỗi không xác định
      return rejectWithValue(error.message || "An unknown error occurred.");
    }
  }
);

export const deleteCartItem = createAsyncThunk<any, number>(
  "cart/deleteCartItem",
  async (cartItemId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/cart/item/${cartItemId}`);
      console.log("delete cart item: ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue("Failed to delete cart item");
    }
  }
);
export const applyCoupon = createAsyncThunk<
  Cart,
  { apply: string; code: string; orderValue: number },
  { rejectValue: string }
>(
  "cart/applyCoupon",
  async ({ apply, code, orderValue }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/coupons/apply?apply=${apply}&code=${code}&orderValue=${orderValue}`
      );
      console.log("apply coupon: ", response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra";
      return rejectWithValue(errorMessage);
    }
  }
);
export const updateCartItem = createAsyncThunk<
  any,
  { cartItemId: number; cartItem: any }
>(
  "cart/updateCartItem",
  async ({ cartItemId, cartItem }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/cart/item/${cartItemId}`, cartItem);
      console.log("update cart item: ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue("Failed to update cart item");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.cart = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        if (state.cart) {
          state.cart.cartItems = state.cart.cartItems.filter(
            (item: CartItem) => item.id !== action.meta.arg
          );
          const mrpPrice = sumCartItemMrpPrice(state.cart?.cartItems || []);
          const sellingPrice = sumCartItemSellingPrice(
            state.cart?.cartItems || []
          );
          state.cart.totalMrpPrice = mrpPrice;
          state.cart.totalSellingPrice = sellingPrice;
          if (state.cart.coupon) {
            const discount = state.cart.coupon.discountPercentage;
            state.cart.totalCouponPrice =
              sellingPrice - (sellingPrice * discount) / 100;
          } else {
            state.cart.totalCouponPrice = sellingPrice;
          }
        }
        state.loading = false;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (state.cart) {
          const index = state.cart.cartItems.findIndex(
            (item: CartItem) => item.id === action.meta.arg.cartItemId
          );
          if (index !== -1) {
            state.cart.cartItems[index] = {
              ...state.cart.cartItems[index],
              ...action.payload,
            };
          }
          const mrpPrice = sumCartItemMrpPrice(state.cart.cartItems);
          const sellingPrice = sumCartItemSellingPrice(state.cart.cartItems);
          state.cart.totalMrpPrice = mrpPrice;
          state.cart.totalSellingPrice = sellingPrice;
          if (state.cart.coupon) {
            const discount = state.cart.coupon.discountPercentage;
            state.cart.totalCouponPrice =
              sellingPrice - (sellingPrice * discount) / 100;
          } else {
            state.cart.totalCouponPrice = sellingPrice;
          }
        }
        state.loading = false;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
