import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Pagination,
  Snackbar,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useMemo, useState } from "react";
import {
  completeReturnRequest,
  fetchAdminReturnRequests,
  markReturnReceived,
  markReturnRefunded,
  reviewReturnRequest,
} from "../../../state/customer/returnRequestSlice";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

type ReturnRequestStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "CUSTOMER_SHIPPED"
  | "RECEIVED"
  | "REFUNDED"
  | "COMPLETED"
  | "CANCELLED";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "REQUESTED", label: "Đã gửi yêu cầu" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Bị từ chối" },
  { value: "CUSTOMER_SHIPPED", label: "Khách đã gửi hàng trả" },
  { value: "RECEIVED", label: "Shop đã nhận hàng trả" },
  { value: "REFUNDED", label: "Đã hoàn tiền" },
  { value: "COMPLETED", label: "Hoàn tất" },
  { value: "CANCELLED", label: "Đã hủy" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "refund_desc", label: "Hoàn tiền cao nhất" },
  { value: "refund_asc", label: "Hoàn tiền thấp nhất" },
];

const PAGE_SIZE = 6;

const AdminReturnRequestPage = () => {
  const dispatch = useAppDispatch();
  const { auth, returnRequestSlice } = useAppSelector((store) => store);
  const { isDark } = useSiteThemeMode();

  const { adminRequests, loading, actionLoading, error } = returnRequestSlice;
  const currentUser = auth.user;

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedId, setExpandedId] = useState<number | false>(false);
  const [page, setPage] = useState(1);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    dispatch(fetchAdminReturnRequests(selectedStatus || undefined));
  }, [dispatch, selectedStatus]);

  useEffect(() => {
    setPage(1);
  }, [keyword, selectedStatus, sortBy]);

  const cardBg = isDark ? "#141414" : "#ffffff";
  const subCardBg = isDark ? "rgba(0,0,0,0.2)" : "rgba(15,23,42,0.04)";
  const borderColor = isDark
    ? "rgba(249,115,22,0.12)"
    : "rgba(15,23,42,0.08)";
  const innerBorderColor = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(15,23,42,0.08)";
  const titleColor = isDark ? "#ffffff" : "#0f172a";
  const textColor = isDark ? "#cbd5e1" : "#475569";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const shadow = isDark
    ? "0 20px 60px rgba(0,0,0,0.18)"
    : "0 20px 60px rgba(15,23,42,0.08)";

  const filteredRequests = useMemo(() => {
    let data = [...adminRequests];

    const q = keyword.trim().toLowerCase();
    if (q) {
      data = data.filter((request: any) => {
        const orderId = String(request.orderId || "");
        const requestId = String(request.id || "");
        const userId = String(request.userId || "");
        const reasonCode = String(request.reasonCode || "").toLowerCase();
        const note = String(request.note || "").toLowerCase();
        const adminNoteText = String(request.adminNote || "").toLowerCase();

        const itemText = (request.items || [])
          .map(
            (item: any) =>
              `${item.productName || ""} ${item.sizeName || ""} ${item.orderItemId || ""}`.toLowerCase()
          )
          .join(" ");

        return (
          orderId.includes(q) ||
          requestId.includes(q) ||
          userId.includes(q) ||
          reasonCode.includes(q) ||
          note.includes(q) ||
          adminNoteText.includes(q) ||
          itemText.includes(q)
        );
      });
    }

    data.sort((a: any, b: any) => {
      const timeA = a.requestedAt ? new Date(a.requestedAt).getTime() : 0;
      const timeB = b.requestedAt ? new Date(b.requestedAt).getTime() : 0;
      const refundA = a.refundAmount || 0;
      const refundB = b.refundAmount || 0;

      switch (sortBy) {
        case "oldest":
          return timeA - timeB;
        case "refund_desc":
          return refundB - refundA;
        case "refund_asc":
          return refundA - refundB;
        case "newest":
        default:
          return timeB - timeA;
      }
    });

    return data;
  }, [adminRequests, keyword, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE));
  const paginatedRequests = filteredRequests.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const formatVND = (value: number | undefined) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);

  const formatDateTime = (value?: string | null) => {
    if (!value) return "Đang cập nhật";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Đang cập nhật";
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isAdmin =
    currentUser?.role === "ROLE_ADMIN" || currentUser?.role === "ADMIN";
  const isStaff =
    currentUser?.role === "ROLE_STAFF" || currentUser?.role === "STAFF";

  const openReviewDialog = (request: any, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setReviewAction(action);
    setAdminNote("");
    setReviewDialogOpen(true);
  };

  const handleReview = async () => {
    if (!selectedRequest || !reviewAction) return;

    try {
      await dispatch(
        reviewReturnRequest({
          id: selectedRequest.id,
          approved: reviewAction === "approve",
          adminNote,
        })
      ).unwrap();

      setSnackbar({
        open: true,
        message:
          reviewAction === "approve"
            ? "Đã duyệt yêu cầu trả hàng."
            : "Đã từ chối yêu cầu trả hàng.",
        severity: "success",
      });

      setReviewDialogOpen(false);
      setSelectedRequest(null);
      setReviewAction(null);
      setAdminNote("");
    } catch (err: any) {
      setSnackbar({
        open: true,
        message:
          typeof err === "string" ? err : "Không thể cập nhật yêu cầu trả hàng.",
        severity: "error",
      });
    }
  };

  const handleMarkReceived = async (requestId: number) => {
    try {
      await dispatch(markReturnReceived(requestId)).unwrap();
      setSnackbar({
        open: true,
        message: "Đã cập nhật trạng thái shop nhận hàng trả.",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message:
          typeof err === "string"
            ? err
            : "Không thể cập nhật trạng thái nhận hàng trả.",
        severity: "error",
      });
    }
  };

  const handleRefunded = async (requestId: number) => {
    try {
      await dispatch(markReturnRefunded(requestId)).unwrap();
      setSnackbar({
        open: true,
        message: "Đã cập nhật trạng thái hoàn tiền.",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message:
          typeof err === "string"
            ? err
            : "Không thể cập nhật trạng thái hoàn tiền.",
        severity: "error",
      });
    }
  };

  const handleComplete = async (requestId: number) => {
    try {
      await dispatch(completeReturnRequest(requestId)).unwrap();
      setSnackbar({
        open: true,
        message: "Đã hoàn tất yêu cầu trả hàng.",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message:
          typeof err === "string"
            ? err
            : "Không thể hoàn tất yêu cầu trả hàng.",
        severity: "error",
      });
    }
  };

  const handleAccordionChange =
    (id: number) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedId(isExpanded ? id : false);
    };

  return (
    <Box className="space-y-6">
      <section
        className="rounded-[1.8rem] px-6 py-5 lg:px-7"
        style={{
          backgroundColor: cardBg,
          border: `1px solid ${borderColor}`,
          boxShadow: shadow,
        }}
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-black" style={{ color: titleColor }}>
                Quản lý trả hàng
              </h2>
              <p className="mt-2" style={{ color: textColor }}>
                Theo dõi, xét duyệt và cập nhật trạng thái các yêu cầu trả hàng từ khách hàng.
              </p>
            </div>

            <div className="text-sm" style={{ color: mutedColor }}>
              Tổng: <span style={{ color: titleColor, fontWeight: 700 }}>{filteredRequests.length}</span> yêu cầu
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <TextField
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo mã yêu cầu, mã đơn, sản phẩm..."
              sx={fieldSx(isDark)}
              slotProps={{
                input: {
                  startAdornment: (
                    <SearchIcon sx={{ color: mutedColor, mr: 1 }} />
                  ),
                },
              }}
            />

            <TextField
              select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              sx={fieldSx(isDark)}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={fieldSx(isDark)}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </div>
      </section>

      {loading ? (
        <section
          className="rounded-[1.8rem] p-8 text-center"
          style={{
            backgroundColor: cardBg,
            border: `1px solid ${borderColor}`,
            boxShadow: shadow,
            color: mutedColor,
          }}
        >
          Đang tải danh sách yêu cầu trả hàng...
        </section>
      ) : filteredRequests.length === 0 ? (
        <section
          className="rounded-[1.8rem] p-8 text-center"
          style={{
            backgroundColor: cardBg,
            border: `1px solid ${borderColor}`,
            boxShadow: shadow,
            color: mutedColor,
          }}
        >
          Không có yêu cầu trả hàng nào phù hợp.
        </section>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedRequests.map((request: any) => (
              <Accordion
                key={request.id}
                expanded={expandedId === request.id}
                onChange={handleAccordionChange(request.id)}
                disableGutters
                sx={{
                  backgroundColor: cardBg,
                  color: titleColor,
                  borderRadius: "1.4rem !important",
                  border: `1px solid ${borderColor}`,
                  boxShadow: shadow,
                  overflow: "hidden",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#fb923c" }} />}
                  sx={{
                    px: 2.5,
                    py: 1.1,
                    "& .MuiAccordionSummary-content": {
                      margin: "10px 0",
                    },
                  }}
                >
                  <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3
                          className="text-lg font-black"
                          style={{ color: titleColor }}
                        >
                          Yêu cầu #{request.id}
                        </h3>
                        <Chip
                          label={getReturnStatusLabel(request.status)}
                          size="small"
                          sx={{
                            borderRadius: "999px",
                            fontWeight: 800,
                            color: getReturnStatusColor(request.status),
                            backgroundColor: isDark
                              ? "rgba(255,255,255,0.04)"
                              : "rgba(15,23,42,0.04)",
                            border: `1px solid ${innerBorderColor}`,
                          }}
                        />
                      </div>

                      <div
                        className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm"
                        style={{ color: textColor }}
                      >
                        <p>Đơn hàng #{request.orderId}</p>
                        <p>Người dùng #{request.userId}</p>
                        <p>Ngày tạo: {formatDateTime(request.requestedAt)}</p>
                        <p>{request.items?.length || 0} sản phẩm</p>
                      </div>
                    </div>

                    <div className="text-left lg:text-right">
                      <p
                        className="text-xs font-semibold uppercase tracking-[0.14em]"
                        style={{ color: mutedColor }}
                      >
                        Hoàn dự kiến
                      </p>
                      <p className="mt-1 text-xl font-black text-orange-400">
                        {formatVND(request.refundAmount)}
                      </p>
                    </div>
                  </div>
                </AccordionSummary>

                <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
                  <Divider sx={{ borderColor, mb: 3 }} />

                  <div className="grid gap-4 xl:grid-cols-[1.2fr_0.9fr]">
                    <div className="space-y-3">
                      {(request.items || []).map((item: any) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-3 rounded-[1.2rem] p-3 sm:flex-row"
                          style={{
                            backgroundColor: subCardBg,
                            border: `1px solid ${innerBorderColor}`,
                          }}
                        >
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="h-24 w-20 rounded-xl object-cover"
                            style={{ border: `1px solid ${innerBorderColor}` }}
                          />

                          <div className="min-w-0 flex-1">
                            <p
                              className="line-clamp-2 text-base font-bold"
                              style={{ color: titleColor }}
                            >
                              {item.productName}
                            </p>

                            <div
                              className="mt-2 flex flex-wrap gap-4 text-sm"
                              style={{ color: textColor }}
                            >
                              <p>
                                OrderItem ID:{" "}
                                <span
                                  className="font-semibold"
                                  style={{ color: titleColor }}
                                >
                                  {item.orderItemId}
                                </span>
                              </p>
                              <p>
                                Size:{" "}
                                <span
                                  className="font-semibold"
                                  style={{ color: titleColor }}
                                >
                                  {item.sizeName || "Không có"}
                                </span>
                              </p>
                              <p>
                                Số lượng trả:{" "}
                                <span
                                  className="font-semibold"
                                  style={{ color: titleColor }}
                                >
                                  {item.quantity}
                                </span>
                              </p>
                            </div>

                            <p className="mt-2 text-sm font-bold text-orange-400">
                              Hoàn: {formatVND(item.refundAmount)}
                            </p>
                          </div>
                        </div>
                      ))}

                      {request.imageUrls?.length > 0 && (
                        <div
                          className="rounded-2xl p-4"
                          style={{
                            backgroundColor: subCardBg,
                            border: `1px solid ${innerBorderColor}`,
                          }}
                        >
                          <p
                            className="text-sm font-bold uppercase tracking-[0.12em]"
                            style={{ color: mutedColor }}
                          >
                            Ảnh minh chứng
                          </p>
                          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {request.imageUrls.map((url: string) => (
                              <img
                                key={url}
                                src={url}
                                alt="return-proof"
                                className="h-24 w-full rounded-xl object-cover"
                                style={{ border: `1px solid ${innerBorderColor}` }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div
                        className="rounded-2xl p-4"
                        style={{
                          backgroundColor: subCardBg,
                          border: `1px solid ${innerBorderColor}`,
                        }}
                      >
                        <p
                          className="text-sm font-bold uppercase tracking-[0.12em]"
                          style={{ color: mutedColor }}
                        >
                          Thông tin yêu cầu
                        </p>
                        <div className="mt-3 space-y-2 text-sm" style={{ color: textColor }}>
                          <p>
                            Trạng thái:{" "}
                            <span
                              className="font-semibold"
                              style={{ color: getReturnStatusColor(request.status) }}
                            >
                              {getReturnStatusLabel(request.status)}
                            </span>
                          </p>
                          <p>Ngày tạo: {formatDateTime(request.requestedAt)}</p>
                          {request.reviewedAt && (
                            <p>Ngày duyệt: {formatDateTime(request.reviewedAt)}</p>
                          )}
                          {request.receivedAt && (
                            <p>Ngày nhận hàng trả: {formatDateTime(request.receivedAt)}</p>
                          )}
                          {request.refundedAt && (
                            <p>Ngày hoàn tiền: {formatDateTime(request.refundedAt)}</p>
                          )}
                        </div>
                      </div>

                      <div
                        className="rounded-2xl p-4"
                        style={{
                          backgroundColor: subCardBg,
                          border: `1px solid ${innerBorderColor}`,
                        }}
                      >
                        <p
                          className="text-sm font-bold uppercase tracking-[0.12em]"
                          style={{ color: mutedColor }}
                        >
                          Lý do
                        </p>
                        <p className="mt-2 text-sm" style={{ color: textColor }}>
                          {request.reasonCode || "Không có"}
                        </p>
                      </div>

                      <div
                        className="rounded-2xl p-4"
                        style={{
                          backgroundColor: subCardBg,
                          border: `1px solid ${innerBorderColor}`,
                        }}
                      >
                        <p
                          className="text-sm font-bold uppercase tracking-[0.12em]"
                          style={{ color: mutedColor }}
                        >
                          Ghi chú khách hàng
                        </p>
                        <p className="mt-2 text-sm" style={{ color: textColor }}>
                          {request.note || "Không có ghi chú"}
                        </p>
                      </div>

                      <div
                        className="rounded-2xl p-4"
                        style={{
                          backgroundColor: subCardBg,
                          border: `1px solid ${innerBorderColor}`,
                        }}
                      >
                        <p
                          className="text-sm font-bold uppercase tracking-[0.12em]"
                          style={{ color: mutedColor }}
                        >
                          Ghi chú nội bộ
                        </p>
                        <p className="mt-2 text-sm" style={{ color: textColor }}>
                          {request.adminNote || "Chưa có"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-1">
                        {(isAdmin || isStaff) && request.status === "REQUESTED" && (
                          <>
                            <Button
                              variant="contained"
                              disabled={actionLoading}
                              sx={primaryButtonSx}
                              onClick={() => openReviewDialog(request, "approve")}
                            >
                              Duyệt
                            </Button>

                            <Button
                              variant="outlined"
                              color="error"
                              disabled={actionLoading}
                              sx={dangerOutlineButtonSx}
                              onClick={() => openReviewDialog(request, "reject")}
                            >
                              Từ chối
                            </Button>
                          </>
                        )}

                        {(isAdmin || isStaff) &&
                          request.status === "CUSTOMER_SHIPPED" && (
                            <Button
                              variant="contained"
                              disabled={actionLoading}
                              sx={primaryButtonSx}
                              onClick={() => handleMarkReceived(request.id)}
                            >
                              Xác nhận đã nhận hàng trả
                            </Button>
                          )}

                        {isAdmin && request.status === "RECEIVED" && (
                          <Button
                            variant="contained"
                            disabled={actionLoading}
                            sx={primaryButtonSx}
                            onClick={() => handleRefunded(request.id)}
                          >
                            Xác nhận hoàn tiền
                          </Button>
                        )}

                        {isAdmin && request.status === "REFUNDED" && (
                          <Button
                            variant="contained"
                            disabled={actionLoading}
                            sx={primaryButtonSx}
                            onClick={() => handleComplete(request.id)}
                          >
                            Hoàn tất yêu cầu
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>

          <Box className="flex justify-center pt-2">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_e, value) => setPage(value)}
              shape="rounded"
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: isDark ? "#fff" : "#0f172a",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(15,23,42,0.12)",
                },
              }}
            />
          </Box>
        </>
      )}

      <Dialog
        open={reviewDialogOpen}
        onClose={actionLoading ? undefined : () => setReviewDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "1.5rem",
            backgroundColor: cardBg,
            color: titleColor,
            border: `1px solid ${borderColor}`,
            boxShadow: shadow,
            overflow: "visible",
            maxHeight: "none",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: "1.3rem" }}>
          {reviewAction === "approve"
            ? "Duyệt yêu cầu trả hàng"
            : "Từ chối yêu cầu trả hàng"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Ghi chú"
            placeholder="Nhập ghi chú cho khách hàng hoặc nội bộ..."
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ ...fieldSx(isDark), mt: 1 }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setReviewDialogOpen(false)}
            sx={ghostButtonSx(isDark)}
            disabled={actionLoading}
          >
            Đóng
          </Button>
          <Button
            onClick={handleReview}
            variant="contained"
            sx={primaryButtonSx}
            disabled={actionLoading}
          >
            {actionLoading
              ? "Đang xử lý..."
              : reviewAction === "approve"
              ? "Xác nhận duyệt"
              : "Xác nhận từ chối"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open || !!error}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={error ? "error" : snackbar.severity}
          variant="filled"
          sx={{ borderRadius: "0.8rem" }}
        >
          {error || snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const getReturnStatusLabel = (status?: ReturnRequestStatus | string) => {
  switch (status) {
    case "REQUESTED":
      return "Đã gửi yêu cầu";
    case "APPROVED":
      return "Đã duyệt";
    case "REJECTED":
      return "Bị từ chối";
    case "CUSTOMER_SHIPPED":
      return "Khách đã gửi hàng trả";
    case "RECEIVED":
      return "Shop đã nhận hàng trả";
    case "REFUNDED":
      return "Đã hoàn tiền";
    case "COMPLETED":
      return "Hoàn tất";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return "Đang xử lý";
  }
};

const getReturnStatusColor = (status?: ReturnRequestStatus | string) => {
  switch (status) {
    case "REQUESTED":
      return "#f59e0b";
    case "APPROVED":
      return "#22c55e";
    case "REJECTED":
      return "#ef4444";
    case "CUSTOMER_SHIPPED":
      return "#fb923c";
    case "RECEIVED":
      return "#38bdf8";
    case "REFUNDED":
      return "#14b8a6";
    case "COMPLETED":
      return "#22c55e";
    case "CANCELLED":
      return "#94a3b8";
    default:
      return "#cbd5e1";
  }
};

const fieldSx = (isDark: boolean) => ({
  minWidth: 220,
  "& .MuiOutlinedInput-root": {
    borderRadius: "1rem",
    color: isDark ? "#fff" : "#0f172a",
    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "#ffffff",
    "& fieldset": {
      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.12)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(249,115,22,0.3)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#fb923c",
    },
  },
  "& .MuiInputLabel-root": {
    color: isDark ? "#94a3b8" : "#64748b",
  },
  "& .MuiSvgIcon-root": {
    color: isDark ? "#cbd5e1" : "#475569",
  },
  "& .MuiInputBase-input::placeholder": {
    color: isDark ? "#94a3b8" : "#64748b",
    opacity: 1,
  },
});

const primaryButtonSx = {
  textTransform: "none",
  borderRadius: "999px",
  px: 2.5,
  fontWeight: 800,
  backgroundColor: "#f97316",
  "&:hover": {
    backgroundColor: "#ea580c",
  },
};

const ghostButtonSx = (isDark: boolean) => ({
  textTransform: "none",
  borderRadius: "999px",
  color: isDark ? "#cbd5e1" : "#475569",
  px: 2.5,
});

const dangerOutlineButtonSx = {
  textTransform: "none",
  borderRadius: "999px",
  px: 2.5,
  fontWeight: 700,
};

export default AdminReturnRequestPage;