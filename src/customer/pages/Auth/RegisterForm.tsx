import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  Collapse,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../state/Store";
import { useFormik } from "formik";
import { sendLoginSignupOtp, signup } from "../../../state/AuthSlice";
import { MuiOtpInput } from "mui-one-time-password-input";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

type SnackbarSeverity = "success" | "info" | "warning" | "error";

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const [sendOtp, setSendOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Validation với email, fullName, otp (khi đã gửi OTP)
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Email không đúng định dạng")
      .required("Email không được để trống"),
    fullName: Yup.string()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .required("Họ và tên không được để trống"),
    otp: Yup.string().when([], {
      is: () => sendOtp,
      then: (schema) =>
        schema
          .matches(/^[0-9]{6}$/, "Mã OTP phải gồm đúng 6 chữ số")
          .required("Vui lòng nhập mã OTP"),
    }),
  });

  // ✅ Countdown resend OTP
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
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

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
      fullName: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await dispatch(signup(values)).unwrap();

        setSnackbar({
          open: true,
          message: "Đăng ký tài khoản thành công!",
          severity: "success",
        });

        navigate("/");
      } catch (error: any) {
        console.log("Signup error:", error);

        let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.";

        if (error?.response?.data) {
          errorMessage =
            error.response.data.message ||
            error.response.data.error ||
            "Máy chủ trả về lỗi.";
        } else if (typeof error === "string") {
          errorMessage = error;
        }

        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleSendOtp = async () => {
    if (!formik.values.email) {
      formik.setFieldTouched("email", true);
      return;
    }
    if (formik.errors.email) return;

    if (!formik.values.fullName) {
      formik.setFieldTouched("fullName", true);
      return;
    }
    if (formik.errors.fullName) return;

    try {
      setLoading(true);
      await dispatch(
        sendLoginSignupOtp({
          email: formik.values.email,
          role: "ROLE_CUSTOMER",
        })
      ).unwrap();

      setSendOtp(true);
      setCountdown(60);

      setSnackbar({
        open: true,
        message: "Mã OTP đã được gửi tới email của bạn!",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error || "Gửi OTP thất bại. Vui lòng thử lại.",
        severity: "error",
      });
      console.error("Send OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="w-full flex justify-center items-center py-8">
      {/* Card đăng ký */}
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 backdrop-blur-md transition-all duration-300 hover:shadow-[0_20px_45px_rgba(0,0,0,0.25)] hover:-translate-y-1">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg mb-1">
            <span className="text-white font-bold text-xl">+</span>
          </div>
          <h1 className="text-center font-semibold text-2xl text-slate-900 dark:text-slate-50">
            Đăng ký tài khoản
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            Tạo tài khoản mới bằng email của bạn và xác thực qua mã OTP.
          </p>
        </div>

        <div className="space-y-5">
          {/* Email */}
          <TextField
            fullWidth
            name="email"
            label="Email"
            placeholder="ví dụ: tenban@gmail.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.8rem",
                transition: "all 0.2s ease",
                "& fieldset": {
                  borderColor: "rgba(148, 163, 184, 0.6)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(45, 212, 191, 0.9)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgb(16, 185, 129)",
                  boxShadow: "0 0 0 1px rgba(16,185,129,0.35)",
                },
              },
            }}
          />

          {/* Họ và tên */}
          <TextField
            fullWidth
            name="fullName"
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.8rem",
                transition: "all 0.2s ease",
                "& fieldset": {
                  borderColor: "rgba(148, 163, 184, 0.6)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(45, 212, 191, 0.9)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgb(16, 185, 129)",
                  boxShadow: "0 0 0 1px rgba(16,185,129,0.35)",
                },
              },
            }}
          />

          {/* OTP section với hiệu ứng Collapse */}
          <Collapse in={sendOtp}>
            <div className="space-y-3 mt-1">
              <p className="font-medium text-xs uppercase tracking-wide text-slate-500">
                Mã xác thực (OTP)
              </p>
              <p className="text-sm text-slate-500">
                Nhập mã OTP gồm 6 chữ số đã được gửi đến{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {formik.values.email || "email của bạn"}
                </span>
                .
              </p>
              <MuiOtpInput
                length={6}
                value={formik.values.otp}
                onChange={(value) => formik.setFieldValue("otp", value)}
                onBlur={() => formik.setFieldTouched("otp", true)}
                TextFieldsProps={{
                  size: "small",
                }}
              />
              {formik.touched.otp && formik.errors.otp && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "0.8rem",
                    marginTop: "4px",
                  }}
                >
                  {formik.errors.otp}
                </div>
              )}

              {/* Resend OTP */}
              <div className="flex items-center justify-between pt-1">
                <Button
                  variant="text"
                  size="small"
                  onClick={handleSendOtp}
                  disabled={countdown > 0 || loading}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.85rem",
                  }}
                >
                  {countdown > 0
                    ? `Gửi lại OTP sau ${countdown}s`
                    : "Gửi lại mã OTP"}
                </Button>
                <span className="text-xs text-slate-400">
                  Kiểm tra cả thư mục Spam / Quảng cáo
                </span>
              </div>
            </div>
          </Collapse>

          {/* Nút hành động */}
          {sendOtp ? (
            <Button
              fullWidth
              variant="contained"
              sx={{
                py: "11px",
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                background:
                  "linear-gradient(135deg, rgb(16,185,129), rgb(59,130,246))",
                boxShadow: "0 18px 35px rgba(16,185,129,0.45)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, rgb(5,150,105), rgb(30,64,175))",
                  boxShadow: "0 20px 40px rgba(5,150,105,0.55)",
                },
              }}
              onClick={() => formik.handleSubmit()}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Đăng ký"
              )}
            </Button>
          ) : (
            <Button
              fullWidth
              onClick={handleSendOtp}
              variant="contained"
              sx={{
                py: "11px",
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                background:
                  "linear-gradient(135deg, rgb(16,185,129), rgb(59,130,246))",
                boxShadow: "0 18px 35px rgba(16,185,129,0.45)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, rgb(5,150,105), rgb(30,64,175))",
                  boxShadow: "0 20px 40px rgba(5,150,105,0.55)",
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
            <p className="text-xs text-center text-slate-400">
              Chúng tôi sẽ gửi mã xác thực dùng một lần đến email bạn cung cấp.
            </p>
          )}
        </div>
      </div>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: "0.8rem",
            boxShadow: "0 10px 25px rgba(15,23,42,0.35)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RegisterForm;
