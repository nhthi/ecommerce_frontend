import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

export type SupportChannel = "CHAT" | "CONTACT_FORM" | "ORDER_SUPPORT";
export type SupportStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_CUSTOMER"
  | "RESOLVED"
  | "CLOSED";
export type SupportPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type SupportSenderType = "CUSTOMER" | "STAFF" | "SYSTEM";
export type SupportMessageType =
  | "TEXT"
  | "IMAGE"
  | "FILE"
  | "INTERNAL_NOTE"
  | "SYSTEM";

export interface SupportConversation {
  id: number;
  code: string;
  customerId: number;
  customerName: string;
  assignedStaffId?: number | null;
  assignedStaffName?: string | null;
  subject: string;
  channel: SupportChannel;
  status: SupportStatus;
  priority: SupportPriority;
  orderId?: number | null;
  productId?: number | null;
  lastMessagePreview?: string | null;
  lastMessageAt?: string | null;
  unreadCustomerCount: number;
  unreadStaffCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SupportMessage {
  id: number;
  conversationId: number;
  senderId?: number | null;
  senderName: string;
  senderType: SupportSenderType;
  messageType: SupportMessageType;
  content: string;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  attachmentType?: string | null;
  internalNote: boolean;
  createdAt: string;
}

export interface SupportAssignmentHistory {
  id: number;
  conversationId: number;
  fromStaffId?: number | null;
  fromStaffName?: string | null;
  toStaffId?: number | null;
  toStaffName?: string | null;
  assignedById?: number | null;
  assignedByName?: string | null;
  note?: string | null;
  createdAt: string;
}

export interface SupportConversationDetail {
  conversation: SupportConversation;
  messages: SupportMessage[];
  assignmentHistories: SupportAssignmentHistory[];
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  last: boolean;
  first?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateSupportConversationPayload {
  subject: string;
  content: string;
  channel?: SupportChannel;
  priority?: SupportPriority;
  orderId?: number | null;
  productId?: number | null;
}

export interface SendSupportMessagePayload {
  conversationId: number;
  content: string;
  messageType?: SupportMessageType;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
}

export interface AssignSupportConversationPayload {
  conversationId: number;
  staffId: number;
  note?: string;
}

export interface UpdateSupportConversationStatusPayload {
  conversationId: number;
  status: SupportStatus;
}

export interface FetchAdminSupportConversationsParams {
  page?: number;
  size?: number;
  status?: SupportStatus;
  priority?: SupportPriority;
  staffId?: number;
  keyword?: string;
}

export interface FetchMySupportConversationsParams {
  page?: number;
  size?: number;
}

interface SupportState {
  loading: boolean;
  actionLoading: boolean;
  error: string | null;

  conversations: SupportConversation[];
  myConversations: SupportConversation[];

  conversationDetail: SupportConversation | null;
  conversationFullDetail: SupportConversationDetail | null;

  messages: SupportMessage[];
  assignmentHistories: SupportAssignmentHistory[];

  totalPages: number;
  totalElements: number;
  currentPage: number;
}

const initialState: SupportState = {
  loading: false,
  actionLoading: false,
  error: null,

  conversations: [],
  myConversations: [],

  conversationDetail: null,
  conversationFullDetail: null,

  messages: [],
  assignmentHistories: [],

  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
};

/* =========================
   CUSTOMER THUNKS
========================= */

export const createSupportConversation = createAsyncThunk<
  SupportConversation,
  CreateSupportConversationPayload,
  { rejectValue: string }
>("support/createSupportConversation", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<ApiResponse<SupportConversation>>(
      "/api/support/conversations",
      payload
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create support conversation"
    );
  }
});

export const fetchMySupportConversations = createAsyncThunk<
  PageResponse<SupportConversation>,
  FetchMySupportConversationsParams | undefined,
  { rejectValue: string }
>("support/fetchMySupportConversations", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<PageResponse<SupportConversation>>>(
      "/api/support/conversations/my",
      {
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch my support conversations"
    );
  }
});

export const fetchMySupportConversationDetail = createAsyncThunk<
  SupportConversation,
  number,
  { rejectValue: string }
>("support/fetchMySupportConversationDetail", async (conversationId, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<SupportConversation>>(
      `/api/support/conversations/${conversationId}`
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch support conversation detail"
    );
  }
});

export const fetchMySupportMessages = createAsyncThunk<
  SupportMessage[],
  number,
  { rejectValue: string }
>("support/fetchMySupportMessages", async (conversationId, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<SupportMessage[]>>(
      `/api/support/conversations/${conversationId}/messages`
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch support messages"
    );
  }
});

export const fetchMySupportFullDetail = createAsyncThunk<
  SupportConversationDetail,
  number,
  { rejectValue: string }
>("support/fetchMySupportFullDetail", async (conversationId, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<SupportConversationDetail>>(
      `/api/support/conversations/${conversationId}/full-detail`
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch support full detail"
    );
  }
});

export const sendMySupportMessage = createAsyncThunk<
  SupportMessage,
  SendSupportMessagePayload,
  { rejectValue: string }
>("support/sendMySupportMessage", async (payload, { rejectWithValue }) => {
  try {
    const { conversationId, ...body } = payload;
    const response = await api.post<ApiResponse<SupportMessage>>(
      `/api/support/conversations/${conversationId}/messages`,
      body
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to send support message"
    );
  }
});

export const markMySupportConversationRead = createAsyncThunk<
  { conversationId: number },
  number,
  { rejectValue: string }
>("support/markMySupportConversationRead", async (conversationId, { rejectWithValue }) => {
  try {
    await api.put(`/api/support/conversations/${conversationId}/read`);
    return { conversationId };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to mark support conversation as read"
    );
  }
});

/* =========================
   ADMIN / STAFF THUNKS
========================= */

export const fetchAdminSupportConversations = createAsyncThunk<
  PageResponse<SupportConversation>,
  FetchAdminSupportConversationsParams | undefined,
  { rejectValue: string }
>("support/fetchAdminSupportConversations", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<PageResponse<SupportConversation>>>(
      "/api/admin/support/conversations",
      {
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 20,
          status: params?.status,
          priority: params?.priority,
          staffId: params?.staffId,
          keyword: params?.keyword,
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch admin support conversations"
    );
  }
});

export const fetchAdminSupportConversationDetail = createAsyncThunk<
  SupportConversation,
  number,
  { rejectValue: string }
>("support/fetchAdminSupportConversationDetail", async (conversationId, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<SupportConversation>>(
      `/api/admin/support/conversations/${conversationId}`
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch admin support conversation detail"
    );
  }
});

export const fetchAdminSupportMessages = createAsyncThunk<
  SupportMessage[],
  number,
  { rejectValue: string }
>("support/fetchAdminSupportMessages", async (conversationId, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<SupportMessage[]>>(
      `/api/admin/support/conversations/${conversationId}/messages`
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch admin support messages"
    );
  }
});

export const fetchAdminSupportAssignments = createAsyncThunk<
  SupportAssignmentHistory[],
  number,
  { rejectValue: string }
>("support/fetchAdminSupportAssignments", async (conversationId, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<SupportAssignmentHistory[]>>(
      `/api/admin/support/conversations/${conversationId}/assignments`
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch support assignment histories"
    );
  }
});

export const fetchAdminSupportFullDetail = createAsyncThunk<
  SupportConversationDetail,
  number,
  { rejectValue: string }
>("support/fetchAdminSupportFullDetail", async (conversationId, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<SupportConversationDetail>>(
      `/api/admin/support/conversations/${conversationId}/full-detail`
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch admin support full detail"
    );
  }
});

export const sendAdminSupportMessage = createAsyncThunk<
  SupportMessage,
  SendSupportMessagePayload,
  { rejectValue: string }
>("support/sendAdminSupportMessage", async (payload, { rejectWithValue }) => {
  try {
    const { conversationId, ...body } = payload;
    const response = await api.post<ApiResponse<SupportMessage>>(
      `/api/admin/support/conversations/${conversationId}/messages`,
      body
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to send admin support message"
    );
  }
});

export const addInternalNote = createAsyncThunk<
  SupportMessage,
  { conversationId: number; content: string },
  { rejectValue: string }
>("support/addInternalNote", async ({ conversationId, content }, { rejectWithValue }) => {
  try {
    const response = await api.post<ApiResponse<SupportMessage>>(
      `/api/admin/support/conversations/${conversationId}/internal-note`,
      { content }
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add internal note"
    );
  }
});

export const assignSupportConversation = createAsyncThunk<
  SupportConversation,
  AssignSupportConversationPayload,
  { rejectValue: string }
>("support/assignSupportConversation", async (payload, { rejectWithValue }) => {
  try {
    const { conversationId, staffId, note } = payload;
    const response = await api.put<ApiResponse<SupportConversation>>(
      `/api/admin/support/conversations/${conversationId}/assign`,
      { staffId, note }
    );
    console.log(payload);
    
    console.log(response);
    
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to assign support conversation"
    );
  }
});

export const updateSupportConversationStatus = createAsyncThunk<
  SupportConversation,
  UpdateSupportConversationStatusPayload,
  { rejectValue: string }
>("support/updateSupportConversationStatus", async (payload, { rejectWithValue }) => {
  try {
    const { conversationId, status } = payload;
    const response = await api.put<ApiResponse<SupportConversation>>(
      `/api/admin/support/conversations/${conversationId}/status`,
      { status }
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update support conversation status"
    );
  }
});

export const markAdminSupportConversationRead = createAsyncThunk<
  { conversationId: number },
  number,
  { rejectValue: string }
>("support/markAdminSupportConversationRead", async (conversationId, { rejectWithValue }) => {
  try {
    await api.put(`/api/admin/support/conversations/${conversationId}/read`);
    return { conversationId };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to mark admin support conversation as read"
    );
  }
});

/* =========================
   SLICE
========================= */

const updateConversationInList = (
  list: SupportConversation[],
  updated: SupportConversation
) => {
  const index = list.findIndex((item) => item.id === updated.id);
  if (index !== -1) {
    list[index] = updated;
  }
};

const pushMessageIfNotExists = (
  messages: SupportMessage[],
  message: SupportMessage
) => {
  const exists = messages.some((item) => item.id === message.id);
  if (!exists) {
    messages.push(message);
  }
};

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    clearSupportError: (state) => {
      state.error = null;
    },
    clearSupportMessages: (state) => {
      state.messages = [];
    },
    clearSupportConversationDetail: (state) => {
      state.conversationDetail = null;
      state.conversationFullDetail = null;
      state.messages = [];
      state.assignmentHistories = [];
    },
    resetSupportState: () => initialState,
    appendSupportMessageLocal: (state, action: PayloadAction<SupportMessage>) => {
      pushMessageIfNotExists(state.messages, action.payload);
      if (state.conversationFullDetail) {
        pushMessageIfNotExists(state.conversationFullDetail.messages, action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder

      /* createSupportConversation */
      .addCase(createSupportConversation.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createSupportConversation.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.myConversations.unshift(action.payload);
      })
      .addCase(createSupportConversation.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to create support conversation";
      })

      /* fetchMySupportConversations */
      .addCase(fetchMySupportConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySupportConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.myConversations = action.payload.content || [];
        state.totalPages = action.payload.totalPages || 0;
        state.totalElements = action.payload.totalElements || 0;
        state.currentPage = action.payload.number || 0;
      })
      .addCase(fetchMySupportConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch my support conversations";
      })

      /* fetchMySupportConversationDetail */
      .addCase(fetchMySupportConversationDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySupportConversationDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.conversationDetail = action.payload;
      })
      .addCase(fetchMySupportConversationDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch support conversation detail";
      })

      /* fetchMySupportMessages */
      .addCase(fetchMySupportMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySupportMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload || [];
      })
      .addCase(fetchMySupportMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch support messages";
      })

      /* fetchMySupportFullDetail */
      .addCase(fetchMySupportFullDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySupportFullDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.conversationFullDetail = action.payload;
        state.conversationDetail = action.payload.conversation;
        state.messages = action.payload.messages || [];
        state.assignmentHistories = action.payload.assignmentHistories || [];
      })
      .addCase(fetchMySupportFullDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch support full detail";
      })

      /* sendMySupportMessage */
      .addCase(sendMySupportMessage.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(sendMySupportMessage.fulfilled, (state, action) => {
        state.actionLoading = false;
        pushMessageIfNotExists(state.messages, action.payload);
        if (state.conversationFullDetail) {
          pushMessageIfNotExists(state.conversationFullDetail.messages, action.payload);
        }
      })
      .addCase(sendMySupportMessage.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to send support message";
      })

      /* markMySupportConversationRead */
      .addCase(markMySupportConversationRead.fulfilled, (state, action) => {
        const { conversationId } = action.payload;
        const targetMy = state.myConversations.find((item) => item.id === conversationId);
        if (targetMy) targetMy.unreadCustomerCount = 0;

        const targetAll = state.conversations.find((item) => item.id === conversationId);
        if (targetAll) targetAll.unreadCustomerCount = 0;

        if (state.conversationDetail?.id === conversationId) {
          state.conversationDetail.unreadCustomerCount = 0;
        }
        if (state.conversationFullDetail?.conversation.id === conversationId) {
          state.conversationFullDetail.conversation.unreadCustomerCount = 0;
        }
      })

      /* fetchAdminSupportConversations */
      .addCase(fetchAdminSupportConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminSupportConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload.content || [];
        state.totalPages = action.payload.totalPages || 0;
        state.totalElements = action.payload.totalElements || 0;
        state.currentPage = action.payload.number || 0;
      })
      .addCase(fetchAdminSupportConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch admin support conversations";
      })

      /* fetchAdminSupportConversationDetail */
      .addCase(fetchAdminSupportConversationDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminSupportConversationDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.conversationDetail = action.payload;
      })
      .addCase(fetchAdminSupportConversationDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch admin support conversation detail";
      })

      /* fetchAdminSupportMessages */
      .addCase(fetchAdminSupportMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminSupportMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload || [];
      })
      .addCase(fetchAdminSupportMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch admin support messages";
      })

      /* fetchAdminSupportAssignments */
      .addCase(fetchAdminSupportAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminSupportAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignmentHistories = action.payload || [];
      })
      .addCase(fetchAdminSupportAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch support assignment histories";
      })

      /* fetchAdminSupportFullDetail */
      .addCase(fetchAdminSupportFullDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminSupportFullDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.conversationFullDetail = action.payload;
        state.conversationDetail = action.payload.conversation;
        state.messages = action.payload.messages || [];
        state.assignmentHistories = action.payload.assignmentHistories || [];
      })
      .addCase(fetchAdminSupportFullDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch admin support full detail";
      })

      /* sendAdminSupportMessage */
      .addCase(sendAdminSupportMessage.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(sendAdminSupportMessage.fulfilled, (state, action) => {
        state.actionLoading = false;
        pushMessageIfNotExists(state.messages, action.payload);
        if (state.conversationFullDetail) {
          pushMessageIfNotExists(state.conversationFullDetail.messages, action.payload);
        }
      })
      .addCase(sendAdminSupportMessage.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to send admin support message";
      })

      /* addInternalNote */
      .addCase(addInternalNote.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(addInternalNote.fulfilled, (state, action) => {
        state.actionLoading = false;
        pushMessageIfNotExists(state.messages, action.payload);
        if (state.conversationFullDetail) {
          pushMessageIfNotExists(state.conversationFullDetail.messages, action.payload);
        }
      })
      .addCase(addInternalNote.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to add internal note";
      })

      /* assignSupportConversation */
      .addCase(assignSupportConversation.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(assignSupportConversation.fulfilled, (state, action) => {
        state.actionLoading = false;
        updateConversationInList(state.conversations, action.payload);
        updateConversationInList(state.myConversations, action.payload);

        if (state.conversationDetail?.id === action.payload.id) {
          state.conversationDetail = action.payload;
        }
        if (state.conversationFullDetail?.conversation.id === action.payload.id) {
          state.conversationFullDetail.conversation = action.payload;
        }
      })
      .addCase(assignSupportConversation.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to assign support conversation";
      })

      /* updateSupportConversationStatus */
      .addCase(updateSupportConversationStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateSupportConversationStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        updateConversationInList(state.conversations, action.payload);
        updateConversationInList(state.myConversations, action.payload);

        if (state.conversationDetail?.id === action.payload.id) {
          state.conversationDetail = action.payload;
        }
        if (state.conversationFullDetail?.conversation.id === action.payload.id) {
          state.conversationFullDetail.conversation = action.payload;
        }
      })
      .addCase(updateSupportConversationStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to update support conversation status";
      })

      /* markAdminSupportConversationRead */
      .addCase(markAdminSupportConversationRead.fulfilled, (state, action) => {
        const { conversationId } = action.payload;
        const target = state.conversations.find((item) => item.id === conversationId);
        if (target) target.unreadStaffCount = 0;

        const targetMy = state.myConversations.find((item) => item.id === conversationId);
        if (targetMy) targetMy.unreadStaffCount = 0;

        if (state.conversationDetail?.id === conversationId) {
          state.conversationDetail.unreadStaffCount = 0;
        }
        if (state.conversationFullDetail?.conversation.id === conversationId) {
          state.conversationFullDetail.conversation.unreadStaffCount = 0;
        }
      });
  },
});

export const {
  clearSupportError,
  clearSupportMessages,
  clearSupportConversationDetail,
  resetSupportState,
  appendSupportMessageLocal,
} = supportSlice.actions;

export default supportSlice.reducer;