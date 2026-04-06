import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../../state/Store";
import {
  createStaffAccount,
  fetchAllStaff,
} from "../../../state/admin/adminUserSlice";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "18px",
    backgroundColor: "rgba(255,255,255,0.03)",
    color: "white",
    "& fieldset": {
      borderColor: "rgba(249,115,22,0.16)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(249,115,22,0.45)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#f97316",
      boxShadow: "0 0 0 1px rgba(249,115,22,0.22)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#94a3b8",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#fb923c",
  },
  "& .MuiFormHelperText-root": {
    color: "#fca5a5",
    marginLeft: "6px",
  },
};

type AddStaffFormProps = {
  open: boolean;
  onClose: () => void;
};

const AddStaffForm = ({ open, onClose }: AddStaffFormProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().min(2, "Nhap it nhat 2 ky tu").required("Bat buoc"),
      email: Yup.string().email("Email khong hop le").required("Bat buoc"),
      password: Yup.string()
        .min(6, "Mat khau toi thieu 6 ky tu")
        .required("Bat buoc"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Mat khau xac nhan khong khop")
        .required("Bat buoc"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        await dispatch(
          createStaffAccount({
            email: values.email,
            fullName: values.fullName,
            password: values.password,
          }),
        ).unwrap();
        await dispatch(fetchAllStaff());
        setSnackbar({
          open: true,
          message: "Da tao tai khoan nhan vien.",
          severity: "success",
        });
        resetForm();
        onClose();
      } catch (error: any) {
        setSnackbar({
          open: true,
          message: error || "Tao tai khoan nhan vien that bai.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <>
      {loading && <CustomLoading message="Dang xu ly tai khoan nhan vien..." />}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 560,
            borderRadius: "26px",
            background:
              "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(10,10,10,0.99))",
            color: "white",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: 24, fontWeight: 800 }}>
          Them nhan vien
        </DialogTitle>
        <DialogContent sx={{ pt: "8px !important" }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              name="fullName"
              label="Ho va ten"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
              sx={inputSx}
            />
            <TextField
              fullWidth
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={inputSx}
            />
            <TextField
              fullWidth
              name="password"
              type="password"
              label="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={inputSx}
            />
            <TextField
              fullWidth
              name="confirmPassword"
              type="password"
              label="Nhap lai password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              sx={inputSx}
            />
            <Box
              sx={{
                borderRadius: "18px",
                px: 2,
                py: 1.5,
                backgroundColor: "rgba(249,115,22,0.08)",
                border: "1px solid rgba(249,115,22,0.16)",
                color: "rgba(255,237,213,0.82)",
                fontSize: 13.5,
              }}
            >
              Tai khoan moi se duoc tao voi role <strong>ROLE_STAFF</strong>.
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: "space-between" }}>
          <Button onClick={handleClose} sx={{ color: "rgba(255,255,255,0.72)" }}>
            Huy
          </Button>
          <Button
            variant="contained"
            onClick={() => formik.handleSubmit()}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              color: "#111111",
              background: "linear-gradient(135deg, #f97316, #ea580c)",
            }}
          >
            Tao tai khoan
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddStaffForm;
