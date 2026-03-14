import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminSettings() {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        ⚙️ Cài Đặt Quản Trị
      </Typography>

      <Tabs value={value} onChange={handleChange}>
        <Tab label="Tổng Quan" />
        <Tab label="Người Dùng" />
        <Tab label="Bảo Mật" />
        <Tab label="Thanh Toán" />
        <Tab label="Vận Chuyển" />
        <Tab label="Thông Báo" />
        <Tab label="Giao Diện" />
      </Tabs>

      {/* Tổng Quan */}
      <TabPanel value={value} index={0}>
        <TextField
          fullWidth
          label="Tên Trang"
          defaultValue="E-Shop Admin"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="URL Logo"
          defaultValue="/uploads/logo.png"
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Ngôn Ngữ Mặc Định</InputLabel>
          <Select defaultValue="vi">
            <MenuItem value="vi">Tiếng Việt</MenuItem>
            <MenuItem value="en">Tiếng Anh</MenuItem>
          </Select>
        </FormControl>

        <TextField fullWidth label="Múi Giờ" defaultValue="Asia/Ho_Chi_Minh" />
      </TabPanel>

      {/* Người Dùng */}
      <TabPanel value={value} index={1}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Cho phép đăng nhập bằng Google"
        />
        <FormControlLabel
          control={<Switch />}
          label="Cho phép đăng nhập bằng Facebook"
        />
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Yêu cầu xác minh email"
        />
      </TabPanel>

      {/* Bảo Mật */}
      <TabPanel value={value} index={2}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Kích hoạt 2FA"
        />

        <TextField
          fullWidth
          label="Danh sách IP được phép"
          placeholder="192.168.1.1, 127.0.0.1"
          sx={{ mt: 2 }}
        />

        <TextField
          fullWidth
          type="number"
          label="Thời gian phiên đăng nhập (giây)"
          defaultValue={3600}
          sx={{ mt: 2 }}
        />
      </TabPanel>

      {/* Thanh Toán */}
      <TabPanel value={value} index={3}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Đơn Vị Tiền</InputLabel>
          <Select defaultValue="VND">
            <MenuItem value="VND">VND</MenuItem>
            <MenuItem value="USD">USD</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Bật thanh toán PayPal"
        />
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Bật thanh toán VNPay"
        />
        <FormControlLabel control={<Switch />} label="Bật thanh toán COD" />

        <TextField
          fullWidth
          type="number"
          label="Thuế (%)"
          defaultValue={10}
          sx={{ mt: 2 }}
        />
      </TabPanel>

      {/* Vận Chuyển */}
      <TabPanel value={value} index={4}>
        <FormControlLabel control={<Switch defaultChecked />} label="GHN" />
        <FormControlLabel control={<Switch />} label="GHTK" />
        <FormControlLabel control={<Switch defaultChecked />} label="VNPost" />

        <TextField
          fullWidth
          type="number"
          label="Miễn phí vận chuyển từ (VND)"
          defaultValue={500000}
          sx={{ mt: 2 }}
        />
      </TabPanel>

      {/* Thông Báo */}
      <TabPanel value={value} index={5}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Thông báo Email"
        />
        <FormControlLabel control={<Switch />} label="Thông báo SMS" />
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Thông báo đẩy (Push)"
        />
      </TabPanel>

      {/* Giao Diện */}
      <TabPanel value={value} index={6}>
        <TextField
          fullWidth
          label="Chủ đề"
          defaultValue="dark"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          type="color"
          label="Màu Chính"
          defaultValue="#1976d2"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          type="color"
          label="Màu Phụ"
          defaultValue="#ff9800"
        />
      </TabPanel>

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary">
          Lưu Cài Đặt
        </Button>
      </Box>
    </Box>
  );
}
