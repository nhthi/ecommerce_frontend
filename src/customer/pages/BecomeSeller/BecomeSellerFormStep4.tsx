import { TextField } from "@mui/material";
import React from "react";

const BecomeSellerFormStep4 = ({ formik }: any) => {
  return (
    <div className="space-y-5">
      <p className="text-xl font-bold text-center text-primary-color">
        Thông tin gian hàng & đăng nhập
      </p>

      {/* Tên gian hàng */}
      <TextField
        fullWidth
        name="businessDetails.businessName"
        label="Tên gian hàng"
        placeholder="Ví dụ: THỜI TRANG NỮ LADY CHIC"
        value={formik.values.businessDetails?.businessName}
        onChange={formik.handleChange}
        error={
          !!(
            formik.touched.businessDetails?.businessName &&
            formik.errors.businessDetails?.businessName
          )
        }
        helperText={
          formik.touched.businessDetails?.businessName
            ? (formik.errors.businessDetails?.businessName as string)
            : ""
        }
      />

      {/* Tên người bán */}
      <TextField
        fullWidth
        name="sellerName"
        label="Tên người bán"
        placeholder="Họ và tên người quản lý gian hàng"
        value={formik.values.sellerName}
        onChange={formik.handleChange}
        error={!!(formik.touched.sellerName && formik.errors.sellerName)}
        helperText={
          formik.touched.sellerName ? (formik.errors.sellerName as string) : ""
        }
      />

      {/* Email đăng nhập */}
      <TextField
        fullWidth
        name="email"
        label="Email đăng nhập"
        placeholder="Email dùng để đăng nhập tài khoản người bán"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={!!(formik.touched.email && formik.errors.email)}
        helperText={formik.touched.email ? (formik.errors.email as string) : ""}
      />

      {/* Mật khẩu */}
      <TextField
        fullWidth
        name="password"
        label="Mật khẩu"
        type="password"
        placeholder="Tối thiểu 6 ký tự"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={!!(formik.touched.password && formik.errors.password)}
        helperText={
          formik.touched.password ? (formik.errors.password as string) : ""
        }
      />

      {/* Nhập lại mật khẩu */}
      <TextField
        fullWidth
        name="confirmPassword"
        label="Nhập lại mật khẩu"
        type="password"
        placeholder="Nhập lại giống mật khẩu phía trên"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        error={
          !!(formik.touched.confirmPassword && formik.errors.confirmPassword)
        }
        helperText={
          formik.touched.confirmPassword
            ? (formik.errors.confirmPassword as string)
            : ""
        }
      />
    </div>
  );
};

export default BecomeSellerFormStep4;
