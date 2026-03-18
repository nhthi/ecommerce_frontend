import React, { useEffect, useState } from "react";
import UserAddressCard from "./UserAddressCard";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { Address as AddressType } from "../../../types/UserType";
import { Alert, Snackbar } from "@mui/material";
import { deleteAddress, setDefaultAddress } from "../../../state/customer/addressSlice";
import CustomLoading from "../../components/CustomLoading/CustomLoading";

const Address = () => {
  const { auth } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();
  const [addresses, setAddresses] = useState<AddressType[]>(auth.user?.addresses || []);
  const [loading, setLoading] = useState(false);
  const activeAddresses = addresses.filter((addr) => addr.active === true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await dispatch(deleteAddress(id));
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      setSnackbar({ open: true, message: "Xóa địa chỉ thành công.", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Không thể xóa địa chỉ lúc này.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (id: number) => {
    try {
      setLoading(true);
      await dispatch(setDefaultAddress(id)).unwrap();
      setAddresses((prev) => prev.map((addr) => ({ ...addr, default: addr.id === id })));
      setSnackbar({ open: true, message: "Đã đặt địa chỉ mặc định.", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Không thể đặt địa chỉ mặc định.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.user?.addresses) setAddresses(auth.user.addresses);
  }, [auth.user]);

  return (
    <div className="space-y-5">
      {loading && <CustomLoading message="Đang xử lý..." />}

      <div>
        <h1 className="text-3xl font-black text-white">Địa chỉ</h1>
        <p className="mt-2 text-base leading-7 text-slate-300">
          Nơi lưu các địa chỉ nhận hàng để đặt mua nhanh hơn ở những lần sau.
        </p>
      </div>

      {activeAddresses.length > 0 ? (
        <div className="space-y-4">
          {activeAddresses.map((item) => (
            <UserAddressCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
              onSetDefault={handleSetDefaultAddress}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[1.8rem] border border-dashed border-orange-500/15 bg-black/20 px-6 py-16 text-center text-slate-400 text-lg">
          Bạn chưa có địa chỉ nào đang hoạt động.
        </div>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: "0.8rem" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Address;