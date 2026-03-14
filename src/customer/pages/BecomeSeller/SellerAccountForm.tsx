import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import React, { useState } from "react";
import BecomeSellerFormStep1 from "./BecomeSellerFormStep1";
import { useFormik } from "formik";
import BecomeSellerFormStep2 from "./BecomeSellerFormStep2";
import BecomeSellerFormStep3 from "./BecomeSellerFormStep3";
import BecomeSellerFormStep4 from "./BecomeSellerFormStep4";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../state/Store";
import { createSeller } from "../../../state/seller/sellerAuthSlice";

const steps = [
  "Thông tin thuế & SĐT",
  "Địa chỉ lấy hàng",
  "Thông tin ngân hàng",
  "Thông tin gian hàng",
];

type SnackbarSeverity = "success" | "error" | "info" | "warning";

const validationSchemas = [
  // Step 1
  Yup.object({
    mobile: Yup.string()
      .matches(
        /^(0(3|5|7|8|9))[0-9]{8}$/,
        "Số điện thoại không hợp lệ (phải là số Việt Nam)"
      )
      .required("Vui lòng nhập số điện thoại"),
    taxCode: Yup.string()
      .matches(/^\d{10,13}$/, "Mã số thuế phải gồm 10–13 chữ số")
      .required("Vui lòng nhập mã số thuế"),
  }),

  // Step 2
  Yup.object({
    pickupAddress: Yup.object({
      receiverName: Yup.string().required("Vui lòng nhập tên người nhận"),
      phoneNumber: Yup.string()
        .matches(
          /^(0(3|5|7|8|9))[0-9]{8}$/,
          "Số điện thoại không hợp lệ (phải là số Việt Nam)"
        )
        .required("Vui lòng nhập số điện thoại người nhận"),
      streetDetail: Yup.string().required("Vui lòng nhập địa chỉ chi tiết"),
      ward: Yup.string().required("Vui lòng nhập phường/xã"),
      district: Yup.string().required("Vui lòng nhập quận/huyện"),
      province: Yup.string().required("Vui lòng nhập tỉnh/thành phố"),
    }),
  }),

  // Step 3
  Yup.object({
    bankDetails: Yup.object({
      accountNumber: Yup.string()
        .matches(/^\d{6,20}$/, "Số tài khoản không hợp lệ")
        .required("Vui lòng nhập số tài khoản"),
      bankName: Yup.string().required("Vui lòng nhập tên ngân hàng"),
      accountHolderName: Yup.string().required(
        "Vui lòng nhập tên chủ tài khoản"
      ),
      branchName: Yup.string().required("Vui lòng nhập chi nhánh"),
    }),
  }),

  // Step 4
  Yup.object({
    businessDetails: Yup.object({
      businessName: Yup.string().required("Vui lòng nhập tên gian hàng"),
    }),
    sellerName: Yup.string().required("Vui lòng nhập tên người bán"),
    email: Yup.string()
      .email("Email không đúng định dạng")
      .required("Vui lòng nhập email"),
    password: Yup.string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Vui lòng nhập mật khẩu"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Mật khẩu nhập lại không khớp")
      .required("Vui lòng xác nhận lại mật khẩu"),
  }),
];

const SellerAccountForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
  }>({
    open: false,
    message: "",
    severity: "error",
  });

  const formik = useFormik({
    initialValues: {
      mobile: "",
      otp: "",
      taxCode: "",
      pickupAddress: {
        receiverName: "",
        phoneNumber: "",
        streetDetail: "",
        ward: "",
        district: "",
        province: "",
        note: "",
      },
      bankDetails: {
        accountNumber: "",
        bankName: "",
        accountHolderName: "",
        branchName: "",
      },
      sellerName: "",
      email: "",
      businessDetails: {
        businessName: "",
        businessEmail: "",
        businessMobile: "",
        businessAddress: "",
        logo: "",
        banner: "",
      },
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchemas[activeStep],
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        console.log("Form submitted", values);
        await dispatch(createSeller(values)).unwrap();

        setSnackbar({
          open: true,
          message: "Đăng ký tài khoản người bán thành công!",
          severity: "success",
        });
        setOpenDialog(true);
      } catch (error: any) {
        console.error(error);
        setSnackbar({
          open: true,
          message: error || "Đăng ký thất bại, vui lòng thử lại!",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleStep = async (direction: number) => {
    if (direction > 0) {
      // Bấm Tiếp tục / Tạo tài khoản
      try {
        await validationSchemas[activeStep].validate(formik.values, {
          abortEarly: false,
        });

        if (activeStep === steps.length - 1) {
          formik.submitForm();
        } else {
          setActiveStep((prev) => prev + 1);
        }
      } catch (err: any) {
        if (err.inner) {
          const formErrors = err.inner.reduce((acc: any, curr: any) => {
            acc[curr.path] = curr.message;
            return acc;
          }, {});

          const formTouched = err.inner.reduce((acc: any, curr: any) => {
            const pathParts = curr.path.split(".");
            let current = acc;
            pathParts.forEach((part: string, index: number) => {
              if (index === pathParts.length - 1) {
                current[part] = true;
              } else {
                current[part] = current[part] || {};
                current = current[part];
              }
            });
            return acc;
          }, {});

          formik.setErrors(formErrors);
          formik.setTouched(formTouched);
        }
      }
    } else {
      // Bấm Back
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <div>
      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Nội dung form theo từng bước */}
      <section className="my-10 space-y-10">
        {activeStep === 0 ? (
          <BecomeSellerFormStep1 formik={formik} />
        ) : activeStep === 1 ? (
          <BecomeSellerFormStep2 formik={formik} />
        ) : activeStep === 2 ? (
          <BecomeSellerFormStep3 formik={formik} />
        ) : activeStep === 3 ? (
          <BecomeSellerFormStep4 formik={formik} />
        ) : null}
      </section>

      {/* Nút điều hướng bước */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => handleStep(-1)}
          variant="contained"
          disabled={activeStep === 0 || loading}
          sx={{ borderRadius: 999, textTransform: "none" }}
        >
          Quay lại
        </Button>

        <Button
          onClick={() => handleStep(1)}
          variant="contained"
          disabled={loading}
          sx={{ borderRadius: 999, textTransform: "none" }}
        >
          {loading
            ? "Đang xử lý..."
            : activeStep === steps.length - 1
            ? "Tạo tài khoản"
            : "Tiếp tục"}
        </Button>
      </div>

      {/* Dialog thông báo đăng ký thành công */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle
          sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.2rem" }}
        >
          🎉 Đăng ký thành công!
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 2 }}>
          <p>Tài khoản người bán của bạn đã được tạo thành công.</p>
          <p className="mt-1 text-sm text-gray-500">
            Bạn có thể đăng nhập để bắt đầu quản lý gian hàng của mình.
          </p>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenDialog(false);
              navigate("/become-seller");
            }}
            sx={{ borderRadius: 999, textTransform: "none" }}
          >
            Đăng nhập ngay
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar báo lỗi / thành công */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
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

export default SellerAccountForm;
