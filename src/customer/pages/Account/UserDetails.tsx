import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchUserProfile, updateProfileUser } from "../../../state/AuthSlice";
import { format } from "date-fns";
import RecentOrders from "./RecentOrder";
import UserProfileForm from "./UserProfileForm";
import CustomLoading from "../../components/CustomLoading/CustomLoading";

const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((store) => store);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    fullName: auth.user?.fullName || "",
    email: auth.user?.email || "",
    mobile: auth.user?.mobile || "",
    birthday: auth.user?.birthday || "",
    gender: auth.user?.gender || "",
    bio: "",
    address: auth.user?.addresses?.[0]?.province || "",
    city: "",
    province: "",
    postalCode: "",
    avatar: auth.user?.avatar || "/default-avatar.png",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated profile:", profile);
  };
  const handleUpdateProfile = async (values: any) => {
    console.log(values);
    setLoading(true);
    await dispatch(updateProfileUser(values));
    setLoading(false);
  };

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <Box className="max-w-5xl mx-auto mt-6">
      {loading && <CustomLoading message="Đang xử lý ảnh..." />}
      {/* Header */}
      <Box className="flex items-center gap-4 mb-6">
        <Avatar
          src={profile.avatar}
          sx={{ width: 80, height: 80, border: "3px solid #1976d2" }}
        />
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {profile.fullName || "Người dùng"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {profile.email}
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Card className="shadow-md rounded-2xl">
        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
        >
          <Tab label="👤 Thông tin cá nhân" />
          <Tab label="🏠 Địa chỉ" />
          <Tab label="🔐 Bảo mật" />
          <Tab label="🛍️ Đơn hàng gần đây" />
        </Tabs>
        <Divider />

        <CardContent>
          {tab === 0 && (
            <>
              <Typography variant="h6" className="mb-4 font-semibold">
                Thông tin cá nhân
              </Typography>

              <UserProfileForm
                initialValues={{
                  fullName: profile.fullName,
                  mobile: profile.mobile,
                  birthday: profile.birthday,
                  gender: profile.gender,
                  bio: profile.bio,
                  avatar: profile.avatar,
                }}
                onSubmit={(values) => {
                  handleUpdateProfile(values);
                }}
              />
            </>
          )}

          {tab === 1 && (
            <>
              <Typography variant="h6" className="mb-4 font-semibold">
                Địa chỉ liên hệ
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Tỉnh/Thành phố"
                    name="province"
                    value={profile.province}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Quận/Huyện"
                    name="city"
                    value={profile.city}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Mã bưu điện"
                    name="postalCode"
                    value={profile.postalCode}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button variant="contained" onClick={handleSave}>
                    Cập nhật địa chỉ
                  </Button>
                </Grid>
              </Grid>
            </>
          )}

          {tab === 2 && (
            <>
              <Typography variant="h6" className="mb-4 font-semibold">
                Bảo mật tài khoản
              </Typography>
              <TextField
                fullWidth
                type="password"
                label="Mật khẩu hiện tại"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                type="password"
                label="Mật khẩu mới"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                type="password"
                label="Xác nhận mật khẩu mới"
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="secondary">
                Cập nhật mật khẩu
              </Button>
            </>
          )}

          {tab === 3 && <RecentOrders customerId={auth.user?.id} />}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;
