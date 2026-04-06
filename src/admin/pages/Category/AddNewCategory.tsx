import React, { useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { useNavigate } from "react-router-dom";
import { createCategory, fetchAllCategory } from "../../../state/admin/adminCategorySlice";

export interface CategoryFormValues {
  name: string;
  categoryId: string;
  level: number;
  parentId: number | null;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Tên danh mục không được để trống"),
  categoryId: Yup.string()
    .trim()
    .required("Mã danh mục không được để trống")
    .min(3, "Mã danh mục tối thiểu 3 ký tự")
    .max(30, "Mã danh mục tối đa 30 ký tự"),
  level: Yup.number()
    .required("Vui lòng chọn cấp độ danh mục")
    .min(1)
    .max(3),
  parentId: Yup.string().nullable(),
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
  background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
};

const AddNewCategoryForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { category } = useAppSelector((store) => store);

  useEffect(() => {
    dispatch(fetchAllCategory());
  }, [dispatch]);

  const formik = useFormik<CategoryFormValues>({
    initialValues: { name: "", categoryId: "", level: 1, parentId: null },
    onSubmit: async (values) => {
      await dispatch(createCategory(values));
      navigate("/admin/categories");
    },
    validationSchema,
  });

  return (
    <Paper elevation={0} sx={{ ...cardSx, p: { xs: 3, lg: 4 } }}>
      <Typography fontSize={28} fontWeight={800} color="white">
        Thêm danh mục mới
      </Typography>

      <Typography
        sx={{
          mt: 0.8,
          mb: 3,
          color: "rgba(255,255,255,0.62)",
          fontSize: 14.5,
        }}
      >
        Tạo cấu trúc danh mục rõ ràng cho sản phẩm fitness, bài viết blog và khóa học.
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
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="categoryId"
              label="Mã danh mục"
              value={formik.values.categoryId}
              onChange={formik.handleChange}
              error={
                formik.touched.categoryId &&
                Boolean(formik.errors.categoryId)
              }
              helperText={
                formik.touched.categoryId && formik.errors.categoryId
              }
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel>Cấp độ</InputLabel>
              <Select
                label="Cấp độ"
                name="level"
                value={formik.values.level}
                onChange={formik.handleChange}
              >
                <MenuItem value={1}>Cấp 1</MenuItem>
                <MenuItem value={2}>Cấp 2</MenuItem>
                <MenuItem value={3}>Cấp 3</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {formik.values.level > 1 && (
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth sx={fieldSx}>
                <InputLabel>Danh mục cha</InputLabel>
                <Select
                  label="Danh mục cha"
                  name="parentId"
                  value={formik.values.parentId || ""}
                  onChange={formik.handleChange}
                >
                  {category.categories
                    .filter((cat) => cat.level === formik.values.level - 1)
                    .map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <Box
              display="flex"
              gap={1.2}
              justifyContent="flex-end"
              flexWrap="wrap"
            >
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/categories")}
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
                  background:
                    "linear-gradient(135deg, #f97316, #ea580c)",
                }}
              >
                Tạo danh mục
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AddNewCategoryForm;