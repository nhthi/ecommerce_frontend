import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { BlogTag, BlogTagFormValues } from "../../../types/BlogType";
import { useAppDispatch } from "../../../state/Store";
import { createBlogTag, updateBlogTag } from "../../../state/admin/adminBlogTagSlice";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";


interface AddEditBlogTagFormProps {
  initialData?: BlogTag;
  isEdit?: boolean;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Tên tag không được để trống")
    .min(2, "Tên tag phải có ít nhất 2 ký tự")
    .max(100, "Tên tag tối đa 100 ký tự"),
  slug: Yup.string()
    .trim()
    .required("Slug không được để trống")
    .min(2, "Slug phải có ít nhất 2 ký tự")
    .max(120, "Slug tối đa 120 ký tự"),
});

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    borderRadius: "18px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(249,115,22,0.4)" },
    "&.Mui-focused fieldset": { borderColor: "#f97316" },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.58)" },
  "& .MuiFormHelperText-root": { color: "#fca5a5" },
};

const cardSx = {
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
};

const AddEditBlogTagForm = ({
  initialData,
  isEdit = false,
}: AddEditBlogTagFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik<BlogTagFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true)
      if (isEdit && initialData?.id) {
        await dispatch(
          updateBlogTag({
            id: initialData.id,
            request: values,
          })
        );
      } else {
        await dispatch(createBlogTag(values));
      }
      setLoading(false)

      navigate("/admin/blog");
    },
  });

  return (
    <Paper elevation={0} sx={{ ...cardSx, p: { xs: 3, lg: 4 } }}>
       {loading && <CustomLoading message="Đang xử lý..." />}
      <Typography fontSize={28} fontWeight={800} color="white">
        {isEdit ? "Cập nhật tag blog" : "Thêm tag blog mới"}
      </Typography>

      <Typography
        sx={{
          mt: 0.8,
          mb: 3,
          color: "rgba(255,255,255,0.62)",
          fontSize: 14.5,
        }}
      >
        Quản lý các tag như whey, cardio, hypertrophy, cutting, protein, gym.
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2.2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="name"
              label="Tên tag"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="slug"
              label="Slug"
              value={formik.values.slug}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.slug && Boolean(formik.errors.slug)}
              helperText={formik.touched.slug && formik.errors.slug}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box display="flex" gap={1.2} justifyContent="flex-end" flexWrap="wrap">
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/blog")}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  px: 2.5,
                  color: "rgba(255,255,255,0.82)",
                  borderColor: "rgba(255,255,255,0.12)",
                }}
              >
                Quay lại
              </Button>

<Button
  type="submit"
  variant="contained"
  sx={{
    borderRadius: 999,
    textTransform: "none",
    px: 2.8,
    background: "linear-gradient(135deg, #f97316, #ea580c)",
    boxShadow: "none",
    "&:hover": {
      background: "linear-gradient(135deg, #ea580c, #c2410c)",
      boxShadow: "none",
    },
  }}
>
  <span style={{ color: "#fff", fontWeight: 700 }}>
    {isEdit ? "Lưu thay đổi" : "Tạo tag"}
  </span>
</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AddEditBlogTagForm;