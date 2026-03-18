import React, { useState } from "react";
import { Avatar, Box, Button, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { AdminPanelSettings, Lock, MailOutline, Person } from "@mui/icons-material";
import { useAppSelector } from "../../../state/Store";

const cardSx = {
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
  color: "#ffffff",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#ffffff",
    borderRadius: "18px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.14)" },
    "&:hover fieldset": { borderColor: "rgba(249,115,22,0.4)" },
    "&.Mui-focused fieldset": { borderColor: "#f97316" },
    "&.Mui-disabled": {
      WebkitTextFillColor: "rgba(255,255,255,0.72)",
      color: "rgba(255,255,255,0.72)",
    },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.64)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#fb923c" },
  "& .MuiFormHelperText-root": { color: "rgba(255,255,255,0.46)" },
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "rgba(255,255,255,0.72)",
  },
};

const innerCardSx = {
  p: 2.4,
  borderRadius: "24px",
  backgroundColor: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#ffffff",
};

const AdminAccountPage: React.FC = () => {
  const { auth } = useAppSelector((store) => store);
  const user = auth.user;
  const [profileForm, setProfileForm] = useState({ fullName: user?.fullName || "", phoneNumber: user?.phoneNumber || "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  return (
    <Box sx={{ color: "#ffffff" }} className="space-y-5">
      <Paper elevation={0} sx={{ ...cardSx, p: { xs: 3, lg: 4 } }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={2} alignItems={{ xs: "flex-start", lg: "center" }}>
              <Avatar sx={{ width: 92, height: 92, fontSize: 34, bgcolor: "rgba(249,115,22,0.14)", color: "#fb923c" }}>
                {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "A"}
              </Avatar>
              <Box>
                <Typography fontSize={28} fontWeight={800} sx={{ color: "#ffffff" }}>{user?.fullName || "Quan tri vien"}</Typography>
                <Typography sx={{ mt: 0.6, color: "rgba(255,255,255,0.68)", fontSize: 14.5 }}>{user?.role || "ROLE_ADMIN"}</Typography>
              </Box>
              <Stack spacing={1.1} width="100%">
                <Paper elevation={0} sx={{ p: 1.5, borderRadius: "20px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff" }}>
                  <Stack direction="row" spacing={1.2} alignItems="center"><MailOutline sx={{ color: "#fb923c" }} /><Typography sx={{ color: "#ffffff" }}>{user?.email}</Typography></Stack>
                </Paper>
                <Paper elevation={0} sx={{ p: 1.5, borderRadius: "20px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff" }}>
                  <Stack direction="row" spacing={1.2} alignItems="center"><AdminPanelSettings sx={{ color: "#fb923c" }} /><Typography sx={{ color: "#ffffff" }}>Trang thai: Dang hoat dong</Typography></Stack>
                </Paper>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Grid container spacing={2.2}>
              <Grid size={{ xs: 12 }}>
                <Paper elevation={0} sx={innerCardSx}>
                  <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2 }}>
                    <Person sx={{ color: "#fb923c" }} />
                    <Typography fontSize={20} fontWeight={800} sx={{ color: "#ffffff" }}>Thong tin ca nhan</Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField fullWidth label="Ho va ten" value={profileForm.fullName} onChange={(e) => setProfileForm((prev) => ({ ...prev, fullName: e.target.value }))} sx={fieldSx} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField fullWidth label="So dien thoai" value={profileForm.phoneNumber} onChange={(e) => setProfileForm((prev) => ({ ...prev, phoneNumber: e.target.value }))} sx={fieldSx} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField fullWidth label="Email dang nhap" value={user?.email || ""} disabled sx={fieldSx} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button variant="contained" sx={{ borderRadius: 999, textTransform: "none", px: 2.8, color: "#ffffff", background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
                        Luu thong tin
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Paper elevation={0} sx={innerCardSx}>
                  <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2 }}>
                    <Lock sx={{ color: "#fb923c" }} />
                    <Typography fontSize={20} fontWeight={800} sx={{ color: "#ffffff" }}>Bao mat tai khoan</Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField fullWidth type="password" label="Mat khau hien tai" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))} sx={fieldSx} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField fullWidth type="password" label="Mat khau moi" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))} sx={fieldSx} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField fullWidth type="password" label="Nhap lai mat khau moi" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} sx={fieldSx} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button variant="outlined" sx={{ borderRadius: 999, textTransform: "none", px: 2.8, color: "#fff7ed", borderColor: "rgba(249,115,22,0.35)" }}>
                        Doi mat khau
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminAccountPage;
