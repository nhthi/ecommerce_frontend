import React, { useEffect, useMemo, useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { LocalMall } from "@mui/icons-material";
import OrderItem from "./OrderItem";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchUserOrdersHistory } from "../../../state/customer/orderSlice";

const ORDER_TABS = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ thanh toán", value: "PENDING_PAYMENT", statuses: ["PENDING_PAYMENT"] },
  { label: "Chờ xác nhận", value: "PLACED", statuses: ["PLACED"] },
  { label: "Đã xác nhận", value: "CONFIRMED", statuses: ["CONFIRMED"] },
  { label: "Đang giao", value: "SHIPPING", statuses: ["ARRIVING", "SHIPPED"] },
  { label: "Đã giao", value: "DELIVERED", statuses: ["DELIVERED"] },
  { label: "Đã hủy", value: "CANCELLED", statuses: ["CANCELLED"] },
];

const Orders = () => {
  const dispatch = useAppDispatch();
  const { order } = useAppSelector((store) => store);
  const [tab, setTab] = useState("ALL");

  useEffect(() => {
    dispatch(fetchUserOrdersHistory());
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    if (!order.orders) return [];
    if (tab === "ALL") return order.orders;
    const currentTab = ORDER_TABS.find((t) => t.value === tab);
    return order.orders.filter((o) => currentTab?.statuses?.includes(o.orderStatus));
  }, [order.orders, tab]);

const getEmptyText = () => {
  switch (tab) {
    case "PENDING_PAYMENT": return "Không có đơn hàng chờ thanh toán.";
    case "PLACED": return "Không có đơn hàng chờ xác nhận.";
    case "CONFIRMED": return "Không có đơn hàng đã xác nhận.";
    case "SHIPPING": return "Không có đơn hàng đang giao.";
    case "DELIVERED": return "Chưa có đơn hàng đã giao.";
    case "CANCELLED": return "Không có đơn hàng đã hủy.";
    default: return "Bạn chưa có đơn hàng nào.";
  }
};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white lg:text-4xl">Đơn hàng</h1>
        
      </div>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          "& .MuiTab-root": { textTransform: "none", fontWeight: 700, fontSize: "1rem", minHeight: 44, px: 2, color: "#94a3b8" },
          "& .Mui-selected": { color: "#fb923c" },
          "& .MuiTabs-indicator": { backgroundColor: "#f97316", height: 3, borderRadius: 3 },
        }}
      >
        {ORDER_TABS.map((t) => (
          <Tab key={t.value} value={t.value} label={<span className="flex items-center gap-2">{t.label}{t.value !== "ALL" && <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">{order.orders?.filter((o) => t.statuses?.includes(o.orderStatus)).length || 0}</span>}</span>} />
        ))}
      </Tabs>

      {filteredOrders.length > 0 ? (
        <div className="space-y-4">{filteredOrders.map((o) => <OrderItem key={o.id} order={o} />)}</div>
      ) : (
        <div className="flex min-h-[380px] flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-orange-500/15 bg-black/20 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 text-orange-300"><LocalMall sx={{ fontSize: 30 }} /></div>
          <h2 className="mt-5 text-2xl font-black text-white">{getEmptyText()}</h2>
          <p className="mt-3 max-w-md text-base leading-7 text-slate-400">
  Đơn hàng sau khi đặt sẽ được cập nhật tại đây để bạn dễ dàng theo dõi hơn.
</p>
          <p className="mt-3 max-w-md text-base leading-7 text-slate-400">Don hang sau khi dat se duoc cap nhat tai day de ban de theo doi hon.</p>
        </div>
      )}
    </div>
  );
};

export default Orders;
