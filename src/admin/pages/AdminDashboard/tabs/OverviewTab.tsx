import React, { useMemo } from "react";
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  AttachMoney,
  Groups,
  Inventory2,
  ShoppingBag,
} from "@mui/icons-material";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardOverviewDto } from "../../../../state/admin/adminDashboardSlice";
import { danger, getCardSx, getSectionTitleSx, info, primary, success, violet } from "../dashboardData";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

interface OverviewTabProps {
  overviewFilter: "month" | "year";
  selectedMonth: string;
  selectedYear: string;
  data: DashboardOverviewDto | null;
  loading: boolean;
  error: string | null;
}

const piePalette = ["#f97316", "#fb923c", "#fdba74", "#f59e0b", "#fbbf24"];
const accentPalette = ["#f97316", "#3b82f6", "#8b5cf6", "#16a34a", "#ef4444"];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const OverviewTab = ({
  overviewFilter,
  selectedMonth,
  selectedYear,
  data,
  loading,
  error,
}: OverviewTabProps) => {
  const { isDark } = useSiteThemeMode();
  const cardSx = getCardSx(isDark);
  const sectionTitleSx = getSectionTitleSx(isDark);
  const gridStroke = isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const axisColor = isDark ? "rgba(255,255,255,0.62)" : "#64748b";
  const tooltipStyle = {
    background: isDark ? "#101010" : "#ffffff",
    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)",
    borderRadius: "14px",
    color: isDark ? "#ffffff" : "#0f172a",
  };

  const summaryCards = useMemo(() => {
  const summary = data?.summary;
  return [
    {
      key: "revenue",
      title: "Doanh thu",
      value: formatCurrency(summary?.revenue ?? 0),
      icon: AttachMoney,
      accent: success,
      bg: "rgba(22,163,74,0.10)",
    },
    {
      key: "orders",
      title: "Số đơn hàng",
      value: String(summary?.totalOrders ?? 0),
      icon: ShoppingBag,
      accent: info,
      bg: "rgba(59,130,246,0.10)",
    },
    {
      key: "sold",
      title: "Sản phẩm đã bán",
      value: String(summary?.totalProductsSold ?? 0),
      icon: Inventory2,
      accent: violet,
      bg: "rgba(139,92,246,0.10)",
    },
    {
      key: "users",
      title: "Số người dùng",
      value: String(summary?.totalUsers ?? 0),
      icon: Groups,
      accent: danger,
      bg: "rgba(239,68,68,0.10)",
    },
  ];
}, [data]);

  const revenueData = useMemo(
    () => (data?.revenueChart ?? []).map((item) => ({ name: item.label, revenue: item.value })),
    [data]
  );

  const paymentData = useMemo(
    () =>
      (data?.paymentMethodChart ?? []).map((item, index) => ({
        name: item.label,
        value: item.value,
        color: accentPalette[index % accentPalette.length],
      })),
    [data]
  );

  const productSoldData = useMemo(
    () => (data?.productSoldChart ?? []).map((item) => ({ name: item.label, sold: item.value })),
    [data]
  );

  const categoryData = useMemo(
    () =>
      (data?.topCategories ?? []).map((item, index) => ({
        name: item.label,
        sales: item.value,
        color: piePalette[index % piePalette.length],
      })),
    [data]
  );

  const orderStatusData = useMemo(
    () =>
      (data?.orderStatusChart ?? []).map((item) => ({
        name: item.date,
        paid: item.paid,
        unpaid: item.unpaid,
      })),
    [data]
  );

  const addressData = useMemo(
    () =>
      (data?.topAddresses ?? []).map((item, index) => ({
        name: item.label,
        value: item.value,
        color: piePalette[index % piePalette.length],
      })),
    [data]
  );

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      {loading && !data ? (
        <Paper elevation={0} sx={{ ...cardSx, p: 5 }}>
          <Stack alignItems="center" spacing={1.4}>
            <CircularProgress sx={{ color: primary }} />
            <Typography sx={{ color: axisColor }}>Đang tải dữ liệu tổng quan...</Typography>
          </Stack>
        </Paper>
      ) : (
        <>
          <Grid container spacing={2.2}>
            {summaryCards.map((item) => {
              const Icon = item.icon;
              return (
                <Grid size={{ xs: 12, sm: 6, xl: 3 }} key={item.key}>
                  <Paper elevation={0} sx={{ ...cardSx, p: 2.3 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Box>
                        <Typography sx={{ color: axisColor, fontSize: 13 }}>{item.title}</Typography>
                        <Typography sx={{ mt: 0.5, fontSize: 24, fontWeight: 900, color: isDark ? "#ffffff" : "#0f172a" }}>{item.value}</Typography>
                      </Box>
                      <Avatar sx={{ backgroundColor: item.bg, color: item.accent }}>
                        <Icon />
                      </Avatar>
                    </Stack>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>

          <Grid container spacing={2.2}>
            <Grid size={{ xs: 12, xl: 8 }}>
              <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
                <Typography sx={sectionTitleSx}>
                  Doanh thu {overviewFilter === "month" ? `tháng ${selectedMonth}/${selectedYear}` : `năm ${selectedYear}`}
                </Typography>
                <Box sx={{ mt: 2, height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <CartesianGrid stroke={gridStroke} />
                      <XAxis dataKey="name" stroke={axisColor} />
                      <YAxis stroke={axisColor} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fill="#c4b5fd" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, xl: 4 }}>
              <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
                <Typography sx={sectionTitleSx}>
                  Phương thức thanh toán {overviewFilter === "month" ? `tháng ${selectedMonth}/${selectedYear}` : `năm ${selectedYear}`}
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={paymentData} dataKey="value" outerRadius={90}>
                        {paymentData.map((item) => <Cell key={item.name} fill={item.color} />)}
                      </Pie>
                                            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: isDark ? "#ffffff" : "#0f172a" }}
  itemStyle={{ color: isDark ? "#ffffff" : "#0f172a" }}/>
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2.2}>
            <Grid size={{ xs: 12, xl: 4 }}>
              <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
                <Typography sx={sectionTitleSx}>
                  Số lượng sản phẩm bán ra {overviewFilter === "month" ? `tháng ${selectedMonth}/${selectedYear}` : `năm ${selectedYear}`}
                </Typography>
                <Box sx={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={productSoldData}>
                      <CartesianGrid stroke={gridStroke} />
                      <XAxis dataKey="name" stroke={axisColor} />
                      <YAxis stroke={axisColor} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="sold" stroke="#86efac" fill="#bbf7d0" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, xl: 4 }}>
              <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
                <Typography sx={sectionTitleSx}>
                  {overviewFilter === "month"
  ? `Top danh mục bán chạy tháng ${selectedMonth}/${selectedYear}`
  : `Top danh mục bán chạy năm ${selectedYear}`}
                </Typography>
                <Box sx={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} dataKey="sales" outerRadius={88}>
                        {categoryData.map((item) => <Cell key={item.name} fill={item.color} />)}
                      </Pie>
                                            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: isDark ? "#ffffff" : "#0f172a" }}
  itemStyle={{ color: isDark ? "#ffffff" : "#0f172a" }}/>
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2.2}>
            <Grid size={{ xs: 12, xl: 8 }}>
              <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
                <Typography sx={sectionTitleSx}>
                  Số lượng đơn hàng {overviewFilter === "month" ? `tháng ${selectedMonth}/${selectedYear}` : `năm ${selectedYear}`}
                </Typography>
                <Box sx={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={orderStatusData}>
                      <CartesianGrid stroke={gridStroke} />
                      <XAxis dataKey="name" stroke={axisColor} />
                      <YAxis stroke={axisColor} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="paid" fill="#818cf8" name="Đã thanh toán" />
                      <Bar dataKey="unpaid" fill="#86efac" name="Chưa thanh toán" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, xl: 4 }}>
              <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
                <Typography sx={sectionTitleSx}>
                  Top địa chỉ đặt hàng {overviewFilter === "month" ? `tháng ${selectedMonth}/${selectedYear}` : `năm ${selectedYear}`}
                </Typography>
                <Box sx={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={addressData} dataKey="value" outerRadius={88}>
                        {addressData.map((item) => <Cell key={item.name} fill={item.color} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: isDark ? "#ffffff" : "#0f172a" }}
  itemStyle={{ color: isDark ? "#ffffff" : "#0f172a" }}/>
                      
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Stack>
  );
};

export default OverviewTab;
