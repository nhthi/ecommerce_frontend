// src/components/chat/UserChatCard.tsx
import React, { useState, MouseEvent } from "react";
import {
  Avatar,
  Card,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ChatMessage } from "../../../state/customer/chatSlice";
import { User } from "../../../types/UserType";
import { Seller } from "../../../types/SellerType";

export interface ChatType {
  id: number;
  customer: User;
  seller: Seller;
  messages: ChatMessage[];
}

interface UserChatCardProps {
  chat: ChatType;
  isCurrentChat: boolean;
}

const UserChatCard: React.FC<UserChatCardProps> = ({ chat, isCurrentChat }) => {
  const navigate = useNavigate();
  const jwt_seller = localStorage.getItem("jwt_seller");
  const currentUserRole = jwt_seller ? "SELLER" : "USER";

  const otherUser = currentUserRole === "USER" ? chat.seller : chat.customer;

  const lastMessage =
    chat.messages && chat.messages.length > 0
      ? chat.messages[chat.messages.length - 1]
      : undefined;

  const lastMessageTime = lastMessage?.createdAt
    ? new Date(lastMessage.createdAt)
    : null;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const displayName =
    (otherUser as any)?.fullName ||
    (otherUser as any)?.businessDetails?.businessName ||
    otherUser.email;

  const avatarLetter = displayName?.charAt(0)?.toUpperCase() || "?";

  const wrapperClasses = `cursor-pointer transition-all ${
    isCurrentChat ? "scale-[0.99]" : "hover:scale-[1.01]"
  }`;

  return (
    <div className={wrapperClasses}>
      <Card
        sx={{
          bgcolor: isCurrentChat ? "#e5f3ff" : "#ffffff",
          borderRadius: 2,
          border: isCurrentChat ? "1px solid #0ea5e9" : "1px solid #e5e7eb",
          boxShadow: isCurrentChat ? 2 : 0,
        }}
      >
        {/* Desktop */}
        <div className="hidden md:block">
          <CardHeader
            sx={{
              py: 1.5,
              "& .MuiCardHeader-content": { minWidth: 0 },
            }}
            action={
              <>
                <IconButton onClick={handleClick}>
                  <MoreVert />
                </IconButton>
                <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate(`/profile?id=${otherUser.id}`);
                    }}
                  >
                    Xem hồ sơ
                  </MenuItem>
                </Menu>
              </>
            }
            avatar={
              <Avatar
                sx={{
                  width: "3rem",
                  height: "3rem",
                  fontSize: "1.25rem",
                  bgcolor: "#0f172a",
                  color: "rgb(88,199,250)",
                }}
                src={(otherUser as any)?.avatar || ""}
              >
                {avatarLetter}
              </Avatar>
            }
            titleTypographyProps={{
              style: {
                textAlign: "left",
                fontSize: "0.95rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
            subheaderTypographyProps={{
              style: { textAlign: "left" },
            }}
            title={displayName}
            subheader={
              lastMessage ? (
                <div className="w-full flex justify-between items-center gap-2">
                  <Tooltip title={lastMessage.content}>
                    <span className="line-clamp-1 text-xs text-slate-600 flex-1">
                      {lastMessage.content}
                    </span>
                  </Tooltip>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {lastMessageTime && format(lastMessageTime, "HH:mm")}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-400">
                  Chưa có tin nhắn nào
                </span>
              )
            }
          />
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center px-3 py-2 gap-3">
          <Avatar
            sx={{
              width: "2.75rem",
              height: "2.75rem",
              fontSize: "1.1rem",
              bgcolor: "#0f172a",
              color: "rgb(88,199,250)",
            }}
            src={(otherUser as any)?.avatar || ""}
          >
            {avatarLetter}
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {displayName}
            </p>
            {lastMessage ? (
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {lastMessage.content}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400">Chưa có tin nhắn</p>
            )}
          </div>

          {lastMessageTime && (
            <span className="text-[10px] text-slate-400">
              {format(lastMessageTime, "HH:mm")}
            </span>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserChatCard;
