import React, { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  AssignmentInd,
  DoneAll,
  ExpandMore,
  FiberManualRecord,
  HourglassEmpty,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  PersonOutline,
  Refresh,
  Search,
  Send,
  SupportAgent,
  Visibility,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  addInternalNote,
  assignSupportConversation,
  clearSupportConversationDetail,
  fetchAdminSupportConversations,
  fetchAdminSupportFullDetail,
  markAdminSupportConversationRead,
  sendAdminSupportMessage,
  SupportConversation,
  SupportPriority,
  SupportStatus,
  updateSupportConversationStatus,
} from "../../../state/customer/supportSlice";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const statusOptions: SupportStatus[] = ["OPEN", "IN_PROGRESS", "WAITING_CUSTOMER", "RESOLVED", "CLOSED"];
const priorityOptions: SupportPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const statusLabelMap: Record<SupportStatus, string> = {
  OPEN: "Mới mở",
  IN_PROGRESS: "Đang xử lý",
  WAITING_CUSTOMER: "Chờ khách phản hồi",
  RESOLVED: "Đã xử lý",
  CLOSED: "Đã đóng",
};

const priorityLabelMap: Record<SupportPriority, string> = {
  LOW: "Thấp",
  MEDIUM: "Trung bình",
  HIGH: "Cao",
  URGENT: "Khẩn cấp",
};

const channelLabelMap: Record<string, string> = {
  CHAT: "Chat",
  CONTACT_FORM: "Biểu mẫu",
  ORDER_SUPPORT: "Hỗ trợ đơn hàng",
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

const getPriorityTone = (priority: SupportPriority) => {
  switch (priority) {
    case "LOW":
      return { color: "#94a3b8", soft: "rgba(148,163,184,0.18)" };
    case "MEDIUM":
      return { color: "#38bdf8", soft: "rgba(56,189,248,0.16)" };
    case "HIGH":
      return { color: "#f59e0b", soft: "rgba(245,158,11,0.16)" };
    case "URGENT":
      return { color: "#ef4444", soft: "rgba(239,68,68,0.16)" };
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
  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;
  return `${Math.floor(diffHour / 24)} ngày trước`;
};

const getInitial = (name?: string | null) => (name ? name.trim().charAt(0).toUpperCase() : "?");

const AdminSupportPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isDark } = useSiteThemeMode();
  const {
    loading,
    actionLoading,
    error,
    conversations,
    conversationFullDetail,
    totalPages,
    totalElements,
    currentPage,
  } = useAppSelector((store) => store.supportSlice);

  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [staffIdInput, setStaffIdInput] = useState("");
  const [staffIdFilter, setStaffIdFilter] = useState("");
  const [page, setPage] = useState(0);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [internalNoteText, setInternalNoteText] = useState("");
  const [assignStaffId, setAssignStaffId] = useState("");
  const [localStatus, setLocalStatus] = useState<string>("");

  const pageBg = isDark ? "#0b0b0b" : "#f7f8fc";
  const cardBg = isDark ? "#141414" : "#ffffff";
  const altBg = isDark ? "#101010" : "#f8fafc";
  const softBg = isDark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
  const strongText = isDark ? "#ffffff" : "#0f172a";
  const mutedText = isDark ? "#94a3b8" : "#64748b";
  const cardSx = {
    borderRadius: 0,
    border: `1px solid ${border}`,
    backgroundColor: cardBg,
    color: strongText,
    boxShadow: isDark ? "0 16px 40px rgba(0,0,0,0.28)" : "0 16px 32px rgba(15,23,42,0.08)",
  };

  useEffect(() => {
    dispatch(
      fetchAdminSupportConversations({
        page,
        size: 20,
        keyword,
        status: selectedStatus ? (selectedStatus as SupportStatus) : undefined,
        priority: selectedPriority ? (selectedPriority as SupportPriority) : undefined,
        staffId: staffIdFilter ? Number(staffIdFilter) : undefined,
      })
    );
  }, [dispatch, keyword, page, selectedPriority, selectedStatus, staffIdFilter]);

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
    if (selectedConversationId && conversations.length > 0 && !conversations.some((item) => item.id === selectedConversationId)) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  useEffect(() => {
    if (!selectedConversationId) return;
    dispatch(fetchAdminSupportFullDetail(selectedConversationId));
    dispatch(markAdminSupportConversationRead(selectedConversationId));
  }, [dispatch, selectedConversationId]);

  useEffect(() => {
    if (conversationFullDetail?.conversation?.status) {
      setLocalStatus(conversationFullDetail.conversation.status);
    }
  }, [conversationFullDetail]);

  useEffect(() => () => {
    dispatch(clearSupportConversationDetail());
  }, [dispatch]);

  const selectedConversation = conversationFullDetail?.conversation ?? null;
  const messages = conversationFullDetail?.messages ?? [];
  const assignmentHistories = conversationFullDetail?.assignmentHistories ?? [];

  const openCount = useMemo(
    () => conversations.filter((item) => item.status === "OPEN" || item.status === "IN_PROGRESS").length,
    [conversations]
  );
  const unreadCount = useMemo(
    () => conversations.reduce((total, item) => total + (item.unreadStaffCount || 0), 0),
    [conversations]
  );
  const urgentCount = useMemo(
    () => conversations.filter((item) => item.priority === "URGENT").length,
    [conversations]
  );

  const handleSearch = () => {
    setPage(0);
    setKeyword(searchInput.trim());
    setStaffIdFilter(staffIdInput.trim());
  };

  const refreshList = () => {
    dispatch(
      fetchAdminSupportConversations({
        page,
        size: 20,
        keyword,
        status: selectedStatus ? (selectedStatus as SupportStatus) : undefined,
        priority: selectedPriority ? (selectedPriority as SupportPriority) : undefined,
        staffId: staffIdFilter ? Number(staffIdFilter) : undefined,
      })
    );
  };

  const handleRefresh = () => {
    refreshList();
    if (selectedConversationId) {
      dispatch(fetchAdminSupportFullDetail(selectedConversationId));
    }
  };

  const handleSendReply = async () => {
    if (!selectedConversationId || !replyText.trim()) return;
    await dispatch(
      sendAdminSupportMessage({
        conversationId: selectedConversationId,
        content: replyText.trim(),
        messageType: "TEXT",
      })
    );
    setReplyText("");
    dispatch(fetchAdminSupportFullDetail(selectedConversationId));
  };

  const handleAddInternalNote = async () => {
    if (!selectedConversationId || !internalNoteText.trim()) return;
    await dispatch(addInternalNote({ conversationId: selectedConversationId, content: internalNoteText.trim() }));
    setInternalNoteText("");
    dispatch(fetchAdminSupportFullDetail(selectedConversationId));
  };

  const handleAssignConversation = async () => {
    if (!selectedConversationId || !assignStaffId.trim()) return;
    await dispatch(
      assignSupportConversation({
        conversationId: selectedConversationId,
        staffId: Number(assignStaffId),
        note: "Phan cong tu trang admin support",
      })
    );
    dispatch(fetchAdminSupportFullDetail(selectedConversationId));
    refreshList();
  };

  const handleUpdateStatus = async () => {
    if (!selectedConversationId || !localStatus) return;
    await dispatch(
      updateSupportConversationStatus({
        conversationId: selectedConversationId,
        status: localStatus as SupportStatus,
      })
    );
    dispatch(fetchAdminSupportFullDetail(selectedConversationId));
    refreshList();
  };

  const renderToneChip = (label: string, tone: { color: string; soft: string }) => (
    <Chip
      size="small"
      label={label}
      sx={{
        height: 28,
        borderRadius: 999,
        color: tone.color,
        bgcolor: tone.soft,
        border: `1px solid ${tone.color}33`,
        fontWeight: 800,
      }}
    />
  );

  return (
    <Box sx={{ p: { xs: 1.5, md: 2.5 }, bgcolor: pageBg, minHeight: "100vh" }}>
      <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2, md: 2.5 }, mb: 2 }}>
        <Stack direction={{ xs: "column", xl: "row" }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 900 }}>Quản lý hỗ trợ khách hàng</Typography>

          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Paper elevation={0} sx={{ p: 1.4, minWidth: 128, borderRadius: 0, bgcolor: softBg, border: `1px solid ${border}` }}>
              <Typography sx={{ color: mutedText, fontSize: 12 }}>Đang xử lý</Typography>
              <Typography sx={{ fontWeight: 900, fontSize: 24 }}>{openCount}</Typography>
            </Paper>
            <Paper elevation={0} sx={{ p: 1.4, minWidth: 128, borderRadius: 0, bgcolor: softBg, border: `1px solid ${border}` }}>
              <Typography sx={{ color: mutedText, fontSize: 12 }}>Tin chưa đọc</Typography>
              <Typography sx={{ fontWeight: 900, fontSize: 24 }}>{unreadCount}</Typography>
            </Paper>
            <Paper elevation={0} sx={{ p: 1.4, minWidth: 128, borderRadius: 0, bgcolor: softBg, border: `1px solid ${border}` }}>
              <Typography sx={{ color: mutedText, fontSize: 12 }}>Ưu tiên cao</Typography>
              <Typography sx={{ fontWeight: 900, fontSize: 24 }}>{urgentCount}</Typography>
            </Paper>
            <Button variant="outlined" startIcon={<Refresh />} onClick={handleRefresh} disabled={loading || actionLoading} sx={{ borderRadius: 0, color: strongText }}>
              Làm mới
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {error && (
        <Paper elevation={0} sx={{ ...cardSx, mb: 2, p: 1.5, borderColor: "rgba(239,68,68,0.24)", bgcolor: isDark ? "rgba(239,68,68,0.10)" : "#fef2f2" }}>
          <Typography sx={{ color: "#ef4444", fontWeight: 800 }}>{error}</Typography>
        </Paper>
      )}

      <Paper elevation={0} sx={{ ...cardSx, overflow: "hidden" }}>
        <Box sx={{ p: 2, borderBottom: `1px solid ${border}`, bgcolor: altBg }}>
          <Grid container spacing={1.2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Tìm theo mã, chủ đề, khách hàng..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 2.5 }}>
              <Select fullWidth size="small" value={selectedStatus} displayEmpty onChange={(e: SelectChangeEvent<string>) => { setPage(0); setSelectedStatus(e.target.value); }}>
                <MenuItem value="">Trạng thái</MenuItem>
                {statusOptions.map((status) => <MenuItem key={status} value={status}>{statusLabelMap[status]}</MenuItem>)}
              </Select>
            </Grid>
            <Grid size={{ xs: 6, md: 2.5 }}>
              <Select fullWidth size="small" value={selectedPriority} displayEmpty onChange={(e: SelectChangeEvent<string>) => { setPage(0); setSelectedPriority(e.target.value); }}>
                <MenuItem value="">Ưu tiên</MenuItem>
                {priorityOptions.map((priority) => <MenuItem key={priority} value={priority}>{priorityLabelMap[priority]}</MenuItem>)}
              </Select>
            </Grid>
            <Grid size={{ xs: 8, md: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Staff ID"
                value={staffIdInput}
                onChange={(e) => setStaffIdInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </Grid>
            <Grid size={{ xs: 4, md: 1 }}>
              <Button fullWidth variant="contained" onClick={handleSearch} sx={{ height: 40, minWidth: 0 }}>
                <span className="text-slate-100">
                <Search sx={{color:"#fff"}}/>
                </span>
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: altBg }}>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Chủ đề</TableCell>
                <TableCell>Kênh</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ưu tiên</TableCell>
                <TableCell>Nhân viên</TableCell>
                <TableCell>Tin gần nhất</TableCell>
                <TableCell align="right">Chi tiết</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ py: 8, textAlign: "center" }}>
                    <Stack alignItems="center" spacing={1.2}>
                      <CircularProgress size={26} />
                      <Typography sx={{ color: mutedText }}>Đang tải...</Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : conversations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ py: 8, textAlign: "center", color: mutedText }}>
                    Không có cuộc trò chuyện nào...
                  </TableCell>
                </TableRow>
              ) : (
                conversations.map((item: SupportConversation) => {
                  const active = item.id === selectedConversationId;
                  return (
                    <TableRow key={item.id} hover selected={active} sx={{ "& .MuiTableCell-root": { borderColor: border } }}>
                      <TableCell>
                        <Stack direction="row" spacing={1.1} alignItems="center">
                          <Avatar sx={{ bgcolor: "#fb923c", color: "#111827", width: 36, height: 36, fontWeight: 800 }}>{getInitial(item.customerName)}</Avatar>
                          <Box>
                            <Typography fontWeight={800}>{item.customerName}</Typography>
                            <Typography sx={{ color: mutedText, fontSize: 12 }}>{item.code}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={700}>{item.subject}</Typography>
                        <Typography sx={{ color: mutedText, fontSize: 12 }}>{item.lastMessagePreview || "Chưa có tin nhắn"}</Typography>
                      </TableCell>
                      <TableCell>{channelLabelMap[item.channel] || item.channel}</TableCell>
                      <TableCell>{renderToneChip(statusLabelMap[item.status], getStatusTone(item.status))}</TableCell>
                      <TableCell>{renderToneChip(priorityLabelMap[item.priority], getPriorityTone(item.priority))}</TableCell>
                      <TableCell>
                        <Typography fontWeight={700}>{item.assignedStaffName || "Chua phan cong"}</Typography>
                        {!!item.unreadStaffCount && <Typography sx={{ color: "#ef4444", fontSize: 12 }}>{item.unreadStaffCount} chưa đọc</Typography>}
                      </TableCell>
                      <TableCell>
                        <Typography>{formatRelativeShort(item.lastMessageAt)}</Typography>
                        <Typography sx={{ color: mutedText, fontSize: 12 }}>{formatDateTime(item.updatedAt)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
  variant={active ? "contained" : "outlined"}
  startIcon={<Visibility />}
  onClick={() => setSelectedConversationId(item.id)}
  sx={{
    borderRadius: 999,
    textTransform: "none",
    boxShadow: "none",
    ...(active
      ? {
          backgroundColor: "#111827",
          "& .MuiButton-startIcon, & .MuiSvgIcon-root": {
            color: "#fff !important",
          },
        }
      : {
          borderColor: "#cbd5e1",
          color: "#334155",
        }),
  }}
>
  <span style={{ color: active ? "#fff" : "#334155", fontWeight: 700 }}>
    Xem
  </span>
</Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Box>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 1.6, borderTop: `1px solid ${border}`, bgcolor: altBg }}>
          <Typography sx={{ color: mutedText, fontSize: 13 }}>Trang {Math.max((currentPage || 0) + 1, 1)} / {Math.max(totalPages, 1)} - {totalElements} hội thoại</Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" startIcon={<KeyboardArrowLeft />} disabled={page <= 0 || loading} onClick={() => setPage((prev) => Math.max(prev - 1, 0))}>Trước</Button>
            <Button size="small" variant="outlined" endIcon={<KeyboardArrowRight />} disabled={loading || (totalPages > 0 ? page >= totalPages - 1 : conversations.length < 20)} onClick={() => setPage((prev) => prev + 1)}>Sau</Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ ...cardSx, mt: 2, overflow: "hidden" }}>
        <Box sx={{ p: 2, borderBottom: `1px solid ${border}`, bgcolor: altBg }}>
          <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
            {selectedConversation ? `${selectedConversation.code} - ${selectedConversation.subject}` : "Chưa chọn hội thoại"}
          </Typography>
          <Typography sx={{ mt: 0.5, color: mutedText }}>
            {selectedConversation ? `Khách hàng: ${selectedConversation.customerName}` : "Chọn một dòng trong bảng để xem và xử lí."}
          </Typography>
        </Box>

        {!selectedConversation ? (
          <Box sx={{ p: 4, textAlign: "center", color: mutedText }}>Không có hội thội nào được chọn</Box>
        ) : (
          <Box sx={{ p: 2 }}>
            <Accordion defaultExpanded disableGutters elevation={0} sx={{ bgcolor: cardBg, border: `1px solid ${border}`, borderRadius: "0 !important", mb: 1.5 }}>
              <AccordionSummary expandIcon={<ExpandMore sx={{ color: mutedText }} />}>
                <Typography fontWeight={900}>Tổng quan hội thoại</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, md: 6, xl: 3 }}><Paper elevation={0} sx={{ p: 1.5, borderRadius: 0, bgcolor: softBg, border: `1px solid ${border}` }}><Stack direction="row" spacing={1} alignItems="center"><PersonOutline sx={{ color: mutedText }} /><Box><Typography sx={{ fontSize: 12, color: mutedText }}>Khách hàng</Typography><Typography fontWeight={800}>{selectedConversation.customerName}</Typography></Box></Stack></Paper></Grid>
                  <Grid size={{ xs: 12, md: 6, xl: 3 }}><Paper elevation={0} sx={{ p: 1.5, borderRadius: 0, bgcolor: softBg, border: `1px solid ${border}` }}><Stack direction="row" spacing={1} alignItems="center"><SupportAgent sx={{ color: mutedText }} /><Box><Typography sx={{ fontSize: 12, color: mutedText }}>Nhân viên</Typography><Typography fontWeight={800}>{selectedConversation.assignedStaffName || "Chưa phân công"}</Typography></Box></Stack></Paper></Grid>
                  <Grid size={{ xs: 12, md: 6, xl: 3 }}><Paper elevation={0} sx={{ p: 1.5, borderRadius: 0, bgcolor: softBg, border: `1px solid ${border}` }}><Stack direction="row" spacing={1} alignItems="center"><HourglassEmpty sx={{ color: mutedText }} /><Box><Typography sx={{ fontSize: 12, color: mutedText }}>Tạo lúc</Typography><Typography fontWeight={800}>{formatDateTime(selectedConversation.createdAt)}</Typography></Box></Stack></Paper></Grid>
                  <Grid size={{ xs: 12, md: 6, xl: 3 }}><Paper elevation={0} sx={{ p: 1.5, borderRadius: 0, bgcolor: softBg, border: `1px solid ${border}` }}><Stack direction="row" spacing={1} alignItems="center"><DoneAll sx={{ color: mutedText }} /><Box><Typography sx={{ fontSize: 12, color: mutedText }}>Cập nhật</Typography><Typography fontWeight={800}>{formatDateTime(selectedConversation.updatedAt)}</Typography></Box></Stack></Paper></Grid>
                </Grid>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
                  {renderToneChip(statusLabelMap[selectedConversation.status], getStatusTone(selectedConversation.status))}
                  {renderToneChip(priorityLabelMap[selectedConversation.priority], getPriorityTone(selectedConversation.priority))}
                  <Chip label={`Kenh: ${channelLabelMap[selectedConversation.channel] || selectedConversation.channel}`} sx={{ bgcolor: altBg, border: `1px solid ${border}` }} />
                  <Chip label={`Order ID: ${selectedConversation.orderId ?? "--"}`} sx={{ bgcolor: altBg, border: `1px solid ${border}` }} />
                  <Chip label={`Product ID: ${selectedConversation.productId ?? "--"}`} sx={{ bgcolor: altBg, border: `1px solid ${border}` }} />
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded disableGutters elevation={0} sx={{ bgcolor: cardBg, border: `1px solid ${border}`, borderRadius: "0 !important", mb: 1.5 }}>
              <AccordionSummary expandIcon={<ExpandMore sx={{ color: mutedText }} />}>
                <Typography fontWeight={900}>Tin nhắn và lịch sử</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {loading && messages.length === 0 ? (
                  <Stack alignItems="center" spacing={1.2} sx={{ py: 4 }}><CircularProgress size={24} /><Typography sx={{ color: mutedText }}>Đang tải nội dung...</Typography></Stack>
                ) : (
                  <Stack spacing={1.3}>
                    {messages.map((msg: any) => {
                      const isStaff = msg.senderType === "STAFF" || msg.senderType === "SYSTEM";
                      const isInternalNote = msg.internalNote;
                      const bubbleBg = isInternalNote
  ? (isDark ? "rgba(249,115,22,0.12)" : "#fff7ed")
  : isStaff
    ? softBg
    : (isDark ? "#111827" : "#f3f4f6");
                      const bubbleColor = isInternalNote ? "#f97316" : isStaff ? strongText : "#ffffff";
                      return (
                        <Stack key={msg.id} alignItems={isInternalNote ? "center" : isStaff ? "flex-start" : "flex-end"}>
                          <Box sx={{ maxWidth: isInternalNote ? "92%" : "78%", px: 1.5, py: 1.2, borderRadius: 0, bgcolor: bubbleBg, color: bubbleColor, border: `1px solid ${isInternalNote ? "rgba(249,115,22,0.22)" : isStaff ? border : "#111827"}` }}>
                            <Typography fontWeight={800} fontSize={13}>{isInternalNote ? `Ghi chú nội bộ - ${msg.senderName}` : msg.senderName}</Typography>
                            <Typography fontSize={11} sx={{ opacity: 0.72, mt: 0.2 }}>{formatDateTime(msg.createdAt)}</Typography>
                            <Typography sx={{ mt: 0.75, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.content}</Typography>
                            {msg.attachmentUrl && <Button size="small" href={msg.attachmentUrl} target="_blank" rel="noreferrer" sx={{ mt: 1, px: 0, color: bubbleColor }}>Xem tệp đính kèm</Button>}
                          </Box>
                        </Stack>
                      );
                    })}
                    {messages.length === 0 && <Typography sx={{ color: mutedText }}>Chua co tin nhan nao.</Typography>}
                  </Stack>
                )}
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded disableGutters elevation={0} sx={{ bgcolor: cardBg, border: `1px solid ${border}`, borderRadius: "0 !important", mb: 1.5 }}>
              <AccordionSummary expandIcon={<ExpandMore sx={{ color: mutedText }} />}>
                <Typography fontWeight={900}>Xử lý hỗ trợ</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1.6}>
                  <Grid size={{ xs: 12, xl: 6 }}>
                    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 0, bgcolor: softBg, border: `1px solid ${border}`, height: "100%" }}>
                      <Typography fontWeight={900} fontSize={14} sx={{ mb: 1 }}>Phản hồi khách hàng</Typography>
                      <Stack direction="row" spacing={1}>
                        <TextField fullWidth multiline minRows={3} maxRows={6} placeholder="Nhập nội dung phản hồi..." value={replyText} onChange={(e) => setReplyText(e.target.value)} disabled={actionLoading} />
                        <Button variant="contained" onClick={handleSendReply} disabled={!replyText.trim() || actionLoading} sx={{ minWidth: 58 }}>
                          {actionLoading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                        </Button>
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, xl: 6 }}>
                    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 0, bgcolor: softBg, border: `1px solid ${border}`, height: "100%" }}>
                      <Typography fontWeight={900} fontSize={14} sx={{ mb: 1 }}>Ghi chú nội bộ</Typography>
                      <Stack direction="row" spacing={1}>
                        <TextField fullWidth multiline minRows={3} maxRows={5} placeholder="Nhập ghi chú chỉ nội bộ thấy..." value={internalNoteText} onChange={(e) => setInternalNoteText(e.target.value)} disabled={actionLoading} />
                        <Button variant="outlined" onClick={handleAddInternalNote} disabled={!internalNoteText.trim() || actionLoading}>Lưu</Button>
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 0, bgcolor: softBg, border: `1px solid ${border}` }}>
                      <Typography fontWeight={900} fontSize={14} sx={{ mb: 1 }}>Cập nhật trạng thái</Typography>
                      <Stack spacing={1}>
                        <Select fullWidth size="small" value={localStatus} onChange={(e: SelectChangeEvent<string>) => setLocalStatus(e.target.value)}>
                          {statusOptions.map((status) => <MenuItem key={status} value={status}>{statusLabelMap[status]}</MenuItem>)}
                        </Select>
                        <Button
  variant="contained"
  onClick={handleUpdateStatus}
  disabled={!localStatus || actionLoading}
  sx={{
    color: "#fff !important",
    "& .MuiButton-label": {
      color: "#fff !important",
    },
    "& .MuiSvgIcon-root": {
      color: "#fff !important",
    },
  }}
>
  <span style={{ color: "#fff", fontWeight: 700 }}>Cập nhật trạng thái</span>
</Button>
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 0, bgcolor: softBg, border: `1px solid ${border}` }}>
                      <Typography fontWeight={900} fontSize={14} sx={{ mb: 1 }}>Phân công nhân viên</Typography>
                      <Stack spacing={1}>
                        <TextField fullWidth size="small" label="Staff ID" value={assignStaffId} onChange={(e) => setAssignStaffId(e.target.value)} />
                        <Button variant="outlined" startIcon={<AssignmentInd />} onClick={handleAssignConversation} disabled={!assignStaffId.trim() || actionLoading}>Phân công</Button>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion disableGutters elevation={0} sx={{ bgcolor: cardBg, border: `1px solid ${border}`, borderRadius: "0 !important" }}>
              <AccordionSummary expandIcon={<ExpandMore sx={{ color: mutedText }} />}>
                <Typography fontWeight={900}>Lịch sử phân công</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {assignmentHistories.length === 0 ? (
                  <Typography sx={{ color: mutedText }}>Chưa có lịch sử phân công.</Typography>
                ) : (
                  <Stack spacing={1.1}>
                    {assignmentHistories.map((history: any) => (
                      <Paper key={history.id} elevation={0} sx={{ p: 1.2, borderRadius: 0, bgcolor: softBg, border: `1px solid ${border}` }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <FiberManualRecord sx={{ fontSize: 10, color: "#fb923c" }} />
                          <Typography fontWeight={800} fontSize={13}>{history.fromStaffName || "Chua co"}{" -> "}{history.toStaffName || "Chưa có"}</Typography>
                        </Stack>
                        <Typography sx={{ mt: 0.5, color: mutedText, fontSize: 13 }}>Người phân công: {history.assignedByName || "--"}</Typography>
                        {history.note && <Typography sx={{ mt: 0.4, fontSize: 13 }}>Ghi chú: {history.note}</Typography>}
                        <Typography sx={{ mt: 0.5, color: mutedText, fontSize: 12 }}>{formatDateTime(history.createdAt)}</Typography>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AdminSupportPage;

