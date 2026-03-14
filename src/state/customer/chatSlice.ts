// src/state/chat/chatSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api, sellerApi } from "../../config/Api";
import { User } from "../../types/UserType";
import { Seller } from "../../types/SellerType";

// ================== TYPES ==================

export interface ChatUser {
  id: number;
  name?: string;
  email?: string;
}

export interface ChatSeller {
  id: number;
  shopName?: string;
  email?: string;
}

export type SenderType = "USER" | "SELLER";

export interface ChatMessage {
  id: number;
  content: string;
  createdAt: string;
  files?: string[];
  senderType: SenderType;
  read: boolean;
}

export interface Chat {
  id: number;
  customer: User;
  seller: Seller;
  messages: ChatMessage[];
}

export interface ChatCreationRequest {
  sellerId: number;
  // Nếu sau này bạn muốn gắn với productId:
  // productId?: number;
}

export interface MessageCreateRequest {
  chatId: number;
  content: string;
  files?: string[];
  senderType?: SenderType; // có thể để backend tự set theo JWT
}

// ================== STATE ==================

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messagesByChatId: Record<number, ChatMessage[]>;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  messagesByChatId: {},
  loading: false,
  error: null,
};

// ================== THUNKS ==================

// 1. Customer lấy danh sách chat
export const fetchCustomerChats = createAsyncThunk<
  Chat[],
  void,
  { rejectValue: string }
>("chat/fetchCustomerChats", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/chats/customer");
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.message || "Không lấy được danh sách chat của khách hàng"
    );
  }
});

// 2. Seller lấy danh sách chat
export const fetchSellerChats = createAsyncThunk<
  Chat[],
  void,
  { rejectValue: string }
>("chat/fetchSellerChats", async (_, { rejectWithValue }) => {
  try {
    const res = await sellerApi.get("/api/chats/seller");
    console.log("fetch seller chats: ", res.data);

    return res.data;
  } catch (err: any) {
    console.log(err);

    return rejectWithValue(
      err.message || "Không lấy được danh sách chat của người bán"
    );
  }
});

// 3. Tạo chat mới (customer -> seller)
export const createChat = createAsyncThunk<
  Chat,
  ChatCreationRequest,
  { rejectValue: string }
>("chat/createChat", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post("/api/chats", payload);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Không tạo được cuộc trò chuyện");
  }
});

// 4. Lấy message của 1 chat
export const fetchMessagesByChatId = createAsyncThunk<
  { chatId: number; messages: ChatMessage[] },
  number,
  { rejectValue: string }
>("chat/fetchMessagesByChatId", async (chatId, { rejectWithValue }) => {
  try {
    let res;
    if (localStorage.getItem("jwt")) {
      res = await api.get(`/api/message/chat/${chatId}`);
    } else {
      res = await sellerApi.get(`/api/message/chat/${chatId}`);
    }
    console.log("fetch message:", res.data);

    return { chatId, messages: res.data };
  } catch (err: any) {
    return rejectWithValue(err.message || "Không lấy được tin nhắn");
  }
});

// 5. Gửi message
export const sendMessage = createAsyncThunk<
  ChatMessage,
  MessageCreateRequest,
  { rejectValue: string }
>("chat/sendMessage", async (payload, { rejectWithValue }) => {
  try {
    const { chatId, ...body } = payload;
    let res;
    if (localStorage.getItem("jwt")) {
      res = await api.post(`/api/message/chat/${chatId}`, body);
    } else {
      res = await sellerApi.post(`/api/message/chat/${chatId}`, body);
    }
    console.log("create message:", res.data);

    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Không gửi được tin nhắn");
  }
});

// ================== SLICE ==================

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentChat(state, action: PayloadAction<Chat | null>) {
      state.currentChat = action.payload;
    },
    // Nếu muốn clear khi logout
    resetChatState(state) {
      state.chats = [];
      state.currentChat = null;
      state.messagesByChatId = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchCustomerChats
    builder
      .addCase(fetchCustomerChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchCustomerChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi khi lấy chat của khách hàng";
      });

    // fetchSellerChats
    builder
      .addCase(fetchSellerChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchSellerChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi khi lấy chat của người bán";
      });

    // createChat
    builder
      .addCase(createChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.loading = false;
        state.chats.push(action.payload);
        state.currentChat = action.payload;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi khi tạo chat mới";
      });

    // fetchMessagesByChatId
    builder
      .addCase(fetchMessagesByChatId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesByChatId.fulfilled, (state, action) => {
        state.loading = false;
        const { chatId, messages } = action.payload;
        state.messagesByChatId[chatId] = messages;
      })
      .addCase(fetchMessagesByChatId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi khi lấy tin nhắn";
      });

    // sendMessage
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        // state.currentChat?.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi khi gửi tin nhắn";
      });
  },
});

// ================== EXPORTS ==================

export const { setCurrentChat, resetChatState } = chatSlice.actions;
export default chatSlice.reducer;
