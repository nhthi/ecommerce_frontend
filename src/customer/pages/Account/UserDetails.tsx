import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchUserProfile, updateProfileUser } from "../../../state/AuthSlice";
import RecentOrders from "./RecentOrder";
import UserProfileForm from "./UserProfileForm";
import CustomLoading from "../../components/CustomLoading/CustomLoading";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    backgroundColor: "rgba(255,255,255,0.03)",
    color: "white",
    "& fieldset": { borderColor: "rgba(249,115,22,0.14)" },
    "&:hover fieldset": { borderColor: "rgba(249,115,22,0.36)" },
    "&.Mui-focused fieldset": { borderColor: "#f97316" },
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#fb923c" },
};

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handleUpdateProfile = async (values: any) => { setLoading(true); await dispatch(updateProfileUser(values)); setLoading(false); };
  useEffect(() => { dispatch(fetchUserProfile()); }, [dispatch]);

  return (
    <Box className="space-y-6">
      {loading && <CustomLoading message="Đang xử lý ảnh..." />}

      <Box className="flex flex-col gap-4 rounded-[1.8rem] border border-orange-500/12 bg-[#141414] p-6 sm:flex-row sm:items-center shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <Avatar src={profile.avatar} sx={{ width: 92, height: 92, border: "3px solid #f97316" }} />
        <Box>
          <Typography sx={{ fontSize: "2rem", fontWeight: 900, color: "white" }}>{profile.fullName || "Người dùng"}</Typography>
          <Typography sx={{ fontSize: "1rem", color: "#cbd5e1", mt: 0.5 }}>{profile.email}</Typography>
        </Box>
      </Box>

      <div className="rounded-[1.8rem] border border-orange-500/12 bg-[#141414] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} variant="scrollable" scrollButtons="auto" sx={{ "& .MuiTab-root": { textTransform: "none", fontWeight: 700, fontSize: "1rem", color: "#94a3b8" }, "& .Mui-selected": { color: "#fb923c" }, "& .MuiTabs-indicator": { backgroundColor: "#f97316", height: 3, borderRadius: 3 } }}>
          <Tab label="Thông tin cá nhân" />
          <Tab label="Địa chỉ" />
          <Tab label="Bảo mật" />
          <Tab label="Đơn hàng gần đây" />
        </Tabs>

        <div className="mt-6">
          {tab === 0 && (
            <>
              <Typography sx={{ fontSize: "1.7rem", fontWeight: 900, color: "white", mb: 3 }}>Thông tin cá nhân</Typography>
              <UserProfileForm
                initialValues={{
                  fullName: profile.fullName,
                  mobile: profile.mobile,
                  birthday: profile.birthday,
                  gender: profile.gender,
                  bio: profile.bio,
                  avatar: profile.avatar
                }}
                onSubmit={handleUpdateProfile}
              />
            </>
          )}

          {tab === 1 && (
            <div className="space-y-4">
              <Typography sx={{ fontSize: "1.7rem", fontWeight: 900, color: "white" }}>Địa chỉ liên hệ</Typography>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField fullWidth label="Địa chỉ" name="address" value={profile.address} onChange={handleChange} sx={inputSx} />
                <TextField fullWidth label="Tỉnh/Thành phố" name="province" value={profile.province} onChange={handleChange} sx={inputSx} />
                <TextField fullWidth label="Quận/Huyện" name="city" value={profile.city} onChange={handleChange} sx={inputSx} />
                <TextField fullWidth label="Mã bưu điện" name="postalCode" value={profile.postalCode} onChange={handleChange} sx={inputSx} />
              </div>
              <Button variant="contained" sx={{ mt: 1, borderRadius: "999px", textTransform: "none", fontWeight: 800, background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", color: "#050505", boxShadow: "none", px: 3 }}>Cập nhật địa chỉ</Button>
            </div>
          )}

          {tab === 2 && (
            <div className="space-y-4">
              <Typography sx={{ fontSize: "1.7rem", fontWeight: 900, color: "white" }}>Bảo mật tài khoản</Typography>
              <TextField fullWidth type="password" label="Mật khẩu hiện tại" sx={inputSx} />
              <TextField fullWidth type="password" label="Mật khẩu mới" sx={inputSx} />
              <TextField fullWidth type="password" label="Xác nhận mật khẩu mới" sx={inputSx} />
              <Button variant="contained" sx={{ borderRadius: "999px", textTransform: "none", fontWeight: 800, background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", color: "#050505", boxShadow: "none", px: 3 }}>Cập nhật mật khẩu</Button>
            </div>
          )}

          {tab === 3 && <RecentOrders customerId={auth.user?.id} />}
        </div>
      </div>
    </Box>
  );
};

export default UserProfile;