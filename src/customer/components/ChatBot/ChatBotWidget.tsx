// src/components/chat/ChatBotWidget.tsx
import React, { useState, useRef, useEffect } from "react";
import { IconButton, TextField, Paper, CircularProgress } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  addUserMessage,
  sendChatMessage,
  resetChat,
  ChatMessage,
} from "../../../state/customer/chatbotSlice";
import { SmartToy } from "@mui/icons-material";

interface Props {
  productId?: number; // optional, gửi context sản phẩm
}

const ChatBotWidget: React.FC<Props> = ({ productId }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const dispatch = useAppDispatch();
  const { messages, loading } = useAppSelector((state) => state.chatbot);

  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setOpen((prev) => !prev);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // 1. Thêm tin nhắn user vào slice
    dispatch(addUserMessage(trimmed));
    setInput("");

    // 2. Gửi tới backend qua thunk, kèm context nếu có
    dispatch(
      sendChatMessage({
        message: trimmed,
        context: productId ? { productId } : undefined,
      })
    );
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <>
      {/* Nút chat nổi */}
      <div className="fixed bottom-5 right-5 z-50">
        <IconButton
          onClick={toggleOpen}
          sx={{
            bgcolor: "#0097e6",
            color: "white",
            boxShadow: 4,
            "&:hover": { bgcolor: "#0080c4" },
          }}
        >
          {open ? <CloseIcon /> : <SmartToy />}
        </IconButton>
      </div>

      {/* Hộp chat */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-[320px] sm:w-[380px]">
          <Paper
            elevation={5}
            className="flex flex-col h-[420px] rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#0097e6] text-white">
              <div>
                <p className="font-semibold text-sm">Trợ lý ảo</p>
                <p className="text-xs text-gray-100">
                  Hỗ trợ mua hàng & tư vấn
                </p>
              </div>
              <IconButton size="small" onClick={toggleOpen}>
                <CloseIcon sx={{ fontSize: 18, color: "white" }} />
              </IconButton>
            </div>

            {/* Nội dung chat */}
            <div
              ref={scrollRef}
              className="flex-1 px-3 py-2 overflow-y-auto bg-gray-50 space-y-2"
            >
              {messages.map((msg: ChatMessage, idx: number) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                      msg.sender === "user"
                        ? "bg-[#0097e6] text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-2xl bg-white border border-gray-200 text-xs text-gray-500 flex items-center gap-2">
                    <CircularProgress size={12} />
                    Đang soạn trả lời...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t px-2 py-2 bg-white flex items-center gap-1">
              <TextField
                size="small"
                variant="outlined"
                placeholder="Nhập câu hỏi..."
                fullWidth
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <IconButton
                onClick={handleSend}
                disabled={loading || !input.trim()}
              >
                <SendIcon />
              </IconButton>
            </div>
          </Paper>
        </div>
      )}
    </>
  );
};

export default ChatBotWidget;
