import React from "react";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import PolicyLayout from "./PolicyLayout";
import { paymentSections } from "./policyContent";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const Payment = () => {
  const { isDark } = useSiteThemeMode();

  return (
    <PolicyLayout
      eyebrow="Chính sách thanh toán"
      title="Phương thức thanh toán linh hoạt, an toàn và minh bạch."
      summary="Chúng tôi cung cấp nhiều hình thức thanh toán nhằm mang lại sự tiện lợi và an tâm cho khách hàng trong quá trình mua sắm."
      image="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&q=80"
      facts={[
        "Hỗ trợ thanh toán khi nhận hàng (COD) tại khu vực áp dụng.",
        "Đơn hàng giá trị cao có thể yêu cầu thanh toán trước.",
        "Ưu tiên các phương thức thanh toán phổ biến, dễ xác nhận.",
        "Hoàn tiền được thực hiện theo phương thức thanh toán ban đầu.",
      ]}
    >
      <Grid container spacing={2.2}>
        {paymentSections.map((section) => (
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
                        color: isDark
                          ? "rgba(255,255,255,0.74)"
                          : "#475569",
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
                        color: isDark
                          ? "rgba(255,255,255,0.74)"
                          : "#475569",
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

export default Payment;