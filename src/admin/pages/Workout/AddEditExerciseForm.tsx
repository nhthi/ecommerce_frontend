import React, { useState } from "react";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../state/Store";
import { createExercise, updateExercise } from "../../../state/admin/adminExerciseSlice";
import { Exercise, ExerciseFormValues } from "../../../types/ExerciseType";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";

interface AddEditExerciseFormProps {
  initialData?: Exercise;
  isEdit?: boolean;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Tên bài tập không được để trống")
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(180, "Tên không vượt quá 180 ký tự"),
  slug: Yup.string().trim().max(220, "Slug không vượt quá 220 ký tự"),
  description: Yup.string().max(2000, "Mô tả không vượt quá 2000 ký tự"),
  instruction: Yup.string().max(4000, "Hướng dẫn không vượt quá 4000 ký tự"),
  muscleGroupPrimary: Yup.string().max(120, "Nhóm cơ chính không vượt quá 120 ký tự"),
  muscleGroupSecondary: Yup.string().max(120, "Nhóm cơ phụ không vượt quá 120 ký tự"),
  difficultyLevel: Yup.string().max(80, "Độ khó không vượt quá 80 ký tự"),
  videoUrl: Yup.string().url("URL video không hợp lệ").nullable(),
  imageUrl: Yup.string().url("URL hình ảnh không hợp lệ").nullable(),
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

const AddEditExerciseForm = ({ initialData, isEdit = false }: AddEditExerciseFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik<ExerciseFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      instruction: initialData?.instruction || "",
      muscleGroupPrimary: initialData?.muscleGroupPrimary || "",
      muscleGroupSecondary: initialData?.muscleGroupSecondary || "",
      difficultyLevel: initialData?.difficultyLevel || "",
      videoUrl: initialData?.videoUrl || "",
      imageUrl: initialData?.imageUrl || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      if (isEdit && initialData?.id) {
        await dispatch(updateExercise({ id: initialData.id, request: values }));
      } else {
        await dispatch(createExercise(values));
      }
      setLoading(false);
      navigate("/admin/workout");
    },
  });

  return (
    <Paper elevation={0} sx={{ ...cardSx, p: { xs: 3, lg: 4 } }}>
      {loading && <CustomLoading message="Đang xử lý..." />}
      <Typography fontSize={28} fontWeight={800} color="white">
        {isEdit ? "Cập nhật bài tập" : "Thêm bài tập mới"}
      </Typography>
      <Typography sx={{ mt: 0.8, mb: 3, color: "rgba(255,255,255,0.62)", fontSize: 14.5 }}>
        Xây dựng thư viện bài tập để tái sử dụng cho các buổi tập và kế hoạch tập luyện.
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2.2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="name"
              label="Tên bài tập"
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
              label="Slug (đường dẫn)"
              value={formik.values.slug}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.slug && Boolean(formik.errors.slug)}
              helperText={formik.touched.slug && formik.errors.slug}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              name="muscleGroupPrimary"
              label="Nhóm cơ chính"
              value={formik.values.muscleGroupPrimary}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.muscleGroupPrimary && Boolean(formik.errors.muscleGroupPrimary)}
              helperText={formik.touched.muscleGroupPrimary && formik.errors.muscleGroupPrimary}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              name="muscleGroupSecondary"
              label="Nhóm cơ phụ"
              value={formik.values.muscleGroupSecondary}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.muscleGroupSecondary && Boolean(formik.errors.muscleGroupSecondary)}
              helperText={formik.touched.muscleGroupSecondary && formik.errors.muscleGroupSecondary}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              name="difficultyLevel"
              label="Độ khó"
              value={formik.values.difficultyLevel}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.difficultyLevel && Boolean(formik.errors.difficultyLevel)}
              helperText={formik.touched.difficultyLevel && formik.errors.difficultyLevel}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              name="description"
              label="Mô tả"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              name="instruction"
              label="Hướng dẫn thực hiện"
              value={formik.values.instruction}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.instruction && Boolean(formik.errors.instruction)}
              helperText={formik.touched.instruction && formik.errors.instruction}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="videoUrl"
              label="URL video"
              value={formik.values.videoUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.videoUrl && Boolean(formik.errors.videoUrl)}
              helperText={formik.touched.videoUrl && formik.errors.videoUrl}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="imageUrl"
              label="URL hình ảnh"
              value={formik.values.imageUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.imageUrl && Boolean(formik.errors.imageUrl)}
              helperText={formik.touched.imageUrl && formik.errors.imageUrl}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box display="flex" gap={1.2} justifyContent="flex-end" flexWrap="wrap">
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/workout")}
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
                }}
              >
                {isEdit ? "Lưu thay đổi" : "Tạo bài tập"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AddEditExerciseForm;