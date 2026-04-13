import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DeleteOutline, ImageOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../state/Store";
import {
  createWorkoutPlan,
  updateWorkoutPlan,
} from "../../../state/admin/adminWorkoutPlanSlice";
import {
  GoalTypeOptions,
  WorkoutPlan,
  WorkoutPlanFormValues,
} from "../../../types/WorkoutPlanType";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";
import { uploadToCloundinary } from "../../../utils/uploadToCloudinary";

interface AddEditWorkoutPlanFormProps {
  initialData?: WorkoutPlan;
  isEdit?: boolean;
  currentUserId?: number;
}

type WorkoutPlanFormInternalValues = {
  name: string;
  description: string;
  cover: string;
  goal: string;
  level: string;
  durationWeeks: number | "";
  daysPerWeek: number | "";
  isTemplate: boolean;
  status: string;
};

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Ten chuong trinh tap khong duoc de trong")
    .min(2, "Toi thieu 2 ky tu")
    .max(180, "Toi da 180 ky tu"),
  description: Yup.string().max(2500, "Toi da 2500 ky tu"),
  cover: Yup.string().url("URL anh bia khong hop le").nullable(),
  goal: Yup.string().max(180, "Toi da 180 ky tu"),
  level: Yup.string().max(80, "Toi da 80 ky tu"),
  durationWeeks: Yup.number().nullable().min(1).max(52),
  daysPerWeek: Yup.number().nullable().min(1).max(7),
  status: Yup.string().max(80),
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

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Ban nhap" },
  { value: "PUBLISHED", label: "Xuat ban" },
  { value: "ARCHIVED", label: "Luu tru" },
];

const LEVEL_OPTIONS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

const AddEditWorkoutPlanForm = ({
  initialData,
  isEdit = false,
  currentUserId,
}: AddEditWorkoutPlanFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    initialData?.cover || "",
  );
  const [uploading, setUploading] = useState(false);

  const formik = useFormik<WorkoutPlanFormInternalValues>({
    enableReinitialize: true,
    initialValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      cover: initialData?.cover || "",
      goal: initialData?.goal || "",
      level: initialData?.level || "",
      durationWeeks: initialData?.durationWeeks ?? "",
      daysPerWeek: initialData?.daysPerWeek ?? "",
      isTemplate: Boolean(initialData?.isTemplate),
      status: initialData?.status || "DRAFT",
    },
    validationSchema,
    onSubmit: async (values) => {
      const request: WorkoutPlanFormValues = {
        name: values.name,
        description: values.description || undefined,
        cover: values.cover || undefined,
        goal: values.goal || undefined,
        level: values.level || undefined,
        durationWeeks:
          values.durationWeeks === "" ? undefined : Number(values.durationWeeks),
        daysPerWeek:
          values.daysPerWeek === "" ? undefined : Number(values.daysPerWeek),
        isTemplate: values.isTemplate,
        status: values.status || undefined,
        createdBy:
          initialData?.createdBy?.id || currentUserId
            ? {
                id: initialData?.createdBy?.id || Number(currentUserId),
              }
            : null,
      };

      setLoading(true);
      try {
        if (isEdit && initialData?.id) {
          await dispatch(updateWorkoutPlan({ id: initialData.id, request }));
        } else {
          await dispatch(createWorkoutPlan(request));
        }
        navigate("/admin/workout");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      formik.setFieldError("cover", "Chi duoc chon file anh");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);

    try {
      setUploading(true);
      const url = await uploadToCloundinary(file, "image");
      formik.setFieldValue("cover", url);
    } catch (error) {
      formik.setFieldError("cover", "Tai anh that bai");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  useEffect(() => {
    setThumbnailPreview(initialData?.cover || "");
  }, [initialData]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleRemoveThumbnail = () => {
    if (thumbnailPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailPreview("");
    formik.setFieldValue("cover", "");
  };

  return (
    <Paper elevation={0} sx={{ ...cardSx, p: { xs: 3, lg: 4 } }}>
      {(loading || uploading) && (
  <CustomLoading message={uploading ? "Đang tải ảnh..." : "Đang xử lý..."} />
)}

<Typography fontSize={28} fontWeight={800} color="white">
  {isEdit ? "Cập nhật chương trình tập" : "Thêm chương trình tập mới"}
</Typography>

      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2.2}>
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                p: 2.4,
                borderRadius: "24px",
                border: "1px dashed rgba(249,115,22,0.24)",
                backgroundColor: "rgba(255,255,255,0.02)",
              }}
            >
              <Typography fontWeight={700} color="white" sx={{ mb: 1.5 }}>
                Ảnh cover
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                <Button
                  component="label"
                  startIcon={<ImageOutlined />}
                  variant="outlined"
                  sx={{
                    borderRadius: 999,
                    textTransform: "none",
                    color: "#fff7ed",
                    borderColor: "rgba(249,115,22,0.24)",
                  }}
                >
                  Chọn ảnh
                  <input hidden type="file" accept="image/*" onChange={handleThumbnailChange} />
                </Button>

                {thumbnailPreview && (
                  <Box sx={{ position: "relative" }}>
                    <Box
                      component="img"
                      src={thumbnailPreview}
                      alt="Workout cover"
                      sx={{
                        width: 180,
                        height: 110,
                        objectFit: "cover",
                        borderRadius: "18px",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    />
                    <IconButton
                      onClick={handleRemoveThumbnail}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "#fecaca",
                        backgroundColor: "rgba(15,15,15,0.8)",
                        border: "1px solid rgba(239,68,68,0.24)",
                      }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="name"
              label="Tên chương trình"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
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
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel>Mục tiêu</InputLabel>
              <Select
                name="goal"
                label="Mục tiêu"
                value={formik.values.goal}
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>Không chọn</em>
                </MenuItem>
                {GoalTypeOptions.map((goal) => (
                  <MenuItem key={goal.value} value={goal.value}>
                    {goal.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel>Cấp độ</InputLabel>
              <Select
                name="level"
                label="Cấp độ"
                value={formik.values.level}
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>Không chọn</em>
                </MenuItem>
                {LEVEL_OPTIONS.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                label="Trạng thái"
                value={formik.values.status}
                onChange={formik.handleChange}
              >
                {STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              name="durationWeeks"
              label="Thời lượng (tuần)"
              value={formik.values.durationWeeks}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.durationWeeks && Boolean(formik.errors.durationWeeks)}
              helperText={formik.touched.durationWeeks && formik.errors.durationWeeks}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              name="daysPerWeek"
              label="Số buổi mỗi tuần"
              value={formik.values.daysPerWeek}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.daysPerWeek && Boolean(formik.errors.daysPerWeek)}
              helperText={formik.touched.daysPerWeek && formik.errors.daysPerWeek}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.isTemplate}
                  onChange={(event) =>
                    formik.setFieldValue("isTemplate", event.target.checked)
                  }
                />
              }
              label={
                <Typography color="rgba(255,255,255,0.78)">
                  Đánh dấu là mẫu
                </Typography>
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Stack direction="row" spacing={1.4} justifyContent="flex-end">
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate("/admin/workout")}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  px: 2.8,
                  color: "#fff7ed",
                  borderColor: "rgba(255,255,255,0.12)",
                }}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={uploading || loading}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  px: 2.8,
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                }}
              >
                {isEdit ? "Lưu thay đổi" : "Tạo lịch tập"}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AddEditWorkoutPlanForm;
