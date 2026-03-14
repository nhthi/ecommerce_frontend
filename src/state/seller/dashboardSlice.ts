import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { sellerApi } from "../../config/Api";
import { PaymentOverview } from "./paymentSlice";

interface OrderStatusSummary {
  status: string;
  count: number;
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

interface TopProduct {
  product: string;
  sold: number;
}

interface Transaction {
  txnId: string;
  orderId: string;
  customer: string;
  product: string;
  total: number;
  method: string;
  status: string;
  time: string;
}

interface DashboardState {
  overview: PaymentOverview | null;
  orderStatusSummary: OrderStatusSummary[];
  monthlyRevenue: MonthlyRevenue[];
  topProducts: TopProduct[];
  recentTransactions: Transaction[];
  loading: boolean;
  error: string | null;
}

// --- Initial State ---
const initialState: DashboardState = {
  overview: null,
  orderStatusSummary: [],
  monthlyRevenue: [],
  topProducts: [],
  recentTransactions: [],
  loading: false,
  error: null,
};

// --- Async Thunk ---
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await sellerApi.get("/api/seller/dashboard");
      console.log("dashboard seller: ", response.data);
      // endpoint backend
      return response.data;
    } catch (err: any) {
      console.log(err);

      return rejectWithValue(
        err.response?.data || "Error fetching dashboard data"
      );
    }
  }
);

// --- Slice ---
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDashboardData.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.overview = action.payload.overview;
          state.orderStatusSummary = action.payload.orderStatusSummary;
          state.monthlyRevenue = action.payload.monthlyRevenue;
          state.topProducts = action.payload.topProducts;
          state.recentTransactions = action.payload.recentTransactions;
        }
      )
      .addCase(
        fetchDashboardData.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Something went wrong";
        }
      );
  },
});

// --- Export ---
export default dashboardSlice.reducer;
