import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../state/Store";
import { useFormik } from "formik";
import { sendLoginSignupOtp, signin } from "../../../state/AuthSlice";
import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  Collapse,
} from "@mui/material";
import * as Yup from "yup";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

type SnackbarSeverity = "success" | "info" | "warning" | "error";

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

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [sendOtp, setSendOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Email không đúng định dạng")
      .required("Email không được để trống"),
    otp: Yup.string().when([], {
      is: () => sendOtp,
      then: (schema) =>
        schema
          .matches(/^[0-9]{6}$/, "Mã OTP phải gồm 6 chữ số")
          .required("Vui lòng nhập mã OTP"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await dispatch(signin(values)).unwrap();
        setSnackbar({
          open: true,
          message: "Đăng nhập thành công",
          severity: "success",
        });
        navigate("/");
      } catch (error: any) {
        setSnackbar({
          open: true,
          message: error || "Không thể đăng nhập. Thử lại sau.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    validationSchema,
  });

  const handleSendOtp = async () => {
    if (!formik.values.email) {
      formik.setFieldTouched("email", true);
      return;
    }
    if (formik.errors.email) return;

    try {
      setLoading(true);
      await dispatch(
        sendLoginSignupOtp({
          email: "signing_" + formik.values.email,
          role: "ROLE_CUSTOMER",
        })
      ).unwrap();

      setSendOtp(true);
      setCountdown(60);
      setSnackbar({
        open: true,
        message: "Mã OTP đã được gửi tới email của bạn",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error || "Gửi OTP thất bại. Thử lại sau.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-[1.8rem] border border-orange-500/12 bg-[#101010] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300">
            Login
          </p>
          <h2 className="mt-2 text-3xl font-black text-white">Đăng nhập</h2>
          <p className="mt-2 max-w-[320px] text-sm leading-6 text-slate-300">
            Nhập email để nhận OTP và vào lại tài khoản nhanh gọn.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-black">
          <MailOutlineIcon />
        </div>
      </div>

      <div className="space-y-5">
        <TextField
          fullWidth
          name="email"
          label="Email"
          placeholder="tenban@email.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          size="small"
          sx={inputSx}
        />

        <Collapse in={sendOtp}>
          <div className="space-y-3 rounded-[1.2rem] border border-orange-500/10 bg-black/20 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-300">
              Xác thực OTP
            </p>
            <p className="text-sm leading-6 text-slate-300">
              Mã OTP 6 số đã được gửi tới{" "}
              <span className="font-semibold text-white">
                {formik.values.email || "email của bạn"}
              </span>.
            </p>
            <MuiOtpInput
              length={6}
              value={formik.values.otp}
              onChange={(value) => formik.setFieldValue("otp", value)}
              onBlur={() => formik.setFieldTouched("otp", true)}
              TextFieldsProps={{
                size: "small",
                sx: inputSx,
              }}
            />
            {formik.touched.otp && formik.errors.otp && (
              <div className="text-sm text-red-300">{formik.errors.otp}</div>
            )}

            <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="text"
                size="small"
                onClick={handleSendOtp}
                disabled={countdown > 0 || loading}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#fb923c",
                  alignSelf: "flex-start",
                }}
              >
                {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi lại OTP"}
              </Button>
              <span className="text-xs text-slate-500">
                Kiểm tra cả Spam nếu chưa thấy mail.
              </span>
            </div>
          </div>
        </Collapse>

        {sendOtp ? (
          <Button
            fullWidth
            variant="contained"
            sx={{
              py: "12px",
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 800,
              fontSize: "0.95rem",
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              color: "#050505",
              boxShadow: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                boxShadow: "none",
              },
            }}
            onClick={() => formik.handleSubmit()}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Đăng nhập"
            )}
          </Button>
        ) : (
          <Button
            fullWidth
            onClick={handleSendOtp}
            variant="contained"
            sx={{
              py: "12px",
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 800,
              fontSize: "0.95rem",
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              color: "#050505",
              boxShadow: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                boxShadow: "none",
              },
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Gửi mã OTP"
            )}
          </Button>
        )}

        {!sendOtp && (
          <p className="text-center text-xs text-slate-500">
            OTP chỉ dùng một lần và có hiệu lực trong thời gian ngắn.
          </p>
        )}
      </div>

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

export default LoginForm;