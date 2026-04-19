import {
  Cancel,
  CheckCircle,
  ElectricBolt,
  Inventory,
  LocalShipping,
  Pending,
} from "@mui/icons-material";
import { Avatar, Box, Button, Chip } from "@mui/material";
import React from "react";
import { Order, OrderStatus } from "../../../types/OrderType";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

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

const OrderItem = ({ order }: { order: Order }) => {
  const navigate = useNavigate();
  const { isDark } = useSiteThemeMode();

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
    }).format(value);

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

  const secondaryButtonSx = {
    textTransform: "none",
    borderRadius: "999px",
    fontSize: "0.95rem",
    fontWeight: 700,
    px: 2.5,
    borderColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(15,23,42,0.14)",
    color: isDark ? "#ffffff" : "#0f172a",
    backgroundColor: "transparent",
    "&:hover": {
      borderColor: isDark ? "rgba(255,255,255,0.32)" : "rgba(15,23,42,0.24)",
      backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.04)",
    },
  };

  return (
    <div
      onClick={() => navigate(`${order.id}`)}
      className="space-y-5 rounded-[1.8rem] cursor-pointer p-5 transition lg:p-6"
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
              width: 52,
              height: 52,
              border: `1px solid ${borderColor}`,
            }}
          >
            {statusConfig.icon}
          </Avatar>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                className="text-xl font-black"
                style={{ color: statusConfig.color }}
              >
                {statusConfig.label}
              </h2>

              <Chip
                label={`#${order?.orderCode || order.id}`}
                size="small"
                sx={{
                  borderRadius: "999px",
                  border: `1px solid ${borderColor}`,
                  color: textSecondary,
                  backgroundColor: bgItem,
                  fontWeight: 700,
                }}
              />
            </div>

            <p style={{ color: textSecondary }}>{statusConfig.subLabel}</p>

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
  );
};

export default OrderItem;