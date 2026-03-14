import { TextField } from "@mui/material";
import React from "react";

const BecomeSellerFormStep3 = ({ formik }: any) => {
  // Lấy ngắn gọn cho nested errors/touched để tránh lỗi TS
  const touchedBank = formik.touched.bankDetails || {};
  const errorBank = (formik.errors.bankDetails || {}) as any;

  return (
    <div className="space-y-5">
      <p className="text-xl font-bold text-center text-primary-color">
        Thông tin ngân hàng
      </p>

      {/* Tên ngân hàng */}
      <TextField
        fullWidth
        name="bankDetails.bankName"
        label="Tên ngân hàng"
        placeholder="VD: Vietcombank, BIDV..."
        value={formik.values.bankDetails?.bankName || ""}
        onChange={formik.handleChange}
        error={!!(touchedBank.bankName && errorBank.bankName)}
        helperText={touchedBank.bankName ? (errorBank.bankName as string) : ""}
      />

      {/* Chi nhánh */}
      <TextField
        fullWidth
        name="bankDetails.branchName"
        label="Chi nhánh"
        placeholder="VD: CN Cần Thơ"
        value={formik.values.bankDetails?.branchName || ""}
        onChange={formik.handleChange}
        error={!!(touchedBank.branchName && errorBank.branchName)}
        helperText={
          touchedBank.branchName ? (errorBank.branchName as string) : ""
        }
      />

      {/* Số tài khoản */}
      <TextField
        fullWidth
        name="bankDetails.accountNumber"
        label="Số tài khoản"
        placeholder="Nhập số tài khoản ngân hàng"
        value={formik.values.bankDetails?.accountNumber || ""}
        onChange={formik.handleChange}
        error={!!(touchedBank.accountNumber && errorBank.accountNumber)}
        helperText={
          touchedBank.accountNumber ? (errorBank.accountNumber as string) : ""
        }
      />

      {/* Tên chủ tài khoản */}
      <TextField
        fullWidth
        name="bankDetails.accountHolderName"
        label="Tên chủ tài khoản"
        placeholder="VD: Nguyễn Văn A"
        value={formik.values.bankDetails?.accountHolderName || ""}
        onChange={formik.handleChange}
        error={!!(touchedBank.accountHolderName && errorBank.accountHolderName)}
        helperText={
          touchedBank.accountHolderName
            ? (errorBank.accountHolderName as string)
            : ""
        }
      />
    </div>
  );
};

export default BecomeSellerFormStep3;
