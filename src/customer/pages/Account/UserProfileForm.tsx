import React, { useState } from "react";
import { Avatar, Button, MenuItem, TextField, Typography } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { Formik } from "formik";
import * as Yup from "yup";
import { uploadToCloundinary } from "../../../utils/uploadToCloudinary";
import CustomLoading from "../../components/CustomLoading/CustomLoading";

interface Props {
  initialValues: { fullName: string; mobile: string; birthday: string; gender: string; bio: string; avatar: string; };
  onSubmit: (values: any) => void;
}

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    backgroundColor: "rgba(255,255,255,0.03)",
    color: "white",
    "& fieldset": { borderColor: "rgba(249,115,22,0.14)" },
    "&:hover fieldset": { borderColor: "rgba(249,115,22,0.36)" },
    "&.Mui-focused fieldset": { borderColor: "#f97316" },
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#fb923c" },
  "& .MuiFormHelperText-root": { color: "#fca5a5" },
};

const UserProfileForm: React.FC<Props> = ({ initialValues, onSubmit }) => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && <CustomLoading message="Đang xử lý ảnh..." />}
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={Yup.object({
          fullName: Yup.string().required("Vui lòng nhập họ và tên"),
          mobile: Yup.string().matches(/^[0-9]{10}$/, "Số điện thoại không hợp lệ").required("Vui lòng nhập số điện thoại"),
          birthday: Yup.string().nullable(),
          gender: Yup.string().oneOf(["MALE", "FEMALE", "OTHER"], "Giới tính không hợp lệ"),
          bio: Yup.string().max(200, "Giới thiệu tối đa 200 ký tự"),
        })}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, handleChange, handleSubmit, setFieldValue }) => {
          const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
              <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
                <div className="text-center">
                  <Avatar src={values.avatar} sx={{ width: 136, height: 136, mx: "auto", mb: 2.5, border: "3px solid #f97316" }} />
                  <Button component="label" startIcon={<PhotoCamera />} sx={{ borderRadius: "999px", textTransform: "none", fontWeight: 700, color: "#fb923c", border: "1px solid rgba(249,115,22,0.3)" }}>
                    Chọn ảnh
                    <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                  </Button>
                  <Typography sx={{ mt: 2, color: "#94a3b8", fontSize: "0.95rem" }}>Ảnh đại diện rõ mặt sẽ dễ nhận ra hơn.</Typography>
                </div>

                <div className="grid gap-4">
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="fullName"
                    value={values.fullName}
                    onChange={handleChange}
                    error={touched.fullName && Boolean(errors.fullName)}
                    helperText={touched.fullName && errors.fullName}
                    sx={inputSx}
                  />
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="mobile"
                    value={values.mobile}
                    onChange={handleChange}
                    error={touched.mobile && Boolean(errors.mobile)}
                    helperText={touched.mobile && errors.mobile}
                    sx={inputSx}
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
                    sx={inputSx}
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
                    sx={inputSx}
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
                    rows={4}
                    value={values.bio}
                    onChange={handleChange}
                    error={touched.bio && Boolean(errors.bio)}
                    helperText={touched.bio && errors.bio}
                    sx={inputSx}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ justifyContent: "center", alignSelf: "flex-start", borderRadius: "999px", textTransform: "none", fontWeight: 800, fontSize: "1rem", background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", color: "#fff", boxShadow: "none", px: 3.5, py: 1.1 }}
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </>
  );
};

export default UserProfileForm;