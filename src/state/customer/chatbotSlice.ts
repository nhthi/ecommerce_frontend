// src/state/customer/chatbotSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

// ======== TYPES ========

export interface ChatContext {
  productId?: number;
}

export interface ChatRequest {
  message: string;
  context?: ChatContext;
}

export interface ChatReponse {
  reply: string;
}

export interface ChatMessage {
  text: string;
  sender: "user" | "bot";
  timestamp?: string;
}

interface ChatbotState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

// ======== THUNK ========

export const sendChatMessage = createAsyncThunk<
  ChatReponse, // reply từ backend
  ChatRequest, // payload
  { rejectValue: string }
>(
  "chatbot/sendChatMessage",
  async (request: ChatRequest, { rejectWithValue }) => {
    try {
      console.log("send: ", request);

      const response = await api.post("/api/chatbot", request);

      console.log(response.data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ======== SLICE ========

const initialState: ChatbotState = {
  messages: [],
  loading: false,
  error: null,
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
    addBotMessage(state, action: PayloadAction<string>) {
      state.messages.push({
        text: action.payload,
        sender: "bot",
        timestamp: new Date().toISOString(),
      });
    },
    resetChat(state) {
      state.messages = [];
      state.error = null;
      state.loading = false;
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
        state.messages.push({
          text: action.payload.reply || "",
          sender: "bot",
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Có lỗi khi gửi tin nhắn";
        state.messages.push({
          text: state.error,
          sender: "bot",
          timestamp: new Date().toISOString(),
        });
      });
  },
});

// ======== EXPORTS ========

export const { addUserMessage, addBotMessage, resetChat } =
  chatbotSlice.actions;
export default chatbotSlice.reducer;
