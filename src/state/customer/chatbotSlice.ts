import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

export interface ProductSuggestion {
  id: number;
  title: string;
  price?: number;
  imageUrl?: string;
  productUrl?: string;
  category?: string;
}

export interface ChatRequest {
  message: string;
  userId?: number;
  sessionId?: string;
}

export interface ChatAction {
  label: string;
  action: string;
  target?: string;
  refId?: number | string;
}

export interface ChatItem {
  itemType: "product" | "order";
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  data?: any;
  actions?: ChatAction[];
}

export interface ChatResponse {
  message: string;
  intent: string;
  sessionId: string;
  type?: "text" | "product_list" | "order_list" | "order_detail";
  products?: ProductSuggestion[];
  items?: ChatItem[];
  actions?: ChatAction[];
  metadata?: any;
}

export interface ChatMessage {
  text: string;
  sender: "user" | "bot";
  timestamp?: string;
  intent?: string;

  products?: ProductSuggestion[];

  type?: "text" | "product_list" | "order_list" | "order_detail";
  items?: ChatItem[];
  actions?: ChatAction[];
  metadata?: any;
}

interface ChatbotState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  sessionId: string | null;
}

export const sendChatMessage = createAsyncThunk<
  ChatResponse,
  ChatRequest,
  { rejectValue: string }
>(
  "chatbot/sendChatMessage",
  async (request: ChatRequest, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/chatbot", request);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể gửi tin nhắn lúc này."
      );
    }
  }
);

const initialState: ChatbotState = {
  messages: [],
  loading: false,
  error: null,
  sessionId: null,
};

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    addUserMessage(state, action: PayloadAction<string>) {
      state.messages.push({
        text: action.payload,
        sender: "user",
        timestamp: new Date().toISOString(),
      });
    },

    addBotMessage(
      state,
      action: PayloadAction<{
        text: string;
        intent?: string;
        products?: ProductSuggestion[];
        type?: "text" | "product_list" | "order_list" | "order_detail";
        items?: ChatItem[];
        actions?: ChatAction[];
        metadata?: any;
      }>
    ) {
      state.messages.push({
        text: action.payload.text,
        sender: "bot",
        timestamp: new Date().toISOString(),
        intent: action.payload.intent,
        products: action.payload.products || [],
        type: action.payload.type || "text",
        items: action.payload.items || [],
        actions: action.payload.actions || [],
        metadata: action.payload.metadata ?? null,
      });
    },

    setSessionId(state, action: PayloadAction<string | null>) {
      state.sessionId = action.payload;
    },

    resetChat(state) {
      state.messages = [];
      state.error = null;
      state.loading = false;
      state.sessionId = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionId = action.payload.sessionId || state.sessionId;

        state.messages.push({
          text: action.payload.message || "",
          sender: "bot",
          timestamp: new Date().toISOString(),
          intent: action.payload.intent,
          products: action.payload.products || [],
          type: action.payload.type || "text",
          items: action.payload.items || [],
          actions: action.payload.actions || [],
          metadata: action.payload.metadata ?? null,
        });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể gửi tin nhắn lúc này.";

        state.messages.push({
          text: state.error,
          sender: "bot",
          timestamp: new Date().toISOString(),
          type: "text",
          items: [],
          actions: [],
          metadata: null,
        });
      });
  },
});

export const { addUserMessage, addBotMessage, setSessionId, resetChat } =
  chatbotSlice.actions;

export default chatbotSlice.reducer;