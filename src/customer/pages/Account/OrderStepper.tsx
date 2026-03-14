import { Box, Avatar } from "@mui/material";
import React from "react";
import {
  CheckCircle,
  FiberManualRecord,
  ElectricBolt,
  LocalShipping,
  Cancel,
  Pending,
  Inventory,
} from "@mui/icons-material";
import { format } from "date-fns";
import { OrderStatus } from "../../../types/OrderType";

// Config màu, icon, label cho từng status
const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return {
        color: "#f1c40f",
        icon: <Pending fontSize="small" />,
        label: "Chờ xác nhận",
      };
    case "PLACED":
      return {
        color: "#00a8ff",
        icon: <Inventory fontSize="small" />,
        label: "Đã đặt hàng",
      };
    case "CONFIRMED":
      return {
        color: "#0984e3",
        icon: <ElectricBolt fontSize="small" />,
        label: "Đã được xác nhận",
      };
    case "SHIPPED":
      return {
        color: "#16a085",
        icon: <LocalShipping fontSize="small" />,
        label: "Đã gửi hàng",
      };
    case "ARRIVING":
      return {
        color: "#2980b9",
        icon: <LocalShipping fontSize="small" />,
        label: "Sắp giao",
      };
    case "DELIVERED":
      return {
        color: "#27ae60",
        icon: <CheckCircle fontSize="small" />,
        label: "Đã giao hàng",
      };
    case "CANCELLED":
      return {
        color: "#e74c3c",
        icon: <Cancel fontSize="small" />,
        label: "Đã hủy",
      };
    default:
      return {
        color: "#7f8c8d",
        icon: <Pending fontSize="small" />,
        label: "Không xác định",
      };
  }
};

// Thứ tự các bước
const ORDER_STEPS: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.PLACED,
  OrderStatus.CONFIRMED,
  OrderStatus.SHIPPED,
  OrderStatus.ARRIVING,
  OrderStatus.DELIVERED,
];

const CANCELLED_STEPS: OrderStatus[] = [
  OrderStatus.PLACED,
  OrderStatus.CANCELLED,
];

// subtitle cho từng bước
const getStepSubtitle = (status: OrderStatus, deliveryDate?: string) => {
  switch (status) {
    case "PENDING":
      return "Đơn hàng đang chờ người bán xác nhận.";
    case "PLACED":
      return "Đơn hàng đã được tạo thành công.";
    case "CONFIRMED":
      return "Người bán đã xác nhận đơn hàng của bạn.";
    case "SHIPPED":
      return "Đơn hàng đang được đơn vị vận chuyển giao đi.";
    case "ARRIVING":
      return deliveryDate
        ? `Dự kiến giao trước ngày ${format(
            new Date(deliveryDate),
            "dd/MM/yyyy"
          )}.`
        : "Đơn hàng sẽ sớm được giao.";
    case "DELIVERED":
      return deliveryDate
        ? `Đã giao ngày ${format(new Date(deliveryDate), "dd/MM/yyyy")}.`
        : "Đơn hàng đã được giao.";
    case "CANCELLED":
      return "Đơn hàng đã bị hủy.";
    default:
      return "";
  }
};

interface Props {
  orderStatus: OrderStatus;
  deliveryDate?: string;
}

const OrderStepper: React.FC<Props> = ({ orderStatus, deliveryDate }) => {
  const steps = orderStatus === "CANCELLED" ? CANCELLED_STEPS : ORDER_STEPS;
  const currentIndex = steps.findIndex((s) => s === orderStatus);

  return (
    <Box className="mx-auto my-4 sm:my-6">
      {steps.map((status, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        const config = getStatusConfig(status);
        const subtitle = getStepSubtitle(status, deliveryDate);

        return (
          <div key={status} className="flex px-2 sm:px-4 mb-4">
            {/* Cột icon + line */}
            <div className="flex flex-col items-center">
              <Avatar
                sx={{
                  bgcolor: config.color,
                  width: 32,
                  height: 32,
                  fontSize: 18,
                }}
              >
                {isCurrent || isCompleted ? (
                  config.icon
                ) : (
                  <FiberManualRecord sx={{ fontSize: 12 }} />
                )}
              </Avatar>

              {index < steps.length - 1 && (
                <div
                  className="w-[2px] mt-1"
                  style={{
                    height: 64,
                    backgroundColor:
                      index < currentIndex ? config.color : "#e5e7eb",
                  }}
                />
              )}
            </div>

            {/* Nội dung bước */}
            <div className="ml-3 w-full -mt-1">
              <div
                className={`p-2 rounded-md ${
                  isCurrent ? "text-white" : "text-slate-800"
                }`}
                style={{
                  backgroundColor: isCurrent ? config.color : "transparent",
                }}
              >
                <p className="font-semibold text-sm">{config.label}</p>
                <p
                  className={`text-xs mt-0.5 ${
                    isCurrent ? "text-white" : "text-slate-600"
                  }`}
                >
                  {subtitle}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </Box>
  );
};

export default OrderStepper;
