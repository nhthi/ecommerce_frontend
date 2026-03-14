import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { sendLoginSignupOtp } from "../../../state/AuthSlice";
import { useAppDispatch } from "../../../state/Store";
import { sellerLogin } from "../../../state/seller/sellerAuthSlice";
import * as Yup from "yup";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useNavigate } from "react-router-dom";

type SnackbarSeverity = "success" | "info" | "warning" | "error";

const SellerLoginForm = () => {
  const navigate = useNavigate();
  const [sendOtp, setSendOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const [countdown, setCountdown] = useState(0);
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
      .required("Vui lòng nhập email"),
    otp: Yup.string().when([], {
      // chỉ validate khi sendOtp = true
      is: () => sendOtp,
      then: (schema) =>
        schema
          .matches(/^[0-9]{6}$/, "OTP phải gồm đúng 6 chữ số")
          .required("Vui lòng nhập OTP"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await dispatch(sellerLogin(values)).unwrap();

        setSnackbar({
          open: true,
          message: "Đăng nhập người bán thành công!",
          severity: "success",
        });

        navigate("/seller");
      } catch (error: any) {
        setSnackbar({
          open: true,
          message: error || "Email hoặc OTP không đúng. Vui lòng kiểm tra lại.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleSendOtp = async () => {
    // validate email trước khi gửi OTP
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
          role: "ROLE_SELLER",
        })
      ).unwrap();

      setSendOtp(true);
      setCountdown(60);
      setSnackbar({
        open: true,
        message: "OTP đã được gửi tới email của bạn!",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error || "Gửi OTP thất bại. Vui lòng thử lại.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <div>
      <h1 className="text-center font-bold text-xl text-primary-color pb-5">
        Đăng nhập tài khoản người bán
      </h1>

      <div className="space-y-5">
        <TextField
          fullWidth
          name="email"
          label="Email đăng nhập"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        {sendOtp && (
          <div className="space-y-2">
            <p className="font-medium text-sm opacity-70">
              Nhập mã OTP đã được gửi đến email của bạn
            </p>
            <MuiOtpInput
              length={6}
              value={formik.values.otp}
              onChange={(value) => formik.setFieldValue("otp", value)}
              onBlur={() => formik.setFieldTouched("otp", true)}
              TextFieldsProps={{
                error: formik.touched.otp && Boolean(formik.errors.otp),
              }}
            />

            {/* Hiển thị validate chỉ 1 dòng dưới toàn bộ OTP input */}
            {formik.touched.otp && formik.errors.otp && (
              <div
                style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}
              >
                {formik.errors.otp}
              </div>
            )}

            {/* Resend OTP */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="text"
                size="small"
                onClick={handleSendOtp}
                disabled={countdown > 0 || loading}
                sx={{ textTransform: "none", fontSize: 13 }}
              >
                {countdown > 0
                  ? `Gửi lại OTP sau ${countdown}s`
                  : "Gửi lại OTP"}
              </Button>
              <p className="text-xs text-gray-500">
                Mã OTP có hiệu lực trong vài phút.
              </p>
            </div>
          </div>
        )}

        {/* Nút chính */}
        {sendOtp ? (
          <Button
            fullWidth
            variant="contained"
            sx={{ py: "11px", borderRadius: 999, textTransform: "none" }}
            onClick={() => formik.handleSubmit()}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Đăng nhập"
            )}
          </Button>
        ) : (
          <Button
            fullWidth
            onClick={handleSendOtp}
            variant="contained"
            sx={{ py: "11px", borderRadius: 999, textTransform: "none" }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Gửi mã OTP"
            )}
          </Button>
        )}
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
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SellerLoginForm;
