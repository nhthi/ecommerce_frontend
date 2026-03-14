import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Chip,
  Grid,
  Avatar,
  CircularProgress,
  Alert,
  Snackbar,
  AlertColor,
} from "@mui/material";
import { uploadToCloundinary } from "../../../utils/uploadToCloudinary";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  fetchSellerProfile,
  updateSeller,
} from "../../../state/seller/sellerSlice";

// Các field form cho FE
interface SellerFormValues {
  sellerName: string;
  email: string;
  mobile: string;
  taxCode: string;
  avatar: string;

  // BusinessDetails
  businessName: string;

  // BankDetails
  accountHolderName: string;
  bankAccountNumber: string;
  bankName: string;
  bankBranchName: string;

  // PickupAddress
  streetDetail: string;
  ward: string;
  district: string;
  province: string;
  pickupPhoneNumber: string;
}

interface SellerStats {
  balance: number;
  totalReceived: number;
  totalOrders: number;
  pendingPayments: number;
  totalRevenue: number;
}

// Map accountStatus từ backend -> text tiếng Việt + màu Chip
const getAccountStatusLabel = (status?: string) => {
  switch (status) {
    case "ACTIVE":
      return { label: "Đang hoạt động", color: "success" as const };
    case "SUSPENDED":
      return { label: "Tạm khóa", color: "warning" as const };
    case "PENDING_VERIFICATION":
    default:
      return { label: "Chờ xác minh", color: "default" as const };
  }
};
interface NotifyState {
  open: boolean;
  message: string;
  type: AlertColor; // quan trọng!
}
const SellerAccountPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const sellers = useAppSelector((store) => store.seller);
  const [notify, setNotify] = useState<NotifyState>({
    open: false,
    message: "",
    type: "success",
  });

  const [saving, setSaving] = useState(false); // loading khi update seller
  const [form, setForm] = useState<SellerFormValues>({
    sellerName: "",
    email: "",
    mobile: "",
    taxCode: "",
    avatar: "",

    businessName: "",

    accountHolderName: "",
    bankAccountNumber: "",
    bankName: "",
    bankBranchName: "",

    streetDetail: "",
    ward: "",
    district: "",
    province: "",
    pickupPhoneNumber: "",
  });
  const seller = sellers.profile;
  // Stats demo (tạm fake, sau bạn nối API khác nếu có)
  const [stats] = useState<SellerStats>({
    balance: 18_240_000,
    totalReceived: 24_320_000,
    totalOrders: 158,
    pendingPayments: 2_780_000,
    totalRevenue: 42_560_000,
  });

  const [editMode, setEditMode] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const openNotify = (type: "success" | "error", message: string) => {
    setNotify({ open: true, type, message });
  };
  // Lấy profile seller thật từ backend
  useEffect(() => {
    dispatch(fetchSellerProfile());
  }, [dispatch]);

  // Khi seller thật về -> map vào form
  useEffect(() => {
    console.log("seller--------", seller);
    if (!seller) return;

    setForm({
      sellerName: seller?.sellerName || "",
      email: seller.email || "",
      mobile: seller.mobile || "",
      taxCode: seller.taxCode || "",
      avatar: seller.avatar || "",

      businessName: seller.businessDetails?.businessName || "",

      accountHolderName: seller.bankDetails?.accountHolderName || "",
      bankAccountNumber: seller.bankDetails?.accountNumber || "",
      bankName: seller.bankDetails?.bankName || "",
      bankBranchName: seller.bankDetails?.branchName || "",

      streetDetail: seller.pickupAddress?.streetDetail || "",
      ward: seller.pickupAddress?.ward || "",
      district: seller.pickupAddress?.district || "",
      province: seller.pickupAddress?.province || "",
      pickupPhoneNumber: seller.pickupAddress?.phoneNumber || "",
    });
  }, [seller]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (value: number) => `${value.toLocaleString("vi-VN")}₫`;

  const handleSave = async () => {
    if (!seller) return;

    const payload: any = {};

    // Các field đơn lẻ
    if (form.sellerName) payload.sellerName = form.sellerName;
    if (form.mobile) payload.mobile = form.mobile;
    if (form.email) payload.email = form.email;
    if (form.taxCode) payload.taxCode = form.taxCode;
    if (form.avatar) payload.avatar = form.avatar;

    // BusinessDetails – service của bạn hiện chỉ update businessName
    if (form.businessName) {
      payload.businessDetails = {
        businessName: form.businessName,
      };
    }

    // BankDetails – chỉ update nếu đủ 4 trường (đúng với điều kiện trong service)
    if (
      form.accountHolderName &&
      form.bankAccountNumber &&
      form.bankName &&
      form.bankBranchName
    ) {
      payload.bankDetails = {
        accountHolderName: form.accountHolderName,
        accountNumber: form.bankAccountNumber,
        bankName: form.bankName,
        branchName: form.bankBranchName,
      };
    }

    // PickupAddress – chỉ update nếu đủ 5 trường (đúng điều kiện trong service)
    if (
      form.streetDetail &&
      form.ward &&
      form.district &&
      form.province &&
      form.pickupPhoneNumber
    ) {
      payload.pickupAddress = {
        streetDetail: form.streetDetail,
        ward: form.ward,
        district: form.district,
        province: form.province,
        phoneNumber: form.pickupPhoneNumber,
      };
    }

    try {
      setSaving(true);
      console.log("update------", payload);

      await dispatch(updateSeller(payload)).unwrap();

      openNotify("success", "Cập nhật thông tin người bán thành công!");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      openNotify("error", "Cập nhật thất bại, vui lòng thử lại!");
    } finally {
      setSaving(false);
    }
  };

  // Cập nhật avatar + preview
  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    try {
      setAvatarUploading(true);
      const url = await uploadToCloundinary(file, "image");
      setForm((prev) => ({ ...prev, avatar: url }));
    } catch (error) {
      console.error("Upload avatar lỗi:", error);
      alert("Tải ảnh đại diện thất bại, vui lòng thử lại!");
    } finally {
      setAvatarUploading(false);
    }
  };

  const { label: statusLabel, color: statusColor } = getAccountStatusLabel(
    seller?.accountStatus
  );

  if (sellers.loading && !seller) {
    return (
      <Box className="min-h-[60vh] flex items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      {/* Header + avatar + nút đổi avatar */}
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={3}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1}
          >
            <Avatar
              src={form.avatar}
              sx={{
                width: 72,
                height: 72,
                border: "2px solid #0ea5e9",
                boxShadow: "0 0 0 3px rgba(14,165,233,0.25)",
              }}
            />
            {editMode && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  component="label"
                  sx={{
                    borderRadius: 999,
                    textTransform: "none",
                    fontSize: 12,
                    px: 2,
                    py: 0.5,
                  }}
                  disabled={avatarUploading}
                >
                  {avatarUploading ? (
                    <>
                      <CircularProgress size={16} sx={{ mr: 1 }} /> Đang tải...
                    </>
                  ) : (
                    "Đổi ảnh đại diện"
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAvatarFileChange}
                  />
                </Button>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  textAlign="center"
                >
                  Nên dùng ảnh vuông &lt; 2MB
                </Typography>
              </>
            )}
          </Box>

          <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Tài khoản người bán
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý thông tin cá nhân, gian hàng, ngân hàng và địa chỉ lấy
              hàng.
            </Typography>
          </Box>
        </Box>
        <Chip
          label={statusLabel}
          color={statusColor}
          variant="outlined"
          sx={{ borderRadius: 999, fontWeight: 600 }}
        />
      </Box>

      {/* 1. Thông tin chung & cửa hàng */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: "1px solid rgba(148,163,184,0.35)",
          boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
        }}
        elevation={0}
      >
        <Box
          mb={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Thông tin cá nhân & gian hàng
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Dùng để hiển thị với khách và quản lý tài khoản người bán.
            </Typography>
          </Box>
          {seller?.id && (
            <Chip
              size="small"
              label={`Mã seller: #${seller.id}`}
              variant="outlined"
              sx={{ borderRadius: 999 }}
            />
          )}
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Họ và tên người bán"
              name="sellerName"
              value={form.sellerName}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Email đăng nhập"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Số điện thoại"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Tên gian hàng (businessName)"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Mã số thuế"
              name="taxCode"
              value={form.taxCode}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Link avatar (tuỳ chọn)"
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
              helperText="Có thể dán URL ảnh trực tiếp nếu muốn."
            />
          </Grid>
        </Grid>
      </Paper>

      {/* 2. Ngân hàng */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: "1px solid rgba(148,163,184,0.35)",
          boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
        }}
        elevation={0}
      >
        <Box
          mb={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Thông tin ngân hàng
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hệ thống sẽ chuyển tiền về tài khoản này sau khi đối soát.
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            * Backend chỉ cập nhật khi điền đủ 4 trường
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              label="Tên chủ tài khoản"
              name="accountHolderName"
              value={form.accountHolderName}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              label="Số tài khoản"
              name="bankAccountNumber"
              value={form.bankAccountNumber}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              label="Ngân hàng"
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              label="Chi nhánh"
              name="bankBranchName"
              value={form.bankBranchName}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* 3. Địa chỉ lấy hàng */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: "1px solid rgba(148,163,184,0.35)",
          boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
        }}
        elevation={0}
      >
        <Box
          mb={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Địa chỉ lấy hàng (pickupAddress)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Đơn vị vận chuyển sẽ đến địa chỉ này để lấy hàng.
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            * Backend chỉ cập nhật khi điền đủ 5 trường
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Địa chỉ chi tiết"
              name="streetDetail"
              value={form.streetDetail}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              label="Phường/Xã"
              name="ward"
              value={form.ward}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              label="Quận/Huyện"
              name="district"
              value={form.district}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              label="Tỉnh/Thành phố"
              name="province"
              value={form.province}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              label="SĐT liên hệ lấy hàng"
              name="pickupPhoneNumber"
              value={form.pickupPhoneNumber}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* 4. Thống kê nhanh (demo) */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: "1px solid rgba(148,163,184,0.35)",
          boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
        }}
        elevation={0}
      >
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Thống kê nhanh
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Một số chỉ số tài chính của gian hàng (demo).
        </Typography>

        <Grid container spacing={2} mt={1}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid rgba(148,163,184,0.35)",
                background:
                  "radial-gradient(circle at top left, rgba(59,130,246,0.06), transparent 60%)",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}
              >
                Tổng đơn hàng
              </Typography>
              <Typography variant="h6" fontWeight={700} mt={0.5}>
                {stats.totalOrders} đơn
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid rgba(148,163,184,0.35)",
                background:
                  "radial-gradient(circle at top left, rgba(16,185,129,0.06), transparent 60%)",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}
              >
                Doanh thu tích lũy
              </Typography>
              <Typography variant="h6" fontWeight={700} mt={0.5}>
                {formatCurrency(stats.totalRevenue)}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid rgba(148,163,184,0.35)",
                background:
                  "radial-gradient(circle at top left, rgba(59,130,246,0.06), transparent 60%)",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}
              >
                Số dư khả dụng
              </Typography>
              <Typography variant="h6" fontWeight={700} mt={0.5}>
                {formatCurrency(stats.balance)}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid rgba(148,163,184,0.35)",
                background:
                  "radial-gradient(circle at top left, rgba(234,179,8,0.08), transparent 60%)",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}
              >
                Đang chờ thanh toán
              </Typography>
              <Typography variant="h6" fontWeight={700} mt={0.5}>
                {formatCurrency(stats.pendingPayments)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* 5. Buttons */}
      <Box display="flex" gap={2}>
        {editMode ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ borderRadius: 999, textTransform: "none" }}
              disabled={avatarUploading}
            >
              Lưu thay đổi
            </Button>
            <Button
              variant="outlined"
              onClick={() => setEditMode(false)}
              sx={{ borderRadius: 999, textTransform: "none" }}
              disabled={avatarUploading}
            >
              Hủy
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={() => setEditMode(true)}
            sx={{ borderRadius: 999, textTransform: "none" }}
          >
            Chỉnh sửa thông tin
          </Button>
        )}
      </Box>
      <Snackbar
        open={notify.open}
        autoHideDuration={3000}
        onClose={() => setNotify({ ...notify, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotify({ ...notify, open: false })}
          severity={notify.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notify.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SellerAccountPage;
