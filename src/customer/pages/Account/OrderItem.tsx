import {
  Cancel,
  CheckCircle,
  CreditCard,
  ElectricBolt,
  Inventory,
  LocalShipping,
  Pending,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Modal,
  Snackbar,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { Order, OrderStatus } from "../../../types/OrderType";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";
import { api } from "../../../config/Api";
import { useAppDispatch } from "../../../state/Store";
import { getPaymentOrderStatus } from "../../../state/customer/orderSlice";

type PaymentState = "PENDING" | "SUCCESS" | "EXPIRED" | "FAILED";

type SepayInfoState = {
  paymentOrderId: number | string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  paymentCode: string;
};

type RetryPaymentResponse = {
  orderId: number;
  orderCode: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotalPrice: number;
  shippingFee: number;
  couponDiscount: number;
  totalPrice: number;
  couponCode?: string | null;
  message?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  paymentCode?: string | null;
  paymentOrderId?: number | null;
};

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: 680,
  bgcolor: "transparent",
  borderRadius: 0,
  boxShadow: "none",
  p: 0,
};

const getStatusConfig = (status: OrderStatus, isDark: boolean) => {
  const palette = {
    neutral: isDark ? "#e5e7eb" : "#111827",
    muted: isDark ? "#94a3b8" : "#64748b",
    subtle: isDark ? "#cbd5e1" : "#334155",
    success: isDark ? "#d1d5db" : "#1f2937",
    danger: isDark ? "#cbd5e1" : "#334155",
  };

  switch (status) {
    case "PENDING":
      return {
        color: palette.subtle,
        icon: <Pending fontSize="small" />,
        label: "Chờ xác nhận",
        subLabel: "Đơn hàng đang chờ người bán xử lý.",
      };
    case "PENDING_PAYMENT":
      return {
        color: palette.subtle,
        icon: <Pending fontSize="small" />,
        label: "Chờ thanh toán",
        subLabel: "Hoàn tất thanh toán để tiếp tục đơn hàng.",
      };
    case "PLACED":
      return {
        color: palette.neutral,
        icon: <Inventory fontSize="small" />,
        label: "Đã đặt hàng",
        subLabel: "Hệ thống đã ghi nhận đơn của bạn.",
      };
    case "CONFIRMED":
      return {
        color: palette.neutral,
        icon: <ElectricBolt fontSize="small" />,
        label: "Đã xác nhận",
        subLabel: "Người bán đã xác nhận sản phẩm trong đơn.",
      };
    case "SHIPPED":
      return {
        color: palette.subtle,
        icon: <LocalShipping fontSize="small" />,
        label: "Đã gửi hàng",
        subLabel: "Đơn đang trong quá trình vận chuyển.",
      };
    case "ARRIVING":
      return {
        color: palette.subtle,
        icon: <LocalShipping fontSize="small" />,
        label: "Sắp giao",
        subLabel: "Đơn sẽ được giao trong thời gian ngắn.",
      };
    case "DELIVERED":
      return {
        color: palette.success,
        icon: <CheckCircle fontSize="small" />,
        label: "Đã giao hàng",
        subLabel: "Đơn hàng đã được giao thành công.",
      };
    case "CANCELLED":
      return {
        color: palette.danger,
        icon: <Cancel fontSize="small" />,
        label: "Đã hủy",
        subLabel: "Đơn hàng này đã bị hủy.",
      };
    default:
      return {
        color: palette.muted,
        icon: <Pending fontSize="small" />,
        label: "Không xác định",
        subLabel: "Trạng thái chưa được cập nhật.",
      };
  }
};

const getPaymentStatusConfig = (
  paymentMethod?: string,
  paymentStatus?: string,
  isDark?: boolean
) => {
  const dark = Boolean(isDark);

  if (paymentMethod === "COD" && paymentStatus !== "SUCCESS") {
    return {
      label: "Thanh toán khi nhận hàng",
      chipLabel: "COD",
      color: dark ? "#cbd5e1" : "#334155",
      bg: dark ? "rgba(255,255,255,0.04)" : "#f8fafc",
    };
  }

  switch (paymentStatus) {
    case "SUCCESS":
      return {
        label: "Đã thanh toán",
        chipLabel: "Đã thanh toán",
        color: dark ? "#d1d5db" : "#111827",
        bg: dark ? "rgba(255,255,255,0.04)" : "#f8fafc",
      };
    case "FAILED":
      return {
        label: "Thanh toán thất bại",
        chipLabel: "Thất bại",
        color: dark ? "#e5e7eb" : "#1f2937",
        bg: dark ? "rgba(255,255,255,0.04)" : "#fff7ed",
      };
    case "PENDING":
    default:
      return {
        label: paymentMethod === "SEPAY" ? "Chưa thanh toán" : "Đang chờ",
        chipLabel: paymentMethod === "SEPAY" ? "Chưa thanh toán" : "Đang chờ",
        color: dark ? "#cbd5e1" : "#334155",
        bg: dark ? "rgba(255,255,255,0.04)" : "#f8fafc",
      };
  }
};

const OrderItem = ({ order }: { order: Order }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isDark } = useSiteThemeMode();

  const [loadingRetry, setLoadingRetry] = useState(false);
  const [sepayInfo, setSepayInfo] = useState<SepayInfoState | null>(null);
  const [remainingTime, setRemainingTime] = useState(180);
  const [paymentStatus, setPaymentStatus] = useState<PaymentState>("PENDING");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "error",
  });

  const textPrimary = isDark ? "#ffffff" : "#0f172a";
  const textSecondary = isDark ? "#94a3b8" : "#64748b";
  const textMuted = isDark ? "#cbd5e1" : "#334155";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const bgCard = isDark ? "#141414" : "#ffffff";
  const bgItem = isDark ? "rgba(255,255,255,0.03)" : "#f8fafc";
  const shadow = isDark
    ? "0 18px 40px rgba(0,0,0,0.18)"
    : "0 18px 40px rgba(15,23,42,0.08)";

  const statusConfig = getStatusConfig(order.orderStatus, isDark);
  const paymentConfig = getPaymentStatusConfig(
    order.paymentMethod,
    order.paymentStatus,
    isDark
  );

  const deliveryLabel =
    order.orderStatus === "DELIVERED"
      ? "Đã giao ngày "
      : order.orderStatus === "ARRIVING"
      ? "Dự kiến giao trước "
      : "Dự kiến giao vào ";

  const formattedDate = order.deliveryDate
    ? format(new Date(order.deliveryDate), "dd/MM/yyyy")
    : "Đang cập nhật";

  const totalItems = order.orderItems?.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const formatVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);

  const isReturnAvailable = (deliveryDate?: string) => {
    if (!deliveryDate) return false;

    const delivered = new Date(deliveryDate);
    if (Number.isNaN(delivered.getTime())) return false;

    const deadline = new Date(delivered);
    deadline.setDate(deadline.getDate() + 7);

    return new Date() <= deadline;
  };

  const canReturn =
    order.orderStatus === "DELIVERED" &&
    isReturnAvailable(order.deliveryDate);

const canRetryPayment = useMemo(() => {
  return (
    order.paymentMethod === "SEPAY" &&
    (order.paymentStatus === "PENDING" || order.paymentStatus === "FAILED") &&
    order.orderStatus !== "CANCELLED"
  );
}, [order]);;

  const secondaryButtonSx = {
    textTransform: "none",
    borderRadius: "999px",
    fontSize: "0.95rem",
    fontWeight: 700,
    px: 2.5,
    borderColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(15,23,42,0.14)",
    color: isDark ? "#ffffff" : "#0f172a",
    backgroundColor: "transparent",
    boxShadow: "none",
    "&:hover": {
      borderColor: isDark ? "rgba(255,255,255,0.32)" : "rgba(15,23,42,0.24)",
      backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.04)",
      boxShadow: "none",
    },
  };

  const primaryButtonSx = {
    textTransform: "none",
    borderRadius: "999px",
    fontSize: "0.95rem",
    fontWeight: 800,
    px: 2.8,
    background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    color: "#fff",
    boxShadow: "none",
    "&:hover": {
      background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
      boxShadow: "none",
    },
  };

  const buildSepayInfoFromResponse = (
    data: RetryPaymentResponse
  ): SepayInfoState | null => {
    if (!data?.paymentOrderId || !data?.paymentCode || !data?.totalPrice) {
      return null;
    }

    return {
      paymentOrderId: data.paymentOrderId,
      bankName: data.bankName ?? "ACB",
      accountNumber: data.accountNumber ?? "10310717",
      accountName: data.accountName ?? "NHTHI SHOPPING",
      amount: Number(data.totalPrice),
      paymentCode: data.paymentCode,
    };
  };

  const handleRetryPayment = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    try {
      setLoadingRetry(true);

      const res = await api.post<RetryPaymentResponse>(
        `/api/orders/${order.id}/retry-payment`
      );

      const data = res.data;
      const extracted = buildSepayInfoFromResponse(data);

      if (!extracted) {
        throw new Error("Không nhận được thông tin thanh toán.");
      }

      setSepayInfo(extracted);
      setPaymentStatus("PENDING");
      setShowSuccessMessage(false);

      setSnackbar({
        open: true,
        message: data.message || "Đã tạo lại thanh toán. Vui lòng quét QR.",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message:
          error?.response?.data?.message ||
          error?.response?.data ||
          error?.message ||
          "Không thể thanh toán lại đơn hàng",
        severity: "error",
      });
    } finally {
      setLoadingRetry(false);
    }
  };

  useEffect(() => {
    if (!sepayInfo) return;

    setRemainingTime(180);
    setPaymentStatus("PENDING");
    setShowSuccessMessage(false);

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentStatus("EXPIRED");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sepayInfo]);

  useEffect(() => {
    if (!sepayInfo?.paymentOrderId || paymentStatus !== "PENDING") return;

    const interval = setInterval(async () => {
      try {
        const res = await dispatch(
          getPaymentOrderStatus(String(sepayInfo.paymentOrderId))
        ).unwrap();

        const status = res?.status as PaymentState;

        if (status === "SUCCESS") {
          setPaymentStatus("SUCCESS");
          setShowSuccessMessage(true);
          clearInterval(interval);

          setTimeout(() => {
            setSepayInfo(null);
            navigate("/ordersuccess");
          }, 2500);
        }

        if (status === "EXPIRED") {
          setPaymentStatus("EXPIRED");
          clearInterval(interval);
        }

        if (status === "FAILED") {
          setPaymentStatus("FAILED");
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Polling retry payment error:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch, navigate, paymentStatus, sepayInfo]);

  return (
    <>
      <div
        onClick={() => navigate(`${order.id}`)}
        className="cursor-pointer space-y-5 rounded-[1.8rem] p-5 transition lg:p-6"
        style={{
          background: bgCard,
          border: `1px solid ${borderColor}`,
          boxShadow: shadow,
        }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
          <div className="flex gap-4">
            <Avatar
              sx={{
                bgcolor: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9",
                color: statusConfig.color,
                width: 54,
                height: 54,
              }}
            >
              {statusConfig.icon}
            </Avatar>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className="text-xl font-black tracking-tight"
                  style={{ color: textPrimary }}
                >
                  {statusConfig.label}
                </h3>

                <Chip
                  label={`#${order.orderCode || order.id}`}
                  size="small"
                  sx={{
                    borderRadius: "999px",
                    border: `1px solid ${borderColor}`,
                    color: textSecondary,
                    backgroundColor: bgItem,
                    fontWeight: 700,
                  }}
                />

                <Chip
                  label={paymentConfig.chipLabel}
                  size="small"
                  icon={<CreditCard sx={{ fontSize: 16 }} />}
                  sx={{
                    borderRadius: "999px",
                    border: `1px solid ${borderColor}`,
                    color: paymentConfig.color,
                    backgroundColor: paymentConfig.bg,
                    fontWeight: 800,
                  }}
                />
              </div>

              <p style={{ color: textSecondary }}>{statusConfig.subLabel}</p>

              {canRetryPayment && (
                <p style={{ color: textSecondary }}>
                  Đơn chưa được thanh toán. Bạn có thể thanh toán lại để hệ thống
                  xác nhận đơn hàng.
                </p>
              )}

              <p style={{ color: textSecondary }}>
                {deliveryLabel}
                <span style={{ color: textPrimary, fontWeight: 600 }}>
                  {formattedDate}
                </span>
              </p>

              {totalItems ? (
                <p style={{ color: textSecondary }}>
                  Số lượng sản phẩm:{" "}
                  <span style={{ color: textPrimary, fontWeight: 600 }}>
                    {totalItems}
                  </span>
                </p>
              ) : null}

              <p style={{ color: textSecondary }}>
                Phương thức thanh toán:{" "}
                <span style={{ color: textPrimary, fontWeight: 700 }}>
                  {order.paymentMethod === "SEPAY"
                    ? "Thanh toán trực tuyến"
                    : "Thanh toán khi nhận hàng"}
                </span>
              </p>

              <p style={{ color: textSecondary }}>
                Trạng thái thanh toán:{" "}
                <span style={{ color: textPrimary, fontWeight: 700 }}>
                  {paymentConfig.label}
                </span>
              </p>
            </div>
          </div>

          <div className="text-left lg:text-right">
            <p
              className="text-sm font-semibold uppercase"
              style={{ color: textSecondary }}
            >
              Tổng tiền
            </p>
            <p
              className="text-2xl font-black"
              style={{ color: textPrimary }}
            >
              {formatVND(order.totalPrice)}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {order.orderItems?.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-[1.3rem] p-4"
              style={{
                background: bgItem,
                border: `1px solid ${borderColor}`,
              }}
            >
              <img
                alt={item.product?.title}
                src={item.product?.images?.[0]}
                className="h-24 w-20 rounded-xl object-cover"
              />

              <div className="flex-1 space-y-2">
                <h3
                  className="line-clamp-2 text-lg font-bold"
                  style={{ color: textPrimary }}
                >
                  {item.product?.title}
                </h3>

                <p style={{ color: textSecondary }}>
                  {item.product?.seller?.businessDetails?.businessName ||
                    "NHTHI Fit"}
                </p>

                <div
                  className="flex flex-wrap gap-4"
                  style={{ color: textSecondary }}
                >
                  <p>
                    Size:{" "}
                    <span style={{ color: textMuted, fontWeight: 600 }}>
                      {item.size?.name || "Không có"}
                    </span>
                  </p>
                  <p>
                    SL:{" "}
                    <span style={{ color: textMuted, fontWeight: 600 }}>
                      {item.quantity}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <p
                    className="text-lg font-black"
                    style={{ color: textPrimary }}
                  >
                    {formatVND(item.sellingPrice || 0)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Box className="flex flex-wrap justify-end gap-3">
          <Button
            variant="outlined"
            size="small"
            sx={secondaryButtonSx}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/account/orders/${order.id}`);
            }}
          >
            Xem chi tiết
          </Button>

          {canRetryPayment && (
            <Button
              variant="contained"
              size="small"
              sx={primaryButtonSx}
              disabled={loadingRetry}
              onClick={handleRetryPayment}
            >
              {loadingRetry ? "Đang tạo thanh toán..." : "Thanh toán lại"}
            </Button>
          )}

          {order.orderStatus === "DELIVERED" && (
            <Button
              variant="outlined"
              size="small"
              sx={secondaryButtonSx}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/account/orders/${order.id}/review`);
              }}
            >
              Viết đánh giá
            </Button>
          )}

          {canReturn && (
            <Button
              variant="outlined"
              size="small"
              sx={secondaryButtonSx}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/account/orders/${order.id}`);
              }}
            >
              Trả hàng
            </Button>
          )}
        </Box>
      </div>

      <Modal
        open={!!sepayInfo}
        onClose={() => {
          if (paymentStatus !== "SUCCESS") setSepayInfo(null);
        }}
      >
        <Box sx={modalStyle}>
          <div
            className={`mx-auto w-[95%] max-w-[420px] rounded-[1.8rem] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.25)] ${
              isDark
                ? "border border-orange-500/16 bg-[#111111] text-white"
                : "border border-slate-200 bg-white text-slate-900"
            }`}
          >
            {showSuccessMessage ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-full ${
                    isDark ? "bg-orange-500/12" : "bg-orange-100"
                  }`}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
                    alt="success"
                    className="h-14 w-14"
                  />
                </div>
                <h3 className="mt-4 text-2xl font-black tracking-tight text-orange-400">
                  Thanh toán thành công
                </h3>
                <p
                  className={`mt-2 text-sm leading-6 ${
                    isDark ? "text-neutral-400" : "text-slate-600"
                  }`}
                >
                  Hệ thống đang chuyển bạn đến trang xác nhận đơn hàng
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-400">
                    Thanh toán lại đơn hàng
                  </p>
                  <h2
                    className={`text-2xl font-black tracking-tight ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Quét QR để chuyển khoản
                  </h2>
                  <p
                    className={`text-sm ${
                      isDark ? "text-neutral-400" : "text-slate-600"
                    }`}
                  >
                    Mã đơn: #{order.orderCode || order.id}
                  </p>
                </div>

                <div
                  className={`mt-5 overflow-hidden rounded-[1.5rem] border p-4 ${
                    isDark
                      ? "border-white/8 bg-white"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <img
                    className="mx-auto h-56 w-56"
                    alt="QR Payment"
                    src={`https://qr.sepay.vn/img?acc=LOCSPAY000336637&bank=${
                      sepayInfo?.bankName || "ACB"
                    }&amount=${sepayInfo?.amount || 0}&des=${
                      sepayInfo?.paymentCode || ""
                    }`}
                  />
                </div>

                <Divider
                  sx={{
                    my: 3,
                    borderColor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(15,23,42,0.08)",
                  }}
                />

                <div
                  className={`space-y-2 text-sm ${
                    isDark ? "text-neutral-300" : "text-slate-600"
                  }`}
                >
                  <p>
                    <b className={isDark ? "text-white" : "text-slate-900"}>
                      Ngân hàng:
                    </b>{" "}
                    {sepayInfo?.bankName}
                  </p>
                  <p>
                    <b className={isDark ? "text-white" : "text-slate-900"}>
                      Số TK:
                    </b>{" "}
                    {sepayInfo?.accountNumber}
                  </p>
                  <p>
                    <b className={isDark ? "text-white" : "text-slate-900"}>
                      Chủ TK:
                    </b>{" "}
                    {sepayInfo?.accountName}
                  </p>
                  <p className="font-semibold text-orange-400">
                    Nội dung: {sepayInfo?.paymentCode}
                  </p>
                  <p
                    className={`text-base font-black ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Số tiền: {(sepayInfo?.amount || 0).toLocaleString()}đ
                  </p>
                </div>

                <Alert severity="info" sx={{ mt: 2 }}>
                  Hệ thống sẽ tự động xác nhận sau khi giao dịch thành công.
                </Alert>

                <p
                  className={`mt-3 text-center text-sm ${
                    isDark ? "text-neutral-400" : "text-slate-600"
                  }`}
                >
                  Thời gian còn lại:{" "}
                  <b
                    className={
                      remainingTime <= 30 ? "text-red-400" : "text-orange-400"
                    }
                  >
                    {Math.floor(remainingTime / 60)}:
                    {(remainingTime % 60).toString().padStart(2, "0")}
                  </b>
                </p>

                {paymentStatus === "EXPIRED" && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Phiên thanh toán đã hết hạn. Vui lòng bấm thanh toán lại.
                  </Alert>
                )}

                {paymentStatus === "FAILED" && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Thanh toán thất bại. Vui lòng thử lại.
                  </Alert>
                )}
              </>
            )}
          </div>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default OrderItem;