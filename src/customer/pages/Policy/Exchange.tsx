import React from "react";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import PolicyLayout from "./PolicyLayout";
import { exchangeSections } from "./policyContent";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const Exchange = () => {
  const { isDark } = useSiteThemeMode();

  return (
    <PolicyLayout
      eyebrow="Quy dinh doi tra"
      title="Doi tra gon gang, de hieu va de ap dung khi phat sinh van de."
      summary="Day la khung noi dung co ban de xu ly cac truong hop sai hang, loi ky thuat hoac nhu cau doi tra hop ly. Ban co the tiep tuc dieu chinh cho sat voi quy trinh thuc te cua shop."
      image="https://images.unsplash.com/photo-1556742208-999815fca738?auto=format&fit=crop&w=1400&q=80"
      facts={[
        "Khung tham khao ho tro doi tra trong 7 ngay tu luc nhan hang.",
        "Can giu san pham, phu kien va thong tin don hang de doi chieu.",
        "Loi thuoc ve shop se duoc uu tien xu ly va ho tro chi phi hop ly.",
        "San pham da qua su dung hoac thieu phu kien co the bi tu choi.",
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

export default Exchange;
