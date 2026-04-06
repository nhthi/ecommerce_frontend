import React, { useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  OrderStatusSummaryDto,
  RecentOrderDto,
} from "../../../../state/admin/adminDashboardSlice";
import { getStatusChip } from "../dashboardData";
import { cardSx, sectionTitleSx } from "../dashboardStyles";

interface OrdersTabProps {
  filteredOrders: RecentOrderDto[];
  primary: string;
  orderStatusSummary: OrderStatusSummaryDto[];
  loading: boolean;
  error: string | null;
}

const statusColorMap: Record<string, string> = {
  DELIVERED: "#16a34a",
  COMPLETED: "#16a34a",
  PENDING: "#f59e0b",
  CONFIRMED: "#3b82f6",
  SHIPPING: "#8b5cf6",
  CANCELLED: "#ef4444",
};

const fallbackPalette = ["#f97316", "#f59e0b", "#3b82f6", "#16a34a", "#ef4444", "#8b5cf6"];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const formatDateTime = (value: string) => {
  if (!value) return "Khong ro";
  return new Date(value).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const normalizeStatusLabel = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "Delivered";
    case "PENDING":
      return "Pending";
    case "CANCELLED":
      return "Cancelled";
    case "CONFIRMED":
      return "Confirmed";
    case "SHIPPING":
      return "Shipping";
    case "COMPLETED":
      return "Completed";
    default:
      return status;
  }
};

const formatStatusDisplay = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "Da giao";
    case "PENDING":
      return "Cho xu ly";
    case "CANCELLED":
      return "Da huy";
    case "CONFIRMED":
      return "Da xac nhan";
    case "SHIPPING":
      return "Dang giao";
    case "COMPLETED":
      return "Hoan thanh";
    default:
      return status;
  }
};

const OrdersTab = ({
  filteredOrders,
  primary,
  orderStatusSummary,
  loading,
  error,
}: OrdersTabProps) => {
  const statusChartData = useMemo(
    () =>
      orderStatusSummary.map((item, index) => ({
        name: formatStatusDisplay(item.label),
        value: item.value,
        color: statusColorMap[item.label] || fallbackPalette[index % fallbackPalette.length],
      })),
    [orderStatusSummary]
  );

  return (
    <Grid container spacing={2.2}>
      {error && (
        <Grid size={{ xs: 12 }}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}

      <Grid size={{ xs: 12, xl: 4 }}>
        <Paper elevation={0} sx={{ ...cardSx, p: 2.5, height: "100%" }}>
          <Typography sx={sectionTitleSx}>Trạng thái đơn hàng</Typography>
          <Box sx={{ mt: 1.2, height: 260 }}>
            {loading && statusChartData.length === 0 ? (
              <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }} spacing={1.2}>
                <CircularProgress sx={{ color: primary }} />
                <Typography sx={{ color: "#64748b" }}>Đang tải trạng thái đơn hàng...</Typography>
              </Stack>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusChartData} dataKey="value" innerRadius={54} outerRadius={84} paddingAngle={3}>
                    {statusChartData.map((item) => <Cell key={item.name} fill={item.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, xl: 8 }}>
        <Paper elevation={0} sx={{ ...cardSx, p: 2.5, height: "100%" }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1.2}>
            <Box>
              <Typography sx={sectionTitleSx}>Đơn hàng gần đây</Typography>
              <Typography sx={{ color: "#64748b", fontSize: 14.5, mt: 0.4 }}>
                Dữ liệu lấy từ API dashboard, đồng bộ theo tháng hoặc năm.
              </Typography>
            </Box>
            <Button component={Link} to="/admin/orders" variant="text" sx={{ textTransform: "none", color: primary, fontWeight: 700, alignSelf: "flex-start" }}>
              Xem tất cả
            </Button>
          </Stack>
          <Box sx={{ mt: 1.6, overflowX: "auto" }}>
            {loading && filteredOrders.length === 0 ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }} spacing={1.2}>
                <CircularProgress sx={{ color: primary }} />
                <Typography sx={{ color: "#64748b" }}>Đang tải danh sách đơn hàng...</Typography>
              </Stack>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Mã đơn</TableCell>
                    <TableCell>Khách hàng</TableCell>
                    <TableCell>Thanh toán</TableCell>
                    <TableCell>Giá trị</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Ngày đặt</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const statusLabel = normalizeStatusLabel(order.status);
                    const statusStyle = getStatusChip(statusLabel);
                    return (
                      <TableRow key={order.orderCode} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{order.orderCode}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.paymentMethod || "Khong ro"}</TableCell>
                        <TableCell sx={{ color: primary, fontWeight: 800 }}>{formatCurrency(order.amount)}</TableCell>
                        <TableCell>
                          <Chip
                            label={formatStatusDisplay(order.status)}
                            size="small"
                            sx={{
                              borderRadius: "999px",
                              color: statusStyle.color,
                              backgroundColor: statusStyle.bg,
                              fontWeight: 700,
                              minWidth: 110,
                            }}
                          />
                        </TableCell>
                        <TableCell>{formatDateTime(order.orderDate)}</TableCell>
                      </TableRow>
                    );
                  })}

                  {!loading && filteredOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: "center", py: 4, color: "#64748b" }}>
                        Khong co don hang nao phu hop voi bo loc hien tai.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OrdersTab;
