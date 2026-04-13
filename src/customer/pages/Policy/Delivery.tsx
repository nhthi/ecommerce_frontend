import React from "react";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import PolicyLayout from "./PolicyLayout";
import { deliverySections } from "./policyContent";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const Delivery = () => {
  const { isDark } = useSiteThemeMode();

  return (
    <PolicyLayout
      eyebrow="Chính sách vận chuyển"
      title="Giao hàng nhanh chóng, minh bạch và dễ theo dõi."
      summary="Thông tin dưới đây giúp khách hàng nắm rõ thời gian xử lý đơn hàng, phạm vi giao hàng và các lưu ý quan trọng khi nhận sản phẩm."
      image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80"
      facts={[
        "Đơn hàng có sẵn được xử lý trong vòng 12–24 giờ làm việc.",
        "Thời gian giao hàng phụ thuộc khu vực và đơn vị vận chuyển.",
        "Sản phẩm cồng kềnh có thể cần xác nhận lịch giao riêng.",
        "Vui lòng kiểm tra tình trạng hàng hóa khi nhận hàng.",
      ]}
    >
      <Grid container spacing={2.2}>
        {deliverySections.map((section) => (
          <Grid key={section.title} size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: "28px",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(15,23,42,0.08)",
                background: isDark
                  ? "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(10,10,10,0.99))"
                  : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
                boxShadow: isDark
                  ? "0 24px 60px rgba(0,0,0,0.28)"
                  : "0 24px 60px rgba(15,23,42,0.08)",
                color: isDark ? "white" : "#0f172a",
                p: 2.4,
              }}
            >
              <Typography fontSize={24} fontWeight={800}>
                {section.title}
              </Typography>

              {section.paragraphs && (
                <Stack spacing={1.1} sx={{ mt: 1.4 }}>
                  {section.paragraphs.map((paragraph) => (
                    <Typography
                      key={paragraph}
                      sx={{
                        color: isDark ? "rgba(255,255,255,0.74)" : "#475569",
                        fontSize: 14.8,
                        lineHeight: 1.8,
                      }}
                    >
                      {paragraph}
                    </Typography>
                  ))}
                </Stack>
              )}

              {section.bullets && (
                <Stack spacing={1} sx={{ mt: 1.4 }}>
                  {section.bullets.map((bullet) => (
                    <Typography
                      key={bullet}
                      sx={{
                        color: isDark ? "rgba(255,255,255,0.74)" : "#475569",
                        fontSize: 14.8,
                        lineHeight: 1.8,
                      }}
                    >
                      {bullet}
                    </Typography>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </PolicyLayout>
  );
};

export default Delivery;