import {
  Cancel,
  CheckCircle,
  ElectricBolt,
  Inventory,
  LocalShipping,
  Pending,
} from "@mui/icons-material";
import { Avatar, Button, Chip } from "@mui/material";
import React from "react";
import { Order, OrderStatus } from "../../../types/OrderType";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return {
        color: "#f59e0b",
        icon: <Pending fontSize="small" />,
        label: "Chờ xác nhận",
        subLabel: "Đơn hàng đang chờ người bán xử lý.",
      };
    case "PENDING_PAYMENT":
      return {
        color: "#f59e0b",
        icon: <Pending fontSize="small" />,
        label: "Chờ thanh toán",
        subLabel: "Hoàn tất thanh toán để tiếp tục đơn hàng.",
      };
    case "PLACED":
      return {
        color: "#fb923c",
        icon: <Inventory fontSize="small" />,
        label: "Đã đặt hàng",
        subLabel: "Hệ thống đã ghi nhận đơn của bạn.",
      };
    case "CONFIRMED":
      return {
        color: "#f97316",
        icon: <ElectricBolt fontSize="small" />,
        label: "Đã xác nhận",
        subLabel: "Người bán đã xác nhận sản phẩm trong đơn.",
      };
    case "SHIPPED":
      return {
        color: "#fdba74",
        icon: <LocalShipping fontSize="small" />,
        label: "Đã gửi hàng",
        subLabel: "Đơn đang trong quá trình vận chuyển.",
      };
    case "ARRIVING":
      return {
        color: "#fb923c",
        icon: <LocalShipping fontSize="small" />,
        label: "Sắp giao",
        subLabel: "Đơn sẽ được giao trong thời gian ngắn.",
      };
    case "DELIVERED":
      return {
        color: "#22c55e",
        icon: <CheckCircle fontSize="small" />,
        label: "Đã giao hàng",
        subLabel: "Đơn hàng đã được giao thành công.",
      };
    case "CANCELLED":
      return {
        color: "#ef4444",
        icon: <Cancel fontSize="small" />,
        label: "Đã hủy",
        subLabel: "Đơn hàng này đã bị hủy.",
      };
    default:
      return {
        color: "#94a3b8",
        icon: <Pending fontSize="small" />,
        label: "Không xác định",
        subLabel: "Trạng thái chưa được cập nhật.",
      };
  }
};

const OrderItem = ({ order }: { order: Order }) => {
  const navigate = useNavigate();
  const statusConfig = getStatusConfig(order.orderStatus);

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

  return (
    <div
      className="space-y-5 rounded-[1.8rem] border border-orange-500/12 bg-[#141414] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition hover:border-orange-400/25 cursor-pointer lg:p-6"
      onClick={() => navigate(`${order.id}`)}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <Avatar
            sx={{ bgcolor: statusConfig.color, width: 52, height: 52 }}
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
                label={`#${order.id}`}
                size="small"
                sx={{
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#cbd5e1",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  fontWeight: 700,
                }}
              />
            </div>
            <p className="text-base leading-7 text-slate-300">
              {statusConfig.subLabel}
            </p>
            <p className="text-base text-slate-400">
              {deliveryLabel}
              <span className="font-semibold text-white">
                {formattedDate}
              </span>
            </p>
            {totalItems ? (
              <p className="text-base text-slate-400">
                Số lượng sản phẩm:{" "}
                <span className="font-semibold text-white">
                  {totalItems}
                </span>
              </p>
            ) : null}
          </div>
        </div>

        <div className="text-left lg:text-right">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            Tổng tiền
          </p>
          <p className="mt-1 text-2xl font-black text-orange-400">
            {formatVND(order.totalPrice)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {order.orderItems?.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-[1.3rem] border border-white/6 bg-black/20 p-4"
          >
            <img
              alt={item.product?.title}
              src={item.product?.images?.[0]}
              className="h-24 w-20 rounded-xl object-cover border border-white/6"
            />
            <div className="min-w-0 flex-1 space-y-2">
              <h3 className="line-clamp-2 text-lg font-bold text-white">
                {item.product?.title}
              </h3>
              <p className="text-base text-slate-400">
                {item.product?.seller?.businessDetails?.businessName ||
                  "NHTHI Fit"}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-base text-slate-300">
                <p>
                  Kích thước:{" "}
                  <span className="font-semibold text-white">
                    {item.size?.name || "Không có"}
                  </span>
                </p>
                <p>
                  Số lượng:{" "}
                  <span className="font-semibold text-white">
                    {item.quantity}
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <p className="text-lg font-black text-orange-400">
                  {formatVND(item.sellingPrice || 0)}
                </p>
                {!!item.mrpPrice && item.mrpPrice > item.sellingPrice && (
                  <>
                    <p className="text-sm font-semibold text-slate-500 line-through">
                      {formatVND(item.mrpPrice)}
                    </p>
                    <p className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-orange-200">
                      Giam {formatVND((item.mrpPrice - item.sellingPrice) * (item.quantity || 1))}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {order.orderStatus === "DELIVERED" && (
        <div className="flex justify-end pt-1">
          <Button
            variant="outlined"
            size="small"
            sx={{
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
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/account/orders/${order.id}/review`);
            }}
          >
            Viết đánh giá
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderItem;
