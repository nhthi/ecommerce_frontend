import React, { useEffect, useMemo, useState } from "react";
import {
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  MenuItem,
  Pagination,
} from "@mui/material";
import { LocalMall, Search } from "@mui/icons-material";
import OrderItem from "./OrderItem";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchUserOrdersHistory } from "../../../state/customer/orderSlice";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const ORDER_TABS = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ thanh toán", value: "PENDING_PAYMENT", statuses: ["PENDING_PAYMENT"] },
  { label: "Chờ xác nhận", value: "PENDING", statuses: ["PENDING"] },
  { label: "Đã xác nhận", value: "CONFIRMED", statuses: ["CONFIRMED"] },
  { label: "Đang giao", value: "SHIPPING", statuses: ["ARRIVING", "SHIPPED"] },
  { label: "Đã giao", value: "DELIVERED", statuses: ["DELIVERED"] },
  { label: "Đã hủy", value: "CANCELLED", statuses: ["CANCELLED"] },
];

const ITEMS_PER_PAGE = 5;

const Orders = () => {
  const dispatch = useAppDispatch();
  const { order } = useAppSelector((store) => store);
  const { isDark } = useSiteThemeMode();

  const textPrimary = isDark ? "#fff" : "#0f172a";
  const textSecondary = isDark ? "#94a3b8" : "#64748b";
  const bgCard = isDark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const borderColor = isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0";

  const [tab, setTab] = useState("ALL");
  const [keyword, setKeyword] = useState("");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchUserOrdersHistory());
  }, [dispatch]);

  useEffect(() => {
    setPage(1);
  }, [tab, keyword, dateFilter, sortBy]);

  const ordersByTab = useMemo(() => {
    if (!order.orders) return [];
    if (tab === "ALL") return order.orders;

    const currentTab = ORDER_TABS.find((t) => t.value === tab);
    return order.orders.filter((o) =>
      currentTab?.statuses?.includes(o.orderStatus)
    );
  }, [order.orders, tab]);

  const filteredOrders = useMemo(() => {
    let result = [...ordersByTab];

    if (keyword.trim()) {
      const normalizedKeyword = keyword.trim().toLowerCase();
      result = result.filter((o) => {
        const orderCode = String(o?.orderId ?? o?.id ?? "").toLowerCase();
        return orderCode.includes(normalizedKeyword);
      });
    }

    if (dateFilter !== "ALL") {
      const now = new Date();

      result = result.filter((o) => {
        const rawDate = o?.orderDate;
        if (!rawDate) return false;

        const orderDate = new Date(rawDate);
        if (Number.isNaN(orderDate.getTime())) return false;

        const diffDays =
          (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);

        switch (dateFilter) {
          case "7_DAYS":
            return diffDays <= 7;
          case "30_DAYS":
            return diffDays <= 30;
          case "90_DAYS":
            return diffDays <= 90;
          default:
            return true;
        }
      });
    }

    result.sort((a, b) => {
      const dateA = new Date(a?.orderDate || 0).getTime();
      const dateB = new Date(b?.orderDate || 0).getTime();

      const totalA = Number(a?.totalPrice || 0);
      const totalB = Number(b?.totalPrice || 0);

      switch (sortBy) {
        case "OLDEST":
          return dateA - dateB;
        case "TOTAL_DESC":
          return totalB - totalA;
        case "TOTAL_ASC":
          return totalA - totalB;
        default:
          return dateB - dateA;
      }
    });

    return result;
  }, [ordersByTab, keyword, dateFilter, sortBy]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, page]);

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
        return "Chưa có đơn hàng đã giao.";
      case "CANCELLED":
        return "Không có đơn hàng đã hủy.";
      default:
        return "Bạn chưa có đơn hàng nào.";
    }
  };

  return (
    <div className="space-y-6">
      <h1
        className="text-3xl font-black lg:text-4xl"
        style={{ color: textPrimary }}
      >
        Đơn hàng
      </h1>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 700,
            fontSize: "1rem",
            color: textSecondary,
          },
          "& .Mui-selected": { color: "#fb923c" },
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
                  <span
                    className="rounded-full px-2 py-0.5 text-xs"
                    style={{
                      background: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "#f1f5f9",
                      color: textSecondary,
                    }}
                  >
                    {order.orders?.filter((o) =>
                      t.statuses?.includes(o.orderStatus)
                    ).length || 0}
                  </span>
                )}
              </span>
            }
          />
        ))}
      </Tabs>

      <div
        className="rounded-[1.5rem] p-4"
        style={{ background: bgCard, border: `1px solid ${borderColor}` }}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <TextField
            fullWidth
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo mã đơn hàng..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: textSecondary }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: textPrimary,
                backgroundColor: bgCard,
              },
            }}
          />

          <TextField
            select
            fullWidth
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            size="small"
            label="Thời gian"
            sx={{
              "& .MuiInputLabel-root": { color: textSecondary },
              "& .MuiOutlinedInput-root": {
                color: textPrimary,
                backgroundColor: bgCard,
              },
            }}
          >
            <MenuItem value="ALL">Tất cả</MenuItem>
            <MenuItem value="7_DAYS">7 ngày</MenuItem>
            <MenuItem value="30_DAYS">30 ngày</MenuItem>
            <MenuItem value="90_DAYS">90 ngày</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size="small"
            label="Sắp xếp"
            sx={{
              "& .MuiInputLabel-root": { color: textSecondary },
              "& .MuiOutlinedInput-root": {
                color: textPrimary,
                backgroundColor: bgCard,
              },
            }}
          >
            <MenuItem value="NEWEST">Mới nhất</MenuItem>
            <MenuItem value="OLDEST">Cũ nhất</MenuItem>
            <MenuItem value="TOTAL_DESC">Giá cao → thấp</MenuItem>
            <MenuItem value="TOTAL_ASC">Giá thấp → cao</MenuItem>
          </TextField>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <>
          <div className="space-y-4">
            {paginatedOrders.map((o) => (
              <OrderItem key={o.id} order={o} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: textPrimary,
                },
              }}
            />
          )}
        </>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-xl p-10"
          style={{ border: `1px dashed ${borderColor}` }}
        >
          <LocalMall sx={{ fontSize: 40, color: "#fb923c" }} />
          <h2 style={{ color: textPrimary }}>{getEmptyText()}</h2>
          <p style={{ color: textSecondary }}>
            Đơn hàng sẽ hiển thị tại đây.
          </p>
        </div>
      )}
    </div>
  );
};

export default Orders;