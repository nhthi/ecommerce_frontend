import React, { useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { useNavigate } from "react-router-dom";
import {
  createCategory,
  fetchAllCategory,
} from "../../../state/admin/adminCategorySlice";

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
    .min(3, "Mã danh mục phải có ít nhất 3 ký tự")
    .max(30, "Mã danh mục không được vượt quá 30 ký tự"),
  level: Yup.number().required("Vui lòng chọn cấp độ danh mục").min(1).max(3),
  parentId: Yup.string().nullable(),
});

const AddNewCategoryForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { category } = useAppSelector((store) => store);

  useEffect(() => {
    dispatch(fetchAllCategory());
  }, []);

  const formik = useFormik<CategoryFormValues>({
    initialValues: {
      name: "",
      categoryId: "",
      level: 1,
      parentId: null,
    },
    onSubmit: async (values) => {
      console.log("Giá trị form:", values);
      await dispatch(createCategory(values));
      navigate("/admin/categories");
    },
    validationSchema,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-color pb-5 text-center">
        Tạo Danh Mục Mới
      </h1>

      <Box
        component={"form"}
        onSubmit={formik.handleSubmit}
        sx={{ padding: 2, mt: 3 }}
      >
        <Grid container spacing={2}>
          {/* Tên danh mục */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="name"
              label="Tên danh mục"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>

          {/* Mã danh mục */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="categoryId"
              label="Mã danh mục"
              value={formik.values.categoryId}
              onChange={formik.handleChange}
              error={
                formik.touched.categoryId && Boolean(formik.errors.categoryId)
              }
              helperText={formik.touched.categoryId && formik.errors.categoryId}
            />
          </Grid>

          {/* Cấp độ danh mục */}
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel id="level-label">Cấp độ</InputLabel>
              <Select
                label="Cấp độ"
                labelId="level-label"
                name="level"
                value={formik.values.level}
                onChange={formik.handleChange}
              >
                <MenuItem value={1}>Cấp 1 (Danh mục cha)</MenuItem>
                <MenuItem value={2}>Cấp 2 (Danh mục con)</MenuItem>
                <MenuItem value={3}>Cấp 3 (Danh mục cháu)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Danh mục cha */}
          {formik.values.level > 1 && (
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel id="parent-label">Danh mục cha</InputLabel>
                <Select
                  labelId="parent-label"
                  name="parentId"
                  label="Danh mục cha"
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

          {/* Submit */}
          <Grid size={{ xs: 12 }}>
            <Button
              fullWidth
              variant="contained"
              sx={{ py: ".8rem" }}
              type="submit"
            >
              Tạo danh mục
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default AddNewCategoryForm;
