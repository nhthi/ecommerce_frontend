import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  AccessTime,
  DirectionsRun,
  Groups2,
  Inventory2,
  LocalShipping,
  MonetizationOn,
  NorthEast,
  NotificationsActive,
  Storefront,
  TrendingUp,
  WarningAmber,
} from "@mui/icons-material";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

const overviewCards = [
  { title: "Doanh thu thang nay", value: "425.6M", note: "+14% so voi thang truoc", icon: MonetizationOn },
  { title: "Don hang dang xu ly", value: "128", note: "18 don can uu tien", icon: LocalShipping },
  { title: "San pham can duyet", value: "37", note: "Tap trung vao nhom ta va phu kien", icon: Inventory2 },
  { title: "Seller dang hoat dong", value: "24", note: "3 ho so moi cho xac minh", icon: Storefront },
];

const monthlyRevenue = [
  { month: "T1", revenue: 48 },
  { month: "T2", revenue: 54 },
  { month: "T3", revenue: 51 },
  { month: "T4", revenue: 66 },
  { month: "T5", revenue: 72 },
  { month: "T6", revenue: 69 },
];

const orderMix = [
  { name: "Moi", value: 24, color: "#f97316" },
  { name: "Dong goi", value: 19, color: "#fb923c" },
  { name: "Dang giao", value: 31, color: "#fdba74" },
  { name: "Hoan tat", value: 20, color: "#22c55e" },
  { name: "Huy", value: 6, color: "#ef4444" },
];

const alerts = [
  { title: "Nhieu don gym mat vua tao trong 2 gio qua", detail: "Kiem tra ton kho de tranh ban vuot so luong.", level: "Can xu ly" },
  { title: "3 seller chua bo sung giay to doi soat", detail: "Nen nhac truoc khi mo rut tien tu dong.", level: "Theo doi" },
  { title: "Ty le bo gio tang o nhom day khang luc", detail: "Can xem lai gia va banner o trang danh muc.", level: "Toi uu" },
];

const quickStats = [
  { label: "Khach hang moi", value: "286", helper: "7 ngay qua" },
  { label: "Tin nhan chua doc", value: "14", helper: "Can phan hoi" },
  { label: "Khoa hoc ban duoc", value: "53", helper: "Tuan nay" },
];

const recentOrders = [
  { id: "ORD-9182", customer: "Nguyen Hoang Anh", total: "1.240.000", status: "Dang giao" },
  { id: "ORD-9178", customer: "Tran Gia Linh", total: "890.000", status: "Moi" },
  { id: "ORD-9172", customer: "Pham Duc Long", total: "2.180.000", status: "Hoan tat" },
];

const topCategories = [
  { name: "Ta tay", value: 78 },
  { name: "Day khang luc", value: 65 },
  { name: "Ghe tap", value: 49 },
  { name: "Phu kien yoga", value: 42 },
];

const cardSx = {
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(180deg, rgba(25,25,25,0.96), rgba(12,12,12,0.98))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
  color: "#ffffff",
};

const AdminDashboardPage: React.FC = () => {
  return (
    <Box sx={{ color: "#ffffff" }} className="space-y-5">
      <Paper elevation={0} sx={{ ...cardSx, overflow: "hidden" }}>
        <Box
          sx={{
            p: { xs: 3, lg: 4 },
            background:
              "radial-gradient(circle at top left, rgba(249,115,22,0.22), transparent 34%), radial-gradient(circle at right, rgba(251,146,60,0.12), transparent 24%)",
          }}
        >
          <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" spacing={3}>
            <Box maxWidth={760}>
              <Chip label="Admin fitness workspace" sx={{ mb: 2, color: "#fed7aa", borderColor: "rgba(249,115,22,0.35)", backgroundColor: "rgba(249,115,22,0.12)" }} variant="outlined" />
              <Typography fontSize={{ xs: 28, lg: 38 }} fontWeight={800} lineHeight={1.08} sx={{ color: "#ffffff" }}>
                Tong quan van hanh he thong ban dung cu fitness, blog va khoa hoc.
              </Typography>
              <Typography sx={{ mt: 1.5, maxWidth: 640, color: "rgba(255,255,255,0.72)", fontSize: 15 }}>
                Tap trung vao doanh thu, xu ly don, duyet seller va ton kho de nhom admin thao tac nhanh hon trong mot giao dien gon, dam va ro rang.
              </Typography>
            </Box>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignSelf="flex-start">
              <Button variant="contained" startIcon={<TrendingUp />} sx={{ borderRadius: 999, px: 2.5, py: 1.1, textTransform: "none", fontWeight: 700, color: "#ffffff", background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
                Lam moi bao cao
              </Button>
              <Button variant="outlined" startIcon={<NotificationsActive />} sx={{ borderRadius: 999, px: 2.5, py: 1.1, textTransform: "none", fontWeight: 700, color: "#fff7ed", borderColor: "rgba(255,255,255,0.16)" }}>
                Xem canh bao
              </Button>
            </Stack>
          </Stack>

          <Grid container spacing={2.2} sx={{ mt: 1.5 }}>
            {overviewCards.map((card) => {
              const Icon = card.icon;
              return (
                <Grid size={{ xs: 12, sm: 6, xl: 3 }} key={card.title}>
                  <Paper elevation={0} sx={{ borderRadius: "24px", border: "1px solid rgba(255,255,255,0.08)", p: 2.2, height: "100%", background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))", color: "#ffffff" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                      <Box>
                        <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 12.5, textTransform: "uppercase", letterSpacing: 0.8 }}>{card.title}</Typography>
                        <Typography fontSize={28} fontWeight={800} sx={{ mt: 0.8, color: "#ffffff" }}>{card.value}</Typography>
                        <Typography sx={{ mt: 0.8, color: "#fdba74", fontSize: 13 }}>{card.note}</Typography>
                      </Box>
                      <Avatar variant="rounded" sx={{ width: 52, height: 52, borderRadius: "18px", backgroundColor: "rgba(249,115,22,0.14)", color: "#fb923c" }}>
                        <Icon />
                      </Avatar>
                    </Stack>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Paper>

      <Grid container spacing={2.2}>
        <Grid size={{ xs: 12, xl: 8 }}>
          <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
              <Box>
                <Typography fontSize={22} fontWeight={800} sx={{ color: "#ffffff" }}>Doanh thu 6 thang</Typography>
                <Typography sx={{ mt: 0.5, color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Bieu do nhanh de theo doi nhom san pham fitness dang ban tot.</Typography>
              </Box>
              <Chip icon={<NorthEast sx={{ color: "#fb923c !important" }} />} label="Tang truong on dinh" variant="outlined" sx={{ color: "#fff7ed", borderColor: "rgba(249,115,22,0.28)" }} />
            </Stack>
            <Box sx={{ mt: 2.5, height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{ fill: "rgba(249,115,22,0.08)" }} contentStyle={{ background: "#111111", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 16, color: "white" }} />
                  <Bar dataKey="revenue" radius={[12, 12, 0, 0]} fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, xl: 4 }}>
          <Paper elevation={0} sx={{ ...cardSx, p: 3, height: "100%" }}>
            <Typography fontSize={22} fontWeight={800} sx={{ color: "#ffffff" }}>Trang thai don hang</Typography>
            <Typography sx={{ mt: 0.5, color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Ty le xu ly hien tai tren toan he thong.</Typography>
            <Box sx={{ mt: 1, height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={orderMix} dataKey="value" innerRadius={56} outerRadius={88} paddingAngle={3}>
                    {orderMix.map((item) => <Cell key={item.name} fill={item.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ background: "#111111", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 16, color: "white" }} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Stack spacing={1}>
              {orderMix.map((item) => (
                <Stack key={item.name} direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ width: 10, height: 10, borderRadius: 999, backgroundColor: item.color }} />
                    <Typography fontSize={14} sx={{ color: "#ffffff" }}>{item.name}</Typography>
                  </Stack>
                  <Typography fontSize={14} fontWeight={700} sx={{ color: "#ffffff" }}>{item.value}%</Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2.2}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper elevation={0} sx={{ ...cardSx, p: 3, height: "100%" }}>
            <Typography fontSize={22} fontWeight={800} sx={{ color: "#ffffff" }}>Canh bao van hanh</Typography>
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              {alerts.map((alert, index) => (
                <Paper key={alert.title} elevation={0} sx={{ borderRadius: "22px", p: 2, border: "1px solid rgba(255,255,255,0.08)", background: index === 0 ? "linear-gradient(180deg, rgba(249,115,22,0.14), rgba(255,255,255,0.03))" : "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))", color: "#ffffff" }}>
                  <Stack direction="row" spacing={1.2} alignItems="flex-start">
                    <Avatar sx={{ width: 38, height: 38, backgroundColor: "rgba(249,115,22,0.14)", color: "#fb923c" }}><WarningAmber fontSize="small" /></Avatar>
                    <Box>
                      <Typography fontWeight={700} fontSize={15.5} sx={{ color: "#ffffff" }}>{alert.title}</Typography>
                      <Typography sx={{ mt: 0.5, color: "rgba(255,255,255,0.7)", fontSize: 13.5 }}>{alert.detail}</Typography>
                      <Chip label={alert.level} size="small" sx={{ mt: 1.2, backgroundColor: "rgba(249,115,22,0.12)", color: "#fdba74" }} />
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 3.5 }}>
          <Paper elevation={0} sx={{ ...cardSx, p: 3, height: "100%" }}>
            <Typography fontSize={22} fontWeight={800} sx={{ color: "#ffffff" }}>Nhip do he thong</Typography>
            <Stack spacing={2.2} sx={{ mt: 2 }}>
              {quickStats.map((item, index) => (
                <Box key={item.label}>
                  <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                    <Typography fontSize={14.5} sx={{ color: "rgba(255,255,255,0.78)" }}>{item.label}</Typography>
                    <Typography fontSize={24} fontWeight={800} sx={{ color: "#ffffff" }}>{item.value}</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={72 - index * 14} sx={{ mt: 1, height: 8, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)", "& .MuiLinearProgress-bar": { borderRadius: 999, background: "linear-gradient(90deg, #f97316, #fb923c)" } }} />
                  <Typography sx={{ mt: 0.8, color: "#fdba74", fontSize: 12.5 }}>{item.helper}</Typography>
                </Box>
              ))}
            </Stack>
            <Divider sx={{ my: 2.5, borderColor: "rgba(255,255,255,0.08)" }} />
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Avatar sx={{ width: 40, height: 40, backgroundColor: "rgba(249,115,22,0.14)", color: "#fb923c" }}><DirectionsRun /></Avatar>
              <Box>
                <Typography fontWeight={700} sx={{ color: "#ffffff" }}>Muc tieu hom nay</Typography>
                <Typography fontSize={13.5} sx={{ color: "rgba(255,255,255,0.68)" }}>Duyet san pham moi truoc 17:00 va dong bo ton kho chieu.</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 3.5 }}>
          <Paper elevation={0} sx={{ ...cardSx, p: 3, height: "100%" }}>
            <Typography fontSize={22} fontWeight={800} sx={{ color: "#ffffff" }}>Hoat dong gan day</Typography>
            <Stack spacing={1.4} sx={{ mt: 2 }}>
              {recentOrders.map((order) => (
                <Paper key={order.id} elevation={0} sx={{ borderRadius: "20px", p: 1.6, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#ffffff" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                    <Box>
                      <Typography fontWeight={700} sx={{ color: "#ffffff" }}>{order.id}</Typography>
                      <Typography fontSize={13.5} sx={{ color: "rgba(255,255,255,0.72)" }}>{order.customer}</Typography>
                      <Typography fontSize={13.5} sx={{ color: "#fdba74", mt: 0.5 }}>{order.total} VND</Typography>
                    </Box>
                    <Chip size="small" label={order.status} sx={{ backgroundColor: order.status === "Hoan tat" ? "rgba(34,197,94,0.14)" : "rgba(249,115,22,0.14)", color: order.status === "Hoan tat" ? "#86efac" : "#fdba74" }} />
                  </Stack>
                </Paper>
              ))}
            </Stack>
            <Divider sx={{ my: 2.5, borderColor: "rgba(255,255,255,0.08)" }} />
            <Typography fontSize={18} fontWeight={800} sx={{ color: "#ffffff" }}>Danh muc ban tot</Typography>
            <Stack spacing={1.1} sx={{ mt: 1.6 }}>
              {topCategories.map((item) => (
                <Stack key={item.name} direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Groups2 sx={{ fontSize: 18, color: "#fb923c" }} />
                    <Typography fontSize={14.5} sx={{ color: "#ffffff" }}>{item.name}</Typography>
                  </Stack>
                  <Typography fontSize={14.5} fontWeight={700} sx={{ color: "#ffffff" }}>{item.value}</Typography>
                </Stack>
              ))}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2.2, color: "rgba(255,255,255,0.6)" }}>
              <AccessTime sx={{ fontSize: 16 }} />
              <Typography fontSize={12.5} sx={{ color: "rgba(255,255,255,0.6)" }}>Cap nhat luc 09:45 hom nay</Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardPage;
