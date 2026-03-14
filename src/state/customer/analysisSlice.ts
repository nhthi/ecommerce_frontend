import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../config/Api";

// ====== 🧩 Định nghĩa kiểu dữ liệu DTO (phải trùng với backend) ======
export interface DailySpendingDTO {
  date: string; // hoặc LocalDate nếu dùng string ISO
  total: number;
}

export interface RecentOrderDTO {
  orderId: number;
  productName: string;
  orderDate: string;
  status: string;
  totalAmount: number;
}

export interface CustomerPurchaseAnalysisDTO {
  totalSpending: number;
  totalOrders: number;
  averagePerOrder: number;
  cancelRate: number;
  chartData: DailySpendingDTO[];
  recentOrders: RecentOrderDTO[];
}

// ====== 🧩 Kiểu state ======
interface AnalysisState {
  data: CustomerPurchaseAnalysisDTO | null;
  loading: boolean;
  error: string | null;
}

// ====== 🧩 Initial state ======
const initialState: AnalysisState = {
  data: null,
  loading: false,
  error: null,
};

// ====== 🧩 AsyncThunk: Gọi API phân tích mua sắm ======
export const fetchCustomerAnalysis = createAsyncThunk<
  CustomerPurchaseAnalysisDTO, // kiểu dữ liệu trả về
  { customerId: number; days?: number }, // tham số đầu vào
  { rejectValue: string } // kiểu reject
>(
  "analysis/fetchCustomerAnalysis",
  async ({ customerId, days = 30 }, { rejectWithValue }) => {
    try {
      const response = await api.get<CustomerPurchaseAnalysisDTO>(
        `/api/analysis/customer/${customerId}?days=${days}`
      );
      console.log(response.data);

      return response.data;
    } catch (error: any) {
      console.log(error);

      return rejectWithValue(
        error.response?.data || "Lỗi khi tải dữ liệu phân tích"
      );
    }
  }
);

// ====== 🧩 Slice chính ======
const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    clearAnalysis: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCustomerAnalysis.fulfilled,
        (state, action: PayloadAction<CustomerPurchaseAnalysisDTO>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(
        fetchCustomerAnalysis.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearAnalysis } = analysisSlice.actions;
export default analysisSlice.reducer;
