import { Box, Button, Grid, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { useAppDispatch } from "../../../state/Store";
import { createAddress } from "../../../state/customer/addressSlice";

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

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "18px",
    color: "white",
    backgroundColor: "rgba(255,255,255,0.03)",
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.1)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(249,115,22,0.35)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#f97316",
    },
    "&.Mui-disabled": {
      backgroundColor: "rgba(255,255,255,0.02)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.62)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#fdba74",
  },
  "& .MuiFormHelperText-root": {
    color: "rgba(255,255,255,0.45)",
    marginLeft: "6px",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255,255,255,0.38)",
    opacity: 1,
  },
  "& .MuiSvgIcon-root": {
    color: "rgba(255,255,255,0.55)",
  },
};

const AddressForm = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useAppDispatch();

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

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

  useEffect(() => {
    if (formik.values.province) {
      const selectedProvince = provinces.find(
        (p) => p.name === formik.values.province,
      );
      if (selectedProvince) {
        axios
          .get(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
          .then((res) => setDistricts(res.data.districts || []))
          .catch((err) => console.error("Error fetching districts", err));
      }
      setWards([]);
      formik.setFieldValue("district", "");
      formik.setFieldValue("ward", "");
    }
  }, [formik.values.province, provinces]);

  useEffect(() => {
    if (formik.values.district) {
      const selectedDistrict = districts.find(
        (d) => d.name === formik.values.district,
      );
      if (selectedDistrict) {
        axios
          .get(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
          .then((res) => setWards(res.data.wards || []))
          .catch((err) => console.error("Error fetching wards", err));
      }
      formik.setFieldValue("ward", "");
    }
  }, [formik.values.district, districts]);

  return (
    <Box
      sx={{
        bgcolor: "#111111",
        color: "white",
        borderRadius: "28px",
        border: "1px solid rgba(249,115,22,0.16)",
        boxShadow: "0 28px 80px rgba(0,0,0,0.45)",
        p: { xs: 3, sm: 4 },
      }}
    >
      <div className="mb-6 space-y-2 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-300">
          New address
        </p>
        <h2 className="text-3xl font-black tracking-tight text-white">
          Thêm địa chỉ giao hàng
        </h2>
        <p className="mx-auto max-w-lg text-sm leading-6 text-neutral-400">
          Điền thông tin giao hàng rõ ràng để đơn được xử lý nhanh và đúng địa chỉ.
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
              error={formik.touched.receiverName && Boolean(formik.errors.receiverName)}
              helperText={formik.touched.receiverName && formik.errors.receiverName}
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
              error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
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
              error={formik.touched.streetDetail && Boolean(formik.errors.streetDetail)}
              helperText={formik.touched.streetDetail && formik.errors.streetDetail}
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
              placeholder="Gọi trước khi giao, giao giờ hành chính..."
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
                  background: "linear-gradient(135deg, #fdba74 0%, #ea580c 100%)",
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