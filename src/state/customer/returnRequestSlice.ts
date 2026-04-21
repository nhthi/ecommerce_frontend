import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

export interface ReturnRequestItem {
  id: number;
  orderItemId: number;
  quantity: number;
  refundAmount: number;
  productName: string;
  productImage: string;
  sizeName: string;
  sellingPrice: number;
}

export interface ReturnRequest {
  id: number;
  orderId: number;
  orderCode?:string;
  userId: number;
  status:
    | "REQUESTED"
    | "APPROVED"
    | "REJECTED"
    | "CUSTOMER_SHIPPED"
    | "RECEIVED"
    | "REFUNDED"
    | "COMPLETED"
    | "CANCELLED";
  reasonCode: string;
  note: string;
  refundAmount: number;
  adminNote?: string | null;
  requestedAt?: string | null;
  reviewedAt?: string | null;
  customerShippedAt?: string | null;
  receivedAt?: string | null;
  refundedAt?: string | null;
  completedAt?: string | null;
  returnTrackingCode?: string | null;
  returnCarrier?: string | null;
  returnShipmentNote?: string | null;
  items: ReturnRequestItem[];
  imageUrls: string[];
}

export interface CreateReturnRequestPayload {
  orderId: number;
  orderItemId: number;
  quantity: number;
  reasonCode: string;
  note?: string;
  imageUrls?: string[];
}
export interface CustomerShippedPayload {
  id: number;
  trackingCode: string;
  carrier?: string;
  shipmentNote?: string;
}
export interface ReviewReturnRequestPayload {
  id: number;
  approved: boolean;
  adminNote?: string;
}

interface ReturnRequestState {
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  success: string | null;
  myRequests: ReturnRequest[];
  adminRequests: ReturnRequest[];
  selectedRequest: ReturnRequest | null;
}

const initialState: ReturnRequestState = {
  loading: false,
  actionLoading: false,
  error: null,
  success: null,
  myRequests: [],
  adminRequests: [],
  selectedRequest: null,
};

export const createReturnRequest = createAsyncThunk<
  ReturnRequest,
  CreateReturnRequestPayload,
  { rejectValue: string }
>("/returnRequests/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/return-requests", payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Không thể tạo yêu cầu trả hàng"
    );
  }
});

export const fetchMyReturnRequests = createAsyncThunk<
  ReturnRequest[],
  void,
  { rejectValue: string }
>("/returnRequests/fetchMy", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/return-requests/my");
    console.log('my return requ ',response.data);
    
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Không thể tải danh sách trả hàng của bạn"
    );
  }
});

export const fetchAdminReturnRequests = createAsyncThunk<
  ReturnRequest[],
  string | undefined,
  { rejectValue: string }
>("/returnRequests/fetchAdmin", async (status, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/return-requests/admin", {
      params: status ? { status } : {},
    });
    console.log(response.data);
    
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Không thể tải danh sách yêu cầu trả hàng"
    );
  }
});

export const reviewReturnRequest = createAsyncThunk<
  ReturnRequest,
  ReviewReturnRequestPayload,
  { rejectValue: string }
>("/returnRequests/review", async ({ id, approved, adminNote }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/return-requests/${id}/review`, {
      approved,
      adminNote,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Không thể duyệt yêu cầu trả hàng"
    );
  }
});

export const markReturnCustomerShipped = createAsyncThunk<
  ReturnRequest,
  CustomerShippedPayload,
  { rejectValue: string }
>(
  "/returnRequests/customerShipped",
  async ({ id, trackingCode, carrier, shipmentNote }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/return-requests/${id}/customer-shipped`,
        {
          trackingCode,
          carrier,
          shipmentNote,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Không thể cập nhật trạng thái đã gửi hàng trả"
      );
    }
  }
);

export const markReturnReceived = createAsyncThunk<
  ReturnRequest,
  number,
  { rejectValue: string }
>("/returnRequests/received", async (id, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/return-requests/${id}/received`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Không thể cập nhật trạng thái đã nhận hàng trả"
    );
  }
});

export const markReturnRefunded = createAsyncThunk<
  ReturnRequest,
  number,
  { rejectValue: string }
>("/returnRequests/refunded", async (id, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/return-requests/${id}/refunded`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Không thể cập nhật trạng thái đã hoàn tiền"
    );
  }
});

export const completeReturnRequest = createAsyncThunk<
  ReturnRequest,
  number,
  { rejectValue: string }
>("/returnRequests/complete", async (id, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/return-requests/${id}/complete`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Không thể hoàn tất yêu cầu trả hàng"
    );
  }
});

export const cancelReturnRequest = createAsyncThunk<
  ReturnRequest,
  number,
  { rejectValue: string }
>("/returnRequests/cancel", async (id, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/return-requests/${id}/cancel`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Không thể hủy yêu cầu trả hàng"
    );
  }
});

const updateRequestInList = (list: ReturnRequest[], updated: ReturnRequest) =>
  list.map((item) => (item.id === updated.id ? updated : item));

const prependIfNotExists = (list: ReturnRequest[], item: ReturnRequest) => {
  const exists = list.some((x) => x.id === item.id);
  return exists ? list : [item, ...list];
};

const returnRequestSlice = createSlice({
  name: "returnRequests",
  initialState,
  reducers: {
    clearReturnRequestState: (state) => {
      state.error = null;
      state.success = null;
    },
    setSelectedReturnRequest: (state, action: PayloadAction<ReturnRequest | null>) => {
      state.selectedRequest = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(createReturnRequest.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createReturnRequest.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.myRequests = prependIfNotExists(state.myRequests, action.payload);
        state.selectedRequest = action.payload;
        state.success = "Tạo yêu cầu trả hàng thành công";
      })
      .addCase(createReturnRequest.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Không thể tạo yêu cầu trả hàng";
      })

      .addCase(fetchMyReturnRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReturnRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.myRequests = action.payload;
      })
      .addCase(fetchMyReturnRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể tải danh sách trả hàng của bạn";
      })

      .addCase(fetchAdminReturnRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminReturnRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.adminRequests = action.payload;
      })
      .addCase(fetchAdminReturnRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể tải danh sách yêu cầu trả hàng";
      })

      .addCase(reviewReturnRequest.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(reviewReturnRequest.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.adminRequests = updateRequestInList(state.adminRequests, action.payload);
        state.myRequests = updateRequestInList(state.myRequests, action.payload);
        if (state.selectedRequest?.id === action.payload.id) {
          state.selectedRequest = action.payload;
        }
        state.success = "Cập nhật duyệt yêu cầu trả hàng thành công";
      })
      .addCase(reviewReturnRequest.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Không thể duyệt yêu cầu trả hàng";
      })

      .addCase(markReturnCustomerShipped.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(markReturnCustomerShipped.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.myRequests = updateRequestInList(state.myRequests, action.payload);
        state.adminRequests = updateRequestInList(state.adminRequests, action.payload);
        if (state.selectedRequest?.id === action.payload.id) {
          state.selectedRequest = action.payload;
        }
        state.success = "Đã cập nhật trạng thái khách gửi hàng trả";
      })
      .addCase(markReturnCustomerShipped.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Không thể cập nhật trạng thái khách gửi hàng trả";
      })

      .addCase(markReturnReceived.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(markReturnReceived.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.adminRequests = updateRequestInList(state.adminRequests, action.payload);
        state.myRequests = updateRequestInList(state.myRequests, action.payload);
        if (state.selectedRequest?.id === action.payload.id) {
          state.selectedRequest = action.payload;
        }
        state.success = "Đã cập nhật trạng thái shop nhận hàng trả";
      })
      .addCase(markReturnReceived.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Không thể cập nhật trạng thái đã nhận hàng trả";
      })

      .addCase(markReturnRefunded.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(markReturnRefunded.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.adminRequests = updateRequestInList(state.adminRequests, action.payload);
        state.myRequests = updateRequestInList(state.myRequests, action.payload);
        if (state.selectedRequest?.id === action.payload.id) {
          state.selectedRequest = action.payload;
        }
        state.success = "Đã cập nhật trạng thái hoàn tiền";
      })
      .addCase(markReturnRefunded.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Không thể cập nhật trạng thái hoàn tiền";
      })

      .addCase(completeReturnRequest.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(completeReturnRequest.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.adminRequests = updateRequestInList(state.adminRequests, action.payload);
        state.myRequests = updateRequestInList(state.myRequests, action.payload);
        if (state.selectedRequest?.id === action.payload.id) {
          state.selectedRequest = action.payload;
        }
        state.success = "Hoàn tất yêu cầu trả hàng thành công";
      })
      .addCase(completeReturnRequest.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Không thể hoàn tất yêu cầu trả hàng";
      })

      .addCase(cancelReturnRequest.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(cancelReturnRequest.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.myRequests = updateRequestInList(state.myRequests, action.payload);
        state.adminRequests = updateRequestInList(state.adminRequests, action.payload);
        if (state.selectedRequest?.id === action.payload.id) {
          state.selectedRequest = action.payload;
        }
        state.success = "Hủy yêu cầu trả hàng thành công";
      })
      .addCase(cancelReturnRequest.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Không thể hủy yêu cầu trả hàng";
      });
  },
});

export const { clearReturnRequestState, setSelectedReturnRequest } =
  returnRequestSlice.actions;

export default returnRequestSlice.reducer;