// src/pages/Message/ChatMessage.tsx
import React from "react";
import { format } from "date-fns";

interface ChatMessageProps {
  message: {
    id: number;
    content: string;
    createdAt: string;
    files?: string[];
    senderType: "USER" | "SELLER";
    read: boolean;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = !!localStorage.getItem("jwt");
  const mySenderType = isUser ? "USER" : "SELLER";

  // true = message của user hiện tại
  const isMyMessage = message.senderType === mySenderType;

  const formattedDate = message.createdAt
    ? format(new Date(message.createdAt), "dd/MM/yyyy HH:mm")
    : "";

  return (
    <div className="w-full my-2">
      {/* Thời gian */}
      <div className="flex justify-center text-[11px] pb-1 text-gray-400">
        {formattedDate}
      </div>

      {/* Bubble */}
      <div
        className={`flex ${isMyMessage ? "justify-end" : "justify-start"} px-1`}
      >
        <div
          className={`max-w-[80%] md:max-w-[60%] shadow-sm ${
            isMyMessage ? "bg-[#1891C8]" : "bg-gray-200"
          } ${
            message.files && message.files.length > 0
              ? "rounded-2xl overflow-hidden"
              : isMyMessage
              ? "rounded-3xl rounded-br-sm"
              : "rounded-3xl rounded-bl-sm"
          } px-3 py-2`}
        >
          {/* Ảnh đính kèm */}
          {message.files && message.files.length > 0 && (
            <div className="flex gap-2 pb-1 flex-wrap">
              {message.files.map((item) => (
                <img
                  key={item}
                  src={item}
                  alt=""
                  className="w-[9rem] h-[12rem] object-cover rounded-xl bg-black/5"
                />
              ))}
            </div>
          )}

          {/* Nội dung */}
          {message.content && (
            <p
              className={`text-sm whitespace-pre-wrap break-words ${
                isMyMessage ? "text-white" : "text-slate-900"
              }`}
            >
              {message.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
