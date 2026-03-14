import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Cart } from "../../types/CartType";
import { api } from "../../config/Api";
import { CouponState } from "../../types/CouponType";

// export const applyCoupon = createAsyncThunk<
//   Cart,
//   { apply: string; code: string; orderValue: number },
//   { rejectValue: string }
// >(
//   "coupon/applyCoupon",
//   async ({ apply, code, orderValue }, { rejectWithValue }) => {
//     try {
//       const response = await api.post(
//         `/api/coupons/apply?apply=${apply}&code=${code}&orderValue=${orderValue}`
//       );
//       console.log("apply coupon: ", response.data);
//       return response.data;
//     } catch (error: any) {
//       console.log("error----", error);
//       return rejectWithValue("Failed to apply coupon");
//     }
//   }
// );

const initialState: CouponState = {
  coupons: [],
  cart: null,
  loading: false,
  error: null,
  couponApplied: false,
  couponCreated: false,
};

// const couponSlice = createSlice({
//   name: "coupon",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(applyCoupon.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.couponApplied = false;
//       })
//       .addCase(applyCoupon.fulfilled, (state, action) => {
//         state.cart = action.payload;
//         state.loading = false;
//         if (action.meta.arg.apply === "true") {
//           state.couponApplied = true;
//         }
//       })
//       .addCase(applyCoupon.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//         state.couponApplied = false;
//       })
//       ;
//   },
// });
// export default couponSlice.reducer;
