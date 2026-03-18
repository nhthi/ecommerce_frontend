import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Box, Typography, Grid, ButtonGroup, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchCustomerAnalysis } from "../../../state/customer/analysisSlice";

interface RecentOrdersProps { customerId: Number; }

const RecentOrders: React.FC<RecentOrdersProps> = ({ customerId }) => {
  const [filter, setFilter] = useState<"7d" | "30d" | "6m">("30d");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { customerAnalysis } = useAppSelector((store) => store);
  const { loading, data } = customerAnalysis;

  useEffect(() => {
    if (customerId) {
      const daysMap: Record<string, number> = { "7d": 7, "30d": 30, "6m": 180 };
      dispatch(fetchCustomerAnalysis({ customerId: Number(customerId), days: daysMap[filter] || 30 }));
    }
  }, [customerId, filter, dispatch]);

  if (loading) return <Box className="flex h-[300px] items-center justify-center"><CircularProgress sx={{ color: "#f97316" }} /></Box>;

  const totalSpent = data?.totalSpending ?? 0;
  const totalOrders = data?.totalOrders ?? 0;
  const avgPerOrder = data?.averagePerOrder ?? 0;
  const cancelRate = data?.cancelRate ?? 0;
  const chartData = data?.chartData ?? [];
  const recentOrders = data?.recentOrders ?? [];

  return (
    <Card sx={{ mt: 1, p: 1.5, backgroundColor: "#141414", border: "1px solid rgba(249,115,22,0.12)", color: "white", borderRadius: "24px", boxShadow: "none" }}>
      <CardHeader
        titleTypographyProps={{ fontSize: "1.7rem", fontWeight: 900, color: "white" }}
        subheaderTypographyProps={{ fontSize: "1rem", color: "#94a3b8" }}
        title="Phân tích mua hàng"
        subheader="Xem mức chi tiêu, tần suất đặt hàng và xu hướng đơn gần đây"
        action={
          <ButtonGroup variant="outlined" size="small">
            {(["7d", "30d", "6m"] as const).map((value) => (
              <Button
                key={value}
                onClick={() => setFilter(value)}
                variant={filter === value ? "contained" : "outlined"}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "rgba(249,115,22,0.28)",
                  color: filter === value ? "#050505" : "#fb923c",
                  backgroundColor: filter === value ? "#f97316" : "transparent",
                  "&:hover": { borderColor: "#fb923c" }
                }}
              >
                {value}
              </Button>
            ))}
          </ButtonGroup>
        }
      />
      <CardContent>
        <Grid container spacing={2.2} sx={{ mb: 3 }}>
          {[
            { label: "Tổng chi tiêu", value: `${totalSpent.toLocaleString()}đ`, color: "#fb923c" },
            { label: "Tổng đơn hàng", value: `${totalOrders}`, color: "#fff" },
            { label: "Trung bình / đơn", value: `${avgPerOrder.toLocaleString()}đ`, color: "#fdba74" },
            { label: "Tỷ lệ hủy đơn", value: `${cancelRate.toFixed(1)}%`, color: "#f87171" }
          ].map((item) => (
            <Grid key={item.label} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper elevation={0} sx={{ p: 2.5, textAlign: "center", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "18px", color: "white", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Typography sx={{ fontSize: "0.95rem", color: "#94a3b8" }}>{item.label}</Typography>
                <Typography sx={{ fontSize: "1.7rem", fontWeight: 900, color: item.color, mt: 1 }}>{item.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ height: 260, mb: 3 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip formatter={(value: any) => `${Number(value).toLocaleString()}đ`} />
              <Line type="monotone" dataKey="amount" stroke="#f97316" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Typography sx={{ fontSize: "1.4rem", fontWeight: 900, color: "white", mb: 1.5 }}>Đơn hàng gần đây</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Mã đơn', 'Sản phẩm', 'Ngày đặt', 'Trạng thái', 'Tổng tiền'].map((cell) => (
                <TableCell
                  key={cell}
                  sx={{ color: "#94a3b8", fontSize: "0.95rem", borderColor: "rgba(255,255,255,0.08)" }}
                  align={cell === 'Tổng tiền' ? 'right' : 'left'}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {recentOrders.length > 0 ? recentOrders.map((order) => (
              <TableRow key={order.orderId} hover onClick={() => navigate(`/account/orders/${order.orderId}`)} sx={{ cursor: "pointer", '& td': { borderColor: 'rgba(255,255,255,0.06)' } }}>
                <TableCell sx={{ color: "white", fontSize: "1rem" }}>#{order.orderId}</TableCell>
                <TableCell sx={{ color: "#e2e8f0", fontSize: "1rem" }}>{order.productName}</TableCell>
                <TableCell sx={{ color: "#cbd5e1", fontSize: "1rem" }}>{order.orderDate}</TableCell>
                <TableCell sx={{ color: order.status === 'DELIVERED' ? '#22c55e' : order.status === 'PENDING' ? '#f59e0b' : '#fb923c', fontSize: "1rem", fontWeight: 700 }}>{order.status}</TableCell>
                <TableCell align="right" sx={{ color: "#fb923c", fontSize: "1rem", fontWeight: 700 }}>{order.totalAmount.toLocaleString()}đ</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: "#94a3b8", fontSize: "1rem", borderColor: "rgba(255,255,255,0.06)" }}>
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