import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { sellerApi } from "../../config/Api";

export interface Transaction {
  txnId: string;
  orderId: string;
  customerName: string;
  productName: string;
  total: number;
  method: string;
  paymentStatus: "PENDING" | "SUCCESS" | "FAILED";
  orderStatus: string;
  time: string;
}

export interface PaymentOverview {
  totalRevenue: number;
  balanceAvailable: number;
  totalReceived: number;
  pendingPayments: number;
  totalOrders: number;
  transactions: Transaction[];
}

interface PaymentState {
  overview: PaymentOverview | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  overview: null,
  loading: false,
  error: null,
};

// === Async thunk để fetch dữ liệu từ backend ===
export const fetchPaymentOverview = createAsyncThunk<
  PaymentOverview,
  void,
  { rejectValue: string }
>("payment/fetchOverview", async (_, { rejectWithValue }) => {
  try {
    const res = await sellerApi.get("/api/seller/payment", {});
    console.log("payment fetch: ", res.data);

    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentState: (state) => {
      state.overview = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPaymentOverview.fulfilled,
        (state, action: PayloadAction<PaymentOverview>) => {
          state.loading = false;
          state.overview = action.payload;
        }
      )
      .addCase(fetchPaymentOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch payment data";
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
