import React, { useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Tune } from "@mui/icons-material";

function TabPanel({ children, value, index }: { children?: React.ReactNode; value: number; index: number }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

const cardSx = {
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
};

const fieldSx = {
  mb: 2,
  "& .MuiOutlinedInput-root": {
    color: "white",
    borderRadius: "18px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(249,115,22,0.4)" },
    "&.Mui-focused fieldset": { borderColor: "#f97316" },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.58)" },
  "& .MuiSelect-icon": { color: "#fb923c" },
};

export default function AdminSettings() {
  const [value, setValue] = useState(0);

  return (
    <Paper elevation={0} sx={{ ...cardSx, p: { xs: 3, lg: 4 } }}>
      <Stack direction="row" spacing={1.2} alignItems="center">
        <Tune sx={{ color: "#fb923c" }} />
        <Typography fontSize={28} fontWeight={800} color="white">
          Cài đặt hệ thống
        </Typography>
      </Stack>
      <Tabs
        value={value}
        onChange={(_, next) => setValue(next)}
        sx={{
          mt: 2.5,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          "& .MuiTab-root": {
            color: "rgba(255,255,255,0.58)",
            textTransform: "none",
            minHeight: 54,
          },
          "& .Mui-selected": { color: "#fb923c !important" },
          "& .MuiTabs-indicator": {
            backgroundColor: "#f97316",
            height: 3,
            borderRadius: 999,
          },
        }}
      >
        <Tab label="Tổng quan" />
        <Tab label="Bảo mật" />
        <Tab label="Thanh toán" />
        <Tab label="Thông báo" />
      </Tabs>

      {/* TAB 1 */}
      <TabPanel value={value} index={0}>
        <TextField fullWidth label="Tên trang" defaultValue="NHTHI FIT Admin" sx={fieldSx} />
        <TextField fullWidth label="URL logo" defaultValue="/uploads/logo.png" sx={fieldSx} />

        <TextField select fullWidth label="Ngôn ngữ mặc định" defaultValue="vi" sx={fieldSx}>
          <MenuItem value="vi">Tiếng Việt</MenuItem>
          <MenuItem value="en">Tiếng Anh</MenuItem>
        </TextField>

        <TextField fullWidth label="Múi giờ" defaultValue="Asia/Ho_Chi_Minh" sx={fieldSx} />
      </TabPanel>

      {/* TAB 2 */}
      <TabPanel value={value} index={1}>
        <Stack spacing={1.2}>
          <FormControlLabel control={<Switch defaultChecked />} label="Bật xác minh email" sx={{ color: "white" }} />
          <FormControlLabel control={<Switch defaultChecked />} label="Bật xác thực 2 lớp (2FA) cho admin" sx={{ color: "white" }} />
          <FormControlLabel control={<Switch />} label="Chỉ cho phép IP nội bộ" sx={{ color: "white" }} />
        </Stack>

        <TextField
          fullWidth
          label="Danh sách IP tin cậy"
          placeholder="192.168.1.1, 127.0.0.1"
          sx={{ ...fieldSx, mt: 2 }}
        />
      </TabPanel>

      {/* TAB 3 */}
      <TabPanel value={value} index={2}>
        <TextField select fullWidth label="Đơn vị tiền tệ" defaultValue="VND" sx={fieldSx}>
          <MenuItem value="VND">VND</MenuItem>
          <MenuItem value="USD">USD</MenuItem>
        </TextField>

        <Stack spacing={1.2}>
          <FormControlLabel control={<Switch defaultChecked />} label="Bật thanh toán VNPay" sx={{ color: "white" }} />
          <FormControlLabel control={<Switch defaultChecked />} label="Bật thanh toán khi nhận hàng (COD)" sx={{ color: "white" }} />
          <FormControlLabel control={<Switch />} label="Bật PayPal" sx={{ color: "white" }} />
        </Stack>

        <TextField
          fullWidth
          type="number"
          label="Thuế (%)"
          defaultValue={10}
          sx={{ ...fieldSx, mt: 2 }}
        />
      </TabPanel>

      {/* TAB 4 */}
      <TabPanel value={value} index={3}>
        <Stack spacing={1.2}>
          <FormControlLabel control={<Switch defaultChecked />} label="Thông báo qua email" sx={{ color: "white" }} />
          <FormControlLabel control={<Switch />} label="Thông báo SMS" sx={{ color: "white" }} />
          <FormControlLabel control={<Switch defaultChecked />} label="Thông báo đẩy (push notification)" sx={{ color: "white" }} />
        </Stack>
      </TabPanel>

      <Box sx={{ mt: 2.5 }}>
        <Button
          variant="contained"
          sx={{
            borderRadius: 999,
            textTransform: "none",
            px: 2.8,
            background: "linear-gradient(135deg, #f97316, #ea580c)",
          }}
        >
          Lưu cài đặt
        </Button>
      </Box>
    </Paper>
  );
}