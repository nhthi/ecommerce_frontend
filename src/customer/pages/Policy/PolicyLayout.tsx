import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { ArrowBack, LocalShipping, Payments, Autorenew, Quiz } from "@mui/icons-material";

const links = [
  { label: "Vận chuyển", path: "/policy/delivery", icon: <LocalShipping sx={{ fontSize: 18 }} /> },
  { label: "Thanh toán", path: "/policy/payment", icon: <Payments sx={{ fontSize: 18 }} /> },
  { label: "Đổi trả", path: "/policy/exchange", icon: <Autorenew sx={{ fontSize: 18 }} /> },
  { label: "FAQ", path: "/policy/faq", icon: <Quiz sx={{ fontSize: 18 }} /> },
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
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #070707 0%, #111111 30%, #090909 100%)",
        px: { xs: 2, md: 3 },
        py: { xs: 3, lg: 4 },
      }}
    >
      <Box sx={{ mx: "auto", maxWidth: "1420px" }}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBack />}
          sx={{
            mb: 2.4,
            textTransform: "none",
            color: "#fff7ed",
            borderRadius: 999,
            border: "1px solid rgba(249,115,22,0.22)",
            px: 2.2,
          }}
        >
          Về trang chủ
        </Button>

        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            borderRadius: "36px",
            border: "1px solid rgba(255,255,255,0.08)",
            background:
              "radial-gradient(circle at top left, rgba(249,115,22,0.18), transparent 24%), linear-gradient(180deg, rgba(20,20,20,0.98), rgba(8,8,8,0.98))",
            boxShadow: "0 30px 90px rgba(0,0,0,0.38)",
            color: "white",
          }}
        >
          <Grid container>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Box sx={{ p: { xs: 2.5, md: 4 } }}>
                <Chip
                  label={eyebrow}
                  variant="outlined"
                  sx={{
                    color: "#fed7aa",
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
                    color: "rgba(255,255,255,0.72)",
                    fontSize: { xs: 15, md: 17 },
                    lineHeight: 1.8,
                  }}
                >
                  {summary}
                </Typography>

                <Grid container spacing={1.2} sx={{ mt: 2.6 }}>
                  {facts.map((fact) => (
                    <Grid key={fact} size={{ xs: 12, sm: 6 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          height: "100%",
                          borderRadius: "22px",
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                          p: 1.6,
                        }}
                      >
                        <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: 14.3, lineHeight: 1.7 }}>
                          {fact}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                <Stack direction={{ xs: "column", md: "row" }} spacing={1.1} sx={{ mt: 2.6 }} flexWrap="wrap" useFlexGap>
                  {links.map((item) => (
                    <Button
                      key={item.path}
                      component={Link}
                      to={item.path}
                      startIcon={item.icon}
                      sx={{
                        borderRadius: 999,
                        textTransform: "none",
                        color: "#fff7ed",
                        border: "1px solid rgba(255,255,255,0.1)",
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

            <Grid size={{ xs: 12, lg: 5 }}>
              <Box sx={{ position: "relative", height: "100%", minHeight: { xs: 260, lg: 520 } }}>
                <Box component="img" src={image} alt={title} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.6))" }} />
                <Box sx={{ position: "absolute", right: 18, bottom: 18, left: 18 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: "24px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(10,10,10,0.65)",
                      backdropFilter: "blur(12px)",
                      color: "white",
                      p: 1.8,
                    }}
                  >
                    <Typography fontSize={22} fontWeight={800}>Thông tin cần biết</Typography>
                    <Typography sx={{ mt: 0.8, color: "rgba(255,255,255,0.72)", fontSize: 14.5, lineHeight: 1.75 }}>
                      Đây là nhóm trang tĩnh được viết theo hướng dễ đọc, giúp khách hàng nắm nhanh thông tin và đối chiếu khi cần hỗ trợ đơn hàng.
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ mt: 2.8 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default PolicyLayout;