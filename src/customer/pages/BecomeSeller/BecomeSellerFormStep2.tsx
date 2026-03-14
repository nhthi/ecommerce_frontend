import {
  Box,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";

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

const BecomeSellerFormStep2 = ({ formik }: any) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);

  // 🏙️ Lấy danh sách tỉnh/thành
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("Error fetching provinces", err))
      .finally(() => setLoading(false));
  }, []);

  // 📍 Khi chọn tỉnh => load quận/huyện
  useEffect(() => {
    const provinceName = formik.values.pickupAddress?.province;
    if (provinceName) {
      const selectedProvince = provinces.find((p) => p.name === provinceName);
      if (selectedProvince) {
        axios
          .get(
            `https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`
          )
          .then((res) => setDistricts(res.data.districts || []))
          .catch((err) => console.error("Error fetching districts", err));
      }
      // Reset lại các field phụ thuộc
      setWards([]);
      formik.setFieldValue("pickupAddress.district", "");
      formik.setFieldValue("pickupAddress.ward", "");
    }
  }, [formik.values.pickupAddress?.province]);

  // 🏡 Khi chọn quận => load phường/xã
  useEffect(() => {
    const districtName = formik.values.pickupAddress?.district;
    if (districtName) {
      const selectedDistrict = districts.find((d) => d.name === districtName);
      if (selectedDistrict) {
        axios
          .get(
            `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`
          )
          .then((res) => setWards(res.data.wards || []))
          .catch((err) => console.error("Error fetching wards", err));
      }
      formik.setFieldValue("pickupAddress.ward", "");
    }
  }, [formik.values.pickupAddress?.district]);

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <p className="text-xl font-bold text-center pb-5">Địa chỉ nhận hàng</p>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* --- Họ và tên người liên hệ --- */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="pickupAddress.receiverName"
              label="Họ và tên người liên hệ"
              value={formik.values.pickupAddress?.receiverName || ""}
              onChange={formik.handleChange}
              error={Boolean(
                formik.touched.pickupAddress?.receiverName &&
                  formik.errors.pickupAddress?.receiverName
              )}
              helperText={
                formik.touched.pickupAddress?.receiverName &&
                formik.errors.pickupAddress?.receiverName
              }
            />
          </Grid>

          {/* --- Số điện thoại liên hệ --- */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="pickupAddress.phoneNumber"
              label="Số điện thoại liên hệ"
              value={formik.values.pickupAddress?.phoneNumber || ""}
              onChange={formik.handleChange}
              error={Boolean(
                formik.touched.pickupAddress?.phoneNumber &&
                  formik.errors.pickupAddress?.phoneNumber
              )}
              helperText={
                formik.touched.pickupAddress?.phoneNumber &&
                formik.errors.pickupAddress?.phoneNumber
              }
            />
          </Grid>

          {/* --- Tỉnh / Thành phố --- */}
          <Grid size={{ xs: 12 }}>
            <TextField
              select
              fullWidth
              name="pickupAddress.province"
              label="Tỉnh / Thành phố"
              value={formik.values.pickupAddress?.province || ""}
              onChange={formik.handleChange}
              error={Boolean(
                formik.touched.pickupAddress?.province &&
                  formik.errors.pickupAddress?.province
              )}
              helperText={
                formik.touched.pickupAddress?.province &&
                formik.errors.pickupAddress?.province
              }
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
              name="pickupAddress.district"
              label="Quận / Huyện"
              value={formik.values.pickupAddress?.district || ""}
              onChange={formik.handleChange}
              error={Boolean(
                formik.touched.pickupAddress?.district &&
                  formik.errors.pickupAddress?.district
              )}
              helperText={
                formik.touched.pickupAddress?.district &&
                formik.errors.pickupAddress?.district
              }
              disabled={!formik.values.pickupAddress?.province}
            >
              {districts.map((district) => (
                <MenuItem key={district.code} value={district.name}>
                  {district.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* --- Phường / Xã --- */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              name="pickupAddress.ward"
              label="Phường / Xã"
              value={formik.values.pickupAddress?.ward || ""}
              onChange={formik.handleChange}
              error={Boolean(
                formik.touched.pickupAddress?.ward &&
                  formik.errors.pickupAddress?.ward
              )}
              helperText={
                formik.touched.pickupAddress?.ward &&
                formik.errors.pickupAddress?.ward
              }
              disabled={!formik.values.pickupAddress?.district}
            >
              {wards.map((ward) => (
                <MenuItem key={ward.code} value={ward.name}>
                  {ward.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* --- Số nhà, tên đường --- */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="pickupAddress.streetDetail"
              label="Số nhà, tên đường"
              value={formik.values.pickupAddress?.streetDetail || ""}
              onChange={formik.handleChange}
              error={Boolean(
                formik.touched.pickupAddress?.streetDetail &&
                  formik.errors.pickupAddress?.streetDetail
              )}
              helperText={
                formik.touched.pickupAddress?.streetDetail &&
                formik.errors.pickupAddress?.streetDetail
              }
            />
          </Grid>

          {/* --- Ghi chú --- */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="pickupAddress.note"
              label="Ghi chú (nếu có)"
              multiline
              rows={3}
              value={formik.values.pickupAddress?.note || ""}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default BecomeSellerFormStep2;
