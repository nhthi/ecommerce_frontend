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

  const strongText = isDark ? "#ffffff" : "#0f172a";
  const mutedText = isDark ? "#94a3b8" : "#64748b";
  const softBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
  const panelBg = isDark ? "#141414" : "#ffffff";
  const subPanelBg = isDark ? "rgba(255,255,255,0.03)" : "#f8fafc";

const summaryItems = useMemo(
  () => [
    { label: "Tổng chi tiêu", value: `${totalSpent.toLocaleString()}đ`, color: "#fb923c" },
    { label: "Tổng đơn hàng", value: `${totalOrders}`, color: strongText },
    { label: "Trung bình / đơn", value: `${avgPerOrder.toLocaleString()}đ`, color: "#fdba74" },
    { label: "Tỷ lệ hủy đơn", value: `${cancelRate.toFixed(1)}%`, color: "#f87171" },
  ],
  [avgPerOrder, cancelRate, strongText, totalOrders, totalSpent]
);

  if (loading) {
    return (
      <Box className="flex h-[300px] items-center justify-center">
        <CircularProgress sx={{ color: "#f97316" }} />
      </Box>
    );
  }

  return (
    <Card
      sx={{
        mt: 1,
        p: 1.5,
        backgroundColor: panelBg,
        border: `1px solid ${isDark ? "rgba(249,115,22,0.12)" : "rgba(15,23,42,0.08)"}`,
        color: strongText,
        borderRadius: "24px",
        boxShadow: isDark ? "none" : "0 18px 40px rgba(15,23,42,0.08)",
      }}
    >
      <CardHeader
        titleTypographyProps={{ fontSize: "1.7rem", fontWeight: 900, color: strongText }}
        subheaderTypographyProps={{ fontSize: "1rem", color: mutedText }}
        title="Phân tích mua hàng"
        subheader="Theo dõi chi tiêu, tần suất mua hàng và xu hướng đơn hàng trong thời gian gần đây"
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
                  "&:hover": { borderColor: "#fb923c" },
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
          {summaryItems.map((item) => (
            <Grid key={item.label} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  textAlign: "center",
                  backgroundColor: subPanelBg,
                  borderRadius: "18px",
                  color: strongText,
                  border: `1px solid ${softBorder}`,
                }}
              >
                <Typography sx={{ fontSize: "0.95rem", color: mutedText }}>{item.label}</Typography>
                <Typography sx={{ fontSize: "1.7rem", fontWeight: 900, color: item.color, mt: 1 }}>
                  {item.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ height: 260, mb: 3 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={softBorder} />
              <XAxis dataKey="date" stroke={mutedText} />
              <YAxis stroke={mutedText} />
              <Tooltip
                formatter={(value: any) => `${Number(value).toLocaleString()}d`}
                contentStyle={{
                  background: panelBg,
                  border: `1px solid ${softBorder}`,
                  borderRadius: 14,
                  color: strongText,
                }}
                labelStyle={{ color: strongText }}
              />
              <Line type="monotone" dataKey="amount" stroke="#f97316" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Typography sx={{ fontSize: "1.4rem", fontWeight: 900, color: strongText, mb: 1.5 }}>
          Đơn hàng gần đây
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              {["Mã đơn", "Sản phẩm", "Ngày đặt", "Trạng thái", "Tổng tiền"].map((cell) => (
                <TableCell
                  key={cell}
                  sx={{ color: mutedText, fontSize: "0.95rem", borderColor: softBorder }}
                  align={cell === "Tong tien" ? "right" : "left"}
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
                  <TableCell sx={{ color: strongText, fontSize: "1rem" }}>#{order.orderId}</TableCell>
                  <TableCell sx={{ color: isDark ? "#e2e8f0" : "#334155", fontSize: "1rem" }}>
                    {order.productName}
                  </TableCell>
                  <TableCell sx={{ color: isDark ? "#cbd5e1" : "#64748b", fontSize: "1rem" }}>
                    {order.orderDate}
                  </TableCell>
                  <TableCell
                    sx={{
                      color:
                        order.status === "DELIVERED"
                          ? "#22c55e"
                          : order.status === "PENDING"
                          ? "#f59e0b"
                          : "#fb923c",
                      fontSize: "1rem",
                      fontWeight: 700,
                    }}
                  >
                    {order.status}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#fb923c", fontSize: "1rem", fontWeight: 700 }}>
                    {order.totalAmount.toLocaleString()}d
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ color: mutedText, fontSize: "1rem", borderColor: softBorder }}
                >
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
