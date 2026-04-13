import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
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
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

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
  const { isDark } = useSiteThemeMode();

  const { messages, loading, sessionId } = useAppSelector((state) => state.chatbot);
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
      return `Khach dang xem san pham "${productTitle}". Cau hoi: ${trimmed}`;
    }

    if (productId) {
      return `Khach dang xem san pham co id ${productId}. Cau hoi: ${trimmed}`;
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

  const paperBg = isDark
    ? "radial-gradient(circle at top, rgba(249,115,22,0.14), transparent 28%), linear-gradient(180deg, #171717 0%, #101010 100%)"
    : "radial-gradient(circle at top, rgba(249,115,22,0.10), transparent 28%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)";
  const strongText = isDark ? "#ffffff" : "#0f172a";
  const mutedText = isDark ? "#a3a3a3" : "#64748b";
  const softBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
  const panelBg = isDark ? "rgba(0,0,0,0.2)" : "#f8fafc";
  const botBubbleBg = isDark ? "#1b1b1b" : "#ffffff";
  const botCardBg = isDark ? "#181818" : "#ffffff";
  const botThumbBg = isDark ? "#242424" : "#f1f5f9";
  const emptyBg = isDark ? "rgba(255,255,255,0.02)" : "#ffffff";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "26px",
          border: `1px solid ${isDark ? "rgba(249,115,22,0.16)" : "rgba(249,115,22,0.18)"}`,
          background: paperBg,
          color: strongText,
          boxShadow: isDark
            ? "0 28px 80px rgba(0,0,0,0.5)"
            : "0 24px 70px rgba(15,23,42,0.16)",
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
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-400">
            Ho tro san pham
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight" style={{ color: strongText }}>
            Hoi nhanh ve san pham
          </h3>
          <p className="mt-1 text-sm leading-6" style={{ color: mutedText }}>
            {productTitle
              ? productTitle
              : "Dat cau hoi ve kich thuoc, bao hanh, vat lieu hoac cach su dung."}
          </p>
        </div>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: isDark ? "rgba(255,255,255,0.7)" : "#64748b",
            backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)",
            "&:hover": {
              backgroundColor: "rgba(249,115,22,0.12)",
              color: "#f97316",
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
          className="flex-1 space-y-3 overflow-y-auto rounded-[1.4rem] p-3"
          style={{
            border: `1px solid ${softBorder}`,
            background: panelBg,
          }}
        >
          {messages.map((msg, index) => (
            <div key={index} className="space-y-2">
              <div className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[82%] rounded-[1.2rem] px-4 py-3 text-[14px] leading-6 whitespace-pre-line"
                  style={{
                    background:
                      msg.sender === "user"
                        ? "linear-gradient(135deg,#fb923c 0%,#f97316 100%)"
                        : botBubbleBg,
                    color: msg.sender === "user" ? "#111111" : strongText,
                    border: msg.sender === "user" ? "none" : `1px solid ${softBorder}`,
                    fontWeight: msg.sender === "user" ? 600 : 500,
                  }}
                >
                  {msg.text}
                </div>
              </div>

              {msg.sender === "bot" && msg.products && msg.products.length > 0 && (
                <div className="space-y-2 pl-1">
                  {msg.products.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleProductClick(product)}
                      className="flex w-full items-center gap-3 p-3 text-left transition"
                      style={{
                        borderRadius: 18,
                        border: `1px solid ${softBorder}`,
                        background: botCardBg,
                      }}
                    >
                      <div
                        className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl"
                        style={{ background: botThumbBg }}
                      >
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs" style={{ color: mutedText }}>
                            No image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-2 text-sm font-semibold" style={{ color: strongText }}>
                          {product.title}
                        </div>

                        {product.category && (
                          <div className="mt-1 text-xs" style={{ color: mutedText }}>
                            {product.category}
                          </div>
                        )}

                        {typeof product.price === "number" && (
                          <div className="mt-1 text-sm font-bold text-orange-400">
                            {product.price.toLocaleString("vi-VN")} d
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
              <div
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                style={{
                  border: `1px solid ${softBorder}`,
                  background: botBubbleBg,
                  color: mutedText,
                }}
              >
                <CircularProgress size={18} sx={{ color: "#fb923c" }} />
                Dang tra loi...
              </div>
            </div>
          )}

          {!messages.length && !loading && (
            <div
              className="rounded-[1.2rem] px-4 py-4 text-sm leading-6"
              style={{
                border: `1px dashed ${softBorder}`,
                background: emptyBg,
                color: mutedText,
              }}
            >
              Dat cau hoi ngan gon nhu: san pham nay phu hop cho muc dich nao,
              vat lieu la gi, co bao hanh hay khong.
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <TextField
            fullWidth
            size="small"
            placeholder="Nhap cau hoi cua ban..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "999px",
                color: strongText,
                backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
                "& fieldset": {
                  borderColor: softBorder,
                },
                "&:hover fieldset": {
                  borderColor: "rgba(249,115,22,0.35)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#f97316",
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: isDark ? "rgba(255,255,255,0.4)" : "rgba(100,116,139,0.8)",
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
                background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
                color: isDark ? "rgba(255,255,255,0.35)" : "rgba(100,116,139,0.5)",
              },
            }}
          >
            {loading ? <CircularProgress size={18} sx={{ color: "inherit" }} /> : <SendIcon />}
          </IconButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductChatDialog;
