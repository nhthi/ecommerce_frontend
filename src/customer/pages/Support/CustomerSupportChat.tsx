import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Dialog,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Add, AttachFile, ChatBubbleOutline, ImageOutlined, Send, SmartDisplay, SupportAgent } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchMySupportConversations,
  fetchMySupportFullDetail,
  markMySupportConversationRead,
  sendMySupportMessage,
  SupportConversation,
  SupportPriority,
  SupportStatus,
} from "../../../state/customer/supportSlice";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";
import { uploadToCloundinary } from "../../../utils/uploadToCloudinary";

const statusLabelMap: Record<SupportStatus, string> = {
  OPEN: "Mới mở",
  IN_PROGRESS: "Đang xử lý",
  WAITING_CUSTOMER: "Chờ phản hồi",
  RESOLVED: "Đã xử lý",
  CLOSED: "Đã đóng",
};

const priorityLabelMap: Record<SupportPriority, string> = {
  LOW: "Thấp",
  MEDIUM: "Trung bình",
  HIGH: "Cao",
  URGENT: "Khẩn cấp",
};

const getStatusTone = (status: SupportStatus) => {
  switch (status) {
    case "OPEN":
      return { color: "#38bdf8", soft: "rgba(56,189,248,0.16)" };
    case "IN_PROGRESS":
      return { color: "#f59e0b", soft: "rgba(245,158,11,0.16)" };
    case "WAITING_CUSTOMER":
      return { color: "#a855f7", soft: "rgba(168,85,247,0.16)" };
    case "RESOLVED":
      return { color: "#22c55e", soft: "rgba(34,197,94,0.16)" };
    case "CLOSED":
      return { color: "#94a3b8", soft: "rgba(148,163,184,0.18)" };
    default:
      return { color: "#94a3b8", soft: "rgba(148,163,184,0.18)" };
  }
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("vi-VN");
};

const formatRelativeShort = (value?: string | null) => {
  if (!value) return "--";
  const date = new Date(value).getTime();
  if (Number.isNaN(date)) return "--";
  const diffMs = Date.now() - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Vua xong";
  if (diffMin < 60) return `${diffMin} phut truoc`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} gio truoc`;
  return `${Math.floor(diffHour / 24)} ngay truoc`;
};

const getInitial = (name?: string | null) => (name ? name.trim().charAt(0).toUpperCase() : "?");

const CustomerSupportChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isDark } = useSiteThemeMode();
  const { loading, actionLoading, myConversations, conversationFullDetail } = useAppSelector((s) => s.supportSlice);

  const [message, setMessage] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const selectedConversationId = id ? Number(id) : null;

  const pageBg = isDark ? "#0b0b0b" : "#f7f8fc";
  const cardBg = isDark ? "#141414" : "#ffffff";
  const altBg = isDark ? "#101010" : "#f8fafc";
  const softBg = isDark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
  const strongText = isDark ? "#ffffff" : "#0f172a";
  const mutedText = isDark ? "#94a3b8" : "#64748b";

  const selectedConversation = conversationFullDetail?.conversation ?? null;
  const messages = conversationFullDetail?.messages ?? [];

  const previewUrl = useMemo(() => {
    if (!attachmentFile) return "";
    return URL.createObjectURL(attachmentFile);
  }, [attachmentFile]);

  const refreshConversationList = () => {
    dispatch(fetchMySupportConversations({ page: 0, size: 30 }));
  };

  useEffect(() => {
    refreshConversationList();
  }, [dispatch]);

  useEffect(() => {
    if (!id && myConversations.length > 0) {
      navigate(`/support/${myConversations[0].id}`, { replace: true });
    }
  }, [id, myConversations, navigate]);

  useEffect(() => {
    if (selectedConversationId) {
      dispatch(fetchMySupportFullDetail(selectedConversationId));
      dispatch(markMySupportConversationRead(selectedConversationId));
    }
  }, [dispatch, selectedConversationId]);

  const handleSelectConversation = (conversationId: number) => {
    navigate(`/support/${conversationId}`);
  };

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setAttachmentFile(file);
  };

  const handleSend = async () => {
    if ((!message.trim() && !attachmentFile) || !selectedConversationId) return;

    if (message.trim()) {
      await dispatch(
        sendMySupportMessage({
          conversationId: selectedConversationId,
          content: message.trim(),
        })
      );
    }

    if (attachmentFile) {
      setUploadingAttachment(true);
      const cloudType = attachmentFile.type.startsWith("video/") ? "video" : "image";
      const url = await uploadToCloundinary(attachmentFile, cloudType);

      await dispatch(
        sendMySupportMessage({
          conversationId: selectedConversationId,
          content: attachmentFile.name,
          messageType: attachmentFile.type.startsWith("image/") ? "IMAGE" : "FILE",
          attachmentUrl: url,
          attachmentName: attachmentFile.name,
          attachmentType: attachmentFile.type,
        })
      );
      setUploadingAttachment(false);
      setAttachmentFile(null);
    }

    setMessage("");
    dispatch(fetchMySupportFullDetail(selectedConversationId));
    refreshConversationList();
  };

  const openCount = useMemo(
    () => myConversations.filter((item) => item.status === "OPEN" || item.status === "IN_PROGRESS").length,
    [myConversations]
  );

  return (
    <Box sx={{ p: { xs: 1.5, md: 2.5 }, bgcolor: pageBg, minHeight: "100vh" }}>
      <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 }, mb: 2, border: `1px solid ${border}`, backgroundColor: cardBg, color: strongText }}>
        <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" spacing={1.5}>
          <Box>
            <Typography sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 900 }}>Các cuộc hỗ trợ của bạn</Typography>
            <Typography sx={{ mt: 0.7, color: mutedText, maxWidth: 720 }}>
             Chọn một hội thoại để tiếp tục trao đổi với bộ phận hỗ trợ, theo dõi tiến độ và gửi thêm thông tin khi cần.
            </Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Paper elevation={0} sx={{ p: 1.3, minWidth: 136, border: `1px solid ${border}`, backgroundColor: softBg }}>
              <Typography sx={{ color: mutedText, fontSize: 12 }}>Tổng cuộc trò chuyện</Typography>
              <Typography sx={{ fontSize: 24, fontWeight: 900 }}>{myConversations.length}</Typography>
            </Paper>
            <Paper elevation={0} sx={{ p: 1.3, minWidth: 136, border: `1px solid ${border}`, backgroundColor: softBg }}>
              <Typography sx={{ color: mutedText, fontSize: 12 }}>Đang xử lý</Typography>
              <Typography sx={{ fontSize: 24, fontWeight: 900 }}>{openCount}</Typography>
            </Paper>
            <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/support/create')}>
              Tạo yêu cầu mới
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={0} sx={{ height: { xs: "auto", lg: "calc(100vh - 196px)" }, border: `1px solid ${border}`, backgroundColor: cardBg, overflow: "hidden" }}>
            <Box sx={{ p: 2, borderBottom: `1px solid ${border}`, bgcolor: altBg }}>
              <Typography fontWeight={900} fontSize={18}>Danh sách hội thoại</Typography>
              <Typography sx={{ mt: 0.4, color: mutedText, fontSize: 13.5 }}>Chọn một hội thoại để xem chi tiết và tiếp tục nhắn tin.</Typography>
            </Box>
            <Box sx={{ p: 1.5, maxHeight: { xs: "none", lg: "calc(100vh - 296px)" }, overflowY: "auto" }}>
              {loading && myConversations.length === 0 ? (
                <Stack alignItems="center" spacing={1.2} sx={{ py: 6 }}>
                  <CircularProgress size={26} />
                  <Typography sx={{ color: mutedText }}>Đang tải cuộc trò chuyện...</Typography>
                </Stack>
              ) : myConversations.length === 0 ? (
                <Stack alignItems="center" spacing={1.2} sx={{ py: 7 }}>
                  <ChatBubbleOutline sx={{ color: mutedText }} />
                  <Typography sx={{ color: mutedText }}>Bạn chưa có cuộc trò chuyện nào.</Typography>
                  <Button variant="contained" onClick={() => navigate('/support/create')}>Tạo cuộc trò chuyện đầu tiên</Button>
                </Stack>
              ) : (
                <Stack spacing={1.1}>
                  {myConversations.map((item: SupportConversation) => {
                    const active = item.id === selectedConversationId;
                    const tone = getStatusTone(item.status);
                    return (
                      <Paper key={item.id} elevation={0} onClick={() => handleSelectConversation(item.id)} sx={{ p: 1.4, cursor: "pointer", border: `1px solid ${active ? '#f97316' : border}`, backgroundColor: active ? (isDark ? 'rgba(249,115,22,0.12)' : 'rgba(249,115,22,0.07)') : softBg, transition: 'all 0.2s ease', '&:hover': { borderColor: '#f97316' } }}>
                        <Stack direction="row" spacing={1.2} alignItems="flex-start">
                          <Avatar sx={{ bgcolor: '#fb923c', color: '#111827', width: 40, height: 40, fontWeight: 800 }}>{getInitial(item.customerName)}</Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack direction="row" justifyContent="space-between" spacing={1}>
                              <Typography fontWeight={800} noWrap>{item.subject}</Typography>
                              <Typography sx={{ color: mutedText, fontSize: 12 }}>{formatRelativeShort(item.lastMessageAt)}</Typography>
                            </Stack>
                            <Typography sx={{ color: mutedText, fontSize: 12.5, mt: 0.35 }}>{item.code}</Typography>
                            <Typography sx={{ color: mutedText, fontSize: 13, mt: 0.55, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.lastMessagePreview || 'Chua co tin nhan'}</Typography>
                            <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                              <Chip size="small" label={statusLabelMap[item.status]} sx={{ color: tone.color, bgcolor: tone.soft, border: `1px solid ${tone.color}33`, fontWeight: 800 }} />
                              <Chip size="small" label={priorityLabelMap[item.priority]} sx={{ bgcolor: altBg, border: `1px solid ${border}`, color: strongText }} />
                              {item.unreadCustomerCount > 0 && <Chip size="small" label={`${item.unreadCustomerCount} moi`} sx={{ color: '#ef4444', bgcolor: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.22)', fontWeight: 800 }} />}
                            </Stack>
                          </Box>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={0} sx={{ height: { xs: "auto", lg: "calc(100vh - 196px)" }, border: `1px solid ${border}`, backgroundColor: cardBg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: `1px solid ${border}`, bgcolor: altBg }}>
              {selectedConversation ? (
                <Stack direction="row" spacing={1.3} alignItems="center">
                  <Avatar sx={{ bgcolor: isDark ? '#1f2937' : '#111827', width: 44, height: 44 }}><SupportAgent /></Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography fontWeight={900} noWrap>{selectedConversation.subject}</Typography>
                    <Typography sx={{ color: mutedText, fontSize: 13.5 }} noWrap>
                      {selectedConversation.code} - {statusLabelMap[selectedConversation.status]} - {priorityLabelMap[selectedConversation.priority]}
                    </Typography>
                  </Box>
                  <Chip label={selectedConversation.assignedStaffName || 'Dang cho phan cong'} sx={{ bgcolor: softBg, border: `1px solid ${border}`, color: strongText }} />
                </Stack>
              ) : (
                <Typography fontWeight={800}>Chọn một cuộc trò chuyện để bắt đầu</Typography>
              )}
            </Box>

            <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: pageBg }}>
              {!selectedConversation ? (
                <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }} spacing={1.2}>
                  <ChatBubbleOutline sx={{ color: mutedText, fontSize: 34 }} />
                  <Typography sx={{ color: mutedText }}>Chọn một hội thoại ở bên trái để tiếp tục.</Typography>
                </Stack>
              ) : loading && messages.length === 0 ? (
                <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }} spacing={1.2}>
                  <CircularProgress size={26} />
                  <Typography sx={{ color: mutedText }}>Đang tải nội dung cuộc trò chuyện...</Typography>
                </Stack>
              ) : (
                <Stack spacing={1.3}>
                  <Paper elevation={0} sx={{ p: 1.3, border: `1px solid ${border}`, backgroundColor: cardBg }}>
                    <Typography fontWeight={800} fontSize={13}>Thông tin nhanh</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                      <Chip label={`Tao luc: ${formatDateTime(selectedConversation.createdAt)}`} sx={{ bgcolor: softBg, border: `1px solid ${border}`, color: strongText }} />
                      <Chip label={`Cap nhat: ${formatDateTime(selectedConversation.updatedAt)}`} sx={{ bgcolor: softBg, border: `1px solid ${border}`, color: strongText }} />
                      <Chip label={`Uu tien: ${priorityLabelMap[selectedConversation.priority]}`} sx={{ bgcolor: softBg, border: `1px solid ${border}`, color: strongText }} />
                    </Stack>
                  </Paper>

                  {messages.map((m: any) => {
                    const isCustomer = m.senderType === 'CUSTOMER';
                    const bubbleBg = isCustomer
  ? isDark
    ? "#1f2937"
    : "#e5e7eb"
  : cardBg;
                    const bubbleColor = isCustomer ? '#ffffff' : strongText;
                    const isImage = m.attachmentType?.startsWith('image/');
                    const isVideo = m.attachmentType?.startsWith('video/');
                    return (
                      <Stack key={m.id} alignItems={isCustomer ? 'flex-end' : 'flex-start'}>
                        <Box sx={{ maxWidth: '78%', px: 1.5, py: 1.2, bgcolor: bubbleBg, color: "bubbleColor", border: `1px solid ${isCustomer ? '#111827' : border}` }}>
                          <Typography fontWeight={800} fontSize={13}>{m.senderName}</Typography>
                          {!!m.content && <Typography sx={{ mt: 0.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{m.content}</Typography>}
                          {m.attachmentUrl && isImage && <Box component="img" src={m.attachmentUrl} alt={m.attachmentName || 'attachment'} onClick={() => setPreviewImage(m.attachmentUrl)} sx={{ mt: 1, width: '100%', maxHeight: 280, objectFit: 'cover', cursor: 'zoom-in' }} />}
                          {m.attachmentUrl && isVideo && <Box component="video" src={m.attachmentUrl} controls sx={{ mt: 1, width: '100%', maxHeight: 320 }} />}
                          {m.attachmentUrl && !isImage && !isVideo && <Button size="small" href={m.attachmentUrl} target="_blank" rel="noreferrer" sx={{ mt: 1, px: 0, color: bubbleColor }}>Mo tep dinh kem</Button>}
                          <Typography sx={{ mt: 0.6, fontSize: 11, opacity: 0.72 }}>{formatDateTime(m.createdAt)}</Typography>
                        </Box>
                      </Stack>
                    );
                  })}
                </Stack>
              )}
            </Box>

            <Divider />

            <Box sx={{ p: 2, pr: { xs: 2, lg: 12 }, bgcolor: altBg }}>
              {attachmentFile && (
                <Paper elevation={0} sx={{ mb: 1.2, p: 1.2, border: `1px solid ${border}`, bgcolor: softBg }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    {attachmentFile.type.startsWith('video/') ? <SmartDisplay sx={{ color: '#f97316' }} /> : <ImageOutlined sx={{ color: '#f97316' }} />}
                    <Typography fontWeight={700}>{attachmentFile.name}</Typography>
                    <Typography sx={{ color: mutedText, fontSize: 12 }}>({Math.round(attachmentFile.size / 1024)} KB)</Typography>
                  </Stack>
                  {attachmentFile.type.startsWith('image/') && previewUrl && <Box component="img" src={previewUrl} alt="preview" sx={{ width: '100%', maxHeight: 200, objectFit: 'cover' }} />}
                  {attachmentFile.type.startsWith('video/') && previewUrl && <Box component="video" src={previewUrl} controls sx={{ width: '100%', maxHeight: 220 }} />}
                  <Button size="small" color="inherit" sx={{ mt: 1 }} onClick={() => setAttachmentFile(null)}>Xóa tệp đính kèm</Button>
                </Paper>
              )}

              {(uploadingAttachment || actionLoading) && <Alert severity="info" sx={{ mb: 1.2 }}>{uploadingAttachment ? 'Đang tải tệp đính kèm...' : 'Đang gửi tin nhắn...'}</Alert>}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={5}
                  placeholder={selectedConversation ? 'Nhập nội dung để tiếp tục hội thoại...' : 'Chọn hội thoại trước khi gửi tin nhắn'}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={!selectedConversation || actionLoading || uploadingAttachment}
                />
                <Stack direction={{ xs: 'row', sm: 'column' }} spacing={1}>
                  <Button component="label" variant="outlined" disabled={!selectedConversation || actionLoading || uploadingAttachment} sx={{ minWidth: 58 }}>
                    <AttachFile />
                    <input hidden type="file" accept="image/*,video/*" onChange={handleSelectFile} />
                  </Button>
                  <Button variant="contained" onClick={handleSend} disabled={!selectedConversation || (!message.trim() && !attachmentFile) || actionLoading || uploadingAttachment} sx={{ minWidth: 58 }}>
                    {uploadingAttachment || actionLoading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Dialog open={!!previewImage} onClose={() => setPreviewImage("")} maxWidth="lg">
        <Box sx={{ bgcolor: isDark ? "#0b0b0b" : "#ffffff", p: 1 }}>
          {previewImage && (
            <Box component="img" src={previewImage} alt="preview-large" sx={{ maxWidth: "90vw", maxHeight: "88vh", display: "block" }} />
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default CustomerSupportChat;



