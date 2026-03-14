import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Deal } from "../../types/DealType";
import { Coupon, CouponState } from "../../types/CouponType";

export const fetchDeals = createAsyncThunk<Deal[]>(
  "deals/fetchDeals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/deals");
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      rejectWithValue(error.response.data.message || "Failed to fetch deals");
    }
  }
);

export const createCoupon = createAsyncThunk<Coupon, Coupon>(
  "coupons/createCoupon",
  async (request, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/coupons/admin/create", request);
      console.log("create coupon: ", response.data);

      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      rejectWithValue(error.response.data.message || "Failed to fetch deals");
    }
  }
);

export const fetchAllCoupons = createAsyncThunk<Coupon[], void>(
  "coupons/fetchAllCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/coupons/admin/all");
      console.log("fetch all coupon: ", response.data);

      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      rejectWithValue(error.response.data.message || "Failed to fetch deals");
    }
  }
);

const initialState: CouponState = {
  coupons: [],
  loading: false,
  error: null,
  cart: null,
  couponCreated: false,
  couponApplied: false,
};

const couponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.couponCreated = true;
        state.coupons.push(action.payload);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
        state.error = null;
      })
      .addCase(fetchAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default couponSlice.reducer;
