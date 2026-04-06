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
  Category,
  FitnessCenter,
  MenuBook,
  PendingActions,
} from "@mui/icons-material";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardContentSectionDto } from "../../../../state/admin/adminDashboardSlice";
import { primary, primarySoft } from "../dashboardData";
import { cardSx, sectionTitleSx } from "../dashboardStyles";

interface ContentTabProps {
  overviewFilter: "month" | "year";
  selectedMonth: string;
  selectedYear: string;
  data: DashboardContentSectionDto | null;
  loading: boolean;
  error: string | null;
}

const summaryItems = [
  { key: "publishedBlogs", label: "Bài blog đã đăng", icon: MenuBook },
  { key: "workoutPlans", label: "Workout plans", icon: FitnessCenter },
  { key: "categories", label: "Danh mục", icon: Category },
  { key: "pendingOrders", label: "Đơn chờ xử lý", icon: PendingActions },
] as const;

const formatValue = (value: number) => new Intl.NumberFormat("vi-VN").format(value || 0);

const ContentTab = ({
  overviewFilter,
  selectedMonth,
  selectedYear,
  data,
  loading,
  error,
}: ContentTabProps) => {
  const periodLabel = overviewFilter === "month" ? `tháng ${selectedMonth}/${selectedYear}` : `năm ${selectedYear}`;

  const blogPerformance = useMemo(
    () =>
      (data?.blogPerformance ?? []).map((item) => ({
        name: item.label,
        posts: item.posts,
        views: item.views,
      })),
    [data]
  );

  const contentSummary = data?.contentSummary;

  return (
    <Grid container spacing={2.2}>
      {error && (
        <Grid size={{ xs: 12 }}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}

      <Grid size={{ xs: 12, xl: 8 }}>
        <Paper elevation={0} sx={{ ...cardSx, p: 2.5, height: "100%" }}>
          <Typography sx={sectionTitleSx}>Hiệu suất blog</Typography>
          <Typography sx={{ mt: 0.5, color: "#64748b", fontSize: 14 }}>{periodLabel}</Typography>
          <Box sx={{ mt: 2, height: 320 }}>
            {loading && blogPerformance.length === 0 ? (
              <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }} spacing={1.2}>
                <CircularProgress sx={{ color: primary }} />
                <Typography sx={{ color: "#64748b" }}>Đang tải dữ liệu nội dung...</Typography>
              </Stack>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={blogPerformance}>
                  <CartesianGrid stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatValue(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="posts" stroke="#f97316" strokeWidth={3} name="Bài đăng" />
                  <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} name="Lượt xem" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, xl: 4 }}>
        <Paper elevation={0} sx={{ ...cardSx, p: 2.5, height: "100%" }}>
          <Typography sx={sectionTitleSx}>Khối nội dung</Typography>
          <Typography sx={{ mt: 0.5, color: "#64748b", fontSize: 14 }}>{periodLabel}</Typography>
          <Stack spacing={1.3} sx={{ mt: 2 }}>
            {summaryItems.map((item) => {
              const Icon = item.icon;
              const value = contentSummary?.[item.key] ?? 0;
              return (
                <Stack key={item.key} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.6, borderRadius: "18px", backgroundColor: "#f8fafc", border: "1px solid rgba(15,23,42,0.06)" }}>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Avatar sx={{ width: 40, height: 40, borderRadius: "14px", backgroundColor: primarySoft, color: primary }}>
                      <Icon fontSize="small" />
                    </Avatar>
                    <Typography sx={{ color: "#334155", fontWeight: 600 }}>{item.label}</Typography>
                  </Stack>
                  <Typography sx={{ color: "#0f172a", fontWeight: 900, fontSize: 22 }}>{formatValue(value)}</Typography>
                </Stack>
              );
            })}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ContentTab;
