import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, OrderItem, OrderState } from "../../types/OrderType";
import { api } from "../../config/Api";
import { Address } from "../../types/UserType";
import { NavigateFunction } from "react-router-dom";

const initialState: OrderState = {
  orders: [],
  orderItem: null,
  currentOrder: null,
  paymentOrder: null,
  loading: false,
  error: null,
  orderCancelled: false,
};

export const fetchUserOrdersHistory = createAsyncThunk<Order[], void>(
  "orders/fetchUserOrdersHistory",
  async (_arg, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/orders/user");
      console.log("fetch user orders history: ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue("Failed to fetch user orders history");
    }
  },
);

export const fetchOrderById = createAsyncThunk<Order, number>(
  "orders/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/orders/${orderId}`);
      console.log("fetch order by id: ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue("Failed to fetch order by id");
    }
  },
);

export type PaymentOrderStatusResponse = {
  status: "PENDING" | "SUCCESS" | "EXPIRED";
};

export const getPaymentOrderStatus = createAsyncThunk<
  PaymentOrderStatusResponse,
  string
>(
  "orders/getPaymentOrderStatus",
  async (paymentOrderId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/orders/payment/${paymentOrderId}/status`,
      );
      console.log("fetch payment order by id: ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue("Failed to fetch order by id");
    }
  },
);

export const createOrder = createAsyncThunk<
  any,
  {
    addressId: number;
    paymentGateway: string;
    navigate: NavigateFunction;
  }
>(
  "orders/createOrder",
  async ({ addressId, paymentGateway, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/orders", null, {
        params: {
          paymentMethod: paymentGateway,
          addressId: addressId,
        },
      });

      return response.data;

    } catch (error: any) {
      console.log("error----", error);

      // 🔥 Lấy message từ backend
      const message =
        error?.response?.data?.message || 
        error?.response?.data || 
        error?.message || 
        "Đặt hàng thất bại";

      return rejectWithValue(message);
    }
  }
);

export const fetchOrderItemById = createAsyncThunk<OrderItem, number>(
  "orders/fetchOrderItemById",
  async (orderItemId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/orders/item/${orderItemId}`);
      console.log("fetch order item by id: ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue("Failed to fetch order item by id");
    }
  },
);

export const paymentSuccess = createAsyncThunk<
  any,
  { paymentId: string; paymentLinkId: string },
  { rejectValue: string }
>(
  "orders/paymentSuccess",
  async ({ paymentId, paymentLinkId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/payment/success`, {
        params: { paymentLinkId },
      });
      console.log("payment success: ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue("Failed to process payment success");
    }
  },
);

export const cancelOrder = createAsyncThunk<Order, number>(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/orders/${orderId}/cancel`);
      console.log("cancel order: ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue(
        error.response.data.message || "Failed to cancel order",
      );
    }
  },
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrdersHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderCancelled = false;
      })
      .addCase(
        fetchUserOrdersHistory.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchUserOrdersHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.loading = false;
          state.currentOrder = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentOrder = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderItemById.fulfilled,
        (state, action: PayloadAction<OrderItem>) => {
          state.loading = false;
          state.orderItem = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchOrderItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(paymentSuccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(paymentSuccess.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log("Payment success processed: ", action.payload);
      })
      .addCase(paymentSuccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderCancelled = false;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order,
        );
        state.error = null;
        state.orderCancelled = true;
        state.currentOrder = action.payload;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;
