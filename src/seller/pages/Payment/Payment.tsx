import React, { useEffect, useState } from "react";
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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TableContainer,
  Chip,
  tableCellClasses,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchPaymentOverview } from "../../../state/seller/paymentSlice";

// ====== Styled Table ======
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
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)",
    transform: "translateY(-1px)",
    transition: "all 0.15s ease-in-out",
  },
  transition: "all 0.15s ease-in-out",
}));

const PaymentManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const paymentState = useAppSelector((store) => store.payment);
  const { overview, loading, error } = paymentState;

  // --- Filter State ---
  const [filter, setFilter] = useState({
    status: "All",
    method: "All",
    minAmount: 0,
    maxAmount: 100000000,
    search: "",
  });

  const handleFilterChange = (e: any) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  // ===== Helpers hiển thị =====
  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return {
          border: "success.main",
          color: "success.main",
          bg: "rgba(34,197,94,0.08)",
        };
      case "PENDING":
        return {
          border: "warning.main",
          color: "warning.main",
          bg: "rgba(234,179,8,0.08)",
        };
      case "FAILED":
        return {
          border: "error.main",
          color: "error.main",
          bg: "rgba(239,68,68,0.08)",
        };
      default:
        return { border: "grey.500", color: "grey.700", bg: "transparent" };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "Thành công";
      case "PENDING":
        return "Đang xử lý";
      case "FAILED":
        return "Thất bại";
      default:
        return status;
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

  // --- Filter Transactions ---
  const filteredTransactions =
    overview?.transactions.filter((t) => {
      const statusMatch =
        filter.status === "All" ? true : t.paymentStatus === filter.status;
      const methodMatch =
        filter.method === "All" ? true : t.method === filter.method;
      const amountMatch =
        t.total >= filter.minAmount && t.total <= filter.maxAmount;
      const searchMatch =
        String(t.orderId).toLowerCase().includes(filter.search.toLowerCase()) ||
        String(t.customerName)
          .toLowerCase()
          .includes(filter.search.toLowerCase());
      return statusMatch && methodMatch && amountMatch && searchMatch;
    }) || [];

  // --- Fetch Overview on mount ---
  useEffect(() => {
    dispatch(fetchPaymentOverview());
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
            Quản lý thanh toán
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Theo dõi dòng tiền, giao dịch và thông tin tài khoản thanh toán của
            bạn.
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Cập nhật lần cuối: {format(new Date(), "dd/MM/yyyy HH:mm")}
        </Typography>
      </Box>

      {/* 1. Tổng quan */}
      <Grid container spacing={2} mb={4}>
        {overview &&
          [
            { label: "Tổng doanh thu", value: overview.totalRevenue },
            { label: "Số dư khả dụng", value: overview.balanceAvailable },
            { label: "Tổng tiền đã nhận", value: overview.totalReceived },
            { label: "Thanh toán đang chờ", value: overview.pendingPayments },
            { label: "Tổng số đơn hàng", value: overview.totalOrders },
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
                    ? `${item.value} đơn`
                    : `${item.value.toLocaleString()}₫`}
                </Typography>
              </Paper>
            </Grid>
          ))}
      </Grid>

      {/* 2. Bộ lọc */}
      <Paper
        sx={{
          p: 2.5,
          mb: 4,
          borderRadius: 3,
          border: "1px solid rgba(148,163,184,0.35)",
        }}
        elevation={0}
      >
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle1" fontWeight={600}>
            Bộ lọc
          </Typography>
        </Box>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
                label="Trạng thái"
              >
                <MenuItem value="All">Tất cả</MenuItem>
                <MenuItem value="SUCCESS">Thành công</MenuItem>
                <MenuItem value="PENDING">Đang xử lý</MenuItem>
                <MenuItem value="FAILED">Thất bại</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Phương thức thanh toán</InputLabel>
              <Select
                name="method"
                value={filter.method}
                onChange={handleFilterChange}
                label="Phương thức thanh toán"
              >
                <MenuItem value="All">Tất cả</MenuItem>
                <MenuItem value="COD">COD</MenuItem>
                <MenuItem value="Momo">Momo</MenuItem>
                <MenuItem value="VNPay">VNPay</MenuItem>
                <MenuItem value="ZaloPay">ZaloPay</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              size="small"
              label="Số tiền tối thiểu"
              type="number"
              name="minAmount"
              value={filter.minAmount}
              onChange={handleFilterChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              size="small"
              label="Số tiền tối đa"
              type="number"
              name="maxAmount"
              value={filter.maxAmount}
              onChange={handleFilterChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              size="small"
              label="Tìm kiếm (Mã đơn / Tên KH)"
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              size="small"
              variant="text"
              onClick={() =>
                setFilter({
                  status: "All",
                  method: "All",
                  minAmount: 0,
                  maxAmount: 100000000,
                  search: "",
                })
              }
            >
              Đặt lại bộ lọc
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 3. Danh sách giao dịch */}
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Giao dịch gần đây
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {filteredTransactions.length} giao dịch được hiển thị
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          mb: 4,
          borderRadius: 3,
          border: "1px solid rgba(148,163,184,0.35)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {/* <StyledTableCell>TXN ID</StyledTableCell> */}
              <StyledTableCell>Mã đơn hàng</StyledTableCell>
              <StyledTableCell>Khách hàng</StyledTableCell>
              <StyledTableCell>Sản phẩm</StyledTableCell>
              <StyledTableCell align="right">Tổng tiền</StyledTableCell>
              <StyledTableCell align="center">Phương thức</StyledTableCell>
              <StyledTableCell align="center">Trạng thái</StyledTableCell>
              <StyledTableCell>Thời gian</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {error}
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              !error &&
              filteredTransactions.map((txn: any) => {
                const statusStyle = getStatusColor(txn.paymentStatus);
                return (
                  <StyledTableRow key={txn.orderId}>
                    {/* <StyledTableCell>{txn.txnId}</StyledTableCell> */}
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
                        sx={{
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 500,
                          borderColor: getMethodColor(txn.method),
                          color: getMethodColor(txn.method),
                        }}
                        variant="outlined"
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Chip
                        size="small"
                        label={getStatusLabel(txn.paymentStatus)}
                        sx={{
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 600,
                          borderColor: statusStyle.border,
                          color: statusStyle.color,
                          backgroundColor: statusStyle.bg,
                          minWidth: 90,
                        }}
                        variant="outlined"
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
            {!loading && !error && filteredTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  Không tìm thấy giao dịch nào phù hợp với bộ lọc hiện tại.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentManagementPage;
