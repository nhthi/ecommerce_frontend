import { Box, Button, Grid, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { useAppDispatch } from "../../../state/Store";
import { createAddress } from "../../../state/customer/addressSlice";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

interface Ward {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
  wards?: Ward[];
}

interface Province {
  code: number;
  name: string;
  districts?: District[];
}

const AddressFormSchema = Yup.object().shape({
  receiverName: Yup.string().required("Họ và tên không được để trống"),
  phoneNumber: Yup.string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^(0|\+84)\d{9}$/, "Số điện thoại không hợp lệ"),
  streetDetail: Yup.string().required("Vui lòng nhập số nhà và tên đường"),
  ward: Yup.string().required("Phường/Xã không được để trống"),
  district: Yup.string().required("Quận/Huyện không được để trống"),
  province: Yup.string().required("Tỉnh/Thành phố không được để trống"),
  note: Yup.string(),
});

const AddressForm = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const { isDark } = useSiteThemeMode();

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const fieldSx = useMemo(
    () => ({
      "& .MuiOutlinedInput-root": {
        borderRadius: "18px",
        color: isDark ? "#ffffff" : "#0f172a",
        backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
        "& fieldset": {
          borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.12)",
        },
        "&:hover fieldset": {
          borderColor: "rgba(249,115,22,0.35)",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#f97316",
        },
        "&.Mui-disabled": {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.02)"
            : "rgba(15,23,42,0.03)",
        },
      },
      "& .MuiInputLabel-root": {
        color: isDark ? "rgba(255,255,255,0.62)" : "#64748b",
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: "#fdba74",
      },
      "& .MuiFormHelperText-root": {
        color: isDark ? "rgba(255,255,255,0.45)" : "#64748b",
        marginLeft: "6px",
      },
      "& .MuiInputBase-input::placeholder": {
        color: isDark ? "rgba(255,255,255,0.38)" : "rgba(100,116,139,0.72)",
        opacity: 1,
      },
      "& .MuiSvgIcon-root": {
        color: isDark ? "rgba(255,255,255,0.55)" : "#64748b",
      },
    }),
    [isDark]
  );

  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("Lỗi khi tải danh sách tỉnh/thành phố", err));
  }, []);

  const formik = useFormik({
    initialValues: {
      receiverName: "",
      phoneNumber: "",
      streetDetail: "",
      ward: "",
      district: "",
      province: "",
      note: "",
    },
    validationSchema: AddressFormSchema,
    onSubmit: async (values) => {
      await dispatch(createAddress(values));
      onClose();
    },
  });

  useEffect(() => {
    if (formik.values.province) {
      const selectedProvince = provinces.find(
        (p) => p.name === formik.values.province
      );

      if (selectedProvince) {
        axios
          .get(
            `https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`
          )
          .then((res) => setDistricts(res.data.districts || []))
          .catch((err) =>
            console.error("Lỗi khi tải danh sách quận/huyện", err)
          );
      }

      setWards([]);
      formik.setFieldValue("district", "");
      formik.setFieldValue("ward", "");
    }
  }, [formik.values.province, provinces]);

  useEffect(() => {
    if (formik.values.district) {
      const selectedDistrict = districts.find(
        (d) => d.name === formik.values.district
      );

      if (selectedDistrict) {
        axios
          .get(
            `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`
          )
          .then((res) => setWards(res.data.wards || []))
          .catch((err) => console.error("Lỗi khi tải danh sách phường/xã", err));
      }

      formik.setFieldValue("ward", "");
    }
  }, [formik.values.district, districts]);

  return (
    <Box
      sx={{
        bgcolor: isDark ? "#111111" : "#ffffff",
        color: isDark ? "white" : "#0f172a",
        borderRadius: "28px",
        border: isDark
          ? "1px solid rgba(249,115,22,0.16)"
          : "1px solid rgba(15,23,42,0.08)",
        boxShadow: isDark
          ? "0 28px 80px rgba(0,0,0,0.45)"
          : "0 24px 70px rgba(15,23,42,0.12)",
        p: { xs: 3, sm: 4 },
      }}
    >
      <div className="mb-6 space-y-2 text-center">
        <p className=" font-bold uppercase tracking-[0.28em] text-xl text-orange-400">
          Thêm địa chỉ giao hàng
        </p>
        
        <p
          className={
            isDark
              ? "mx-auto max-w-lg text-sm leading-6 text-neutral-400"
              : "mx-auto max-w-lg text-sm leading-6 text-slate-600"
          }
        >
          Điền đầy đủ thông tin giao hàng để đơn hàng được xử lý nhanh chóng và
          chính xác hơn.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="receiverName"
              label="Người nhận"
              placeholder="Nguyễn Văn A"
              value={formik.values.receiverName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.receiverName &&
                Boolean(formik.errors.receiverName)
              }
              helperText={
                formik.touched.receiverName && formik.errors.receiverName
              }
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="phoneNumber"
              label="Số điện thoại"
              placeholder="0987654321"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
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
              value={formik.values.province}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.province && Boolean(formik.errors.province)}
              helperText={formik.touched.province && formik.errors.province}
              sx={fieldSx}
            >
              {provinces.map((province) => (
                <MenuItem key={province.code} value={province.name}>
                  {province.name}
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
              value={formik.values.district}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.district && Boolean(formik.errors.district)}
              helperText={formik.touched.district && formik.errors.district}
              disabled={!formik.values.province}
              sx={fieldSx}
            >
              {districts.map((district) => (
                <MenuItem key={district.code} value={district.name}>
                  {district.name}
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
              error={formik.touched.ward && Boolean(formik.errors.ward)}
              helperText={formik.touched.ward && formik.errors.ward}
              disabled={!formik.values.district}
              sx={fieldSx}
            >
              {wards.map((ward) => (
                <MenuItem key={ward.code} value={ward.name}>
                  {ward.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="streetDetail"
              label="Số nhà, tên đường"
              placeholder="123 Lê Lợi"
              value={formik.values.streetDetail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.streetDetail &&
                Boolean(formik.errors.streetDetail)
              }
              helperText={
                formik.touched.streetDetail && formik.errors.streetDetail
              }
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="note"
              label="Ghi chú"
              placeholder="Gọi trước khi giao, giao trong giờ hành chính..."
              value={formik.values.note}
              onChange={formik.handleChange}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                py: "13px",
                fontWeight: 800,
                fontSize: "0.98rem",
                borderRadius: "999px",
                textTransform: "none",
                color: "#111111",
                background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                boxShadow: "0 14px 35px rgba(249,115,22,0.35)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #fdba74 0%, #ea580c 100%)",
                },
              }}
            >
              Lưu địa chỉ giao hàng
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddressForm;