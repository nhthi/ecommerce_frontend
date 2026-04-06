import React from "react";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import PolicyLayout from "./PolicyLayout";
import { paymentSections } from "./policyContent";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const Payment = () => {
  const { isDark } = useSiteThemeMode();

  return (
    <PolicyLayout
      eyebrow="Chinh sach thanh toan"
      title="Thanh toan linh hoat, minh bach va uu tien an toan giao dich."
      summary="Noi dung duoi day mo ta cac hinh thuc thanh toan dang ap dung, cach xac nhan giao dich va mot so nguyen tac bao mat co ban de khach hang yen tam hon khi mua sam."
      image="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&q=80"
      facts={[
        "COD chi ap dung voi don du dieu kien va khu vuc ho tro.",
        "Thanh toan truoc co the can thiet voi don lon hoac dat truoc.",
        "Shop uu tien cac kenh thanh toan quen thuoc, de doi chieu.",
        "Thong tin hoan tien duoc xu ly theo kenh thanh toan ban dau.",
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
                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)",
                background: isDark ? "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(10,10,10,0.99))" : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
                boxShadow: isDark ? "0 24px 60px rgba(0,0,0,0.28)" : "0 24px 60px rgba(15,23,42,0.08)",
                color: isDark ? "white" : "#0f172a",
                p: 2.4,
              }}
            >
              <Typography fontSize={24} fontWeight={800}>{section.title}</Typography>
              {section.paragraphs && (
                <Stack spacing={1.1} sx={{ mt: 1.4 }}>
                  {section.paragraphs.map((paragraph) => (
                    <Typography key={paragraph} sx={{ color: isDark ? "rgba(255,255,255,0.74)" : "#475569", fontSize: 14.8, lineHeight: 1.8 }}>
                      {paragraph}
                    </Typography>
                  ))}
                </Stack>
              )}
              {section.bullets && (
                <Stack spacing={1} sx={{ mt: 1.4 }}>
                  {section.bullets.map((bullet) => (
                    <Typography key={bullet} sx={{ color: isDark ? "rgba(255,255,255,0.74)" : "#475569", fontSize: 14.8, lineHeight: 1.8 }}>
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
