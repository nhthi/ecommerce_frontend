import React, { useEffect, useMemo, useState } from "react";
import {
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  MenuItem,
  Pagination,
} from "@mui/material";
import { LocalMall, Search, FilterList } from "@mui/icons-material";
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

const ITEMS_PER_PAGE = 5;

const Orders = () => {
  const dispatch = useAppDispatch();
  const { order } = useAppSelector((store) => store);

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
    return order.orders.filter((o) => currentTab?.statuses?.includes(o.orderStatus));
  }, [order.orders, tab]);

  const filteredOrders = useMemo(() => {
    let result = [...ordersByTab];

    if (keyword.trim()) {
      const normalizedKeyword = keyword.trim().toLowerCase();
      result = result.filter((o) => {
        const orderCode =
          String(o?.orderId ?? o?.id ?? "")
            .toLowerCase();
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

        const diffMs = now.getTime() - orderDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

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
      const dateA = new Date(a?.orderDate ||  0).getTime();
      const dateB = new Date(b?.orderDate ||  0).getTime();

      const totalA = Number(a?.totalPrice ||  0);
      const totalB = Number(b?.totalPrice ||  0);

      switch (sortBy) {
        case "OLDEST":
          return dateA - dateB;
        case "TOTAL_DESC":
          return totalB - totalA;
        case "TOTAL_ASC":
          return totalA - totalB;
        case "NEWEST":
        default:
          return dateB - dateA;
      }
    });

    return result;
  }, [ordersByTab, keyword, dateFilter, sortBy]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredOrders.slice(start, end);
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
      <div>
        <h1 className="text-3xl font-black text-white lg:text-4xl">Đơn hàng</h1>
      </div>

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
            minHeight: 44,
            px: 2,
            color: "#94a3b8",
          },
          "& .Mui-selected": { color: "#fb923c" },
          "& .MuiTabs-indicator": {
            backgroundColor: "#f97316",
            height: 3,
            borderRadius: 3,
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
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">
                    {order.orders?.filter((o) => t.statuses?.includes(o.orderStatus)).length || 0}
                  </span>
                )}
              </span>
            }
          />
        ))}
      </Tabs>

      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
        

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <TextField
            fullWidth
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo mã đơn hàng..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#94a3b8", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.03)",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.08)",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#94a3b8",
                opacity: 1,
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
              "& .MuiInputLabel-root": { color: "#94a3b8" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#fb923c" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.03)",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.08)",
              },
              "& .MuiSvgIcon-root": { color: "#94a3b8" },
            }}
          >
            <MenuItem value="ALL">Tất cả thời gian</MenuItem>
            <MenuItem value="7_DAYS">7 ngày gần đây</MenuItem>
            <MenuItem value="30_DAYS">30 ngày gần đây</MenuItem>
            <MenuItem value="90_DAYS">90 ngày gần đây</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size="small"
            label="Sắp xếp"
            sx={{
              "& .MuiInputLabel-root": { color: "#94a3b8" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#fb923c" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.03)",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.08)",
              },
              "& .MuiSvgIcon-root": { color: "#94a3b8" },
            }}
          >
            <MenuItem value="NEWEST">Mới nhất</MenuItem>
            <MenuItem value="OLDEST">Cũ nhất</MenuItem>
            <MenuItem value="TOTAL_DESC">Giá trị cao đến thấp</MenuItem>
            <MenuItem value="TOTAL_ASC">Giá trị thấp đến cao</MenuItem>
          </TextField>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-400">
            Hiển thị <span className="font-bold text-white">{paginatedOrders.length}</span> /{" "}
            <span className="font-bold text-orange-300">{filteredOrders.length}</span> đơn hàng
          </p>

          {(keyword || dateFilter !== "ALL" || sortBy !== "NEWEST") && (
            <button
              type="button"
              onClick={() => {
                setKeyword("");
                setDateFilter("ALL");
                setSortBy("NEWEST");
                setPage(1);
              }}
              className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/15"
            >
              Xóa bộ lọc
            </button>
          )}
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
            <div className="flex justify-center pt-2">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#cbd5e1",
                    borderColor: "rgba(255,255,255,0.08)",
                    backgroundColor: "rgba(255,255,255,0.03)",
                  },
                  "& .Mui-selected": {
                    backgroundColor: "rgba(249,115,22,0.18) !important",
                    color: "#fdba74",
                    border: "1px solid rgba(249,115,22,0.35)",
                  },
                }}
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex min-h-[380px] flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-orange-500/15 bg-black/20 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 text-orange-300">
            <LocalMall sx={{ fontSize: 30 }} />
          </div>
          <h2 className="mt-5 text-2xl font-black text-white">{getEmptyText()}</h2>
          <p className="mt-3 max-w-md text-base leading-7 text-slate-400">
            Đơn hàng sau khi đặt sẽ được cập nhật tại đây để bạn dễ dàng theo dõi hơn.
          </p>
        </div>
      )}
    </div>
  );
};

export default Orders;