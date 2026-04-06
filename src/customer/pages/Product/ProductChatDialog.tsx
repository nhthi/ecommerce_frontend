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
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  addUserMessage,
  resetChat,
  sendChatMessage,
  ProductSuggestion,
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
  const navigate = useNavigate();

  const { messages, loading, sessionId } = useAppSelector((state) => state.chatbot);

  // sửa lại theo store auth thật của bạn nếu khác
  const user = useAppSelector((state: any) => state.auth?.user);
  const userId = user?.id;

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      dispatch(resetChat());
      setInput("");
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const buildMessageForProduct = (rawMessage: string) => {
    const trimmed = rawMessage.trim();
    if (!trimmed) return "";

    if (productTitle) {
      return `Khách đang xem sản phẩm "${productTitle}". Câu hỏi: ${trimmed}`;
    }

    if (productId) {
      return `Khách đang xem sản phẩm có id ${productId}. Câu hỏi: ${trimmed}`;
    }

    return trimmed;
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    dispatch(addUserMessage(trimmed));

    dispatch(
      sendChatMessage({
        message: buildMessageForProduct(trimmed),
        userId,
        sessionId: sessionId || undefined,
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

  const handleProductClick = (product: ProductSuggestion) => {
    if (product.productUrl) {
      navigate(product.productUrl);
      return;
    }

    if (product.id) {
      navigate(`/products/${product.id}`);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "26px",
          border: "1px solid rgba(249,115,22,0.16)",
          background:
            "radial-gradient(circle at top, rgba(249,115,22,0.14), transparent 28%), linear-gradient(180deg, #171717 0%, #101010 100%)",
          color: "white",
          boxShadow: "0 28px 80px rgba(0,0,0,0.5)",
        },
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          px: 3,
          pt: 3,
          pb: 2,
        }}
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300">
            Hỗ trợ sản phẩm
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
            Hỏi nhanh về sản phẩm
          </h3>
          <p className="mt-1 text-sm leading-6 text-neutral-400">
            {productTitle
              ? productTitle
              : "Đặt câu hỏi về kích thước, bảo hành, vật liệu hoặc cách sử dụng."}
          </p>
        </div>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "rgba(255,255,255,0.7)",
            backgroundColor: "rgba(255,255,255,0.04)",
            "&:hover": {
              backgroundColor: "rgba(249,115,22,0.12)",
              color: "#fdba74",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          height: 430,
          px: 3,
          pb: 3,
        }}
      >
        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto rounded-[1.4rem] border border-white/8 bg-black/20 p-3"
        >
          {messages.map((msg, index) => (
            <div key={index} className="space-y-2">
              <div
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={[
                    "max-w-[82%] rounded-[1.2rem] px-4 py-3 text-[14px] leading-6 whitespace-pre-line",
                    msg.sender === "user"
                      ? "bg-[linear-gradient(135deg,#fb923c_0%,#f97316_100%)] text-[#111111] font-semibold"
                      : "border border-white/8 bg-[#1b1b1b] text-neutral-200",
                  ].join(" ")}
                >
                  {msg.text}
                </div>
              </div>

              {msg.sender === "bot" &&
                msg.products &&
                msg.products.length > 0 && (
                  <div className="space-y-2 pl-1">
                    {msg.products.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleProductClick(product)}
                        className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-[#181818] p-3 text-left transition hover:border-orange-400/40 hover:bg-[#1d1d1d]"
                      >
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-[#242424]">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="line-clamp-2 text-sm font-semibold text-white">
                            {product.title}
                          </div>

                          {product.category && (
                            <div className="mt-1 text-xs text-neutral-400">
                              {product.category}
                            </div>
                          )}

                          {typeof product.price === "number" && (
                            <div className="mt-1 text-sm font-bold text-orange-300">
                              {product.price.toLocaleString("vi-VN")} đ
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-full border border-white/8 bg-[#1b1b1b] px-4 py-2 text-sm text-neutral-300">
                <CircularProgress size={18} sx={{ color: "#fb923c" }} />
                Đang trả lời...
              </div>
            </div>
          )}

          {!messages.length && !loading && (
            <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-white/[0.02] px-4 py-4 text-sm leading-6 text-neutral-400">
              Đặt câu hỏi ngắn gọn như: sản phẩm này phù hợp cho mục đích nào,
              vật liệu là gì, có bảo hành hay không.
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <TextField
            fullWidth
            size="small"
            placeholder="Nhập câu hỏi của bạn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "999px",
                color: "white",
                backgroundColor: "rgba(255,255,255,0.03)",
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.1)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(249,115,22,0.35)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#f97316",
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(255,255,255,0.4)",
                opacity: 1,
              },
            }}
          />

          <IconButton
            onClick={handleSend}
            disabled={loading || !input.trim()}
            sx={{
              width: 44,
              height: 44,
              color: "#111111",
              background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
              boxShadow: "0 14px 30px rgba(249,115,22,0.28)",
              "&:hover": {
                background: "linear-gradient(135deg, #fdba74 0%, #ea580c 100%)",
              },
              "&.Mui-disabled": {
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.35)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={18} sx={{ color: "inherit" }} />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductChatDialog;