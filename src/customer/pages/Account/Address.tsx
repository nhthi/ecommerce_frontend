import React, { useEffect, useState } from "react";
import UserAddressCard from "./UserAddressCard";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { Address as AddressType } from "../../../types/UserType";
import { Alert, Snackbar, Typography } from "@mui/material";
import {
  deleteAddress,
  setDefaultAddress,
} from "../../../state/customer/addressSlice";
import { fetchUserProfile } from "../../../state/AuthSlice";
import CustomLoading from "../../components/CustomLoading/CustomLoading";

const Address = () => {
  const { auth } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();
  const [addresses, setAddresses] = useState<AddressType[]>(
    auth.user?.addresses || []
  );
  const [loading, setLoading] = useState(false);
  // Chỉ lấy các địa chỉ có isActive = true
  const activeAddresses = addresses.filter((addr) => addr.active === true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  // Hàm xử lý xóa (nhận từ UserAddressCard)
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await dispatch(deleteAddress(id));
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      setSnackbar({
        open: true,
        message: "Xóa địa chỉ thành công!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Lỗi khi xóa địa chỉ!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSetDefaultAddress = async (id: number) => {
    try {
      setLoading(true);
      await dispatch(setDefaultAddress(id)).unwrap();
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          default: addr.id === id, // chỉ 1 địa chỉ mặc định
        }))
      );
      setSnackbar({
        open: true,
        message: "Đặt làm địa chỉ mặc định thành công!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Không thể đặt địa chỉ mặc định!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  useEffect(() => {
    if (auth.user?.addresses) {
      setAddresses(auth.user.addresses);
    }
  }, [auth.user]);
  return (
    <div className="space-y-3">
      {loading && <CustomLoading message="Đang xử lý" />}
      <Typography variant="h6" className="mb-3 font-semibold">
        Địa chỉ của bạn
      </Typography>

      {activeAddresses.length > 0 ? (
        activeAddresses.map((item) => (
          <UserAddressCard
            key={item.id}
            item={item}
            onDelete={handleDelete}
            onSetDefault={handleSetDefaultAddress}
          />
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          Bạn chưa có địa chỉ nào đang hoạt động.
        </Typography>
      )}
      {/* Snackbar hiển thị thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Address;
