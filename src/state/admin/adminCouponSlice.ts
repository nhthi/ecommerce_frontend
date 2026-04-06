import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Coupon, CouponState } from "../../types/CouponType";

// ================= FETCH ALL =================
export const fetchAllCoupons = createAsyncThunk<Coupon[], void>(
  "coupons/fetchAllCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/coupons/admin");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy danh sách coupon"
      );
    }
  }
);

// ================= CREATE =================
export const createCoupon = createAsyncThunk<Coupon, Coupon>(
  "coupons/createCoupon",
  async (request, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/coupons/admin", request);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Tạo coupon thất bại"
      );
    }
  }
);

// ================= UPDATE =================
export const updateCoupon = createAsyncThunk<
  Coupon,
  { id: number; data: Coupon }
>("coupons/updateCoupon", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/coupons/admin/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Cập nhật coupon thất bại"
    );
  }
});

// ================= DELETE =================
export const deleteCoupon = createAsyncThunk<number, number>(
  "coupons/deleteCoupon",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/coupons/admin/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Xóa coupon thất bại"
      );
    }
  }
);

// ================= APPLY =================
export const applyCoupon = createAsyncThunk<
  any,
  { code: string; orderValue: number }
>("coupons/applyCoupon", async ({ code, orderValue }, { rejectWithValue }) => {
  try {
    const response = await api.post(
      `/api/coupons/apply?code=${code}&orderValue=${orderValue}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Áp dụng coupon thất bại"
    );
  }
});

// ================= REMOVE =================
export const removeCoupon = createAsyncThunk<any, string>(
  "coupons/removeCoupon",
  async (code, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/api/coupons/remove?code=${code}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Xóa coupon khỏi giỏ thất bại"
      );
    }
  }
);

// ================= STATE =================
const initialState: CouponState = {
  coupons: [],
  loading: false,
  error: null,
  cart: null,
  couponCreated: false,
  couponApplied: false,
};

// ================= SLICE =================
const couponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    resetCouponState: (state) => {
      state.couponCreated = false;
      state.couponApplied = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ===== FETCH =====
      .addCase(fetchAllCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ===== CREATE =====
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.couponCreated = true;
        state.coupons.push(action.payload);
      })

      // ===== UPDATE =====
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const updated = action.payload;
        state.coupons = state.coupons.map((c) =>
          c.id === updated.id ? updated : c
        );
      })

      // ===== DELETE =====
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(
          (c) => c.id !== action.payload
        );
      })

      // ===== APPLY =====
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.couponApplied = true;
      })

      // ===== REMOVE =====
      .addCase(removeCoupon.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.couponApplied = false;
      });
  },
});

export const { resetCouponState } = couponSlice.actions;
export default couponSlice.reducer;