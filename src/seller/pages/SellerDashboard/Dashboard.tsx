import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Chip,
  Divider,
  tableCellClasses,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { useNavigate } from "react-router-dom";
import { fetchDashboardData } from "../../../state/seller/dashboardSlice";
import { Transaction } from "../../../state/seller/paymentSlice";

interface OrderStatusSummary {
  status: string;
  count: number;
}

interface ProductSummary {
  product: string;
  sold: number;
}

// ============ Styled table ============
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: "linear-gradient(90deg, #0052d4, #4364f7, #6fb1fc)",
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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
    boxShadow: "0 4px 12px rgba(15,23,42,0.12)",
    transform: "translateY(-1px)",
    transition: "all 0.15s ease-in-out",
  },
  transition: "all 0.15s ease-in-out",
}));

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const dashboard = useAppSelector((store) => store.dashboard);

  const overview = dashboard.overview;
  const orderStatus: OrderStatusSummary[] = dashboard.orderStatusSummary;
  const monthlyRevenue = dashboard.monthlyRevenue;
  const topProducts: ProductSummary[] = dashboard.topProducts;
  const transactions: Transaction[] = dashboard.overview?.transactions || [];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AA336A",
    "#8884D8",
    "#FF6666",
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "SUCCESS":
      case "Success":
        return {
          borderColor: "success.main",
          color: "success.main",
          bg: "rgba(34,197,94,0.08)",
        };
      case "PENDING":
      case "Pending":
        return {
          borderColor: "warning.main",
          color: "warning.main",
          bg: "rgba(234,179,8,0.08)",
        };
      case "FAILED":
      case "Failed":
        return {
          borderColor: "error.main",
          color: "error.main",
          bg: "rgba(239,68,68,0.08)",
        };
      default:
        return {
          borderColor: "grey.500",
          color: "grey.700",
          bg: "transparent",
        };
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "Momo":
        return "#a855f7";
      case "VNPay":
        return "#0ea5e9";
      case "ZaloPay":
        return "#22c55e";
      case "COD":
        return "#64748b";
      default:
        return "#94a3b8";
    }
  };

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  return (
    <Box p={4}>
      {/* Header */}
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Bảng điều khiển người bán
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tổng quan về doanh thu, đơn hàng và hoạt động bán hàng của bạn.
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Cập nhật lần cuối: {format(new Date(), "dd/MM/yyyy HH:mm")}
        </Typography>
      </Box>

      {/* Overview */}
      <Grid container spacing={2} mb={4}>
        {[
          { label: "Tổng doanh thu", value: overview?.totalRevenue },
          { label: "Số dư khả dụng", value: overview?.balanceAvailable },
          { label: "Đã nhận", value: overview?.totalReceived },
          { label: "Thanh toán đang chờ", value: overview?.pendingPayments },
          { label: "Tổng số đơn hàng", value: overview?.totalOrders },
        ].map((item) => (
          <Grid size={{ xs: 12, md: 2.4 }} key={item.label}>
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
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}
              >
                {item.label}
              </Typography>

              <Typography variant="h6" fontWeight={700} mt={0.6}>
                {item.label === "Tổng số đơn hàng"
                  ? `${item.value ?? 0} đơn`
                  : `${item.value ? Number(item.value).toLocaleString() : 0}₫`}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={2} mb={4}>
        {/* Monthly Revenue */}
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
              Doanh thu theo tháng
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Biểu đồ doanh thu theo từng tháng
            </Typography>

            <Box mt={2} sx={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: any) =>
                      `${Number(value).toLocaleString()}₫`
                    }
                  />
                  <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Orders by Status */}
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
              Đơn hàng theo trạng thái
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tỷ lệ đơn hàng theo từng trạng thái
            </Typography>

            <Box mt={2} sx={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatus as any}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    label
                  >
                    {orderStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Top Products */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 4,
          borderRadius: 3,
          border: "1px solid rgba(148,163,184,0.35)",
          boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Sản phẩm bán chạy
        </Typography>
        <Typography variant="caption" color="text.secondary" mb={2}>
          Các sản phẩm bán chạy nhất trong thời gian gần đây
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Sản phẩm</StyledTableCell>
                <StyledTableCell align="right">Số lượng bán</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topProducts.map((p) => (
                <StyledTableRow key={p.product}>
                  <StyledTableCell>{p.product}</StyledTableCell>
                  <StyledTableCell align="right">{p.sold}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Recent Transactions */}
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
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Giao dịch gần đây
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {transactions.length} giao dịch gần nhất
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Mã đơn</StyledTableCell>
                <StyledTableCell>Khách hàng</StyledTableCell>
                <StyledTableCell>Sản phẩm</StyledTableCell>
                <StyledTableCell align="right">Tổng tiền</StyledTableCell>
                <StyledTableCell align="center">Phương thức</StyledTableCell>
                <StyledTableCell align="center">Trạng thái</StyledTableCell>
                <StyledTableCell>Thời gian</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {transactions.map((txn) => {
                const statusStyle = getStatusStyle(txn.paymentStatus);

                const statusLabel =
                  txn.paymentStatus === "SUCCESS"
                    ? "Thành công"
                    : txn.paymentStatus === "PENDING"
                    ? "Đang chờ"
                    : "Thất bại";

                return (
                  <StyledTableRow key={txn.txnId}>
                    <StyledTableCell>{txn.orderId}</StyledTableCell>
                    <StyledTableCell>{txn.customerName}</StyledTableCell>
                    <StyledTableCell>{txn.productName}</StyledTableCell>

                    <StyledTableCell align="right">
                      {txn.total.toLocaleString()}₫
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Chip
                        size="small"
                        label={txn.method}
                        variant="outlined"
                        sx={{
                          borderRadius: 999,
                          fontSize: 11,
                          borderColor: getMethodColor(txn.method),
                          color: getMethodColor(txn.method),
                        }}
                      />
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Chip
                        size="small"
                        label={statusLabel}
                        variant="outlined"
                        sx={{
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 600,
                          minWidth: 90,
                          borderColor: statusStyle.borderColor,
                          color: statusStyle.color,
                          backgroundColor: statusStyle.bg,
                        }}
                      />
                    </StyledTableCell>

                    <StyledTableCell>
                      {txn.time
                        ? format(parseISO(txn.time), "dd/MM/yyyy HH:mm")
                        : "-"}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;
