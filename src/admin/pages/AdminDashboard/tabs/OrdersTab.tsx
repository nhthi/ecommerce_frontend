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
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  OrderStatusSummaryDto,
  RecentOrderDto,
} from "../../../../state/admin/adminDashboardSlice";
import { getCardSx, getSectionTitleSx, getStatusChip } from "../dashboardData";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

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

const fallbackPalette = [
  "#f97316",
  "#f59e0b",
  "#3b82f6",
  "#16a34a",
  "#ef4444",
  "#8b5cf6",
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const formatDateTime = (value: string) => {
  if (!value) return "Không rõ";
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
      return "Đã giao";
    case "PENDING":
      return "Chờ xử lý";
    case "CANCELLED":
      return "Đã hủy";
    case "CONFIRMED":
      return "Đã xác nhận";
    case "SHIPPING":
      return "Đang giao";
    case "COMPLETED":
      return "Hoàn thành";
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
  const { isDark } = useSiteThemeMode();
  const cardSx = getCardSx(isDark);
  const sectionTitleSx = getSectionTitleSx(isDark);
  const tableBorder = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(15,23,42,0.08)";
  const muted = isDark ? "rgba(255,255,255,0.62)" : "#64748b";
  const tooltipStyle = {
    background: isDark ? "#101010" : "#ffffff",
    border: isDark
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid rgba(15,23,42,0.08)",
    borderRadius: "14px",
    color: isDark ? "#ffffff" : "#0f172a",
  };
const legendStyle = {
  fontSize: 16,
  color: isDark ? "#e5e7eb" : "#334155",
};
  const statusChartData = useMemo(
    () =>
      orderStatusSummary.map((item, index) => ({
        name: formatStatusDisplay(item.label),
        value: item.value,
        color:
          statusColorMap[item.label] ||
          fallbackPalette[index % fallbackPalette.length],
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

          <Box sx={{ mt: 1.2, height: 280,marginTop:4 }}>
            {loading && statusChartData.length === 0 ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ height: "100%" }}
                spacing={1.2}
              >
                <CircularProgress sx={{ color: primary }} />
                <Typography sx={{ color: muted }}>
                  Đang tải trạng thái đơn hàng...
                </Typography>
              </Stack>
            ) : (
              <ResponsiveContainer width="100%" height="100%" >
                <PieChart>
                  <Pie
  data={statusChartData}
  dataKey="value"
  nameKey="name"
  innerRadius={54}
  outerRadius={84}
  paddingAngle={3}
  label={({ name, percent }) => `${name} ${(Number(percent) * 100).toFixed(0)}%`}
>
  {statusChartData.map((item) => (
    <Cell key={item.name} fill={item.color} />
  ))}
</Pie>
<Legend wrapperStyle={legendStyle} />
<Tooltip
  contentStyle={tooltipStyle}
  formatter={(value: number, name: string) => [value, name]}
/>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, xl: 8 }}>
        <Paper elevation={0} sx={{ ...cardSx, p: 2.5, height: "100%" }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={1.2}
          >
            <Box>
              <Typography sx={sectionTitleSx}>Đơn hàng gần đây</Typography>
              <Typography sx={{ color: muted, fontSize: 14.5, mt: 0.4 }}>
                Dữ liệu được đồng bộ theo bộ lọc tháng hoặc năm.
              </Typography>
            </Box>

            <Button
              component={Link}
              to="/admin/orders"
              variant="text"
              sx={{
                textTransform: "none",
                color: primary,
                fontWeight: 700,
                alignSelf: "flex-start",
              }}
            >
              Xem tất cả
            </Button>
          </Stack>

          <Box sx={{ mt: 1.6, overflowX: "auto" }}>
            {loading && filteredOrders.length === 0 ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ py: 6 }}
                spacing={1.2}
              >
                <CircularProgress sx={{ color: primary }} />
                <Typography sx={{ color: muted }}>
                  Đang tải danh sách đơn hàng...
                </Typography>
              </Stack>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: muted, borderColor: tableBorder }}>
                      Mã đơn
                    </TableCell>
                    <TableCell sx={{ color: muted, borderColor: tableBorder }}>
                      Khách hàng
                    </TableCell>
                    <TableCell sx={{ color: muted, borderColor: tableBorder }}>
                      Thanh toán
                    </TableCell>
                    <TableCell sx={{ color: muted, borderColor: tableBorder }}>
                      Giá trị
                    </TableCell>
                    <TableCell sx={{ color: muted, borderColor: tableBorder }}>
                      Trạng thái
                    </TableCell>
                    <TableCell sx={{ color: muted, borderColor: tableBorder }}>
                      Ngày đặt
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredOrders.map((order) => {
                    const statusLabel = normalizeStatusLabel(order.status);
                    const statusStyle = getStatusChip(statusLabel);

                    return (
                      <TableRow key={order.orderCode} hover>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            color: isDark ? "#ffffff" : "#0f172a",
                            borderColor: tableBorder,
                          }}
                        >
                          {order.orderCode}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: isDark
                              ? "rgba(255,255,255,0.78)"
                              : "#334155",
                            borderColor: tableBorder,
                          }}
                        >
                          {order.customerName}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: isDark
                              ? "rgba(255,255,255,0.78)"
                              : "#334155",
                            borderColor: tableBorder,
                          }}
                        >
                          {order.paymentMethod || "Không rõ"}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: primary,
                            fontWeight: 800,
                            borderColor: tableBorder,
                          }}
                        >
                          {formatCurrency(order.amount)}
                        </TableCell>

                        <TableCell sx={{ borderColor: tableBorder }}>
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

                        <TableCell
                          sx={{
                            color: isDark
                              ? "rgba(255,255,255,0.78)"
                              : "#334155",
                            borderColor: tableBorder,
                          }}
                        >
                          {formatDateTime(order.orderDate)}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {!loading && filteredOrders.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        sx={{
                          textAlign: "center",
                          py: 4,
                          color: muted,
                          borderColor: tableBorder,
                        }}
                      >
                        Không có đơn hàng nào phù hợp với bộ lọc hiện tại.
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