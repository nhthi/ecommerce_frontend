import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchCustomerAnalysis } from "../../../state/customer/analysisSlice";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

interface RecentOrdersProps {
  customerId: Number;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ customerId }) => {
  const [filter, setFilter] = useState<"7d" | "30d" | "6m">("30d");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isDark } = useSiteThemeMode();
  const { customerAnalysis } = useAppSelector((store) => store);
  const { loading, data } = customerAnalysis;

  useEffect(() => {
    if (customerId) {
      const daysMap: Record<string, number> = { "7d": 7, "30d": 30, "6m": 180 };
      dispatch(
        fetchCustomerAnalysis({
          customerId: Number(customerId),
          days: daysMap[filter] || 30,
        })
      );
    }
  }, [customerId, filter, dispatch]);

  const totalSpent = data?.totalSpending ?? 0;
  const totalOrders = data?.totalOrders ?? 0;
  const avgPerOrder = data?.averagePerOrder ?? 0;
  const cancelRate = data?.cancelRate ?? 0;
  const chartData = data?.chartData ?? [];
  const recentOrders = data?.recentOrders ?? [];

  const strongText = isDark ? "#ffffff" : "#000000";
  const mutedText = isDark ? "#9ca3af" : "#6b7280";
  const softBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  const panelBg = isDark ? "#121212" : "#ffffff";
  const subPanelBg = isDark ? "#1a1a1a" : "#f3f4f6";

  const summaryItems = useMemo(
    () => [
      { label: "Tổng chi tiêu", value: `${totalSpent.toLocaleString()}đ` },
      { label: "Tổng đơn hàng", value: `${totalOrders}` },
      { label: "Trung bình / đơn", value: `${avgPerOrder.toLocaleString()}đ` },
      { label: "Tỷ lệ hủy đơn", value: `${cancelRate.toFixed(1)}%` },
    ],
    [avgPerOrder, cancelRate, totalOrders, totalSpent]
  );

  if (loading) {
    return (
      <Box className="flex h-[300px] items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card
      sx={{
        mt: 1,
        p: 1.5,
        backgroundColor: panelBg,
        border: `1px solid ${softBorder}`,
        color: strongText,
        borderRadius: "20px",
        boxShadow: "none",
      }}
    >
      <CardHeader
        titleTypographyProps={{ fontSize: "1.6rem", fontWeight: 800, color: strongText }}
        subheaderTypographyProps={{ fontSize: "0.95rem", color: mutedText }}
        title="Phân tích mua hàng"
        subheader="Theo dõi chi tiêu và hành vi mua hàng gần đây"
        action={
          <ButtonGroup variant="outlined" size="small">
            {(["7d", "30d", "6m"] as const).map((value) => (
              <Button
                key={value}
                onClick={() => setFilter(value)}
                variant={filter === value ? "contained" : "outlined"}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: softBorder,
                  color: filter === value ? "#ffffff" : strongText,
                  backgroundColor: filter === value ? "#000000" : "transparent",
                }}
              >
                {value}
              </Button>
            ))}
          </ButtonGroup>
        }
      />

      <CardContent>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {summaryItems.map((item) => (
            <Grid key={item.label} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: "center",
                  backgroundColor: subPanelBg,
                  borderRadius: "14px",
                  border: `1px solid ${softBorder}`,
                }}
              >
                <Typography sx={{ fontSize: "0.9rem", color: mutedText }}>
                  {item.label}
                </Typography>
                <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, mt: 1 }}>
                  {item.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ height: 250, mb: 3 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={softBorder} />
              <XAxis dataKey="date" stroke={mutedText} />
              <YAxis stroke={mutedText} />
              <Tooltip
                formatter={(value: any) => `${Number(value).toLocaleString()}đ`}
                contentStyle={{
                  background: panelBg,
                  border: `1px solid ${softBorder}`,
                  borderRadius: 10,
                  color: strongText,
                }}
              />
              <Line
  type="monotone"
  dataKey="amount"
  stroke={isDark ? "#e5e7eb" : "#111827"}
  strokeWidth={2.5}
  dot={false}
/>
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, mb: 1.5 }}>
          Đơn hàng gần đây
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              {["Mã đơn", "Sản phẩm", "Ngày đặt", "Trạng thái", "Tổng tiền"].map((cell) => (
                <TableCell
                  key={cell}
                  sx={{ color: mutedText, borderColor: softBorder }}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <TableRow
                  key={order.orderId}
                  hover
                  onClick={() => navigate(`/account/orders/${order.orderId}`)}
                  sx={{
                    cursor: "pointer",
                    "& td": { borderColor: softBorder },
                  }}
                >
                  <TableCell>#{order.orderId}</TableCell>
                  <TableCell>{order.productName}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {order.status}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {order.totalAmount.toLocaleString()}đ
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: mutedText }}>
                  Chưa có đơn hàng
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