import { Box, TextField } from "@mui/material";
import React from "react";

const BecomeSellerFormStep1 = ({ formik }: any) => {
  return (
    <Box>
      <p className="text-xl font-bold text-center pb-9 text-primary-color">
        Thông tin liên hệ & mã số thuế
      </p>

      <div className="space-y-9">
        {/* Số điện thoại */}
        <TextField
          fullWidth
          name="mobile"
          label="Số điện thoại"
          placeholder="Nhập số điện thoại người bán"
          value={formik.values.mobile}
          onChange={formik.handleChange}
          error={!!(formik.touched.mobile && formik.errors.mobile)}
          helperText={
            formik.touched.mobile ? (formik.errors.mobile as string) : ""
          }
        />

        {/* Mã số thuế */}
        <TextField
          fullWidth
          name="taxCode"
          label="Mã số thuế"
          placeholder="Nhập MST (10–13 chữ số)"
          value={formik.values.taxCode}
          onChange={formik.handleChange}
          error={!!(formik.touched.taxCode && formik.errors.taxCode)}
          helperText={
            formik.touched.taxCode ? (formik.errors.taxCode as string) : ""
          }
        />
      </div>
    </Box>
  );
};

export default BecomeSellerFormStep1;
