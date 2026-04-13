import React from "react";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import PolicyLayout from "./PolicyLayout";
import { exchangeSections } from "./policyContent";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const Exchange = () => {
  const { isDark } = useSiteThemeMode();

  return (
    <PolicyLayout
      eyebrow="Chính sách đổi trả"
      title="Quy định đổi trả rõ ràng, minh bạch và dễ áp dụng."
      summary="Nội dung dưới đây giúp khách hàng nắm rõ các trường hợp được hỗ trợ đổi trả, điều kiện áp dụng và quy trình xử lý khi phát sinh vấn đề với đơn hàng."
      image="https://images.unsplash.com/photo-1556742208-999815fca738?auto=format&fit=crop&w=1400&q=80"
      facts={[
        "Hỗ trợ đổi trả trong vòng 7 ngày kể từ khi nhận hàng.",
        "Vui lòng giữ đầy đủ sản phẩm, phụ kiện và thông tin đơn hàng để đối chiếu.",
        "Các trường hợp lỗi từ phía shop sẽ được ưu tiên hỗ trợ phù hợp.",
        "Sản phẩm đã qua sử dụng hoặc không còn đầy đủ phụ kiện có thể không được chấp nhận.",
      ]}
    >
      <Grid container spacing={2.2}>
        {exchangeSections.map((section) => (
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

export default Exchange;