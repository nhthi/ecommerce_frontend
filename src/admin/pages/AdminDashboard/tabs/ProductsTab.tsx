import React, { useMemo } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardProductSectionDto } from "../../../../state/admin/adminDashboardSlice";
import { getCardSx, getSectionTitleSx } from "../dashboardData";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

interface ProductsTabProps {
  overviewFilter: "month" | "year";
  selectedMonth: string;
  selectedYear: string;
  data: DashboardProductSectionDto | null;
  loading: boolean;
  error: string | null;
}

const formatValue = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value || 0);

const ProductsTab = ({
  overviewFilter,
  selectedMonth,
  selectedYear,
  data,
  loading,
  error,
}: ProductsTabProps) => {
  const { isDark } = useSiteThemeMode();
  const cardSx = getCardSx(isDark);
  const sectionTitleSx = getSectionTitleSx(isDark);
  const muted = isDark ? "rgba(255,255,255,0.62)" : "#64748b";
  const gridStroke = isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const axisColor = isDark ? "rgba(255,255,255,0.62)" : "#64748b";
  const tooltipStyle = {
    background: isDark ? "#101010" : "#ffffff",
    border: isDark
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid rgba(15,23,42,0.08)",
    borderRadius: "14px",
    color: isDark ? "#ffffff" : "#0f172a",
  };

  const periodLabel =
    overviewFilter === "month"
      ? `Tháng ${selectedMonth}/${selectedYear}`
      : `Năm ${selectedYear}`;

  const topCategories = useMemo(
    () =>
      (data?.topCategories ?? []).map((item) => ({
        name: item.label,
        sales: item.value,
      })),
    [data]
  );

  const inventoryData = useMemo(
    () =>
      (data?.inventoryTrend ?? []).map((item) => ({
        month: item.label,
        inStock: item.inStock,
        lowStock: item.lowStock,
        outOfStock: item.outOfStock,
      })),
    [data]
  );

  const lowStockAlerts = data?.lowStockAlerts ?? [];

  return (
    <Grid container spacing={2.2}>
      {error && (
        <Grid size={{ xs: 12 }}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}

      <Grid size={{ xs: 12, xl: 5 }}>
        <Paper elevation={0} sx={{ ...cardSx, p: 2.5, height: "100%" }}>
          <Typography sx={sectionTitleSx}>Danh mục bán chạy</Typography>
          <Typography sx={{ mt: 0.5, color: muted, fontSize: 14 }}>
            {periodLabel}
          </Typography>

          <Box sx={{ mt: 2.2, height: 320 }}>
            {loading && topCategories.length === 0 ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ height: "100%" }}
                spacing={1.2}
              >
                <CircularProgress sx={{ color: "#f97316" }} />
                <Typography sx={{ color: muted }}>
                  Đang tải dữ liệu danh mục...
                </Typography>
              </Stack>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topCategories}
                  layout="vertical"
                  margin={{ left: 10, right: 10 }}
                >
                  <CartesianGrid stroke={gridStroke} horizontal={false} />
                  <XAxis type="number" stroke={axisColor} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    stroke={axisColor}
                  />
                  <Tooltip
                    formatter={(value: number) => formatValue(value)}
                    contentStyle={tooltipStyle}
                  />
                  <Bar dataKey="sales" radius={[0, 10, 10, 0]} fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, xl: 7 }}>
        <Paper elevation={0} sx={{ ...cardSx, p: 2.5, height: "100%" }}>
          <Typography sx={sectionTitleSx}>Xu hướng tồn kho</Typography>
          <Typography sx={{ mt: 0.5, color: muted, fontSize: 14 }}>
            {periodLabel}
          </Typography>

          <Box sx={{ mt: 2, height: 320 }}>
            {loading && inventoryData.length === 0 ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ height: "100%" }}
                spacing={1.2}
              >
                <CircularProgress sx={{ color: "#f97316" }} />
                <Typography sx={{ color: muted }}>
                  Đang tải dữ liệu tồn kho...
                </Typography>
              </Stack>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryData}>
                  <CartesianGrid stroke={gridStroke} vertical={false} />
                  <XAxis dataKey="month" stroke={axisColor} />
                  <YAxis stroke={axisColor} />
                  <Tooltip
                    formatter={(value: number) => formatValue(value)}
                    contentStyle={tooltipStyle}
                  />
                  <Bar
                    dataKey="inStock"
                    fill="#16a34a"
                    radius={[8, 8, 0, 0]}
                    name="Còn hàng"
                  />
                  <Bar
                    dataKey="lowStock"
                    fill="#f59e0b"
                    radius={[8, 8, 0, 0]}
                    name="Sắp hết"
                  />
                  <Bar
                    dataKey="outOfStock"
                    fill="#ef4444"
                    radius={[8, 8, 0, 0]}
                    name="Hết hàng"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
          <Typography sx={sectionTitleSx}>Cảnh báo tồn kho</Typography>
          <Typography sx={{ mt: 0.5, color: muted, fontSize: 14 }}>
            {periodLabel}
          </Typography>

          <Stack spacing={1.2} sx={{ mt: 2 }}>
            {loading && lowStockAlerts.length === 0 ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ py: 6 }}
                spacing={1.2}
              >
                <CircularProgress sx={{ color: "#f97316" }} />
                <Typography sx={{ color: muted }}>
                  Đang tải cảnh báo tồn kho...
                </Typography>
              </Stack>
            ) : (
              lowStockAlerts.map((item) => (
                <Paper
                  key={item.productId}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: "18px",
                    backgroundColor: isDark ? "#181818" : "#fffaf5",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(249,115,22,0.14)",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                    alignItems="center"
                  >
                    <Box>
                      <Typography
                        sx={{
                          color: isDark ? "#ffffff" : "#0f172a",
                          fontWeight: 700,
                        }}
                      >
                        {item.productName}
                      </Typography>
                      <Typography
                        sx={{ mt: 0.35, color: muted, fontSize: 13.5 }}
                      >
                        SKU: {item.sku} • {item.categoryName}
                      </Typography>
                    </Box>

                    <Chip
                      label={`Còn ${item.quantity}`}
                      sx={{
                        backgroundColor: "rgba(245,158,11,0.14)",
                        color: "#b45309",
                        fontWeight: 800,
                      }}
                    />
                  </Stack>
                </Paper>
              ))
            )}

            {!loading && lowStockAlerts.length === 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "18px",
                  backgroundColor: isDark ? "#181818" : "#f8fafc",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.06)",
                }}
              >
                <Typography sx={{ color: muted, textAlign: "center" }}>
                  Không có cảnh báo tồn kho trong kỳ hiện tại.
                </Typography>
              </Paper>
            )}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ProductsTab;