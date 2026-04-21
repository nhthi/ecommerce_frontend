import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Pagination,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import {
  completeReturnRequest,
  fetchAdminReturnRequests,
  markReturnReceived,
  markReturnRefunded,
  reviewReturnRequest,
} from "../../../state/customer/returnRequestSlice";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";
import { Download } from "@mui/icons-material";

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

const EXPORT_FIELD_OPTIONS = [
  { key: "id", label: "ID yêu cầu" },
  { key: "orderId", label: "Mã đơn hàng" },
  { key: "userId", label: "ID người dùng" },
  { key: "status", label: "Trạng thái" },
  { key: "requestedAt", label: "Ngày tạo" },
  { key: "itemCount", label: "Số sản phẩm" },
  { key: "refundAmount", label: "Hoàn dự kiến" },
  { key: "reasonCode", label: "Lý do" },
  { key: "note", label: "Ghi chú khách hàng" },
  { key: "adminNote", label: "Ghi chú nội bộ" },
  { key: "reviewedAt", label: "Ngày duyệt" },
  { key: "receivedAt", label: "Ngày nhận hàng trả" },
  { key: "refundedAt", label: "Ngày hoàn tiền" },
  { key: "items", label: "Danh sách sản phẩm" },
  { key: "customerShippedAt", label: "Khách gửi hàng lúc" },
{ key: "completedAt", label: "Ngày hoàn tất" },
{ key: "returnTrackingCode", label: "Mã vận đơn" },
{ key: "returnCarrier", label: "Đơn vị vận chuyển" },
{ key: "returnShipmentNote", label: "Ghi chú gửi trả" },
{ key: "imageUrls", label: "Ảnh minh chứng" },
] as const;

type ExportFieldKey = (typeof EXPORT_FIELD_OPTIONS)[number]["key"];

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
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(
    null
  );
  const [adminNote, setAdminNote] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedId, setExpandedId] = useState<number | false>(false);
  const [page, setPage] = useState(1);

  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [selectedExportFields, setSelectedExportFields] = useState<
    ExportFieldKey[]
  >([
    "id",
    "orderId",
    "userId",
    "status",
    "requestedAt",
    "itemCount",
    "refundAmount",
    "reasonCode",
  ]);

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
    let data = [...(adminRequests || [])];

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
              `${item.productName || ""} ${item.sizeName || ""} ${
                item.orderItemId || ""
              }`.toLowerCase()
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
          typeof err === "string"
            ? err
            : "Không thể cập nhật yêu cầu trả hàng.",
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

  const handleToggleExportField = (field: ExportFieldKey) => {
    setSelectedExportFields((prev) =>
      prev.includes(field)
        ? prev.filter((item) => item !== field)
        : [...prev, field]
    );
  };

  const handleSelectAllExportFields = () => {
    setSelectedExportFields(EXPORT_FIELD_OPTIONS.map((item) => item.key));
  };

  const handleClearAllExportFields = () => {
    setSelectedExportFields([]);
  };

  const getItemsText = (request: any) => {
    if (!Array.isArray(request.items) || !request.items.length) return "";

    return request.items
      .map((item: any) => {
        const name = item.productName || "Sản phẩm";
        const size = item.sizeName ? `Size ${item.sizeName}` : "";
        const qty =
          item.quantity !== undefined && item.quantity !== null
            ? `x${item.quantity}`
            : "";
        const refund =
          item.refundAmount !== undefined && item.refundAmount !== null
            ? `Hoàn ${formatVND(item.refundAmount)}`
            : "";
        const orderItemId = item.orderItemId
          ? `Item #${item.orderItemId}`
          : "";

        return [name, size, qty, refund, orderItemId].filter(Boolean).join(" - ");
      })
      .join(" | ");
  };

  const handleExportExcel = () => {
    const sourceRequests = filteredRequests || [];

    if (!sourceRequests.length) {
      alert("Không có dữ liệu yêu cầu trả hàng để xuất Excel");
      return;
    }

    if (!selectedExportFields.length) {
      alert("Vui lòng chọn ít nhất một mục để xuất");
      return;
    }

    const exportData = sourceRequests.map((request: any) => {
      const row: Record<string, string | number> = {};

      if (selectedExportFields.includes("id")) {
        row["ID yêu cầu"] = request.id ?? "";
      }

      if (selectedExportFields.includes("orderId")) {
        row["Mã đơn hàng"] = request.orderCode || request.orderId || "";
      }

      if (selectedExportFields.includes("userId")) {
        row["ID người dùng"] = request.userId ?? "";
      }

      if (selectedExportFields.includes("status")) {
        row["Trạng thái"] = getReturnStatusLabel(request.status);
      }

      if (selectedExportFields.includes("requestedAt")) {
        row["Ngày tạo"] = request.requestedAt
          ? format(new Date(request.requestedAt), "dd/MM/yyyy HH:mm")
          : "";
      }

      if (selectedExportFields.includes("itemCount")) {
        row["Số sản phẩm"] = Array.isArray(request.items)
          ? request.items.length
          : 0;
      }

      if (selectedExportFields.includes("refundAmount")) {
        row["Hoàn dự kiến"] = request.refundAmount ?? 0;
      }

      if (selectedExportFields.includes("reasonCode")) {
        row["Lý do"] = request.reasonCode ?? "";
      }

      if (selectedExportFields.includes("note")) {
        row["Ghi chú khách hàng"] = request.note ?? "";
      }

      if (selectedExportFields.includes("adminNote")) {
        row["Ghi chú nội bộ"] = request.adminNote ?? "";
      }

      if (selectedExportFields.includes("reviewedAt")) {
        row["Ngày duyệt"] = request.reviewedAt
          ? format(new Date(request.reviewedAt), "dd/MM/yyyy HH:mm")
          : "";
      }

      if (selectedExportFields.includes("receivedAt")) {
        row["Ngày nhận hàng trả"] = request.receivedAt
          ? format(new Date(request.receivedAt), "dd/MM/yyyy HH:mm")
          : "";
      }

      if (selectedExportFields.includes("refundedAt")) {
        row["Ngày hoàn tiền"] = request.refundedAt
          ? format(new Date(request.refundedAt), "dd/MM/yyyy HH:mm")
          : "";
      }

      if (selectedExportFields.includes("items")) {
        row["Danh sách sản phẩm"] = getItemsText(request);
      }
      if (selectedExportFields.includes("customerShippedAt")) {
  row["Khách gửi hàng lúc"] = request.customerShippedAt
    ? format(new Date(request.customerShippedAt), "dd/MM/yyyy HH:mm")
    : "";
}

if (selectedExportFields.includes("completedAt")) {
  row["Ngày hoàn tất"] = request.completedAt
    ? format(new Date(request.completedAt), "dd/MM/yyyy HH:mm")
    : "";
}

if (selectedExportFields.includes("returnTrackingCode")) {
  row["Mã vận đơn"] = request.returnTrackingCode ?? "";
}

if (selectedExportFields.includes("returnCarrier")) {
  row["Đơn vị vận chuyển"] = request.returnCarrier ?? "";
}

if (selectedExportFields.includes("returnShipmentNote")) {
  row["Ghi chú gửi trả"] = request.returnShipmentNote ?? "";
}

if (selectedExportFields.includes("imageUrls")) {
  row["Ảnh minh chứng"] = Array.isArray(request.imageUrls)
    ? request.imageUrls.join(" | ")
    : "";
}

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    worksheet["!cols"] = [
      { wch: 14 },
      { wch: 16 },
      { wch: 16 },
      { wch: 22 },
      { wch: 20 },
      { wch: 14 },
      { wch: 16 },
      { wch: 24 },
      { wch: 34 },
      { wch: 34 },
      { wch: 20 },
      { wch: 22 },
      { wch: 22 },
      { wch: 60 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ReturnRequests");

    const fileName = `return_requests_${format(
      new Date(),
      "ddMMyyyy_HHmmss"
    )}.xlsx`;

    XLSX.writeFile(workbook, fileName);
    setOpenExportDialog(false);
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
              
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Chip
                label={`${filteredRequests.length} yêu cầu`}
                sx={{
                  borderRadius: "999px",
                  color: titleColor,
                  border: `1px solid ${borderColor}`,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.03)"
                    : "#fff7ed",
                  fontWeight: 700,
                }}
              />

              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => setOpenExportDialog(true)}
                disabled={!filteredRequests.length}
                sx={ghostButtonSx(isDark)}
              >
                Xuất Excel
              </Button>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_220px_220px]">
            <TextField
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo mã đơn, mã yêu cầu, user, sản phẩm..."
              size="small"
              sx={fieldSx(isDark)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: mutedColor }} />
                ),
              }}
            />

            <TextField
              select
              label="Trạng thái"
              size="small"
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
              label="Sắp xếp"
              size="small"
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
          className="rounded-[1.8rem] px-6 py-10 text-center"
          style={{
            backgroundColor: cardBg,
            border: `1px solid ${borderColor}`,
            boxShadow: shadow,
            color: mutedColor,
          }}
        >
          Đang tải dữ liệu...
        </section>
      ) : paginatedRequests.length === 0 ? (
        <section
          className="rounded-[1.8rem] px-6 py-10 text-center"
          style={{
            backgroundColor: cardBg,
            border: `1px solid ${borderColor}`,
            boxShadow: shadow,
            color: mutedColor,
          }}
        >
          Không có yêu cầu trả hàng phù hợp.
        </section>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {paginatedRequests.map((request: any) => (
              <Accordion
                key={request.id}
                expanded={expandedId === request.id}
                onChange={handleAccordionChange(request.id)}
                disableGutters
                elevation={0}
                sx={{
                  borderRadius: "1.8rem !important",
                  overflow: "hidden",
                  border: `1px solid ${borderColor}`,
                  backgroundColor: cardBg,
                  boxShadow: shadow,
                  "&::before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: mutedColor }} />}
                  sx={{
                    px: 3,
                    py: 2.2,
                    minHeight: "unset !important",
                    "& .MuiAccordionSummary-content": {
                      margin: "0 !important",
                    },
                  }}
                >
                  <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Chip
                          label={`Yêu cầu #${request.id}`}
                          size="small"
                          sx={{
                            borderRadius: "999px",
                            fontWeight: 700,
                            color: titleColor,
                            backgroundColor: isDark
                              ? "rgba(255,255,255,0.05)"
                              : "#f8fafc",
                          }}
                        />
                        <Chip
                          label={getReturnStatusLabel(request.status)}
                          size="small"
                          sx={{
                            borderRadius: "999px",
                            fontWeight: 700,
                            color: getReturnStatusColor(request.status),
                            border: `1px solid ${getReturnStatusColor(
                              request.status
                            )}55`,
                            backgroundColor: `${getReturnStatusColor(
                              request.status
                            )}14`,
                          }}
                        />
                      </div>

                      <div
                        className="text-xl font-semibold"
                        style={{ color: titleColor }}
                      >
                        Đơn hàng #{request.orderCode || request.orderId} • User #{request.userId}
                      </div>

                      <div className="text-xl" style={{ color: mutedColor }}>
                        Tạo lúc {formatDateTime(request.requestedAt)}
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className="text-xl font-bold uppercase tracking-[0.12em]"
                        style={{ color: mutedColor }}
                      >
                        Hoàn dự kiến
                      </p>
                      <p
                        className="mt-1 text-lg font-extrabold"
                        style={{ color: titleColor }}
                      >
                        {formatVND(request.refundAmount)}
                      </p>
                    </div>
                  </div>
                </AccordionSummary>

<AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
  <Divider sx={{ mb: 2, borderColor }} />

  <div className="grid gap-4 lg:grid-cols-2">
    <div
      className="rounded-2xl p-4"
      style={{
        backgroundColor: subCardBg,
        border: `1px solid ${innerBorderColor}`,
      }}
    >
      <p
        className="text-xl font-bold uppercase tracking-[0.12em]"
        style={{ color: mutedColor }}
      >
        Thông tin xử lý
      </p>

      <div
        className="mt-3 space-y-2 text-xl"
        style={{ color: textColor }}
      >
        <p>
          <span className="font-semibold">Trạng thái:</span>{" "}
          <span style={{ color: getReturnStatusColor(request.status) }}>
            {getReturnStatusLabel(request.status)}
          </span>
        </p>
        <p>
          <span className="font-semibold">Ngày tạo:</span>{" "}
          {formatDateTime(request.requestedAt)}
        </p>
        <p>
          <span className="font-semibold">Ngày duyệt:</span>{" "}
          {formatDateTime(request.reviewedAt)}
        </p>
        <p>
          <span className="font-semibold">Khách gửi hàng lúc:</span>{" "}
          {formatDateTime(request.customerShippedAt)}
        </p>
        <p>
          <span className="font-semibold">Ngày shop nhận hàng trả:</span>{" "}
          {formatDateTime(request.receivedAt)}
        </p>
        <p>
          <span className="font-semibold">Ngày hoàn tiền:</span>{" "}
          {formatDateTime(request.refundedAt)}
        </p>
        <p>
          <span className="font-semibold">Ngày hoàn tất:</span>{" "}
          {formatDateTime(request.completedAt)}
        </p>
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
        className="text-xl font-bold uppercase tracking-[0.12em]"
        style={{ color: mutedColor }}
      >
        Lý do và ghi chú
      </p>

      <div
        className="mt-3 space-y-2 text-xl"
        style={{ color: textColor }}
      >
        <p>
          <span className="font-semibold">Lý do:</span>{" "}
          {request.reasonCode || "Chưa có"}
        </p>
        <p>
          <span className="font-semibold">Khách ghi chú:</span>{" "}
          {request.note || "Không có"}
        </p>
        <p>
          <span className="font-semibold">Nội bộ:</span>{" "}
          {request.adminNote || "Chưa có"}
        </p>
      </div>
    </div>
  </div>

  <div className="mt-4 grid gap-4 lg:grid-cols-2">
    <div
      className="rounded-2xl p-4"
      style={{
        backgroundColor: subCardBg,
        border: `1px solid ${innerBorderColor}`,
      }}
    >
      <p
        className="text-xl font-bold uppercase tracking-[0.12em]"
        style={{ color: mutedColor }}
      >
        Thông tin gửi trả
      </p>

      <div
        className="mt-3 space-y-2 text-xl"
        style={{ color: textColor }}
      >
        <p>
          <span className="font-semibold">Mã vận đơn:</span>{" "}
          {request.returnTrackingCode || "Chưa cập nhật"}
        </p>
        <p>
          <span className="font-semibold">Đơn vị vận chuyển:</span>{" "}
          {request.returnCarrier || "Chưa cập nhật"}
        </p>
        <p>
          <span className="font-semibold">Ghi chú gửi trả:</span>{" "}
          {request.returnShipmentNote || "Không có"}
        </p>
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
        className="text-xl font-bold uppercase tracking-[0.12em]"
        style={{ color: mutedColor }}
      >
        Ảnh minh chứng
      </p>

      {(request.imageUrls || []).length > 0 ? (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {request.imageUrls.map((url: string, index: number) => (
            <a
              key={`${url}-${index}`}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <img
                src={url}
                alt={`return-proof-${index + 1}`}
                className="h-28 w-full rounded-xl object-cover"
                style={{
                  border: `1px solid ${innerBorderColor}`,
                  backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#fff",
                }}
              />
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xl" style={{ color: mutedColor }}>
          Không có ảnh minh chứng.
        </p>
      )}
    </div>
  </div>

  <div
    className="mt-4 rounded-2xl p-4"
    style={{
      backgroundColor: subCardBg,
      border: `1px solid ${innerBorderColor}`,
    }}
  >
    <p
      className="text-xl font-bold uppercase tracking-[0.12em]"
      style={{ color: mutedColor }}
    >
      Sản phẩm trả hàng
    </p>

    <div className="mt-3 flex flex-col gap-3">
      {(request.items || []).length > 0 ? (
        request.items.map((item: any, index: number) => (
          <div
            key={item.orderItemId || index}
            className="rounded-2xl p-3"
            style={{
              border: `1px solid ${innerBorderColor}`,
              backgroundColor: isDark
                ? "rgba(255,255,255,0.02)"
                : "#ffffff",
            }}
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              
              <img
                src={
                  item.productImage ||
                  "https://placehold.co/120x120?text=No+Image"
                }
                alt={item.productName || "Sản phẩm"}
                className="h-24 w-24 rounded-xl object-cover"
                style={{
                  border: `1px solid ${innerBorderColor}`,
                  backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#fff",
                }}
              />

              <div className="min-w-0 flex-1">
                <div
                  className="text-xl font-semibold"
                  style={{ color: titleColor }}
                >
                  {item.productName || "Sản phẩm"}
                </div>

                <div
                  className="mt-1 text-xl"
                  style={{ color: textColor }}
                >
                  Mã item: #{item.orderItemId || "-"} • Size:{" "}
                  {item.sizeName || "-"} • Số lượng: {item.quantity ?? 0}
                </div>

                <div
                  className="mt-1 text-xl font-semibold"
                  style={{ color: titleColor }}
                >
                  Hoàn: {formatVND(item.refundAmount)}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm" style={{ color: mutedColor }}>
          Không có sản phẩm trong yêu cầu trả hàng.
        </p>
      )}
    </div>
  </div>

  <div className="flex flex-wrap gap-3 pt-4">
    {(isAdmin || isStaff) && request.status === "REQUESTED" && (
      <>
        <Button
          variant="contained"
          disabled={actionLoading}
          sx={primaryButtonSx}
          onClick={() => openReviewDialog(request, "approve")}
        >
          <span className="text-slate-100">Duyệt</span>
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

    {(isAdmin || isStaff) && request.status === "CUSTOMER_SHIPPED" && (
      <Button
        variant="contained"
        disabled={actionLoading}
        sx={primaryButtonSx}
        onClick={() => handleMarkReceived(request.id)}
      >
        <span className="text-slate-100">Xác nhận đã nhận hàng trả</span>
      </Button>
    )}

    {isAdmin && request.status === "RECEIVED" && (
      <Button
        variant="contained"
        disabled={actionLoading}
        sx={primaryButtonSx}
        onClick={() => handleRefunded(request.id)}
      >
        <span className="text-slate-100">Xác nhận hoàn tiền</span>
      </Button>
    )}

    {isAdmin && request.status === "REFUNDED" && (
      <Button
        variant="contained"
        disabled={actionLoading}
        sx={primaryButtonSx}
        onClick={() => handleComplete(request.id)}
      >
        <span className="text-slate-100">Hoàn tất yêu cầu</span>
      </Button>
    )}
  </div>
</AccordionDetails>
              </Accordion>
            ))}
          </div>

          <div className="flex justify-center">
            <Pagination
              page={page}
              count={totalPages}
              onChange={(_e, value) => setPage(value)}
              // color="primary"
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#fff",
                },
              }}
            />
          </div>
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
            <span className="text-slate-100">

            {actionLoading
              ? "Đang xử lý..."
              : reviewAction === "approve"
              ? "Xác nhận duyệt"
              : "Xác nhận từ chối"}
            </span>
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openExportDialog}
        onClose={() => setOpenExportDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "1.5rem",
            backgroundColor: cardBg,
            color: titleColor,
            border: `1px solid ${borderColor}`,
            boxShadow: shadow,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: "1.2rem" }}>
          Chọn các mục muốn xuất Excel
        </DialogTitle>

        <DialogContent>
          <Stack direction="row" spacing={1} sx={{ mb: 1.8, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              onClick={handleSelectAllExportFields}
              sx={ghostButtonSx(isDark)}
            >
              Chọn tất cả
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearAllExportFields}
              sx={ghostButtonSx(isDark)}
            >
              Bỏ chọn tất cả
            </Button>
          </Stack>

          <FormGroup>
            {EXPORT_FIELD_OPTIONS.map((field) => (
              <FormControlLabel
                key={field.key}
                control={
                  <Checkbox
                    checked={selectedExportFields.includes(field.key)}
                    onChange={() => handleToggleExportField(field.key)}
                    sx={{
                      color: "rgba(249,115,22,0.6)",
                      "&.Mui-checked": { color: "#f97316" },
                    }}
                  />
                }
                label={field.label}
                sx={{
                  color: titleColor,
                  ".MuiFormControlLabel-label": {
                    fontSize: 14.5,
                  },
                }}
              />
            ))}
          </FormGroup>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenExportDialog(false)}
            sx={ghostButtonSx(isDark)}
          >
            Hủy
          </Button>
          <Button
            onClick={handleExportExcel}
            variant="contained"

            sx={primaryButtonSx}
          >
<span className="text-slate-100"><Download /> Xuất file</span>
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