import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { Lock, Person, Email, PhoneIphone } from "@mui/icons-material";
import { useAppSelector } from "../../../state/Store";

const AdminAccountPage: React.FC = () => {
  const { auth } = useAppSelector((store) => store);

  const user = auth.user;

  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    // TODO: Gắn API cập nhật thông tin admin tại đây
    console.log("Cập nhật thông tin:", profileForm);
  };

  const handleChangePassword = () => {
    // TODO: Gắn API đổi mật khẩu tại đây
    console.log("Đổi mật khẩu:", passwordForm);
  };

  const avatarLetter =
    user?.fullName?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "A";

  return (
    <Box className="px-4 lg:px-16 py-8 bg-slate-50 min-h-[80vh]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
          Thông tin tài khoản
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Quản lý thông tin cá nhân và bảo mật tài khoản quản trị viên.
        </p>
      </div>

      <Grid container spacing={4}>
        {/* Cột trái: Thông tin cơ bản */}
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e5e7eb",
              background:
                "linear-gradient(135deg, rgba(239,246,255,0.9), #ffffff)",
            }}
          >
            <CardContent className="flex flex-col items-center py-6">
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "#0f172a",
                  color: "rgb(88,199,250)",
                  fontSize: "2rem",
                  mb: 2,
                }}
                src={user?.avatar || ""}
              >
                {avatarLetter}
              </Avatar>
              <h2 className="text-lg font-semibold text-slate-900">
                {user?.fullName || "Quản trị viên"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Vai trò:{" "}
                <span className="font-medium text-sky-600">
                  {user?.role || "ADMIN"}
                </span>
              </p>

              <Divider className="!my-4 w-full" />

              <div className="w-full space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Email fontSize="small" className="text-sky-500" />
                  <span className="font-medium">Email:</span>
                  <span className="truncate">{user?.email}</span>
                </div>
                {user?.phoneNumber && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <PhoneIphone fontSize="small" className="text-sky-500" />
                    <span className="font-medium">Số điện thoại:</span>
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-600">
                  <Lock fontSize="small" className="text-sky-500" />
                  <span className="font-medium">Trạng thái:</span>
                  <span className="text-emerald-600 font-semibold">
                    Đang hoạt động
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Cột phải: Form chỉnh sửa + đổi mật khẩu */}
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <div className="space-y-5">
            {/* Thông tin cá nhân */}
            <Card
              elevation={0}
              sx={{ borderRadius: 3, border: "1px solid #e5e7eb" }}
            >
              <CardHeader
                title="Thông tin cá nhân"
                subheader="Cập nhật tên hiển thị, số điện thoại và thông tin liên hệ."
                sx={{
                  "& .MuiCardHeader-title": {
                    fontWeight: 700,
                    fontSize: "1rem",
                  },
                  "& .MuiCardHeader-subheader": {
                    fontSize: "0.85rem",
                  },
                }}
                avatar={
                  <div className="bg-sky-100 rounded-2xl p-2">
                    <Person className="text-sky-600" />
                  </div>
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      name="fullName"
                      value={profileForm.fullName}
                      onChange={handleProfileChange}
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      name="phoneNumber"
                      value={profileForm.phoneNumber}
                      onChange={handleProfileChange}
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Email đăng nhập"
                      value={user?.email || ""}
                      size="small"
                      disabled
                      helperText="Email dùng để đăng nhập, không thể thay đổi."
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      variant="contained"
                      onClick={handleSaveProfile}
                      sx={{
                        textTransform: "none",
                        borderRadius: "999px",
                        px: 3,
                        py: 1,
                        backgroundColor: "#0ea5e9",
                        "&:hover": { backgroundColor: "#0284c7" },
                      }}
                    >
                      Lưu thay đổi
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Bảo mật & đổi mật khẩu */}
            <Card
              elevation={0}
              sx={{ borderRadius: 3, border: "1px solid #e5e7eb" }}
            >
              <CardHeader
                title="Bảo mật & mật khẩu"
                subheader="Đổi mật khẩu định kỳ giúp tài khoản của bạn an toàn hơn."
                sx={{
                  "& .MuiCardHeader-title": {
                    fontWeight: 700,
                    fontSize: "1rem",
                  },
                  "& .MuiCardHeader-subheader": {
                    fontSize: "0.85rem",
                  },
                }}
                avatar={
                  <div className="bg-rose-100 rounded-2xl p-2">
                    <Lock className="text-rose-500" />
                  </div>
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Mật khẩu hiện tại"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Mật khẩu mới"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Nhập lại mật khẩu mới"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleChangePassword}
                      sx={{
                        textTransform: "none",
                        borderRadius: "999px",
                        px: 3,
                        py: 1,
                      }}
                    >
                      Đổi mật khẩu
                    </Button>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Gợi ý: sử dụng mật khẩu tối thiểu 8 ký tự bao gồm chữ hoa,
                      chữ thường, số và ký tự đặc biệt.
                    </p>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminAccountPage;
