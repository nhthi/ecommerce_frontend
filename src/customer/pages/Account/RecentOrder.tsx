import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Grid,
  ButtonGroup,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchCustomerAnalysis } from "../../../state/customer/analysisSlice";

interface RecentOrdersProps {
  customerId: Number;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ customerId }) => {
  const [filter, setFilter] = useState<"7d" | "30d" | "6m">("30d");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { auth, customerAnalysis } = useAppSelector((store) => store);
  const { loading, data, error } = customerAnalysis;

  // 🔹 Gọi API khi load trang
  useEffect(() => {
    if (customerId) {
      const daysMap: Record<string, number> = { "7d": 7, "30d": 30, "6m": 180 };
      const days = daysMap[filter] || 30;
      dispatch(fetchCustomerAnalysis({ customerId: Number(customerId), days }));
    }
  }, [customerId, filter]);

  // 🔹 Hiển thị trạng thái tải
  if (loading) {
    return (
      <Box className="flex justify-center items-center h-[300px]">
        <CircularProgress />
      </Box>
    );
  }

  // 🔹 Dữ liệu thật từ API
  const totalSpent = data?.totalSpending ?? 0;
  const totalOrders = data?.totalOrders ?? 0;
  const avgPerOrder = data?.averagePerOrder ?? 0;
  const cancelRate = data?.cancelRate ?? 0;
  const chartData = data?.chartData ?? [];
  console.log("chart:" + chartData);

  const recentOrders = data?.recentOrders ?? [];
  const mockChartData = [
    { date: "2025-10-01", total: 1000000 },
    { date: "2025-10-02", total: 2000000 },
    { date: "2025-10-03", total: 1500000 },
  ];
  return (
    <Card sx={{ mt: 4, p: 2 }}>
      <CardHeader
        title="📦 Phân tích hoạt động mua hàng"
        subheader="Xem lại hành trình và thói quen mua sắm của bạn"
        action={
          <ButtonGroup variant="outlined" size="small">
            <Button
              onClick={() => setFilter("7d")}
              variant={filter === "7d" ? "contained" : "outlined"}
            >
              7 ngày
            </Button>
            <Button
              onClick={() => setFilter("30d")}
              variant={filter === "30d" ? "contained" : "outlined"}
            >
              30 ngày
            </Button>
            <Button
              onClick={() => setFilter("6m")}
              variant={filter === "6m" ? "contained" : "outlined"}
            >
              6 tháng
            </Button>
          </ButtonGroup>
        }
      />

      <CardContent>
        {/* 🔹 Thống kê tổng quan */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Tổng chi tiêu
              </Typography>
              <Typography variant="h6" color="primary">
                {totalSpent.toLocaleString()}₫
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Tổng đơn hàng
              </Typography>
              <Typography variant="h6">{totalOrders}</Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Trung bình / đơn
              </Typography>
              <Typography variant="h6" color="success.main">
                {avgPerOrder.toLocaleString()}₫
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Tỉ lệ hủy đơn
              </Typography>
              <Typography variant="h6" color="error.main">
                {cancelRate.toFixed(1)}%
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* 🔹 Biểu đồ doanh thu */}
        <Box sx={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString()}₫`} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#1976d2"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* 🔹 Danh sách đơn hàng gần đây */}
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Đơn hàng gần đây
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Ngày đặt</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Tổng tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <TableRow
                  key={order.orderId}
                  hover
                  onClick={() => navigate(`/account/orders/${order.orderId}`)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>#{order.orderId}</TableCell>
                  <TableCell>{order.productName}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>
                    <Typography
                      color={
                        order.status === "DELIVERED"
                          ? "green"
                          : order.status === "PENDING"
                          ? "orange"
                          : "red"
                      }
                    >
                      {order.status}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {order.totalAmount.toLocaleString()}₫
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Chưa có đơn hàng gần đây
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
