import React from "react";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import PolicyLayout from "./PolicyLayout";
import { deliverySections } from "./policyContent";

const Delivery = () => {
  return (
    <PolicyLayout
      eyebrow="Chính sách vận chuyển"
      title="Giao hàng rõ ràng, dễ theo dõi và phù hợp với dụng cụ fitness."
      summary="Thông tin giao hàng dưới đây được xây dựng để khách hàng dễ hình dung thời gian xử lý, phạm vi giao và các lưu ý khi nhận hàng, từ phụ kiện nhỏ đến thiết bị lớn."
      image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80"
      facts={[
        "Đơn có sẵn sẽ được xử lý trong 12 đến 24 giờ làm việc.",
        "Nội thành và tỉnh lân cận được ưu tiên tùy tuyến vận chuyển.",
        "Sản phẩm lớn có thể cần xác nhận lịch giao và lắp đặt riêng.",
        "Khách nên kiểm tra tình trạng thùng hàng ngay khi nhận đơn.",
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

export default Delivery;