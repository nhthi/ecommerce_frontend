import React from "react";
import { Avatar, Box, Button, Divider, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { Download, LocalShipping, TrendingDown, TrendingUp } from "@mui/icons-material";
import { recentActivities, reportCards, danger, info, primary, primarySoft, success, violet } from "../dashboardData";
import { cardSx, sectionTitleSx } from "../dashboardStyles";

const ReportsTab = () => {
  return (
    <Grid container spacing={2.2}>
      <Grid size={{ xs: 12, xl: 4 }}>
        <Paper elevation={0} sx={{ ...cardSx, p: 2.5, height: "100%" }}>
          <Typography sx={sectionTitleSx}>Xuất báo cáo</Typography>
          <Stack spacing={1.2} sx={{ mt: 2 }}>
            {reportCards.map((item) => {
              const Icon = item.icon;
              return (
                <Paper key={item.title} elevation={0} sx={{ p: 1.6, borderRadius: "18px", border: "1px solid rgba(15,23,42,0.06)", backgroundColor: "#f8fafc" }}>
                  <Stack direction="row" spacing={1.2}>
                    <Avatar sx={{ width: 42, height: 42, backgroundColor: primarySoft, color: primary, borderRadius: "14px" }}>
                      <Icon fontSize="small" />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: "#0f172a", fontWeight: 700 }}>{item.title}</Typography>
                      <Typography sx={{ mt: 0.4, color: "#64748b", fontSize: 13.5 }}>{item.desc}</Typography>
                      <Button startIcon={<Download />} variant="text" sx={{ mt: 0.5, px: 0, textTransform: "none", color: primary, fontWeight: 700 }}>
                        Xuất file
                      </Button>
                    </Box>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, xl: 4 }}>
        <Paper elevation={0} sx={{ ...cardSx, p: 2.5, height: "100%" }}>
          <Typography sx={sectionTitleSx}>Tóm tắt hiệu suất</Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Box>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ color: "#334155", fontWeight: 600 }}>Mục tiêu doanh thu</Typography><Typography sx={{ color: primary, fontWeight: 800 }}>76%</Typography></Stack>
              <LinearProgress variant="determinate" value={76} sx={{ mt: 1, height: 8, borderRadius: 999, backgroundColor: "#e2e8f0", "& .MuiLinearProgress-bar": { backgroundColor: primary } }} />
            </Box>
            <Box>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ color: "#334155", fontWeight: 600 }}>Mục tiêu đơn hàng</Typography><Typography sx={{ color: info, fontWeight: 800 }}>64%</Typography></Stack>
              <LinearProgress variant="determinate" value={64} sx={{ mt: 1, height: 8, borderRadius: 999, backgroundColor: "#e2e8f0", "& .MuiLinearProgress-bar": { backgroundColor: info } }} />
            </Box>
            <Box>
              <Stack direction="row" justifyContent="space-between"><Typography sx={{ color: "#334155", fontWeight: 600 }}>Hiệu suất chăm sóc đơn</Typography><Typography sx={{ color: success, fontWeight: 800 }}>84%</Typography></Stack>
              <LinearProgress variant="determinate" value={84} sx={{ mt: 1, height: 8, borderRadius: 999, backgroundColor: "#e2e8f0", "& .MuiLinearProgress-bar": { backgroundColor: success } }} />
            </Box>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={1.1}>
            <Stack direction="row" justifyContent="space-between"><Typography sx={{ color: "#64748b" }}>Lợi nhuận ước tính</Typography><Stack direction="row" spacing={0.5} alignItems="center"><TrendingUp sx={{ color: success, fontSize: 16 }} /><Typography sx={{ color: success, fontWeight: 800 }}>+9.6%</Typography></Stack></Stack>
            <Stack direction="row" justifyContent="space-between"><Typography sx={{ color: "#64748b" }}>Tỷ lệ hoàn đơn</Typography><Stack direction="row" spacing={0.5} alignItems="center"><TrendingDown sx={{ color: danger, fontSize: 16 }} /><Typography sx={{ color: danger, fontWeight: 800 }}>2.1%</Typography></Stack></Stack>
            <Stack direction="row" justifyContent="space-between"><Typography sx={{ color: "#64748b" }}>Đơn đang giao</Typography><Stack direction="row" spacing={0.5} alignItems="center"><LocalShipping sx={{ color: violet, fontSize: 16 }} /><Typography sx={{ color: violet, fontWeight: 800 }}>126 đơn</Typography></Stack></Stack>
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, xl: 4 }}>
        <Paper elevation={0} sx={{ ...cardSx, p: 2.5, height: "100%" }}>
          <Typography sx={sectionTitleSx}>Nhật ký hoạt động</Typography>
          <Stack spacing={1.2} sx={{ mt: 2 }}>
            {recentActivities.map((item) => {
              const Icon = item.icon;
              return (
                <Stack key={item.title} direction="row" spacing={1.3} sx={{ p: 1.5, borderRadius: "18px", border: "1px solid rgba(15,23,42,0.06)", backgroundColor: "#ffffff" }}>
                  <Avatar sx={{ width: 42, height: 42, backgroundColor: item.bg, color: item.color, borderRadius: "14px" }}>
                    <Icon fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography sx={{ color: "#0f172a", fontWeight: 700 }}>{item.title}</Typography>
                    <Typography sx={{ mt: 0.3, color: "#64748b", fontSize: 13.5 }}>{item.desc}</Typography>
                    <Typography sx={{ mt: 0.5, color: item.color, fontSize: 12.8, fontWeight: 700 }}>{item.time}</Typography>
                  </Box>
                </Stack>
              );
            })}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ReportsTab;
