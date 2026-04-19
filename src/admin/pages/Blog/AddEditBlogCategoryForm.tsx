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
import { useAppDispatch } from "../../../state/Store";
import { useNavigate } from "react-router-dom";
import {
  createBlogCategory,
  updateBlogCategory,
} from "../../../state/admin/adminBlogCategorySlice";
import {
  BlogCategory,
  BlogCategoryFormValues,
} from "../../../types/BlogType";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";

interface AddEditBlogCategoryFormProps {
  initialData?: BlogCategory;
  isEdit?: boolean;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Tên danh mục không được để trống")
    .min(2, "Tên danh mục phải có ít nhất 2 ký tự")
    .max(150, "Tên danh mục tối đa 150 ký tự"),
  slug: Yup.string()
    .trim()
    .required("Slug không được để trống")
    .min(2, "Slug phải có ít nhất 2 ký tự")
    .max(180, "Slug tối đa 180 ký tự"),
  description: Yup.string().max(2000, "Mô tả quá dài"),
  imageUrl: Yup.string().url("Image URL không hợp lệ").nullable(),
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

const AddEditBlogCategoryForm = ({
  initialData,
  isEdit = false,
}: AddEditBlogCategoryFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik<BlogCategoryFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      imageUrl: initialData?.imageUrl || "",
    },
    validationSchema,
    onSubmit: async (values) => {
        setLoading(true)
      if (isEdit && initialData?.id) {
        await dispatch(
          updateBlogCategory({
            id: initialData.id,
            request: values,
          })
        );

      } else {
        await dispatch(createBlogCategory(values));
      }
        setLoading(false)

      navigate("/admin/blog");
    },
  });

  return (
    <Paper elevation={0} sx={{ ...cardSx, p: { xs: 3, lg: 4 } }}>
         {loading && <CustomLoading message="Đang xử lý..." />}
      
      <Typography fontSize={28} fontWeight={800} color="white">
        {isEdit ? "Cập nhật danh mục blog" : "Thêm danh mục blog mới"}
      </Typography>

      <Typography
        sx={{
          mt: 0.8,
          mb: 3,
          color: "rgba(255,255,255,0.62)",
          fontSize: 14.5,
        }}
      >
        Tạo danh mục cho blog fitness như dinh dưỡng, tập luyện, recovery, supplement.
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2.2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="name"
              label="Tên danh mục"
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
            <TextField
              fullWidth
              name="imageUrl"
              label="Ảnh danh mục (URL)"
              value={formik.values.imageUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.imageUrl && Boolean(formik.errors.imageUrl)}
              helperText={formik.touched.imageUrl && formik.errors.imageUrl}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              name="description"
              label="Mô tả"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={formik.touched.description && formik.errors.description}
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
    {isEdit ? "Lưu thay đổi" : "Tạo danh mục"}
  </span>
</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AddEditBlogCategoryForm;