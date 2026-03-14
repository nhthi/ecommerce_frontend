// src/pages/Message/Message.tsx
import React, {
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import {
  Avatar,
  Backdrop,
  CircularProgress,
  Grid,
  IconButton,
} from "@mui/material";
import { Frame, Message as MessageStomp } from "@stomp/stompjs";
import WestIcon from "@mui/icons-material/West";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import { Close } from "@mui/icons-material";

import UserChatCard from "./UserChatCard";
import ChatMessage from "./ChatMessage";

import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";

import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { API_URL } from "../../../config/Api";

import {
  Chat,
  fetchCustomerChats,
  fetchMessagesByChatId,
  ChatMessage as ChatMessageType,
  sendMessage,
  setCurrentChat,
  SenderType,
  fetchSellerChats,
} from "../../../state/customer/chatSlice";

const Message: React.FC = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((store) => store.auth);
  const chatState = useAppSelector((store) => store.chatSlice);
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [userChat, setUserChat] = useState<any>(null);

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentChat: Chat | null = chatState.currentChat;

  // websocket
  const [stompClient, setStompClient] = useState<any>(null);
  const subscriptionRef = useRef<any>(null);
  const [connected, setConnected] = useState(false);

  const jwt = localStorage.getItem("jwt");
  const jwt_seller = localStorage.getItem("jwt_seller");

  // Scroll xuống cuối khi messages thay đổi
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // set userChat mỗi khi currentChat đổi
  useEffect(() => {
    if (currentChat) {
      const { customer, seller } = currentChat;
      setUserChat(jwt ? seller : customer);
    } else {
      setUserChat(null);
    }
  }, [currentChat, jwt]);

  // Lấy danh sách chat
  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      dispatch(fetchCustomerChats());
    } else if (localStorage.getItem("jwt_seller")) {
      dispatch(fetchSellerChats());
    }
  }, [dispatch]);

  // Chọn chat
  const handleSelectChat = (chat: Chat) => {
    dispatch(setCurrentChat(chat));
    dispatch(fetchMessagesByChatId(chat.id))
      .unwrap()
      .then(({ messages }) => {
        setMessages(messages);
      })
      .catch((err) => {
        console.error("[CHAT] Error fetching messages by chatId:", err);
      });
  };

  // Sync messages từ store khi currentChat hoặc messagesByChatId thay đổi
  useEffect(() => {
    if (currentChat) {
      const storeMessages =
        chatState.messagesByChatId[currentChat.id] ||
        currentChat.messages ||
        [];
      setMessages(storeMessages);
    }
  }, [chatState.messagesByChatId, currentChat]);

  // ========= Upload ảnh =========
  const handleSelectImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    try {
      const file = e.target.files[0];
      const { uploadToCloundinary } = await import(
        "../../../utils/uploadToCloudinary"
      );
      const imgUrl = await uploadToCloundinary(file, "image");
      setSelectedImage((prev) => [...prev, imgUrl]);
    } catch (err) {
      console.error("[UPLOAD] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImage((prev) => prev.filter((_, i) => i !== index));
  };

  // ========= WebSocket =========
  // WebSocket connect
  useEffect(() => {
    const sock = new SockJS(`${API_URL}/ws`);
    const stomp = Stomp.over(sock);
    setStompClient(stomp);

    stomp.connect(
      { Authorization: `Bearer ${jwt || jwt_seller}` },
      (frame: Frame) => {
        setConnected(true);
      },
      (err: any) => {
        console.log("Websocket error ...", err);
      }
    );

    return () => {
      if (stomp) {
        if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
        stomp.disconnect();
      }
    };
  }, [jwt, jwt_seller]);

  useEffect(() => {
    if (!currentChat || !stompClient || !connected) return;

    // unsubscribe cũ nếu có
    if (subscriptionRef.current) subscriptionRef.current.unsubscribe();

    subscriptionRef.current = stompClient.subscribe(
      `/user/${currentChat.id}/private`,
      (payload: MessageStomp) => {
        const receivedMessage: ChatMessageType = JSON.parse(payload.body);
        setMessages((prev) => [...prev, receivedMessage]);
      }
    );

    return () => {
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
    };
  }, [currentChat?.id, stompClient, connected]);

  // Send message qua websocket
  const sendMessageToServer = (newMessage: ChatMessageType) => {
    if (stompClient && newMessage && currentChat) {
      stompClient.send(
        `/app/chat/${currentChat.id.toString()}`,
        {},
        JSON.stringify(newMessage)
      );
    }
  };

  // ========= Gửi message =========
  const handleCreateMessage = (value: string) => {
    if (!currentChat) return;

    const trimmed = value.trim();
    if (!trimmed && selectedImage.length === 0) return;

    let senderType: SenderType = "USER";
    if (localStorage.getItem("jwt_seller")) senderType = "SELLER";

    const payload = {
      chatId: currentChat.id,
      content: trimmed,
      files: selectedImage,
      senderType,
    };

    dispatch(sendMessage(payload))
      .unwrap()
      .then((savedMessage) => {
        sendMessageToServer(savedMessage);
        setInputValue("");
        setSelectedImage([]);
      })
      .catch((err) => {
        console.error("[CHAT] sendMessage error:", err);
      });
  };

  const handleInputKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateMessage(inputValue);
    }
  };

  const handleSendClick = () => {
    handleCreateMessage(inputValue);
  };

  return (
    <div className="bg-slate-50">
      <Grid container className="h-[90vh] overflow-y-hidden">
        {/* Danh sách chat */}
        <Grid size={{ xs: 4, md: 3 }} className="border-r border-slate-200">
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 px-4 pt-4 pb-3 bg-white/80 border-b border-slate-200">
              <IconButton
                onClick={() => navigate(-1)}
                size="small"
                sx={{ mr: 1 }}
              >
                <WestIcon />
              </IconButton>
              <div>
                <h1 className="text-sm md:text-lg font-semibold text-slate-800">
                  Tin nhắn
                </h1>
                <p className="text-[11px] text-slate-500 hidden md:block">
                  Trò chuyện với người bán và khách hàng
                </p>
              </div>
            </div>

            <div className="flex-1 mt-2 overflow-y-scroll scroll-hidden pb-4 space-y-2 px-3">
              {chatState.chats.map((item) => (
                <div key={item.id} onClick={() => handleSelectChat(item)}>
                  <UserChatCard
                    chat={item as any}
                    isCurrentChat={currentChat?.id === item.id}
                  />
                </div>
              ))}

              {chatState.chats.length === 0 && (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 text-center px-3">
                  Bạn chưa có cuộc trò chuyện nào. Hãy thử nhắn tin với người
                  bán từ trang chi tiết sản phẩm.
                </div>
              )}
            </div>
          </div>
        </Grid>

        {/* Khu vực chat */}
        <Grid size={{ xs: 8, md: 9 }} className="h-full bg-white">
          {currentChat ? (
            <div className="flex flex-col h-full">
              {/* Header chat */}
              <div className="flex justify-between items-center px-4 md:px-7 py-3 md:py-4 bg-[#1891C8] text-white shadow-sm">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={userChat?.avatar}
                    sx={{
                      bgcolor: "#0f172a",
                      color: "rgb(88,199,250)",
                      width: 40,
                      height: 40,
                    }}
                  />
                  <div>
                    <p className="text-sm md:text-base font-semibold">
                      {userChat?.fullName ||
                        userChat?.businessDetails?.businessName ||
                        userChat?.email}
                    </p>
                    <p className="text-[11px] md:text-xs text-white/80">
                      Đang trò chuyện
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={messagesEndRef}
                className="flex-1 overflow-y-scroll px-2 md:px-4 space-y-3 py-4 scroll-hidden bg-slate-50"
              >
                {messages.map((item) => (
                  <ChatMessage key={item.id} message={item as any} />
                ))}

                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400">
                    <ChatBubbleOutlineIcon
                      sx={{ fontSize: "4rem", color: "#cbd5f5" }}
                    />
                    <p className="mt-2">
                      Hãy gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện.
                    </p>
                  </div>
                )}
              </div>

              {/* Input + preview ảnh */}
              <div className="bg-white border-t border-slate-200 px-2 md:px-4 pb-3 pt-2">
                {/* Ảnh đã chọn */}
                {selectedImage.length > 0 && (
                  <div className="flex space-x-2 pb-2 overflow-x-auto">
                    {selectedImage.map((item, index) => (
                      <div className="relative" key={item + index}>
                        <img
                          src={item}
                          alt=""
                          className="w-[5rem] h-[5rem] object-cover rounded-lg border"
                        />
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            bgcolor: "rgba(0,0,0,0.6)",
                            color: "white",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                          }}
                          size="small"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Close sx={{ fontSize: 16 }} />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input + nút gửi + chọn ảnh */}
                <div className="py-2 flex items-center justify-center space-x-2 md:space-x-3">
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleInputKeyPress}
                    type="text"
                    className="outline-none w-full h-11 rounded-full px-4 bg-slate-50 border border-slate-300 text-sm"
                    placeholder="Nhập tin nhắn..."
                  />
                  <IconButton color="primary" onClick={handleSendClick}>
                    <SendIcon />
                  </IconButton>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSelectImage}
                      style={{ display: "none" }}
                      id="image-input"
                    />
                    <label htmlFor="image-input">
                      <IconButton color="primary" component="span">
                        <AddPhotoAlternateIcon />
                      </IconButton>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full space-y-5 flex flex-col justify-center items-center text-slate-500">
              <ChatBubbleOutlineIcon
                sx={{ fontSize: "6rem", color: "#cbd5f5" }}
              />
              <p className="font-semibold text-lg">Chưa chọn cuộc trò chuyện</p>
              <p className="text-sm text-slate-400 px-4 text-center">
                Hãy chọn một cuộc trò chuyện ở bên trái để bắt đầu nhắn tin.
              </p>
            </div>
          )}
        </Grid>
      </Grid>

      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </div>
  );
};

export default Message;
