import React, { useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import { useAppDispatch } from "../../../state/Store";
import { changePassword } from "../../../state/AuthSlice";

type SnackbarSeverity = "success" | "info" | "warning" | "error";

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
  "& .MuiFormHelperText-root": {
    color: "#fca5a5",
    marginLeft: "6px",
  },
};

const ChangePasswordForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Mật khẩu hiện tại không được để trống"),
      newPassword: Yup.string()
        .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
        .max(50, "Mật khẩu mới không được vượt quá 50 ký tự")
        .required("Mật khẩu mới không được để trống"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Mật khẩu xác nhận không khớp")
        .required("Vui lòng nhập lại mật khẩu mới"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        const result = await dispatch(
          changePassword({
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          })
        ).unwrap();

        setSnackbar({
          open: true,
          message: result?.message || "Đổi mật khẩu thành công",
          severity: "success",
        });

        resetForm();
      } catch (error: any) {
        setSnackbar({
          open: true,
          message: error || "Đổi mật khẩu thất bại. Vui lòng thử lại.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const renderPasswordField = (
    name: "oldPassword" | "newPassword" | "confirmPassword",
    label: string,
    show: boolean,
    setShow: React.Dispatch<React.SetStateAction<boolean>>
  ) => (
    <TextField
      fullWidth
      name={name}
      label={label}
      type={show ? "text" : "password"}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched[name] && Boolean(formik.errors[name])}
      helperText={formik.touched[name] && formik.errors[name]}
      sx={inputSx}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockOutlineIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShow((prev) => !prev)}
              edge="end"
              sx={{ color: "#94a3b8" }}
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );

  return (
    <div className="space-y-4">
      <Typography sx={{ fontSize: "1.7rem", fontWeight: 900, color: "white" }}>
        Bảo mật tài khoản
      </Typography>

      <Typography sx={{ fontSize: "0.95rem", color: "#94a3b8" }}>
        Đổi mật khẩu định kỳ để bảo vệ tài khoản của bạn an toàn hơn.
      </Typography>

      {renderPasswordField(
        "oldPassword",
        "Mật khẩu hiện tại",
        showOldPassword,
        setShowOldPassword
      )}

      {renderPasswordField(
        "newPassword",
        "Mật khẩu mới",
        showNewPassword,
        setShowNewPassword
      )}

      {renderPasswordField(
        "confirmPassword",
        "Xác nhận mật khẩu mới",
        showConfirmPassword,
        setShowConfirmPassword
      )}

      <Button
        variant="contained"
        onClick={() => formik.handleSubmit()}
        disabled={loading}
        sx={{
          borderRadius: "999px",
          textTransform: "none",
          fontWeight: 800,
          background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
          color: "#fff",
          boxShadow: "none",
          px: 3,
          py: 1.2,
        }}
      >
        {loading ? (
          <CircularProgress size={22} color="inherit" />
        ) : (
          "Cập nhật mật khẩu"
        )}
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: "0.8rem" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ChangePasswordForm;