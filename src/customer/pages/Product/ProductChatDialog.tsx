// src/components/chat/ProductChatDialog.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  addUserMessage,
  resetChat,
  sendChatMessage,
} from "../../../state/customer/chatbotSlice";

interface ProductChatDialogProps {
  open: boolean;
  onClose: () => void;
  productId?: number;
  productTitle?: string;
}

const ProductChatDialog: React.FC<ProductChatDialogProps> = ({
  open,
  onClose,
  productId,
  productTitle,
}) => {
  const [input, setInput] = useState("");
  const dispatch = useAppDispatch();
  const { messages, loading } = useAppSelector((state) => state.chatbot);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Khi đóng popup thì reset chat
  useEffect(() => {
    if (!open) {
      dispatch(resetChat());
      setInput("");
    }
  }, [open, dispatch]);

  // Auto scroll xuống cuối khi có message mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Thêm message user vào Redux
    dispatch(addUserMessage(trimmed));

    // Gửi lên backend kèm context sản phẩm
    dispatch(
      sendChatMessage({
        message: trimmed,
        context: productId ? { productId } : undefined,
      })
    );

    setInput("");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 3 },
        onClick: (e: React.MouseEvent) => e.stopPropagation(), // tránh click “lọt” xuống card
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1,
        }}
      >
        <span>
          Hỏi đáp về sản phẩm
          {productTitle ? `: ${productTitle}` : ""}
        </span>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          height: 380,
        }}
      >
        {/* Vùng hiển thị chat */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: 4,
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "8px 12px",
                  borderRadius: 12,
                  fontSize: 14,
                  backgroundColor:
                    msg.sender === "user" ? "#0097e6" : "#f1f2f6",
                  color: msg.sender === "user" ? "#fff" : "#2f3542",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <CircularProgress size={20} />
            </div>
          )}

          {!messages.length && !loading && (
            <div style={{ fontSize: 13, color: "#888" }}>
              👋 Hãy đặt câu hỏi về sản phẩm (chất liệu, kích thước, bảo hành,
              sử dụng, v.v.)
            </div>
          )}
        </div>

        {/* Ô nhập + nút gửi */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Nhập câu hỏi của bạn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <IconButton onClick={handleSend} disabled={loading || !input.trim()}>
            {loading ? <CircularProgress size={20} /> : <SendIcon />}
          </IconButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductChatDialog;
