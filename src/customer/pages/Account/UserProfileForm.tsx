import React, { useState } from "react";
import {
  Avatar,
  Button,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { Formik } from "formik";
import * as Yup from "yup";
import { uploadToCloundinary } from "../../../utils/uploadToCloudinary";
import CustomLoading from "../../components/CustomLoading/CustomLoading";

interface Props {
  initialValues: {
    fullName: string;
    mobile: string;
    birthday: string;
    gender: string;
    bio: string;
    avatar: string;
  };
  onSubmit: (values: any) => void;
}

const UserProfileForm: React.FC<Props> = ({ initialValues, onSubmit }) => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && <CustomLoading message="Đang xử lý ảnh..." />}

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={Yup.object({
          fullName: Yup.string().required("Vui lòng nhập họ tên"),
          mobile: Yup.string()
            .matches(/^[0-9]{10}$/, "Số điện thoại không hợp lệ")
            .required("Vui lòng nhập số điện thoại"),
          birthday: Yup.string().nullable(),
          gender: Yup.string().oneOf(
            ["MALE", "FEMALE", "OTHER"],
            "Giới tính không hợp lệ"
          ),
          bio: Yup.string().max(200, "Giới thiệu tối đa 200 ký tự"),
        })}
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => {
          const handleImageChange = async (
            event: React.ChangeEvent<HTMLInputElement>
          ) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setLoading(true);
            try {
              const image = await uploadToCloundinary(file, "image");
              setFieldValue("avatar", image);
            } finally {
              setLoading(false);
            }
          };

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Avatar */}
                <Grid size={{ xs: 12, sm: 4 }} textAlign="center">
                  <Avatar
                    src={values.avatar}
                    sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
                  />
                  <IconButton
                    color="primary"
                    component="label"
                    disabled={loading}
                  >
                    <PhotoCamera />
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleImageChange}
                    />
                  </IconButton>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Cập nhật ảnh đại diện
                  </Typography>
                </Grid>

                {/* Thông tin */}
                <Grid size={{ xs: 12, sm: 8 }}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="fullName"
                    value={values.fullName}
                    onChange={handleChange}
                    error={touched.fullName && Boolean(errors.fullName)}
                    helperText={touched.fullName && errors.fullName}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="mobile"
                    value={values.mobile}
                    onChange={handleChange}
                    error={touched.mobile && Boolean(errors.mobile)}
                    helperText={touched.mobile && errors.mobile}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    name="birthday"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={values.birthday}
                    onChange={handleChange}
                    error={touched.birthday && Boolean(errors.birthday)}
                    helperText={touched.birthday && errors.birthday}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    select
                    fullWidth
                    label="Giới tính"
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    error={touched.gender && Boolean(errors.gender)}
                    helperText={touched.gender && errors.gender}
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="">Chọn giới tính</MenuItem>
                    <MenuItem value="MALE">Nam</MenuItem>
                    <MenuItem value="FEMALE">Nữ</MenuItem>
                    <MenuItem value="OTHER">Khác</MenuItem>
                  </TextField>

                  <TextField
                    fullWidth
                    label="Giới thiệu bản thân"
                    name="bio"
                    multiline
                    rows={3}
                    value={values.bio}
                    onChange={handleChange}
                    error={touched.bio && Boolean(errors.bio)}
                    helperText={touched.bio && errors.bio}
                    sx={{ mb: 2 }}
                  />

                  <Button type="submit" variant="contained" disabled={loading}>
                    Lưu thay đổi
                  </Button>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </>
  );
};

export default UserProfileForm;
