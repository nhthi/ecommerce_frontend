import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { useFormik } from "formik";
import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Alert, Box, Button, Grid, Snackbar, TextField } from "@mui/material";
import * as Yup from "yup";
import { useAppDispatch } from "../../../state/Store";
import { useNavigate } from "react-router-dom";
import { createCoupon } from "../../../state/admin/adminCouponSlice";

interface CouponFormValues {
  code: string;
  discountPercentage: number;
  validityStartDate: Dayjs | null;
  validityEndDate: Dayjs | null;
  minimumOrderValue: number;
  maximumOrderValue: number;
  name: string;
  quantity: number;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Tên giảm giá không được bỏ trống")
    .min(3, "Tên phải có ít nhất 3 ký tự")
    .max(100, "Tên không được vượt quá 100 ký tự"),

  code: Yup.string()
    .trim()
    .required("Mã giảm giá không được bỏ trống")
    .min(3, "Mã phải có ít nhất 3 ký tự")
    .max(20, "Mã không được vượt quá 20 ký tự"),

  discountPercentage: Yup.number()
    .typeError("Vui lòng nhập số")
    .required("Phần trăm giảm giá không được bỏ trống")
    .min(1, "Giảm giá phải từ 1% trở lên")
    .max(100, "Giảm giá không được vượt quá 100%"),

  validityStartDate: Yup.date()
    .nullable()
    .required("Vui lòng chọn ngày bắt đầu"),

  validityEndDate: Yup.date()
    .nullable()
    .required("Vui lòng chọn ngày kết thúc")
    .min(Yup.ref("validityStartDate"), "Ngày kết thúc phải sau ngày bắt đầu"),

  minimumOrderValue: Yup.number()
    .typeError("Vui lòng nhập số")
    .required("Giá trị đơn hàng tối thiểu không được bỏ trống")
    .min(0, "Giá trị tối thiểu không được âm"),

  maximumOrderValue: Yup.number()
    .typeError("Vui lòng nhập số")
    .required("Giá trị đơn hàng tối đa không được bỏ trống")
    .min(
      Yup.ref("minimumOrderValue"),
      "Giá trị tối đa phải lớn hơn hoặc bằng giá trị tối thiểu"
    ),

  quantity: Yup.number()
    .typeError("Vui lòng nhập số")
    .required("Số lượng mã không được bỏ trống")
    .min(1, "Số lượng phải từ 1 trở lên"),
});

const AddNewCouponForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const formik = useFormik<CouponFormValues>({
    initialValues: {
      code: "",
      discountPercentage: 0,
      validityStartDate: null,
      validityEndDate: null,
      minimumOrderValue: 0,
      maximumOrderValue: 0,
      name: "",
      quantity: 1,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formatedValues = {
          ...values,
          validityStartDate: values.validityStartDate
            ? values.validityStartDate.toISOString()
            : null,
          validityEndDate: values.validityEndDate
            ? values.validityEndDate.toISOString()
            : null,
        };

        await dispatch(createCoupon(formatedValues)).unwrap();

        setSnackbar({
          open: true,
          message: "Tạo mã giảm giá thành công!",
          severity: "success",
        });

        setTimeout(() => navigate("/admin/coupon"), 3000);
      } catch (error: any) {
        let message = "Tạo mã giảm giá thất bại. Vui lòng thử lại!";
        if (typeof error === "string") message = error;
        if (error?.response?.data?.message) {
          message = error.response.data.message;
        }

        setSnackbar({
          open: true,
          message,
          severity: "error",
        });
      }
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-color pb-5 text-center">
        Tạo Mã Giảm Giá Mới
      </h1>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          component={"form"}
          onSubmit={formik.handleSubmit}
          sx={{ padding: 2, mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                name="name"
                label="Tên Mã Giảm Giá"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                name="code"
                label="Mã Giảm Giá"
                value={formik.values.code}
                onChange={formik.handleChange}
                error={formik.touched.code && Boolean(formik.errors.code)}
                helperText={formik.touched.code && formik.errors.code}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                name="discountPercentage"
                label="Phần Trăm Giảm Giá (%)"
                value={formik.values.discountPercentage}
                onChange={(e) =>
                  formik.setFieldValue(
                    "discountPercentage",
                    Number(e.target.value)
                  )
                }
                error={
                  formik.touched.discountPercentage &&
                  Boolean(formik.errors.discountPercentage)
                }
                helperText={
                  formik.touched.discountPercentage &&
                  formik.errors.discountPercentage
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                sx={{ width: "100%" }}
                label="Ngày Bắt Đầu"
                value={formik.values.validityStartDate}
                onChange={(value) =>
                  formik.setFieldValue("validityStartDate", value)
                }
                slotProps={{
                  textField: {
                    error:
                      formik.touched.validityStartDate &&
                      Boolean(formik.errors.validityStartDate),
                    helperText:
                      formik.touched.validityStartDate &&
                      formik.errors.validityStartDate,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                sx={{ width: "100%" }}
                label="Ngày Kết Thúc"
                value={formik.values.validityEndDate}
                onChange={(value) =>
                  formik.setFieldValue("validityEndDate", value)
                }
                slotProps={{
                  textField: {
                    error:
                      formik.touched.validityEndDate &&
                      Boolean(formik.errors.validityEndDate),
                    helperText:
                      formik.touched.validityEndDate &&
                      formik.errors.validityEndDate,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                name="minimumOrderValue"
                label="Giá Trị Đơn Hàng Tối Thiểu"
                value={formik.values.minimumOrderValue}
                onChange={(e) =>
                  formik.setFieldValue(
                    "minimumOrderValue",
                    Number(e.target.value)
                  )
                }
                error={
                  formik.touched.minimumOrderValue &&
                  Boolean(formik.errors.minimumOrderValue)
                }
                helperText={
                  formik.touched.minimumOrderValue &&
                  formik.errors.minimumOrderValue
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                name="maximumOrderValue"
                label="Giá Trị Đơn Hàng Tối Đa"
                value={formik.values.maximumOrderValue}
                onChange={(e) =>
                  formik.setFieldValue(
                    "maximumOrderValue",
                    Number(e.target.value)
                  )
                }
                error={
                  formik.touched.maximumOrderValue &&
                  Boolean(formik.errors.maximumOrderValue)
                }
                helperText={
                  formik.touched.maximumOrderValue &&
                  formik.errors.maximumOrderValue
                }
              />
            </Grid>

            {/* 👉 Số lượng mã giảm giá */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                name="quantity"
                label="Số Lượng Mã"
                value={formik.values.quantity}
                onChange={(e) =>
                  formik.setFieldValue("quantity", Number(e.target.value))
                }
                error={
                  formik.touched.quantity && Boolean(formik.errors.quantity)
                }
                helperText={formik.touched.quantity && formik.errors.quantity}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button
                fullWidth
                variant="contained"
                sx={{ py: ".8rem" }}
                type="submit"
              >
                Tạo Mã Giảm Giá
              </Button>
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddNewCouponForm;
