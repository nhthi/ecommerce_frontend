import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  MenuItem,
  Snackbar,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  cancelReturnRequest,
  fetchMyReturnRequests,
  markReturnCustomerShipped,
} from "../../../../state/customer/returnRequestSlice";
import { useAppDispatch, useAppSelector } from "../../../../state/Store";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";
import { Close } from "@mui/icons-material";

const STATUS_FILTERS = [
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

type ShippingFormState = {
  trackingCode: string;
  carrier: string;
  shipmentNote: string;
};

const MyReturnRequestsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isDark } = useSiteThemeMode();

  const { myRequests, loading, actionLoading, error } = useAppSelector(
    (store) => store.returnRequestSlice
  );

  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [expandedId, setExpandedId] = useState<number | false>(false);

  const [shippingForms, setShippingForms] = useState<
    Record<number, ShippingFormState>
  >({});
const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    dispatch(fetchMyReturnRequests());
  }, [dispatch]);

  useEffect(() => {
    const approvedRequests = myRequests.filter(
      (request) => request.status === "APPROVED"
    );

    setShippingForms((prev) => {
      const next = { ...prev };

      approvedRequests.forEach((request) => {
        if (!next[request.id]) {
          next[request.id] = {
            trackingCode: request.returnTrackingCode || "",
            carrier: request.returnCarrier || "",
            shipmentNote: request.returnShipmentNote || "",
          };
        }
      });

      return next;
    });
  }, [myRequests]);

  const formatVND = (value: number | undefined) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);

  const formatDate = (value?: string | null) => {
    if (!value) return "Đang cập nhật";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Đang cập nhật";
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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

  const filteredRequests = useMemo(() => {
    let data = [...myRequests];

    if (statusFilter) {
      data = data.filter((request) => request.status === statusFilter);
    }

    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword) {
      data = data.filter((request) => {
        const baseText = [
          request.id,
          request.orderId,
          request.status,
          request.note,
          request.adminNote,
          request.returnTrackingCode,
          request.returnCarrier,
          request.returnShipmentNote,
        ]
          .join(" ")
          .toLowerCase();

        const itemsText = (request.items || [])
          .map(
            (item) =>
              `${item.productName || ""} ${item.sizeName || ""} ${
                item.orderItemId || ""
              }`
          )
          .join(" ")
          .toLowerCase();

        return baseText.includes(keyword) || itemsText.includes(keyword);
      });
    }

    data.sort((a, b) => {
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
  }, [myRequests, searchKeyword, sortBy, statusFilter]);

  const handleCancel = async (id: number) => {
    try {
      await dispatch(cancelReturnRequest(id)).unwrap();
      setSnackbar({
        open: true,
        message: "Hủy yêu cầu trả hàng thành công.",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: typeof err === "string" ? err : "Không thể hủy yêu cầu lúc này.",
        severity: "error",
      });
    }
  };

  const handleShippingFieldChange = (
    requestId: number,
    field: keyof ShippingFormState,
    value: string
  ) => {
    setShippingForms((prev) => ({
      ...prev,
      [requestId]: {
        trackingCode: prev[requestId]?.trackingCode || "",
        carrier: prev[requestId]?.carrier || "",
        shipmentNote: prev[requestId]?.shipmentNote || "",
        [field]: value,
      },
    }));
  };

  const handleCustomerShipped = async (id: number) => {
    const form = shippingForms[id] || {
      trackingCode: "",
      carrier: "",
      shipmentNote: "",
    };

    if (!form.trackingCode.trim()) {
      setSnackbar({
        open: true,
        message: "Vui lòng nhập mã vận đơn trước khi xác nhận gửi hàng trả.",
        severity: "error",
      });
      return;
    }

    try {
      await dispatch(
        markReturnCustomerShipped({
          id,
          trackingCode: form.trackingCode.trim(),
          carrier: form.carrier.trim(),
          shipmentNote: form.shipmentNote.trim(),
        })
      ).unwrap();

      setSnackbar({
        open: true,
        message: "Đã cập nhật trạng thái khách gửi hàng trả.",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message:
          typeof err === "string"
            ? err
            : "Không thể cập nhật trạng thái lúc này.",
        severity: "error",
      });
    }
  };

  const handleAccordionChange =
    (id: number) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedId(isExpanded ? id : false);
    };

  const cardBg = isDark ? "#141414" : "#ffffff";
  const subCardBg = isDark ? "rgba(0,0,0,0.2)" : "rgba(15,23,42,0.04)";
  const borderColor = isDark
    ? "rgba(249,115,22,0.12)"
    : "rgba(15,23,42,0.08)";
  const innerBorderColor = isDark
    ? "rgba(255,255,255,0.06)"
    : "rgba(15,23,42,0.08)";
  const titleColor = isDark ? "#ffffff" : "#0f172a";
  const textColor = isDark ? "#cbd5e1" : "#475569";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const shadow = isDark
    ? "0 20px 60px rgba(0,0,0,0.18)"
    : "0 20px 60px rgba(15,23,42,0.08)";

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
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2
                className="text-3xl font-black"
                style={{ color: titleColor }}
              >
                Yêu cầu trả hàng của tôi
              </h2>
            </div>

            <Button
              variant="outlined"
              sx={secondaryButtonSx}
              onClick={() => navigate("/account/orders")}
            >
              Đơn hàng của tôi
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <TextField
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo mã yêu cầu, mã đơn, sản phẩm..."
              sx={filterFieldSx(isDark)}
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={filterFieldSx(isDark)}
            >
              {STATUS_FILTERS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={filterFieldSx(isDark)}
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
          }}
        >
          <p className="text-xl font-bold" style={{ color: titleColor }}>
            Không có yêu cầu phù hợp
          </p>
          <p className="mt-2" style={{ color: mutedColor }}>
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
          </p>
          <Button
            variant="outlined"
            sx={{ ...secondaryButtonSx, mt: 3 }}
            onClick={() => {
              setSearchKeyword("");
              setStatusFilter("");
              setSortBy("newest");
            }}
          >
            Xóa bộ lọc
          </Button>
        </section>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((request) => (
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
                  py: 1.2,
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
                      className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xl"
                      style={{ color: textColor }}
                    >
                      <p>Đơn hàng #{request.orderCode || request.orderId}</p>
                      <p>Ngày tạo: {formatDate(request.requestedAt)}</p>
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

                <div className="">
                  <div className="space-y-3 mb-4">
                    {request.items?.map((item) => (
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
                            className="mt-2 flex flex-wrap gap-4 text-xl"
                            style={{ color: textColor }}
                          >
                            <p>
                              Kích thước:{" "}
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

                          <p className="mt-2 text-xl font-bold text-orange-400">
                            Hoàn: {formatVND(item.refundAmount)}
                          </p>
                        </div>
                      </div>
                    ))}
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
                        className="text-xl font-bold uppercase tracking-[0.12em]"
                        style={{ color: mutedColor }}
                      >
                        Thông tin yêu cầu
                      </p>
                      <div
                        className="mt-3 space-y-2 text-xl"
                        style={{ color: textColor }}
                      >
                        <p>
                          Trạng thái:{" "}
                          <span
                            className="font-semibold"
                            style={{
                              color: getReturnStatusColor(request.status),
                            }}
                          >
                            {getReturnStatusLabel(request.status)}
                          </span>
                        </p>
                        <p>Ngày tạo: {formatDateTime(request.requestedAt)}</p>
                        <p>Lý do: {request.reasonCode || "Không có"}</p>

                        {request.customerShippedAt && (
                          <p>
                            Khách gửi hàng lúc:{" "}
                            {formatDateTime(request.customerShippedAt)}
                          </p>
                        )}

                        {request.returnTrackingCode && (
                          <p>
                            Mã vận đơn:{" "}
                            <span
                              className="font-semibold"
                              style={{ color: titleColor }}
                            >
                              {request.returnTrackingCode}
                            </span>
                          </p>
                        )}

                        {request.returnCarrier && (
                          <p>
                            Đơn vị vận chuyển:{" "}
                            <span
                              className="font-semibold"
                              style={{ color: titleColor }}
                            >
                              {request.returnCarrier}
                            </span>
                          </p>
                        )}

                        {request.returnShipmentNote && (
                          <p>Ghi chú gửi trả: {request.returnShipmentNote}</p>
                        )}
                      </div>
                    </div>

                    {(request.note || request.adminNote) && (
                      <div className="grid gap-3">
                        {request.note && (
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
                              Ghi chú của bạn
                            </p>
                            <p
                              className="mt-2 text-xl"
                              style={{ color: textColor }}
                            >
                              {request.note}
                            </p>
                          </div>
                        )}

                        {request.adminNote && (
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
                              Ghi chú từ shop
                            </p>
                            <p
                              className="mt-2 text-xl"
                              style={{ color: textColor }}
                            >
                              {request.adminNote}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

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
                        <div className="mt-3 grid grid-cols-2 gap-3">
  {request.imageUrls.map((url) => (
    <button
      key={url}
      type="button"
      onClick={() => setPreviewImage(url)}
      className="overflow-hidden rounded-xl"
      style={{ border: `1px solid ${innerBorderColor}` }}
    >
      <img
        src={url}
        alt="return-proof"
        className="h-50 w-full object-fit transition hover:scale-105"
      />
    </button>
  ))}
</div>

                      </div>
                    )}
<Dialog
  open={!!previewImage}
  onClose={() => setPreviewImage(null)}
  maxWidth="md"
  fullWidth
>
  <DialogContent className="relative p-2">
    <IconButton
      onClick={() => setPreviewImage(null)}
      sx={{
        position: "absolute",
        right: 8,
        top: 8,
        zIndex: 10,
        bgcolor: "rgba(0,0,0,0.45)",
        color: "#fff",
        "&:hover": {
          bgcolor: "rgba(0,0,0,0.65)",
        },
      }}
    >
      <Close />
    </IconButton>

    {previewImage && (
      <img
        src={previewImage}
        alt="preview"
        className="max-h-[80vh] w-full rounded-lg object-contain"
      />
    )}
  </DialogContent>
</Dialog>
                    {request.status === "APPROVED" && (
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
                          Thông tin gửi hàng trả
                        </p>

                        <div className="mt-3 space-y-3">
                          <TextField
                            fullWidth
                            label="Mã vận đơn"
                            placeholder="Nhập mã vận đơn trả hàng"
                            value={shippingForms[request.id]?.trackingCode || ""}
                            onChange={(e) =>
                              handleShippingFieldChange(
                                request.id,
                                "trackingCode",
                                e.target.value
                              )
                            }
                            sx={filterFieldSx(isDark)}
                          />

                          <TextField
                            fullWidth
                            label="Đơn vị vận chuyển"
                            placeholder="Ví dụ: GHN, GHTK, Viettel Post..."
                            value={shippingForms[request.id]?.carrier || ""}
                            onChange={(e) =>
                              handleShippingFieldChange(
                                request.id,
                                "carrier",
                                e.target.value
                              )
                            }
                            sx={filterFieldSx(isDark)}
                          />

                          <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="Ghi chú gửi trả"
                            placeholder="Nhập ghi chú thêm nếu có"
                            value={shippingForms[request.id]?.shipmentNote || ""}
                            onChange={(e) =>
                              handleShippingFieldChange(
                                request.id,
                                "shipmentNote",
                                e.target.value
                              )
                            }
                            sx={filterFieldSx(isDark)}
                          />

                          <p className="text-sm" style={{ color: mutedColor }}>
                            Sau khi gửi hàng cho shop, vui lòng nhập thông tin
                            vận chuyển và xác nhận để shop dễ theo dõi hơn.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    variant="outlined"
                    sx={secondaryButtonSx}
                    onClick={() => navigate(`/account/orders/${request.orderId}`)}
                  >
                    Xem đơn hàng
                  </Button>

                  {request.status === "REQUESTED" && (
                    <Button
                      variant="outlined"
                      color="error"
                      disabled={actionLoading}
                      sx={dangerButtonSx}
                      onClick={() => handleCancel(request.id)}
                    >
                      Hủy yêu cầu
                    </Button>
                  )}

                  {request.status === "APPROVED" && (
                    <Button
                      variant="contained"
                      disabled={actionLoading}
                      sx={primaryButtonSx}
                      onClick={() => handleCustomerShipped(request.id)}
                    >
                      <span className="text-slate-100">
                        Xác nhận đã gửi hàng trả
                      </span>
                    </Button>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      )}

      <Snackbar
        open={!!error || snackbar.open}
        autoHideDuration={3000}
        onClose={() => {
          setSnackbar((prev) => ({ ...prev, open: false }));
        }}
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

const getReturnStatusLabel = (status?: string) => {
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

const getReturnStatusColor = (status?: string) => {
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

const filterFieldSx = (isDark: boolean) => ({
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
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#fb923c",
  },
  "& .MuiInputBase-input::placeholder": {
    color: isDark ? "#94a3b8" : "#64748b",
    opacity: 1,
  },
  "& .MuiSvgIcon-root": {
    color: isDark ? "#cbd5e1" : "#475569",
  },
});

const secondaryButtonSx = {
  textTransform: "none",
  borderRadius: "999px",
  fontSize: "0.95rem",
  fontWeight: 700,
  borderColor: "rgba(249,115,22,0.3)",
  color: "#fb923c",
  px: 2.5,
  "&:hover": {
    borderColor: "#fb923c",
    backgroundColor: "rgba(249,115,22,0.08)",
  },
};

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

const dangerButtonSx = {
  textTransform: "none",
  borderRadius: "999px",
  px: 2.5,
  fontWeight: 700,
};

export default MyReturnRequestsPage;