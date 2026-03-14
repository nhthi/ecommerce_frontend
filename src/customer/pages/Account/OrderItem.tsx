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
        color: "#f1c40f",
        icon: <Pending fontSize="small" />,
        label: "Chờ xác nhận",
        subLabel: "Đơn hàng đang chờ người bán xác nhận.",
      };
    case "PENDING_PAYMENT":
      return {
        color: "#cccaaa",
        icon: <Pending fontSize="small" />,
        label: "Chờ thanh toán",
        subLabel: "Thanh toán ngay để hoàn thành đơn hàng.",
      };
    case "PLACED":
      return {
        color: "#00a8ff",
        icon: <Inventory fontSize="small" />,
        label: "Đã đặt hàng",
        subLabel: "Chúng tôi đã nhận được đơn hàng của bạn.",
      };
    case "CONFIRMED":
      return {
        color: "#0984e3",
        icon: <ElectricBolt fontSize="small" />,
        label: "Đã xác nhận",
        subLabel: "Người bán đã xác nhận đơn hàng.",
      };
    case "SHIPPED":
      return {
        color: "#16a085",
        icon: <LocalShipping fontSize="small" />,
        label: "Đã gửi hàng",
        subLabel: "Đơn hàng đang được vận chuyển.",
      };
    case "ARRIVING":
      return {
        color: "#2980b9",
        icon: <LocalShipping fontSize="small" />,
        label: "Sắp giao",
        subLabel: "Đơn hàng sẽ sớm được giao đến bạn.",
      };
    case "DELIVERED":
      return {
        color: "#27ae60",
        icon: <CheckCircle fontSize="small" />,
        label: "Đã giao hàng",
        subLabel: "Đơn hàng đã được giao thành công.",
      };
    case "CANCELLED":
      return {
        color: "#e74c3c",
        icon: <Cancel fontSize="small" />,
        label: "Đã hủy",
        subLabel: "Đơn hàng đã bị hủy.",
      };
    default:
      return {
        color: "#7f8c8d",
        icon: <Pending fontSize="small" />,
        label: "Trạng thái không xác định",
        subLabel: "",
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
    0,
  );

  const handleCardClick = () => {
    navigate(`${order.id}`);
  };

  const formatVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  return (
    <div
      className="text-sm bg-white/95 p-4 sm:p-5 space-y-4 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Header: trạng thái + tổng tiền */}
      <div className="flex justify-between gap-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar
            sx={{
              bgcolor: statusConfig.color,
              width: 40,
              height: 40,
              fontSize: 18,
            }}
          >
            {statusConfig.icon}
          </Avatar>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1
                className="font-semibold text-sm sm:text-base"
                style={{ color: statusConfig.color }}
              >
                {statusConfig.label}
              </h1>
              <Chip
                label={`#${order.id}`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: "0.7rem",
                  borderRadius: "999px",
                  borderColor: "rgba(148,163,184,0.6)",
                  color: "rgb(100,116,139)",
                }}
              />
            </div>
            <p className="text-xs text-slate-500">{statusConfig.subLabel}</p>
            <p className="text-xs text-slate-500">
              {deliveryLabel}
              <span className="font-medium text-slate-800">
                {formattedDate}
              </span>
            </p>
            {totalItems ? (
              <p className="text-xs text-slate-500">
                Số lượng sản phẩm:{" "}
                <span className="font-medium text-slate-800">{totalItems}</span>
              </p>
            ) : null}
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">Tổng tiền</p>
          <p className="text-base sm:text-lg font-semibold text-sky-600">
            {formatVND(order.totalPrice)}
          </p>
        </div>
      </div>

      {/* Danh sách sản phẩm trong đơn */}
      <div className="space-y-2">
        {order.orderItems?.map((item) => (
          <div
            key={item.id}
            className="px-3 py-2.5 sm:p-3 bg-slate-50 rounded-xl flex gap-3"
          >
            <div className="shrink-0">
              <img
                alt={item.product?.title}
                src={item.product?.images?.[0]}
                className="w-16 h-20 object-cover rounded-lg border border-slate-100"
              />
            </div>
            <div className="w-full space-y-1">
              <h2 className="font-semibold text-slate-900 text-sm line-clamp-2">
                {item.product?.title}
              </h2>
              <p className="text-xs text-slate-500">
                {item.product?.seller?.businessDetails?.businessName ||
                  "Nhà bán hàng"}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                <p>
                  <span className="font-medium">Size:</span>{" "}
                  {item.size?.name || "Không có"}
                </p>
                <p>
                  <span className="font-medium">Số lượng:</span> {item.quantity}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nút đánh giá */}
      {order.orderStatus === "DELIVERED" && (
        <div className="flex justify-end pt-1">
          <Button
            variant="outlined"
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: "999px",
              fontSize: "0.8rem",
            }}
            onClick={(e) => {
              e.stopPropagation(); // tránh trigger click card
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
