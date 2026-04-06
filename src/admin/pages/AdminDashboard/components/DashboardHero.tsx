import React from "react";
import { Download, ShoppingBag } from "@mui/icons-material";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { cardSx } from "../dashboardStyles";
import { primary, primarySoft } from "../dashboardData";

const DashboardHero = () => {
  return (
    <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2.5, md: 3.5 }, overflow: "hidden", position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          top: -80,
          right: -30,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.18), transparent 70%)",
        }}
      />

      <Stack direction={{ xs: "column", xl: "row" }} spacing={3} justifyContent="space-between">
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Chip label="Dashboard demo · fake data" sx={{ mb: 1.5, color: primary, backgroundColor: primarySoft, fontWeight: 700, borderRadius: "999px" }} />
          <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 900, color: "#0f172a", lineHeight: 1.15 }}>
            Admin dashboard chia tab quản lý, gọn hơn và nhiều báo cáo hơn.
          </Typography>
          <Typography sx={{ mt: 1.2, maxWidth: 760, color: "#64748b", fontSize: 15.5 }}>
            UI đang dùng dữ liệu giả để chốt layout trước. Đã bỏ mục nguồn traffic, thêm tabs quản lý, thêm nhiều biểu đồ và có khu vực xuất báo cáo.
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} alignSelf="flex-start">
          <Button
            variant="contained"
            startIcon={<Download />}
            sx={{ borderRadius: "999px", px: 2.4, py: 1.1, textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg, #f97316, #ea580c)", boxShadow: "none" }}
          >
            Xuất báo cáo
          </Button>
          <Button
            component={Link}
            to="/admin/orders"
            variant="outlined"
            startIcon={<ShoppingBag />}
            sx={{ borderRadius: "999px", px: 2.4, py: 1.1, textTransform: "none", fontWeight: 700, borderColor: "rgba(15,23,42,0.12)", color: "#0f172a" }}
          >
            Quản lý đơn hàng
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default DashboardHero;
