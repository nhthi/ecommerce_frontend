import React from "react";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import PolicyLayout from "./PolicyLayout";
import { deliverySections } from "./policyContent";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const Delivery = () => {
  const { isDark } = useSiteThemeMode();

  return (
    <PolicyLayout
      eyebrow="Chinh sach van chuyen"
      title="Giao hang ro rang, de theo doi va phu hop voi dung cu fitness."
      summary="Thong tin giao hang duoi day duoc xay dung de khach hang de hinh dung thoi gian xu ly, pham vi giao va cac luu y khi nhan hang, tu phu kien nho den thiet bi lon."
      image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80"
      facts={[
        "Don co san se duoc xu ly trong 12 den 24 gio lam viec.",
        "Noi thanh va tinh lan can duoc uu tien tuy tuyen van chuyen.",
        "San pham lon co the can xac nhan lich giao va lap dat rieng.",
        "Khach nen kiem tra tinh trang thung hang ngay khi nhan don.",
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

export default Delivery;
