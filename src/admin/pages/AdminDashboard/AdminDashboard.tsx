import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Chip,
  Button,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  Tooltip,
  tableCellClasses,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import RefreshIcon from "@mui/icons-material/Refresh";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import StorefrontIcon from "@mui/icons-material/Storefront";
import GroupIcon from "@mui/icons-material/Group";
import PaymentIcon from "@mui/icons-material/Payment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentIcon from "@mui/icons-material/Assignment";

// ========= Styled table =========
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: "linear-gradient(90deg, #0052d4, #4364f7, #6fb1fc)",
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    borderBottomColor: "rgba(148, 163, 184, 0.3)",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)",
    transform: "translateY(-1px)",
    transition: "all 0.15s ease-in-out",
  },
  transition: "all 0.15s ease-in-out",
}));

// ========= Fake data =========
const overview = {
  totalRevenue: 425_600_000,
  totalOrders: 50,
  totalUsers: 25,
  totalSellers: 5,
  pendingPayouts: 19,
  systemBalance: 182_400_000,
};

const monthlyRevenue = [
  { month: "Th1", revenue: 50_000_000 },
  { month: "Th2", revenue: 42_000_000 },
  { month: "Th3", revenue: 53_000_000 },
  { month: "Th4", revenue: 60_000_000 },
  { month: "Th5", revenue: 72_000_000 },
  { month: "Th6", revenue: 64_000_000 },
];

const orderStatusData = [
  { status: "Chờ xử lý", count: 10 },
  { status: "Đã đặt", count: 5 },
  { status: "Đã gửi", count: 15 },
  { status: "Đã giao", count: 8 },
  { status: "Đã huỷ", count: 4 },
  { status: "Trả hàng", count: 8 },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#22c55e",
  "#f97316",
  "#ef4444",
];

const alerts = [
  {
    type: "RỦI RO",
    title: "Tỷ lệ huỷ đơn COD tăng 24% so với tuần trước",
    time: "5 phút trước",
  },
  {
    type: "NHÀ BÁN",
    title: "3 seller bị báo cáo spam / bán hàng giả",
    time: "30 phút trước",
  },
  {
    type: "RÚT TIỀN",
    title: "Có 7 yêu cầu rút tiền chờ duyệt > 24h",
    time: "1 giờ trước",
  },
];

const recentOrders = [
  {
    id: "ORD-908123",
    customer: "Trần Minh Tâm",
    seller: "Local Brand A",
    total: 320_000,
    status: "Đã giao",
  },
  {
    id: "ORD-908090",
    customer: "Nguyễn Thị Hoa",
    seller: "Sneaker Zone",
    total: 1_250_000,
    status: "Đang giao",
  },
  {
    id: "ORD-907999",
    customer: "Lê Quốc Huy",
    seller: "Street Wear B",
    total: 280_000,
    status: "Chờ xử lý",
  },
];

const recentSellers = [
  {
    id: "SEL-101",
    name: "Tokyo Streetwear",
    joined: "Hôm nay",
    status: "Chờ duyệt",
  },
  {
    id: "SEL-099",
    name: "Minimal Studio",
    joined: "Hôm qua",
    status: "Đang hoạt động",
  },
];

const recentPayouts = [
  {
    id: "PAYOUT-20251201-001",
    seller: "Local Brand A",
    amount: 12_800_000,
    status: "Chờ duyệt",
  },
  {
    id: "PAYOUT-20251130-004",
    seller: "Sneaker Zone",
    amount: 8_500_000,
    status: "Hoàn tất",
  },
];

const formatCurrency = (v: number) =>
  v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const AdminDashboardPage: React.FC = () => {
  return (
    <Box p={4}>
      {/* Header */}
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Bảng điều khiển Admin
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tổng quan hệ thống sàn thương mại điện tử nhiều nhà bán: người dùng,
            đơn hàng, thanh toán và các cảnh báo rủi ro.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<NotificationsActiveIcon />}
            sx={{ borderRadius: 999, textTransform: "none" }}
          >
            Xem cảnh báo
          </Button>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            sx={{ borderRadius: 999, textTransform: "none" }}
          >
            Làm mới
          </Button>
        </Stack>
      </Box>

      {/* Overview cards */}
      <Grid container spacing={2} mb={4}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid rgba(148,163,184,0.35)",
              boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
              background:
                "radial-gradient(circle at top left, rgba(59,130,246,0.08), transparent 55%)",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}
                >
                  Tổng doanh thu
                </Typography>
                <Typography variant="h6" fontWeight={700} mt={0.6}>
                  {formatCurrency(overview.totalRevenue)}
                </Typography>
              </Box>
              <PaymentIcon />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid rgba(148,163,184,0.35)",
              boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
              background:
                "radial-gradient(circle at top left, rgba(16,185,129,0.08), transparent 55%)",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}
                >
                  Tổng đơn hàng
                </Typography>
                <Typography variant="h6" fontWeight={700} mt={0.6}>
                  {overview.totalOrders.toLocaleString()} đơn
                </Typography>
              </Box>
              <AssignmentIcon />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid rgba(148,163,184,0.35)",
              boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
              background:
                "radial-gradient(circle at top left, rgba(59,130,246,0.08), transparent 55%)",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}
                >
                  Người dùng / Nhà bán
                </Typography>
                <Typography variant="h6" fontWeight={700} mt={0.6}>
                  {overview.totalUsers} người dùng • {overview.totalSellers} nhà
                  bán
                </Typography>
              </Box>
              <GroupIcon />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid rgba(148,163,184,0.35)",
              boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
              background:
                "radial-gradient(circle at top left, rgba(234,179,8,0.1), transparent 55%)",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}
                >
                  Yêu cầu rút tiền / Số dư hệ thống
                </Typography>
                <Typography variant="body2" fontWeight={600} mt={0.5}>
                  {overview.pendingPayouts} yêu cầu chờ duyệt
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Số dư: {formatCurrency(overview.systemBalance)}
                </Typography>
              </Box>
              <StorefrontIcon />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts row */}
      <Grid container spacing={2} mb={4}>
        {/* Revenue chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid rgba(148,163,184,0.35)",
              boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Tổng quan doanh thu
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Doanh thu theo từng tháng
            </Typography>
            <Box mt={2} sx={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip
                    formatter={(v: any) => formatCurrency(Number(v))}
                  />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Orders status chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid rgba(148,163,184,0.35)",
              boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Đơn hàng theo trạng thái
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tỷ lệ đơn theo từng trạng thái
            </Typography>
            <Box mt={2} sx={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    label
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell
                        key={entry.status}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Middle row: Alerts + Quick actions */}
      <Grid container spacing={2} mb={4}>
        {/* Alerts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid rgba(148,163,184,0.35)",
              boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1.5}
            >
              <Typography variant="h6" fontWeight={600}>
                Cảnh báo & Rủi ro
              </Typography>
              <Chip
                size="small"
                icon={<NotificationsActiveIcon fontSize="small" />}
                label={`${alerts.length} cảnh báo`}
                color="warning"
                variant="outlined"
              />
            </Stack>
            <Stack spacing={1.5}>
              {alerts.map((a, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px dashed rgba(248,113,113,0.7)",
                    background:
                      "radial-gradient(circle at top left, rgba(248,113,113,0.08), transparent 60%)",
                  }}
                >
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" fontWeight={600}>
                      {a.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {a.time}
                    </Typography>
                  </Stack>
                  <Chip
                    size="small"
                    label={a.type}
                    color="error"
                    variant="outlined"
                    sx={{ borderRadius: 999, mt: 0.5 }}
                  />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Quick actions */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid rgba(148,163,184,0.35)",
              boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={1}>
              Thao tác nhanh
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              mb={2}
              display="block"
            >
              Các thao tác quản trị thường dùng.
            </Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<StorefrontIcon />}
                  sx={{ borderRadius: 999, textTransform: "none", flex: 1 }}
                >
                  Duyệt seller mới
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AssignmentIcon />}
                  sx={{ borderRadius: 999, textTransform: "none", flex: 1 }}
                >
                  Duyệt sản phẩm
                </Button>
              </Stack>
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PaymentIcon />}
                  sx={{ borderRadius: 999, textTransform: "none", flex: 1 }}
                >
                  Duyệt rút tiền
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LocalShippingIcon />}
                  sx={{ borderRadius: 999, textTransform: "none", flex: 1 }}
                >
                  Theo dõi đơn bất thường
                </Button>
              </Stack>
              <Button
                variant="text"
                size="small"
                sx={{ alignSelf: "flex-start", textTransform: "none" }}
              >
                Xem toàn bộ trang quản trị &rarr;
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom row: Recent tables */}
      <Grid container spacing={2}>
        {/* Recent orders */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid rgba(148,163,184,0.35)",
              boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
            }}
          >
            <Box
              mb={1.5}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight={600}>
                Đơn hàng gần đây
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {recentOrders.length} đơn gần nhất
              </Typography>
            </Box>
            <Divider sx={{ mb: 1.5 }} />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Mã đơn</StyledTableCell>
                    <StyledTableCell>Khách hàng</StyledTableCell>
                    <StyledTableCell>Nhà bán</StyledTableCell>
                    <StyledTableCell align="right">Tổng tiền</StyledTableCell>
                    <StyledTableCell align="center">Trạng thái</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((o) => (
                    <StyledTableRow key={o.id}>
                      <StyledTableCell>{o.id}</StyledTableCell>
                      <StyledTableCell>{o.customer}</StyledTableCell>
                      <StyledTableCell>{o.seller}</StyledTableCell>
                      <StyledTableCell align="right">
                        {formatCurrency(o.total)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Chip
                          size="small"
                          label={o.status}
                          variant="outlined"
                          sx={{ borderRadius: 999, fontSize: 11 }}
                          color={
                            o.status === "Đã giao"
                              ? "success"
                              : o.status === "Đang giao"
                              ? "primary"
                              : "warning"
                          }
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent sellers & payouts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid rgba(148,163,184,0.35)",
              boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
              mb: 2,
            }}
          >
            <Box
              mb={1.5}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight={600}>
                Nhà bán mới
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {recentSellers.length} seller mới
              </Typography>
            </Box>
            <Divider sx={{ mb: 1.5 }} />
            <Stack spacing={1.5}>
              {recentSellers.map((s) => (
                <Stack
                  key={s.id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {s.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {s.id} • {s.joined}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={s.status}
                    variant={
                      s.status === "Đang hoạt động" ? "outlined" : "filled"
                    }
                    color={
                      s.status === "Đang hoạt động" ? "success" : "warning"
                    }
                    sx={{ borderRadius: 999 }}
                  />
                </Stack>
              ))}
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid rgba(148,163,184,0.35)",
              boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
            }}
          >
            <Box
              mb={1.5}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight={600}>
                Yêu cầu rút tiền gần đây
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {recentPayouts.length} giao dịch
              </Typography>
            </Box>
            <Divider sx={{ mb: 1.5 }} />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Mã yêu cầu</StyledTableCell>
                    <StyledTableCell>Nhà bán</StyledTableCell>
                    <StyledTableCell align="right">Số tiền</StyledTableCell>
                    <StyledTableCell align="center">Trạng thái</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentPayouts.map((p) => (
                    <StyledTableRow key={p.id}>
                      <StyledTableCell>{p.id}</StyledTableCell>
                      <StyledTableCell>{p.seller}</StyledTableCell>
                      <StyledTableCell align="right">
                        {formatCurrency(p.amount)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Chip
                          size="small"
                          label={p.status}
                          variant="outlined"
                          sx={{ borderRadius: 999, fontSize: 11 }}
                          color={
                            p.status === "Hoàn tất"
                              ? "success"
                              : p.status === "Chờ duyệt"
                              ? "warning"
                              : "default"
                          }
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardPage;
