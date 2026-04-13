import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import PolicyLayout from "./PolicyLayout";
import { faqHighlights, faqItems } from "./policyContent";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const Faq = () => {
  const { isDark } = useSiteThemeMode();

  return (
    <PolicyLayout
      eyebrow="Hỗ trợ khách hàng"
      title="Câu hỏi thường gặp"
      summary="Tổng hợp những thông tin quan trọng giúp khách hàng tra cứu nhanh về đơn hàng, thanh toán, vận chuyển và chính sách hỗ trợ."
      image="https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1400&q=80"
      facts={faqHighlights}
    >
      <Grid container spacing={2.2}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            elevation={0}
            sx={{
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
              Cần hỗ trợ nhanh?
            </Typography>

            <Typography
              sx={{
                mt: 1.1,
                color: isDark ? "rgba(255,255,255,0.74)" : "#475569",
                fontSize: 14.8,
                lineHeight: 1.8,
              }}
            >
              Nếu yêu cầu của bạn liên quan đến đơn hàng, đổi trả hoặc thanh
              toán, vui lòng chuẩn bị mã đơn hàng và thông tin liên hệ để quá
              trình hỗ trợ được xử lý nhanh chóng hơn.
            </Typography>

            <Stack spacing={1.2} sx={{ mt: 2 }}>
              {faqHighlights.map((item) => (
                <Paper
                  key={item}
                  elevation={0}
                  sx={{
                    borderRadius: "18px",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(15,23,42,0.08)",
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(255,255,255,0.78)",
                    p: 1.4,
                  }}
                >
                  <Typography
                    sx={{
                      color: isDark ? "rgba(255,255,255,0.76)" : "#475569",
                      fontSize: 14.4,
                      lineHeight: 1.75,
                    }}
                  >
                    {item}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={1.6}>
            {faqItems.map((item) => (
              <Paper
                key={item.question}
                elevation={0}
                sx={{
                  borderRadius: "24px",
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
                  overflow: "hidden",
                }}
              >
                <Accordion
                  elevation={0}
                  sx={{
                    background: "transparent",
                    color: isDark ? "white" : "#0f172a",
                    boxShadow: "none",
                    "&::before": { display: "none" },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: "#fb923c" }} />}
                    sx={{ px: 2.2, py: 0.7 }}
                  >
                    <Typography fontSize={18} fontWeight={700}>
                      {item.question}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ px: 2.2, pb: 2.2 }}>
                    <Typography
                      sx={{
                        color: isDark ? "rgba(255,255,255,0.74)" : "#475569",
                        fontSize: 15,
                        lineHeight: 1.8,
                      }}
                    >
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </PolicyLayout>
  );
};

export default Faq;