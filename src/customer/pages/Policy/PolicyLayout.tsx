import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  LocalShipping,
  Payments,
  Autorenew,
  Quiz,
} from "@mui/icons-material";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const links = [
  {
    label: "Vận chuyển",
    path: "/policy/delivery",
    icon: <LocalShipping sx={{ fontSize: 18 }} />,
  },
  {
    label: "Thanh toán",
    path: "/policy/payment",
    icon: <Payments sx={{ fontSize: 18 }} />,
  },
  {
    label: "Đổi trả",
    path: "/policy/exchange",
    icon: <Autorenew sx={{ fontSize: 18 }} />,
  },
  {
    label: "FAQ",
    path: "/policy/faq",
    icon: <Quiz sx={{ fontSize: 18 }} />,
  },
];

const PolicyLayout = ({
  eyebrow,
  title,
  summary,
  image,
  facts,
  children,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  image: string;
  facts: string[];
  children: React.ReactNode;
}) => {
  const { isDark } = useSiteThemeMode();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(180deg, #070707 0%, #111111 30%, #090909 100%)"
          : "linear-gradient(180deg, #f8fafc 0%, #eef2f7 30%, #f6f7fb 100%)",
        px: { xs: 2, md: 3 },
        py: { xs: 3, lg: 4 },
      }}
    >
      <Box sx={{ mx: "auto", maxWidth: "1420px" }}>
        {/* BACK BUTTON */}
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBack />}
          sx={{
            mb: 2.4,
            textTransform: "none",
            color: isDark ? "#fff7ed" : "#0f172a",
            borderRadius: 999,
            border: "1px solid rgba(249,115,22,0.22)",
            px: 2.2,
          }}
        >
          Về trang chủ
        </Button>

        {/* HEADER */}
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            borderRadius: "36px",
            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(15,23,42,0.08)",
            background: isDark
              ? "radial-gradient(circle at top left, rgba(249,115,22,0.18), transparent 24%), linear-gradient(180deg, rgba(20,20,20,0.98), rgba(8,8,8,0.98))"
              : "radial-gradient(circle at top left, rgba(249,115,22,0.14), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
            boxShadow: isDark
              ? "0 30px 90px rgba(0,0,0,0.38)"
              : "0 30px 90px rgba(15,23,42,0.08)",
            color: isDark ? "white" : "#0f172a",
          }}
        >
          <Grid container>
            {/* LEFT */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Box sx={{ p: { xs: 2.5, md: 4 } }}>
                <Chip
                  label={eyebrow}
                  variant="outlined"
                  sx={{
                    color: isDark ? "#fed7aa" : "#c2410c",
                    borderColor: "rgba(249,115,22,0.28)",
                    backgroundColor: "rgba(249,115,22,0.1)",
                  }}
                />

                <Typography
                  fontSize={{ xs: 34, md: 56 }}
                  fontWeight={900}
                  lineHeight={1.02}
                  sx={{ mt: 1.8, maxWidth: 820 }}
                >
                  {title}
                </Typography>

                <Typography
                  sx={{
                    mt: 1.5,
                    maxWidth: 780,
                    color: isDark
                      ? "rgba(255,255,255,0.72)"
                      : "#475569",
                    fontSize: { xs: 15, md: 17 },
                    lineHeight: 1.8,
                  }}
                >
                  {summary}
                </Typography>

                {/* FACTS */}
                <Grid container spacing={1.2} sx={{ mt: 2.6 }}>
                  {facts.map((fact) => (
                    <Grid key={fact} size={{ xs: 12, sm: 6 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          height: "100%",
                          borderRadius: "22px",
                          border: isDark
                            ? "1px solid rgba(255,255,255,0.08)"
                            : "1px solid rgba(15,23,42,0.08)",
                          background: isDark
                            ? "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))"
                            : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.9))",
                          p: 1.6,
                        }}
                      >
                        <Typography
                          sx={{
                            color: isDark
                              ? "rgba(255,255,255,0.8)"
                              : "#334155",
                            fontSize: 14.3,
                            lineHeight: 1.7,
                          }}
                        >
                          {fact}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                {/* LINKS */}
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={1.1}
                  sx={{ mt: 2.6 }}
                  flexWrap="wrap"
                  useFlexGap
                >
                  {links.map((item) => (
                    <Button
                      key={item.path}
                      component={Link}
                      to={item.path}
                      startIcon={item.icon}
                      sx={{
                        borderRadius: 999,
                        textTransform: "none",
                        color: isDark ? "#fff7ed" : "#0f172a",
                        border: isDark
                          ? "1px solid rgba(255,255,255,0.1)"
                          : "1px solid rgba(15,23,42,0.08)",
                        backgroundColor: isDark
                          ? "transparent"
                          : "rgba(255,255,255,0.82)",
                        px: 2.2,
                        py: 1,
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Stack>
              </Box>
            </Grid>

            {/* RIGHT IMAGE */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Box
                sx={{
                  position: "relative",
                  height: "100%",
                  minHeight: { xs: 260, lg: 520 },
                }}
              >
                <Box
  component="img"
  src={image}
  alt={title}
  sx={{
    width: "100%",
    maxWidth: 480,
    height: 520,
    objectFit: "cover",
    borderRadius: "24px",
  }}
/>

                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.6))",
                  }}
                />

                {/* OVERLAY */}
                <Box sx={{ position: "absolute", right: 18, bottom: 18, left: 18 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: "24px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: isDark
                        ? "rgba(10,10,10,0.65)"
                        : "rgba(255,255,255,0.82)",
                      backdropFilter: "blur(12px)",
                      color: isDark ? "white" : "#0f172a",
                      p: 1.8,
                    }}
                  >
                    <Typography fontSize={22} fontWeight={800}>
                      Thông tin cần biết
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.8,
                        color: isDark
                          ? "rgba(255,255,255,0.72)"
                          : "#475569",
                        fontSize: 14.5,
                        lineHeight: 1.75,
                      }}
                    >
                      Tổng hợp các chính sách và hướng dẫn quan trọng giúp bạn
                      dễ dàng tra cứu và xử lý khi phát sinh vấn đề với đơn hàng.
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* CONTENT */}
        <Box sx={{ mt: 2.8 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default PolicyLayout;