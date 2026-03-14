import React, { useEffect, useMemo, useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { LocalMall } from "@mui/icons-material";
import OrderItem from "./OrderItem";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchUserOrdersHistory } from "../../../state/customer/orderSlice";

/* ================== ORDER STATUS TABS ================== */
const ORDER_TABS = [
  { label: "Tất cả", value: "ALL" },
  {
    label: "Chờ thanh toán",
    value: "PENDING_PAYMENT",
    statuses: ["PENDING_PAYMENT"],
  },
  {
    label: "Chờ xác nhận",
    value: "PLACED",
    statuses: ["PLACED"],
  },
  {
    label: "Đã xác nhận",
    value: "CONFIRMED",
    statuses: ["CONFIRMED"],
  },
  {
    label: "Đang giao",
    value: "SHIPPING",
    statuses: ["ARRIVING", "SHIPPED"],
  },
  {
    label: "Đã giao",
    value: "DELIVERED",
    statuses: ["DELIVERED"],
  },
  {
    label: "Đã hủy",
    value: "CANCELLED",
    statuses: ["CANCELLED"],
  },
];

const Orders = () => {
  const dispatch = useAppDispatch();
  const { order } = useAppSelector((store) => store);

  const [tab, setTab] = useState("ALL");

  /* ================== FETCH DATA ================== */
  useEffect(() => {
    dispatch(fetchUserOrdersHistory());
  }, [dispatch]);

  /* ================== FILTER ORDERS ================== */
  const filteredOrders = useMemo(() => {
    if (!order.orders) return [];

    if (tab === "ALL") return order.orders;

    const currentTab = ORDER_TABS.find((t) => t.value === tab);
    return order.orders.filter((o) =>
      currentTab?.statuses?.includes(o.orderStatus),
    );
  }, [order.orders, tab]);

  /* ================== EMPTY TEXT ================== */
  const getEmptyText = () => {
    switch (tab) {
      case "PENDING_PAYMENT":
        return "Không có đơn hàng chờ thanh toán.";
      case "PLACED":
        return "Không có đơn hàng chờ xác nhận.";
      case "CONFIRMED":
        return "Không có đơn hàng đã xác nhận.";
      case "SHIPPING":
        return "Không có đơn hàng đang giao.";
      case "DELIVERED":
        return "Chưa có đơn hàng nào đã giao.";
      case "CANCELLED":
        return "Không có đơn hàng đã hủy.";
      default:
        return "Bạn chưa có đơn hàng nào.";
    }
  };

  return (
    <div className="min-h-screen text-sm">
      {/* ================== HEADER ================== */}
      <div className="pb-4">
        <h1 className="text-xl font-semibold text-slate-900">
          Lịch sử đơn hàng
        </h1>
        <p className="text-xs text-slate-500">
          Theo dõi trạng thái và chi tiết các đơn hàng của bạn.
        </p>
      </div>

      {/* ================== TABS ================== */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 3,
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.85rem",
            minHeight: 36,
            px: 2,
            color: "#64748b",
          },
          "& .Mui-selected": {
            color: "#0097e6",
            fontWeight: 600,
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#0097e6",
            height: 3,
            borderRadius: 2,
          },
        }}
      >
        {ORDER_TABS.map((t) => (
          <Tab
            key={t.value}
            value={t.value}
            label={
              <span className="flex items-center gap-2">
                {t.label}
                {t.value !== "ALL" && (
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 rounded-full">
                    {order.orders?.filter((o) =>
                      t.statuses?.includes(o.orderStatus),
                    ).length || 0}
                  </span>
                )}
              </span>
            }
          />
        ))}
      </Tabs>

      {/* ================== ORDER LIST ================== */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-3">
          {filteredOrders.map((o) => (
            <OrderItem key={o.id} order={o} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[55vh] bg-white/80 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-sky-50 flex items-center justify-center shadow">
            <LocalMall sx={{ fontSize: 28, color: "#0097e6" }} />
          </div>
          <h2 className="mt-4 text-base font-semibold text-slate-900">
            {getEmptyText()}
          </h2>
          <p className="mt-1 text-xs text-slate-500 text-center max-w-sm">
            Các đơn hàng của bạn sẽ hiển thị tại đây để bạn dễ dàng theo dõi.
          </p>
        </div>
      )}
    </div>
  );
};

export default Orders;
