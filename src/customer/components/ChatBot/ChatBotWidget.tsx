import React, { useState, useRef, useEffect, useMemo } from "react";
import { IconButton, TextField, Paper, CircularProgress, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  addUserMessage,
  sendChatMessage,
  resetChat,
  ChatMessage,
} from "../../../state/customer/chatbotSlice";
import { SmartToy, Bolt, FitnessCenter } from "@mui/icons-material";

interface Props {
  productId?: number;
}

const ChatBotWidget: React.FC<Props> = ({ productId }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const dispatch = useAppDispatch();
  const { messages, loading } = useAppSelector((state) => state.chatbot);

  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestionMessages = useMemo(
    () => [
      "Toi moi tap gym, nen mua dung cu nao truoc?",
      "Tu van giup toi mot bo ta va day khang luc cho tap tai nha.",
      "San pham nao phu hop de tap cardio trong khong gian nho?",
      "Cach chon kich thuoc gang tay hoac day tap nhu the nao?",
    ],
    [],
  );

  const toggleOpen = () => setOpen((prev) => !prev);

  const submitMessage = (message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    dispatch(addUserMessage(trimmed));
    setInput("");

    dispatch(
      sendChatMessage({
        message: trimmed,
        context: productId ? { productId } : undefined,
      }),
    );
  };

  const handleSend = () => {
    submitMessage(input);
  };

  const handleSuggestionClick = (message: string) => {
    submitMessage(message);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) {
      setInput("");
    }
  }, [open]);

  const showSuggestions = messages.length === 0 && !loading;

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <button
          type="button"
          onClick={toggleOpen}
          className={[
            "group flex h-14 w-14 items-center justify-center rounded-full border border-orange-400/30",
            "bg-[linear-gradient(135deg,#fb923c_0%,#f97316_100%)] text-[#111111]",
            "shadow-[0_18px_38px_rgba(249,115,22,0.35)] transition-all duration-300",
            open ? "scale-95" : "hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(249,115,22,0.42)]",
          ].join(" ")}
          aria-label={open ? "Dong chatbot" : "Mo chatbot"}
        >
          {open ? <CloseIcon sx={{ fontSize: 24 }} /> : <SmartToy sx={{ fontSize: 26 }} />}
        </button>
      </div>

      <div
        className={[
          "fixed bottom-24 right-5 z-50 w-[calc(100vw-2rem)] max-w-[390px] origin-bottom-right transition-all duration-300",
          open ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-95 opacity-0",
        ].join(" ")}
      >
        <Paper
          elevation={0}
          className="flex h-[540px] flex-col overflow-hidden rounded-[1.8rem] border border-orange-500/16 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.16),_transparent_30%),linear-gradient(180deg,_#171717_0%,_#101010_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-start justify-between border-b border-white/8 px-5 py-4 text-white">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/12 text-orange-300">
                  <FitnessCenter sx={{ fontSize: 20 }} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300">
                    Fitness support
                  </p>
                  <p className="text-lg font-black tracking-tight text-white">
                    Tro ly mua sam
                  </p>
                </div>
              </div>
              <p className="text-sm leading-6 text-neutral-400">
                Tu van nhanh ve dung cu, combo tap, kich thuoc va cach chon san pham.
              </p>
            </div>
            <IconButton
              size="small"
              onClick={() => {
                setOpen(false);
                dispatch(resetChat());
              }}
              sx={{
                color: "rgba(255,255,255,0.76)",
                backgroundColor: "rgba(255,255,255,0.04)",
                "&:hover": {
                  backgroundColor: "rgba(249,115,22,0.12)",
                  color: "#fdba74",
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {showSuggestions && (
              <div className="space-y-4">
                <div className="rounded-[1.4rem] border border-orange-500/14 bg-[#1a1714] p-4 text-sm leading-6 text-neutral-100 shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
                  <div className="mb-3 flex items-center gap-2 text-orange-300">
                    <Bolt sx={{ fontSize: 18 }} />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                      Goi y nhanh
                    </span>
                  </div>
                  <p className="text-neutral-100">
                    Ban co the hoi ve may cardio, bo ta, phu kien tap tai nha hoac nhan goi y mua theo muc tieu tap luyen.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {suggestionMessages.map((item) => (
                    <Button
                      key={item}
                      onClick={() => handleSuggestionClick(item)}
                      variant="outlined"
                      sx={{
                        textTransform: "none",
                        borderRadius: "999px",
                        px: 1.8,
                        py: 0.8,
                        fontSize: "0.82rem",
                        lineHeight: 1.45,
                        justifyContent: "flex-start",
                        color: "#f5f5f5",
                        borderColor: "rgba(249,115,22,0.22)",
                        backgroundColor: "#1b1b1b",
                        "&:hover": {
                          borderColor: "rgba(249,115,22,0.34)",
                          backgroundColor: "rgba(249,115,22,0.16)",
                        },
                      }}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg: ChatMessage, idx: number) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={[
                    "max-w-[84%] rounded-[1.25rem] px-4 py-3 text-sm leading-6 transition-all duration-200",
                    msg.sender === "user"
                      ? "bg-[linear-gradient(135deg,#fb923c_0%,#f97316_100%)] text-[#111111] rounded-br-md font-semibold shadow-[0_12px_28px_rgba(249,115,22,0.22)]"
                      : "border border-white/8 bg-[#1a1a1a] text-neutral-100 rounded-bl-md shadow-[0_10px_22px_rgba(0,0,0,0.14)]",
                  ].join(" ")}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-[1.1rem] border border-white/8 bg-[#1b1b1b] px-3 py-2 text-xs text-neutral-300">
                  <CircularProgress size={14} sx={{ color: "#fb923c" }} />
                  Dang soan tra loi...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/8 bg-black/10 px-3 py-3">
            <div className="rounded-[1.35rem] border border-orange-500/12 bg-[#f6efe7] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
              <div className="mb-1 px-2 text-[11px] font-semibold tracking-[0.08em] text-[#7a5a44] uppercase">
                Nhap cau hoi cua ban
              </div>
              <div className="flex items-center gap-2 rounded-[1rem] bg-white px-3 py-1.5 shadow-[0_8px_24px_rgba(17,17,17,0.06)]">
                <TextField
                  size="small"
                  variant="standard"
                  placeholder="Vi du: may nao hop voi phong 15m2?"
                  fullWidth
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    "& .MuiInputBase-root": {
                      color: "#1f2937",
                      fontSize: "0.96rem",
                      fontWeight: 500,
                    },
                    "& .MuiInputBase-input": {
                      paddingY: "6px",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#9ca3af",
                      opacity: 1,
                    },
                  }}
                />
                <IconButton
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  sx={{
                    width: 42,
                    height: 42,
                    color: "#111111",
                    background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                    boxShadow: "0 12px 24px rgba(249,115,22,0.2)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #fdba74 0%, #ea580c 100%)",
                    },
                    "&.Mui-disabled": {
                      background: "rgba(17,17,17,0.08)",
                      color: "rgba(17,17,17,0.28)",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={18} sx={{ color: "inherit" }} /> : <SendIcon sx={{ fontSize: 20 }} />}
                </IconButton>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default ChatBotWidget;
