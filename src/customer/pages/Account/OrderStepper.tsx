import { Box, Avatar } from "@mui/material";
import React from "react";
import { CheckCircle, FiberManualRecord, ElectricBolt, LocalShipping, Cancel, Pending, Inventory } from "@mui/icons-material";
import { format } from "date-fns";
import { OrderStatus } from "../../../types/OrderType";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return {
        color: "#f59e0b",
        icon: <Pending fontSize="small" />,
        label: "Chờ xác nhận",
      };
    case "PLACED":
      return {
        color: "#fb923c",
        icon: <Inventory fontSize="small" />,
        label: "Đã đặt hàng",
      };
    case "CONFIRMED":
      return {
        color: "#f97316",
        icon: <ElectricBolt fontSize="small" />,
        label: "Đã xác nhận",
      };
    case "SHIPPED":
      return {
        color: "#fdba74",
        icon: <LocalShipping fontSize="small" />,
        label: "Đang vận chuyển",
      };
    case "ARRIVING":
      return {
        color: "#fb923c",
        icon: <LocalShipping fontSize="small" />,
        label: "Sắp giao",
      };
    case "DELIVERED":
      return {
        color: "#22c55e",
        icon: <CheckCircle fontSize="small" />,
        label: "Đã giao hàng",
      };
    case "CANCELLED":
      return {
        color: "#ef4444",
        icon: <Cancel fontSize="small" />,
        label: "Đã hủy",
      };
    default:
      return {
        color: "#94a3b8",
        icon: <Pending fontSize="small" />,
        label: "Không xác định",
      };
  }
};

const ORDER_STEPS: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.ARRIVING, OrderStatus.DELIVERED];
const CANCELLED_STEPS: OrderStatus[] = [OrderStatus.PLACED, OrderStatus.CANCELLED];

const getStepSubtitle = (status: OrderStatus, deliveryDate?: string) => {
  switch (status) {
    case "PENDING":
      return "Đơn hàng đang chờ người bán xác nhận.";
    case "PLACED":
      return "Đơn hàng đã được tạo thành công.";
    case "CONFIRMED":
      return "Người bán đã xác nhận đơn hàng.";
    case "SHIPPED":
      return "Đơn hàng đã được bàn giao cho đơn vị vận chuyển.";
    case "ARRIVING":
      return deliveryDate
        ? `Dự kiến giao trước ngày ${format(new Date(deliveryDate), "dd/MM/yyyy")}.`
        : "Đơn hàng đang trên đường giao đến bạn.";
    case "DELIVERED":
      return deliveryDate
        ? `Đã giao thành công vào ngày ${format(new Date(deliveryDate), "dd/MM/yyyy")}.`
        : "Đơn hàng đã được giao thành công.";
    case "CANCELLED":
      return "Đơn hàng đã bị hủy.";
    default:
      return "";
  }
};
interface Props { orderStatus: OrderStatus; deliveryDate?: string; }

const OrderStepper: React.FC<Props> = ({ orderStatus, deliveryDate }) => {
  const steps = orderStatus === "CANCELLED" ? CANCELLED_STEPS : ORDER_STEPS;
  const currentIndex = steps.findIndex((s) => s === orderStatus);
    const { isDark } = useSiteThemeMode();
  
  return (
    <Box className="mx-auto my-4 sm:my-6">
      {steps.map((status, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const config = getStatusConfig(status);
        const subtitle = getStepSubtitle(status, deliveryDate);
        return (
          <div key={status} className="mb-5 flex px-1 sm:px-2">
            <div className="flex flex-col items-center">
              <Avatar sx={{ bgcolor: config.color, width: 40, height: 40, fontSize: 20,color:"#fff" }}>{isCurrent || isCompleted ? config.icon : <FiberManualRecord sx={{ fontSize: 14 }} />}</Avatar>
              {index < steps.length - 1 && (
  <div
    className="mt-1 w-[2px]"
    style={{
      height: 76,
      backgroundColor:
        index < currentIndex
          ? config.color
          : isDark
          ? "rgba(255,255,255,0.12)"
          : "rgba(0,0,0,0.16)",
    }}
  />
)}
            </div>
            <div className="ml-4 w-full -mt-1">
              <div className={`rounded-[1.2rem] px-4 py-3 `} style={{ backgroundColor: isCurrent ? config.color : "rgba(255,255,255,0.03)" }}>
                <p className={`text-lg font-black ${isCurrent ? "text-slate-100":''}`}>{config.label}</p>
                <p className={`mt-1 text-base leading-7 ${isCurrent ? "text-black/80" : "text-slate-300"}`}>{subtitle}</p>
              </div>
            </div>
          </div>
        );
      })}
    </Box>
  );
};

export default OrderStepper;
