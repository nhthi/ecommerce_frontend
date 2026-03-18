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
        <Typography fontSize={28} fontWeight={800} color="white">Settings</Typography>
      </Stack>
      <Typography sx={{ mt: 0.8, color: "rgba(255,255,255,0.62)", fontSize: 14.5 }}>
        Cau hinh nhanh cac thong so van hanh de admin quan ly he thong gon hon.
      </Typography>

      <Tabs
        value={value}
        onChange={(_, next) => setValue(next)}
        sx={{ mt: 2.5, borderBottom: "1px solid rgba(255,255,255,0.08)", "& .MuiTab-root": { color: "rgba(255,255,255,0.58)", textTransform: "none", minHeight: 54 }, "& .Mui-selected": { color: "#fb923c !important" }, "& .MuiTabs-indicator": { backgroundColor: "#f97316", height: 3, borderRadius: 999 } }}
      >
        <Tab label="Tong quan" />
        <Tab label="Bao mat" />
        <Tab label="Thanh toan" />
        <Tab label="Thong bao" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <TextField fullWidth label="Ten trang" defaultValue="NHTHI FIT Admin" sx={fieldSx} />
        <TextField fullWidth label="Logo URL" defaultValue="/uploads/logo.png" sx={fieldSx} />
        <TextField select fullWidth label="Ngon ngu mac dinh" defaultValue="vi" sx={fieldSx}>
          <MenuItem value="vi">Tieng Viet</MenuItem>
          <MenuItem value="en">English</MenuItem>
        </TextField>
        <TextField fullWidth label="Mui gio" defaultValue="Asia/Ho_Chi_Minh" sx={fieldSx} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Stack spacing={1.2}>
          <FormControlLabel control={<Switch defaultChecked />} label="Bat xac minh email" sx={{ color: "white" }} />
          <FormControlLabel control={<Switch defaultChecked />} label="Bat 2FA cho admin" sx={{ color: "white" }} />
          <FormControlLabel control={<Switch />} label="Chi cho phep IP noi bo" sx={{ color: "white" }} />
        </Stack>
        <TextField fullWidth label="Danh sach IP tin cay" placeholder="192.168.1.1, 127.0.0.1" sx={{ ...fieldSx, mt: 2 }} />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <TextField select fullWidth label="Don vi tien" defaultValue="VND" sx={fieldSx}>
          <MenuItem value="VND">VND</MenuItem>
          <MenuItem value="USD">USD</MenuItem>
        </TextField>
        <Stack spacing={1.2}>
          <FormControlLabel control={<Switch defaultChecked />} label="Bat VNPay" sx={{ color: "white" }} />
          <FormControlLabel control={<Switch defaultChecked />} label="Bat COD" sx={{ color: "white" }} />
          <FormControlLabel control={<Switch />} label="Bat PayPal" sx={{ color: "white" }} />
        </Stack>
        <TextField fullWidth type="number" label="Thue (%)" defaultValue={10} sx={{ ...fieldSx, mt: 2 }} />
      </TabPanel>

      <TabPanel value={value} index={3}>
        <Stack spacing={1.2}>
          <FormControlLabel control={<Switch defaultChecked />} label="Thong bao email" sx={{ color: "white" }} />
          <FormControlLabel control={<Switch />} label="Thong bao SMS" sx={{ color: "white" }} />
          <FormControlLabel control={<Switch defaultChecked />} label="Thong bao day" sx={{ color: "white" }} />
        </Stack>
      </TabPanel>

      <Box sx={{ mt: 2.5 }}>
        <Button variant="contained" sx={{ borderRadius: 999, textTransform: "none", px: 2.8, background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
          Luu cai dat
        </Button>
      </Box>
    </Paper>
  );
}
