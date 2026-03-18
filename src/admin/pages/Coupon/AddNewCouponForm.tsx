import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { useFormik } from "formik";
import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Alert, Box, Button, Grid, Paper, Snackbar, TextField, Typography } from "@mui/material";
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
  name: Yup.string().trim().required("Ten giam gia khong duoc bo trong").min(3).max(100),
  code: Yup.string().trim().required("Ma giam gia khong duoc bo trong").min(3).max(20),
  discountPercentage: Yup.number().typeError("Vui long nhap so").required("Can nhap phan tram giam").min(1).max(100),
  validityStartDate: Yup.date().nullable().required("Chon ngay bat dau"),
  validityEndDate: Yup.date().nullable().required("Chon ngay ket thuc").min(Yup.ref("validityStartDate"), "Ngay ket thuc phai sau ngay bat dau"),
  minimumOrderValue: Yup.number().typeError("Vui long nhap so").required("Can nhap don toi thieu").min(0),
  maximumOrderValue: Yup.number().typeError("Vui long nhap so").required("Can nhap don toi da").min(Yup.ref("minimumOrderValue"), "Don toi da phai lon hon hoac bang don toi thieu"),
  quantity: Yup.number().typeError("Vui long nhap so").required("Can nhap so luong ma").min(1),
});

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    borderRadius: "18px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(249,115,22,0.4)" },
    "&.Mui-focused fieldset": { borderColor: "#f97316" },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.58)" },
  "& .MuiFormHelperText-root": { color: "#fca5a5" },
};

const cardSx = {
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
};

const AddNewCouponForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

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
          validityStartDate: values.validityStartDate ? values.validityStartDate.toISOString() : null,
          validityEndDate: values.validityEndDate ? values.validityEndDate.toISOString() : null,
        };
        await dispatch(createCoupon(formatedValues)).unwrap();
        setSnackbar({ open: true, message: "Tao coupon thanh cong", severity: "success" });
        setTimeout(() => navigate("/admin/coupon"), 1800);
      } catch (error: any) {
        let message = "Tao coupon that bai";
        if (typeof error === "string") message = error;
        if (error?.response?.data?.message) message = error.response.data.message;
        setSnackbar({ open: true, message, severity: "error" });
      }
    },
  });

  return (
    <Paper elevation={0} sx={{ ...cardSx, p: { xs: 3, lg: 4 } }}>
      <Typography fontSize={28} fontWeight={800} color="white">Tao coupon moi</Typography>
      <Typography sx={{ mt: 0.8, mb: 3, color: "rgba(255,255,255,0.62)", fontSize: 14.5 }}>
        Tao ma giam gia co gioi han so luong va thoi gian de day doanh thu theo tung chien dich.
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2.2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth name="name" label="Ten coupon" value={formik.values.name} onChange={formik.handleChange} error={formik.touched.name && Boolean(formik.errors.name)} helperText={formik.touched.name && formik.errors.name} sx={fieldSx} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth name="code" label="Ma coupon" value={formik.values.code} onChange={formik.handleChange} error={formik.touched.code && Boolean(formik.errors.code)} helperText={formik.touched.code && formik.errors.code} sx={fieldSx} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth type="number" name="discountPercentage" label="Giam (%)" value={formik.values.discountPercentage} onChange={(e) => formik.setFieldValue("discountPercentage", Number(e.target.value))} error={formik.touched.discountPercentage && Boolean(formik.errors.discountPercentage)} helperText={formik.touched.discountPercentage && formik.errors.discountPercentage} sx={fieldSx} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <DatePicker sx={{ width: "100%", ...fieldSx }} label="Ngay bat dau" value={formik.values.validityStartDate} onChange={(value) => formik.setFieldValue("validityStartDate", value)} slotProps={{ textField: { error: formik.touched.validityStartDate && Boolean(formik.errors.validityStartDate), helperText: formik.touched.validityStartDate && formik.errors.validityStartDate } }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <DatePicker sx={{ width: "100%", ...fieldSx }} label="Ngay ket thuc" value={formik.values.validityEndDate} onChange={(value) => formik.setFieldValue("validityEndDate", value)} slotProps={{ textField: { error: formik.touched.validityEndDate && Boolean(formik.errors.validityEndDate), helperText: formik.touched.validityEndDate && formik.errors.validityEndDate } }} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth type="number" name="minimumOrderValue" label="Don toi thieu" value={formik.values.minimumOrderValue} onChange={(e) => formik.setFieldValue("minimumOrderValue", Number(e.target.value))} error={formik.touched.minimumOrderValue && Boolean(formik.errors.minimumOrderValue)} helperText={formik.touched.minimumOrderValue && formik.errors.minimumOrderValue} sx={fieldSx} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth type="number" name="maximumOrderValue" label="Don toi da" value={formik.values.maximumOrderValue} onChange={(e) => formik.setFieldValue("maximumOrderValue", Number(e.target.value))} error={formik.touched.maximumOrderValue && Boolean(formik.errors.maximumOrderValue)} helperText={formik.touched.maximumOrderValue && formik.errors.maximumOrderValue} sx={fieldSx} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth type="number" name="quantity" label="So luong ma" value={formik.values.quantity} onChange={(e) => formik.setFieldValue("quantity", Number(e.target.value))} error={formik.touched.quantity && Boolean(formik.errors.quantity)} helperText={formik.touched.quantity && formik.errors.quantity} sx={fieldSx} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box display="flex" gap={1.2} justifyContent="flex-end" flexWrap="wrap">
                <Button variant="outlined" onClick={() => navigate("/admin/coupon")} sx={{ borderRadius: 999, textTransform: "none", px: 2.5, color: "rgba(255,255,255,0.82)", borderColor: "rgba(255,255,255,0.12)" }}>
                  Quay lai
                </Button>
                <Button type="submit" variant="contained" sx={{ borderRadius: 999, textTransform: "none", px: 2.8, background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
                  Tao coupon
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default AddNewCouponForm;
