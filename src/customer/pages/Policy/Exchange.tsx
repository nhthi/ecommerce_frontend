import React from "react";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import PolicyLayout from "./PolicyLayout";
import { exchangeSections } from "./policyContent";

const Exchange = () => {
  return (
    <PolicyLayout
      eyebrow="Quy định đổi trả"
      title="Đổi trả gọn gàng, dễ hiểu và dễ áp dụng khi phát sinh vấn đề."
      summary="Đây là khung nội dung cơ bản để xử lý các trường hợp sai hàng, lỗi kỹ thuật hoặc nhu cầu đổi trả hợp lý. Bạn có thể tiếp tục điều chỉnh cho sát với quy trình thực tế của shop."
      image="https://images.unsplash.com/photo-1556742208-999815fca738?auto=format&fit=crop&w=1400&q=80"
      facts={[
        "Khung tham khảo hỗ trợ đổi trả trong 7 ngày từ lúc nhận hàng.",
        "Cần giữ sản phẩm, phụ kiện và thông tin đơn hàng để đối chiếu.",
        "Lỗi thuộc về shop sẽ được ưu tiên xử lý và hỗ trợ chi phí hợp lý.",
        "Sản phẩm đã qua sử dụng hoặc thiếu phụ kiện có thể bị từ chối.",
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

export default Exchange;