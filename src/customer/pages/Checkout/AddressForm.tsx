import { Box, Button, Grid, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { useAppDispatch } from "../../../state/Store";
import { createAddress } from "../../../state/customer/addressSlice";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const ghnApi = axios.create({
  baseURL: "https://dev-online-gateway.ghn.vn/shiip/public-api",
  headers: {
    Token: "65d34894-3b36-11f1-a973-aee5264794df",
  },
});

interface Province {
  ProvinceID: number;
  ProvinceName: string;
}

interface District {
  DistrictID: number;
  DistrictName: string;
}

interface Ward {
  WardCode: string;
  WardName: string;
}

const AddressFormSchema = Yup.object().shape({
  receiverName: Yup.string().required("Họ và tên không được để trống"),
  phoneNumber: Yup.string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^(0|\+84)\d{9}$/, "Số điện thoại không hợp lệ"),
  streetDetail: Yup.string().required("Vui lòng nhập địa chỉ"),
  ward: Yup.string().required("Chọn phường/xã"),
  district: Yup.number().min(1, "Chọn quận/huyện").required("Chọn quận/huyện"),
  province: Yup.number().min(1, "Chọn tỉnh/thành").required("Chọn tỉnh/thành"),
});

const AddressForm = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const { isDark } = useSiteThemeMode();

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fieldSx = useMemo(
    () => ({
      "& .MuiOutlinedInput-root": {
        borderRadius: "16px",
        color: isDark ? "#ffffff" : "#000000",
        backgroundColor: isDark ? "#151515" : "#ffffff",
        transition: "all .2s ease",
        "& fieldset": {
          borderColor: isDark
            ? "rgba(255,255,255,0.12)"
            : "rgba(0,0,0,0.12)",
        },
        "&:hover fieldset": {
          borderColor: isDark
            ? "rgba(255,255,255,0.22)"
            : "rgba(0,0,0,0.22)",
        },
        "&.Mui-focused fieldset": {
          borderColor: isDark
            ? "rgba(255,255,255,0.28)"
            : "rgba(0,0,0,0.28)",
        },
        "&.Mui-disabled": {
          backgroundColor: isDark ? "#121212" : "#f5f5f5",
          color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)",
        },
      },
      "& .MuiInputLabel-root": {
        color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)",
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: isDark ? "#ffffff" : "#000000",
      },
      "& .MuiFormHelperText-root": {
        marginLeft: "2px",
        color: isDark ? "rgba(255,255,255,0.58)" : "rgba(0,0,0,0.58)",
      },
      "& .MuiSvgIcon-root": {
        color: isDark ? "rgba(255,255,255,0.68)" : "rgba(0,0,0,0.6)",
      },
    }),
    [isDark]
  );

  useEffect(() => {
    ghnApi
      .get("/master-data/province")
      .then((res) => setProvinces(res.data.data))
      .catch(console.error);
  }, []);

  const formik = useFormik({
    initialValues: {
      receiverName: "",
      phoneNumber: "",
      streetDetail: "",
      ward: "",
      district: 0,
      province: 0,
      note: "",
    },
    validationSchema: AddressFormSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);

        const provinceObj = provinces.find(
          (p) => p.ProvinceID === values.province
        );
        const districtObj = districts.find(
          (d) => d.DistrictID === values.district
        );
        const wardObj = wards.find((w) => w.WardCode === values.ward);

        await dispatch(
          createAddress({
            receiverName: values.receiverName,
            phoneNumber: values.phoneNumber,
            streetDetail: values.streetDetail,
            provinceId: values.province,
            districtId: values.district,
            wardCode: values.ward,
            province: provinceObj?.ProvinceName || "",
            district: districtObj?.DistrictName || "",
            ward: wardObj?.WardName || "",
            note: values.note,
          })
        );

        formik.resetForm();
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
  });

  const provinceId = formik.values.province;
  const districtId = formik.values.district;

  useEffect(() => {
    if (!provinceId) {
      setDistricts([]);
      setWards([]);
      return;
    }

    ghnApi
      .get(`/master-data/district?province_id=${provinceId}`)
      .then((res) => setDistricts(res.data.data))
      .catch(console.error);

    setWards([]);
    formik.setFieldValue("district", 0);
    formik.setFieldValue("ward", "");
  }, [provinceId]);

  useEffect(() => {
    if (!districtId) {
      setWards([]);
      return;
    }

    ghnApi
      .get(`/master-data/ward?district_id=${districtId}`)
      .then((res) => setWards(res.data.data))
      .catch(console.error);

    formik.setFieldValue("ward", "");
  }, [districtId]);

  return (
    <Box
      sx={{
        p: 0,
      }}
    >
      <div
        className={`overflow-hidden rounded-[1.8rem] border shadow-sm ${
          isDark
            ? "border-white/10 bg-[#111111] text-white"
            : "border-black/10 bg-white text-black"
        }`}
      >
        <div
          className={`border-b px-5 py-5 sm:px-6 ${
            isDark ? "border-white/10" : "border-black/10"
          }`}
        >
          <p
            className={`text-[11px] font-bold uppercase tracking-[0.24em] ${
              isDark ? "text-white/45" : "text-black/45"
            }`}
          >
            Địa chỉ mới
          </p>
          <h2
            className={`mt-2 text-2xl font-black tracking-tight ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Thêm địa chỉ giao hàng
          </h2>
          <p
            className={`mt-1 text-sm leading-6 ${
              isDark ? "text-white/65" : "text-black/60"
            }`}
          >
            Điền đầy đủ thông tin để sử dụng cho đơn hàng của bạn.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="px-5 py-5 sm:px-6">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  name="receiverName"
                  label="Người nhận"
                  value={formik.values.receiverName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.receiverName &&
                    !!formik.errors.receiverName
                  }
                  helperText={
                    formik.touched.receiverName &&
                    formik.errors.receiverName
                  }
                  sx={fieldSx}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="Số điện thoại"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.phoneNumber &&
                    !!formik.errors.phoneNumber
                  }
                  helperText={
                    formik.touched.phoneNumber &&
                    formik.errors.phoneNumber
                  }
                  sx={fieldSx}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  name="province"
                  label="Tỉnh / Thành phố"
                  value={formik.values.province || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.province && !!formik.errors.province}
                  helperText={formik.touched.province && formik.errors.province}
                  sx={fieldSx}
                >
                  <MenuItem value="">Chọn tỉnh / thành phố</MenuItem>
                  {provinces.map((p) => (
                    <MenuItem key={p.ProvinceID} value={p.ProvinceID}>
                      {p.ProvinceName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  name="district"
                  label="Quận / Huyện"
                  value={formik.values.district || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!provinceId}
                  error={formik.touched.district && !!formik.errors.district}
                  helperText={formik.touched.district && formik.errors.district}
                  sx={fieldSx}
                >
                  <MenuItem value="">Chọn quận / huyện</MenuItem>
                  {districts.map((d) => (
                    <MenuItem key={d.DistrictID} value={d.DistrictID}>
                      {d.DistrictName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  select
                  fullWidth
                  name="ward"
                  label="Phường / Xã"
                  value={formik.values.ward}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!districtId}
                  error={formik.touched.ward && !!formik.errors.ward}
                  helperText={formik.touched.ward && formik.errors.ward}
                  sx={fieldSx}
                >
                  <MenuItem value="">Chọn phường / xã</MenuItem>
                  {wards.map((w) => (
                    <MenuItem key={w.WardCode} value={w.WardCode}>
                      {w.WardName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  name="streetDetail"
                  label="Số nhà, tên đường"
                  value={formik.values.streetDetail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.streetDetail &&
                    !!formik.errors.streetDetail
                  }
                  helperText={
                    formik.touched.streetDetail &&
                    formik.errors.streetDetail
                  }
                  sx={fieldSx}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  name="note"
                  label="Ghi chú (không bắt buộc)"
                  value={formik.values.note}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  sx={fieldSx}
                />
              </Grid>
            </Grid>
          </div>

          <div
            className={`flex flex-col gap-3 border-t px-5 py-5 sm:flex-row sm:justify-end sm:px-6 ${
              isDark ? "border-white/10" : "border-black/10"
            }`}
          >
            <Button
              type="button"
              onClick={onClose}
              variant="outlined"
              sx={{
                minWidth: 120,
                borderRadius: "14px",
                py: 1.1,
                textTransform: "none",
                fontWeight: 700,
                color: isDark ? "#fff" : "#000",
                borderColor: isDark
                  ? "rgba(255,255,255,0.14)"
                  : "rgba(0,0,0,0.14)",
                backgroundColor: "transparent",
                boxShadow: "none",
                "&:hover": {
                  borderColor: isDark
                    ? "rgba(255,255,255,0.28)"
                    : "rgba(0,0,0,0.28)",
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.04)",
                  boxShadow: "none",
                },
              }}
            >
              Hủy
            </Button>

            <Button
              type="submit"
              variant="outlined"
              disabled={submitting}
              sx={{
                minWidth: 140,
                borderRadius: "14px",
                py: 1.1,
                textTransform: "none",
                fontWeight: 800,
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                      color: "#fff",
                      "&:hover": {
                        background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                        boxShadow: "none",
                      },
                borderColor: isDark
                  ? "rgba(255,255,255,0.16)"
                  : "rgba(0,0,0,0.14)",
                boxShadow: "none",
                
                "&.Mui-disabled": {
                  color: isDark
                    ? "rgba(255,255,255,0.35)"
                    : "rgba(0,0,0,0.35)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.08)",
                },
              }}
            >
              {submitting ? "Đang lưu..." : "Lưu địa chỉ"}
            </Button>
          </div>
        </form>
      </div>
    </Box>
  );
};

export default AddressForm;