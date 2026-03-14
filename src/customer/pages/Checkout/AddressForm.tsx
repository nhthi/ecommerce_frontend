import { Box, Button, Grid, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { useAppDispatch } from "../../../state/Store";
import { createAddress } from "../../../state/customer/addressSlice";

// 🧩 Kiểu dữ liệu cho tỉnh/thành - quận/huyện - phường/xã
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

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  // --- Fetch danh sách tỉnh ---
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("Error fetching provinces", err));
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

  // --- Khi chọn tỉnh => load quận ---
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
          .catch((err) => console.error("Error fetching districts", err));
      }
      setWards([]);
      formik.setFieldValue("district", "");
      formik.setFieldValue("ward", "");
    }
  }, [formik.values.province, provinces]);

  // --- Khi chọn quận => load phường ---
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
          .catch((err) => console.error("Error fetching wards", err));
      }
      formik.setFieldValue("ward", "");
    }
  }, [formik.values.district, districts]);

  return (
    <Box
      sx={{
        // maxWidth: 560,
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: 8,
        p: 4,
      }}
    >
      <p className="text-xl font-semibold text-center pb-1 text-slate-900">
        Thông tin giao hàng
      </p>
      <p className="text-xs text-center text-slate-500 mb-4">
        Vui lòng điền chính xác địa chỉ để đơn hàng được giao nhanh chóng.
      </p>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="receiverName"
              label="Họ và tên người nhận"
              placeholder="Ví dụ: Nguyễn Văn A"
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
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="phoneNumber"
              label="Số điện thoại"
              placeholder="Ví dụ: 0987 654 321"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
            />
          </Grid>

          {/* --- Tỉnh / Thành phố --- */}
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
            >
              {provinces.map((province) => (
                <MenuItem key={province.code} value={province.name}>
                  {province.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* --- Quận / Huyện --- */}
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
            >
              {districts.map((district) => (
                <MenuItem key={district.code} value={district.name}>
                  {district.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* --- Phường / Xã --- */}
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
            >
              {wards.map((ward) => (
                <MenuItem key={ward.code} value={ward.name}>
                  {ward.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* --- Địa chỉ chi tiết --- */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="streetDetail"
              label="Số nhà, tên đường"
              placeholder="Ví dụ: 123 Lê Lợi"
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
            />
          </Grid>

          {/* --- Ghi chú --- */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="note"
              label="Ghi chú giao hàng (nếu có)"
              placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
              value={formik.values.note}
              onChange={formik.handleChange}
            />
          </Grid>

          {/* --- Nút submit --- */}
          <Grid size={{ xs: 12 }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                py: "12px",
                fontWeight: 600,
                borderRadius: "999px",
                textTransform: "none",
                background:
                  "linear-gradient(135deg, rgb(56,189,248), rgb(37,99,235))",
                boxShadow: "0 10px 25px rgba(37,99,235,0.4)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, rgb(59,130,246), rgb(30,64,175))",
                },
              }}
            >
              Xác nhận địa chỉ giao hàng
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddressForm;
