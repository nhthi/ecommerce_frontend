import React from "react";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import PolicyLayout from "./PolicyLayout";
import { paymentSections } from "./policyContent";

const Payment = () => {
  return (
    <PolicyLayout
      eyebrow="Chính sách thanh toán"
      title="Thanh toán linh hoạt, minh bạch và ưu tiên an toàn giao dịch."
      summary="Nội dung dưới đây mô tả các hình thức thanh toán đang áp dụng, cách xác nhận giao dịch và một số nguyên tắc bảo mật cơ bản để khách hàng yên tâm hơn khi mua sắm."
      image="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&q=80"
      facts={[
        "COD chỉ áp dụng với đơn đủ điều kiện và khu vực hỗ trợ.",
        "Thanh toán trước có thể cần thiết với đơn lớn hoặc đặt trước.",
        "Shop ưu tiên các kênh thanh toán quen thuộc, dễ đối chiếu.",
        "Thông tin hoàn tiền được xử lý theo kênh thanh toán ban đầu.",
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
                border: "1px solid rgba(255,255,255,0.08)",
                background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(10,10,10,0.99))",
                boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
                color: "white",
                p: 2.4,
              }}
            >
              <Typography fontSize={24} fontWeight={800}>{section.title}</Typography>
              {section.paragraphs && (
                <Stack spacing={1.1} sx={{ mt: 1.4 }}>
                  {section.paragraphs.map((paragraph) => (
                    <Typography key={paragraph} sx={{ color: "rgba(255,255,255,0.74)", fontSize: 14.8, lineHeight: 1.8 }}>
                      {paragraph}
                    </Typography>
                  ))}
                </Stack>
              )}
              {section.bullets && (
                <Stack spacing={1} sx={{ mt: 1.4 }}>
                  {section.bullets.map((bullet) => (
                    <Typography key={bullet} sx={{ color: "rgba(255,255,255,0.74)", fontSize: 14.8, lineHeight: 1.8 }}>
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