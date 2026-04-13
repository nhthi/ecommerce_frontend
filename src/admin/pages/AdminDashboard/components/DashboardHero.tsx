import React from "react";
import { Download, ShoppingBag } from "@mui/icons-material";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { getCardSx, primary, primarySoft } from "../dashboardData";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

const DashboardHero = () => {
  const { isDark } = useSiteThemeMode();
  const cardSx = getCardSx(isDark);

  return (
    <Paper
      elevation={0}
      sx={{
        ...cardSx,
        p: { xs: 2.5, md: 3.5 },
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -80,
          right: -30,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(249,115,22,0.18), transparent 70%)",
        }}
      />

      <Stack
        direction={{ xs: "column", xl: "row" }}
        spacing={3}
        justifyContent="space-between"
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Chip
            label="Tổng quan"
            sx={{
              mb: 1.5,
              color: primary,
              backgroundColor: primarySoft,
              fontWeight: 700,
              borderRadius: "999px",
            }}
          />

          <Typography
            sx={{
              fontSize: { xs: 20, md: 20 },
              fontWeight: 900,
              color: isDark ? "#ffffff" : "#0f172a",
              lineHeight: 1.15,
            }}
          >
            Bảng điều khiển quản trị gọn gàng và dễ theo dõi hơn.
          </Typography>

        
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.2}
          alignSelf="flex-start"
        >
          <Button
            variant="contained"
            startIcon={<Download />}
            sx={{
              borderRadius: "999px",
              px: 2.4,
              py: 1.1,
              textTransform: "none",
              fontWeight: 700,
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              boxShadow: "none",
            }}
          >
            Xuất báo cáo
          </Button>

          <Button
            component={Link}
            to="/admin/orders"
            variant="outlined"
            startIcon={<ShoppingBag />}
            sx={{
              borderRadius: "999px",
              px: 2.4,
              py: 1.1,
              textTransform: "none",
              fontWeight: 700,
              borderColor: isDark
                ? "rgba(255,255,255,0.10)"
                : "rgba(15,23,42,0.12)",
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          >
            Quản lý đơn hàng
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default DashboardHero;