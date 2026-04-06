import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  Collapse,
  IconButton,
  InputAdornment,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../state/Store";
import { useFormik } from "formik";
import { sendLoginSignupOtp, signup } from "../../../state/AuthSlice";
import { MuiOtpInput } from "mui-one-time-password-input";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlineIcon from "@mui/icons-material/LockOutline";

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

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const [sendOtp, setSendOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Email không đúng định dạng")
      .required("Email không được để trống"),

    fullName: Yup.string()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .required("Họ và tên không được để trống"),

    password: Yup.string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .max(50, "Mật khẩu không được vượt quá 50 ký tự")
      .required("Mật khẩu không được để trống"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Mật khẩu nhập lại không khớp")
      .required("Vui lòng nhập lại mật khẩu"),

    otp: Yup.string().when([], {
      is: () => sendOtp,
      then: (schema) =>
        schema
          .matches(/^[0-9]{6}$/, "Mã OTP phải gồm 6 chữ số")
          .required("Vui lòng nhập mã OTP"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
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
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        await dispatch(
          signup({
            email: values.email,
            fullName: values.fullName,
            password: values.password,
            otp: values.otp,
          })
        ).unwrap();

        setSnackbar({
          open: true,
          message: "Tạo tài khoản thành công",
          severity: "success",
        });

        navigate("/");
      } catch (error: any) {
        let errorMessage = "Đăng ký thất bại. Thử lại sau.";

        if (error?.response?.data) {
          errorMessage =
            error.response.data.message ||
            error.response.data.error ||
            errorMessage;
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
    await formik.setTouched({
      email: true,
      fullName: true,
      password: true,
      confirmPassword: true,
      otp: false,
    });

    await formik.validateForm();

    if (
      !formik.values.email ||
      !formik.values.fullName ||
      !formik.values.password ||
      !formik.values.confirmPassword
    ) {
      return;
    }

    if (
      formik.errors.email ||
      formik.errors.fullName ||
      formik.errors.password ||
      formik.errors.confirmPassword
    ) {
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        sendLoginSignupOtp({
          email: formik.values.email,
          password: formik.values.password,
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
            Register
          </p>
          <h2 className="mt-2 text-3xl font-black text-white">
            Tạo tài khoản
          </h2>
          <p className="mt-2 max-w-[320px] text-sm leading-6 text-slate-300">
            Đăng ký nhanh để lưu sản phẩm, theo dõi đơn và nhận các gợi ý tập luyện.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-black">
          <PersonAddAlt1Icon />
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
          sx={inputSx}
        />

        <TextField
          fullWidth
          name="password"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          type={showPassword ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          size="small"
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
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  sx={{ color: "#94a3b8" }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          name="confirmPassword"
          label="Nhập lại mật khẩu"
          placeholder="Nhập lại mật khẩu"
          type={showRePassword ? "text" : "password"}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          size="small"
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
                  onClick={() => setShowRePassword((prev) => !prev)}
                  edge="end"
                  sx={{ color: "#94a3b8" }}
                >
                  {showRePassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Collapse in={sendOtp}>
          <div className="space-y-3 rounded-[1.2rem] border border-orange-500/10 bg-black/20 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-300">
              Xác thực OTP
            </p>
            <p className="text-sm leading-6 text-slate-300">
              Nhập mã OTP 6 số đã gửi tới{" "}
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
                Nếu chưa thấy mail, hãy kiểm tra Spam.
              </span>
            </div>
          </div>
        </Collapse>

        {sendOtp ? (
          <Button
            fullWidth
            variant="contained"
            onClick={() => formik.handleSubmit()}
            disabled={loading}
            sx={{
              py: "12px",
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 800,
              fontSize: "0.95rem",
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              color: "#050505",
              boxShadow: "none",
            }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Đăng ký"}
          </Button>
        ) : (
          <Button
            fullWidth
            onClick={handleSendOtp}
            disabled={loading}
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
            }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Gửi mã OTP"}
          </Button>
        )}

        {!sendOtp && (
          <p className="text-center text-xs text-slate-500">
            Nhập đầy đủ thông tin, mật khẩu và xác thực OTP để tạo tài khoản.
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

export default RegisterForm;