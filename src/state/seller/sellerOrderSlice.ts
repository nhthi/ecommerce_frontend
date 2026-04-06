import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Order, OrderStatus } from "../../types/OrderType";
import { api } from "../../config/Api";

interface SellerOrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: SellerOrderState = {
  orders: [],
  loading: false,
  error: null,
};
export const getAllOrders = createAsyncThunk<Order[], void>(
  "adminOrders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/orders");
      console.log("Fetched all orders:", response.data);

      return response.data;
    } catch (error: any) {
      console.log("Error fetching all orders:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to fetch orders"
      );
    }
  }
);
export const fetchSellerOrders = createAsyncThunk<Order[], void>(
  "sellerOrders/fetchSellerOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/seller/orders");
      console.log("Fetched seller orders:", response.data);

      return response.data;
    } catch (error: any) {
      console.log("Error fetching seller orders:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to fetch orders"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk<
  Order,
  {
    orderId: number;
    orderStatus: OrderStatus;
  }
>(
  "sellerOrders/updateOrderStatus",
  async ({ orderId, orderStatus }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/seller/orders/${orderId}/status/${orderStatus}`
      );
      console.log("update status orders:", response.data);

      return response.data;
    } catch (error: any) {
      console.log("Error update status orders:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to update status orders"
      );
    }
  }
);

export const deleteOrder = createAsyncThunk<any, number>(
  "sellerOrders/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/api/seller/orders/${orderId}/delete`
      );
      console.log("delete orders:", response.data);

      return response.data;
    } catch (error: any) {
      console.log("Error delete orders:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to delete orders"
      );
    }
  }
);

const sellerOrderSlice = createSlice({
  name: "sellerOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (order) => order?.id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(
          (order) => order.id !== action.payload.id
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default sellerOrderSlice.reducer;
