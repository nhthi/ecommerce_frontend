import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

export interface ChartItemDto {
  label: string;
  value: number;
}

export interface OrderStatusChartDto {
  date: string;
  paid: number;
  unpaid: number;
}

export interface DashboardSummaryDto {
  revenue: number;
  totalOrders: number;
  totalProductsSold: number;
  totalUsers: number;
}

export interface DashboardOverviewDto {
  summary: DashboardSummaryDto;
  revenueChart: ChartItemDto[];
  paymentMethodChart: ChartItemDto[];
  productSoldChart: ChartItemDto[];
  topCategories: ChartItemDto[];
  orderStatusChart: OrderStatusChartDto[];
  topAddresses: ChartItemDto[];
}

export interface OrderStatusSummaryDto {
  label: string;
  value: number;
}

export interface RecentOrderDto {
  orderCode: string;
  customerName: string;
  paymentMethod: string | null;
  amount: number;
  status: string;
  orderDate: string;
}

export interface DashboardOrderSectionDto {
  orderStatusSummary: OrderStatusSummaryDto[];
  recentOrders: RecentOrderDto[];
}

export interface DashboardFilter {
  filterType: "month" | "year";
  month?: number;
  year: number;
}

// ================= PRODUCT SECTION TYPES =================
export interface InventoryTrendDto {
  label: string;
  inStock: number;
  outOfStock: number;
  lowStock: number;
}

export interface LowStockAlertDto {
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  categoryName: string;
}

export interface DashboardProductSectionDto {
  topCategories: ChartItemDto[];
  inventoryTrend: InventoryTrendDto[];
  lowStockAlerts: LowStockAlertDto[];
}

// ================= CONTENT SECTION TYPES =================
export interface BlogPerformanceDto {
  label: string;
  posts: number;
  views: number;
}

export interface ContentSummaryDto {
  publishedBlogs: number;
  workoutPlans: number;
  categories: number;
  pendingOrders: number;
}

export interface DashboardContentSectionDto {
  blogPerformance: BlogPerformanceDto[];
  contentSummary: ContentSummaryDto;
}

export interface AdminDashboardState {
  data: DashboardOverviewDto | null;
  orderSection: DashboardOrderSectionDto | null;
  productSection: DashboardProductSectionDto | null;
  contentSection: DashboardContentSectionDto | null;

  currentFilter: DashboardFilter;

  loading: boolean;
  orderSectionLoading: boolean;
  productSectionLoading: boolean;
  contentSectionLoading: boolean;

  error: string | null;
  orderSectionError: string | null;
  productSectionError: string | null;
  contentSectionError: string | null;
}

const buildParams = (filter: DashboardFilter) => {
  const params: Record<string, string | number> = {
    filterType: filter.filterType,
    year: filter.year,
  };

  if (filter.filterType === "month" && filter.month) {
    params.month = filter.month;
  }

  return params;
};

export const fetchAdminDashboard = createAsyncThunk<
  DashboardOverviewDto,
  DashboardFilter
>("adminDashboard/fetchAdminDashboard", async (filter, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/admin/dashboard/overview", {
      params: buildParams(filter),
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Loi khi lay du lieu dashboard"
    );
  }
});

export const fetchDashboardOrderSection = createAsyncThunk<
  DashboardOrderSectionDto,
  DashboardFilter & { limit?: number }
>(
  "adminDashboard/fetchDashboardOrderSection",
  async (payload, { rejectWithValue }) => {
    try {
      const { limit = 6, ...filter } = payload;

      const response = await api.get("/api/admin/dashboard/orders", {
        params: {
          ...buildParams(filter),
          limit,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Loi khi lay du lieu don hang dashboard"
      );
    }
  }
);

export const fetchDashboardProductSection = createAsyncThunk<
  DashboardProductSectionDto,
  DashboardFilter
>(
  "adminDashboard/fetchDashboardProductSection",
  async (filter, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/dashboard/products", {
        params: buildParams(filter),
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Loi khi lay du lieu san pham dashboard"
      );
    }
  }
);

export const fetchDashboardContentSection = createAsyncThunk<
  DashboardContentSectionDto,
  DashboardFilter
>(
  "adminDashboard/fetchDashboardContentSection",
  async (filter, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/dashboard/content", {
        params: buildParams(filter),
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Loi khi lay du lieu content dashboard"
      );
    }
  }
);

const initialState: AdminDashboardState = {
  data: null,
  orderSection: null,
  productSection: null,
  contentSection: null,

  currentFilter: {
    filterType: "month",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  },

  loading: false,
  orderSectionLoading: false,
  productSectionLoading: false,
  contentSectionLoading: false,

  error: null,
  orderSectionError: null,
  productSectionError: null,
  contentSectionError: null,
};

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    resetAdminDashboardState: (state) => {
      state.loading = false;
      state.orderSectionLoading = false;
      state.productSectionLoading = false;
      state.contentSectionLoading = false;

      state.error = null;
      state.orderSectionError = null;
      state.productSectionError = null;
      state.contentSectionError = null;
    },

    setDashboardFilter: (state, action: PayloadAction<DashboardFilter>) => {
      state.currentFilter = action.payload;
    },

    clearAdminDashboardData: (state) => {
      state.data = null;
      state.orderSection = null;
      state.productSection = null;
      state.contentSection = null;

      state.error = null;
      state.orderSectionError = null;
      state.productSectionError = null;
      state.contentSectionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== OVERVIEW =====
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ===== ORDER SECTION =====
      .addCase(fetchDashboardOrderSection.pending, (state) => {
        state.orderSectionLoading = true;
        state.orderSectionError = null;
      })
      .addCase(fetchDashboardOrderSection.fulfilled, (state, action) => {
        state.orderSectionLoading = false;
        state.orderSection = action.payload;
      })
      .addCase(fetchDashboardOrderSection.rejected, (state, action) => {
        state.orderSectionLoading = false;
        state.orderSectionError = action.payload as string;
      })

      // ===== PRODUCT SECTION =====
      .addCase(fetchDashboardProductSection.pending, (state) => {
        state.productSectionLoading = true;
        state.productSectionError = null;
      })
      .addCase(fetchDashboardProductSection.fulfilled, (state, action) => {
        state.productSectionLoading = false;
        state.productSection = action.payload;
      })
      .addCase(fetchDashboardProductSection.rejected, (state, action) => {
        state.productSectionLoading = false;
        state.productSectionError = action.payload as string;
      })

      // ===== CONTENT SECTION =====
      .addCase(fetchDashboardContentSection.pending, (state) => {
        state.contentSectionLoading = true;
        state.contentSectionError = null;
      })
      .addCase(fetchDashboardContentSection.fulfilled, (state, action) => {
        state.contentSectionLoading = false;
        state.contentSection = action.payload;
      })
      .addCase(fetchDashboardContentSection.rejected, (state, action) => {
        state.contentSectionLoading = false;
        state.contentSectionError = action.payload as string;
      });
  },
});

export const {
  resetAdminDashboardState,
  setDashboardFilter,
  clearAdminDashboardData,
} = adminDashboardSlice.actions;

export default adminDashboardSlice.reducer;