import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  createWorkoutPlanDay,
  replaceExercisesOfWorkoutPlanDay,
  updateWorkoutPlanDay,
} from "../../../state/admin/adminWorkoutPlanDaySlice";
import { fetchAllWorkoutPlans } from "../../../state/admin/adminWorkoutPlanSlice";
import { fetchAllExercises } from "../../../state/admin/adminExerciseSlice";
import { WorkoutPlanDay, WorkoutPlanDayFormValues } from "../../../types/WorkoutPlanDayType";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";

interface AddEditWorkoutPlanDayFormProps {
  initialData?: WorkoutPlanDay;
  isEdit?: boolean;
}

type WorkoutPlanDayFormInternalValues = {
  workoutPlanId: number | "";
  dayNumber: number | "";
  dayName: string;
  title: string;
  focusMuscleGroup: string;
  estimatedDurationMin: number | "";
  note: string;
  sortOrder: number | "";
  exerciseIds: number[];
};

const validationSchema = Yup.object().shape({
  workoutPlanId: Yup.number().nullable().required("Vui lòng chọn kế hoạch tập"),
  dayNumber: Yup.number()
    .required("Ngày tập không được để trống")
    .min(1, "Tối thiểu là ngày 1")
    .max(31, "Tối đa là ngày 31"),
  dayName: Yup.string().max(100, "Tên ngày không vượt quá 100 ký tự"),
  title: Yup.string().max(180, "Tiêu đề không vượt quá 180 ký tự"),
  focusMuscleGroup: Yup.string().max(180, "Nhóm cơ không vượt quá 180 ký tự"),
  estimatedDurationMin: Yup.number()
    .nullable()
    .min(1, "Thời lượng tối thiểu 1 phút")
    .max(600, "Thời lượng tối đa 600 phút"),
  note: Yup.string().max(2000, "Ghi chú không vượt quá 2000 ký tự"),
  sortOrder: Yup.number()
    .nullable()
    .min(0, "Thứ tự không hợp lệ")
    .max(200, "Thứ tự quá lớn"),
  exerciseIds: Yup.array().of(Yup.number()),
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

const AddEditWorkoutPlanDayForm = ({ initialData, isEdit = false }: AddEditWorkoutPlanDayFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { workoutPlans } = useAppSelector((store) => store.adminWorkoutPlan);
  const { exercises } = useAppSelector((store) => store.adminExercise);

  useEffect(() => {
    dispatch(fetchAllWorkoutPlans());
    dispatch(fetchAllExercises());
  }, [dispatch]);

  const formik = useFormik<WorkoutPlanDayFormInternalValues>({
    enableReinitialize: true,
    initialValues: {
      workoutPlanId: initialData?.workoutPlan?.id || "",
      dayNumber: initialData?.dayNumber ?? "",
      dayName: initialData?.dayName || "",
      title: initialData?.title || "",
      focusMuscleGroup: initialData?.focusMuscleGroup || "",
      estimatedDurationMin: initialData?.estimatedDurationMin ?? "",
      note: initialData?.note || "",
      sortOrder: initialData?.sortOrder ?? "",
      exerciseIds: initialData?.exercises?.map((item) => Number(item.id)) || [],
    },
    validationSchema,
    onSubmit: async (values) => {
      const request: WorkoutPlanDayFormValues = {
        dayNumber: Number(values.dayNumber),
        dayName: values.dayName || undefined,
        title: values.title || undefined,
        focusMuscleGroup: values.focusMuscleGroup || undefined,
        estimatedDurationMin:
          values.estimatedDurationMin === "" ? undefined : Number(values.estimatedDurationMin),
        note: values.note || undefined,
        sortOrder: values.sortOrder === "" ? undefined : Number(values.sortOrder),
      };

      setLoading(true);

      if (isEdit && initialData?.id) {
        const result = await dispatch(updateWorkoutPlanDay({ id: initialData.id, request }));
        const dayId = (result.payload as WorkoutPlanDay | undefined)?.id || initialData.id;

        await dispatch(
          replaceExercisesOfWorkoutPlanDay({
            dayId: Number(dayId),
            exerciseIds: values.exerciseIds,
          })
        );
      } else {
        const result = await dispatch(
          createWorkoutPlanDay({
            workoutPlanId: Number(values.workoutPlanId),
            request,
          })
        );

        const created = result.payload as WorkoutPlanDay | undefined;

        if (created?.id) {
          await dispatch(
            replaceExercisesOfWorkoutPlanDay({
              dayId: Number(created.id),
              exerciseIds: values.exerciseIds,
            })
          );
        }
      }

      setLoading(false);
      navigate("/admin/workout");
    },
  });

  return (
    <Paper elevation={0} sx={{ ...cardSx, p: { xs: 3, lg: 4 } }}>
      {loading && <CustomLoading message="Đang xử lý..." />}

      <Typography fontSize={28} fontWeight={800} color="white">
        {isEdit ? "Cập nhật ngày tập" : "Thêm ngày tập mới"}
      </Typography>

      <Typography
        sx={{
          mt: 0.8,
          mb: 3,
          color: "rgba(255,255,255,0.62)",
          fontSize: 14.5,
        }}
      >
        Cấu hình từng ngày tập, liên kết với kế hoạch tập và gán danh sách bài tập từ thư viện.
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2.2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel>Kế hoạch tập</InputLabel>
              <Select
                name="workoutPlanId"
                label="Kế hoạch tập"
                value={formik.values.workoutPlanId}
                onChange={formik.handleChange}
              >
                {workoutPlans.map((plan) => (
                  <MenuItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              name="dayNumber"
              label="Ngày tập"
              value={formik.values.dayNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.dayNumber && Boolean(formik.errors.dayNumber)}
              helperText={formik.touched.dayNumber && formik.errors.dayNumber}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              name="sortOrder"
              label="Thứ tự hiển thị"
              value={formik.values.sortOrder}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.sortOrder && Boolean(formik.errors.sortOrder)}
              helperText={formik.touched.sortOrder && formik.errors.sortOrder}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="dayName"
              label="Tên ngày"
              value={formik.values.dayName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.dayName && Boolean(formik.errors.dayName)}
              helperText={formik.touched.dayName && formik.errors.dayName}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="title"
              label="Tiêu đề buổi tập"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="focusMuscleGroup"
              label="Nhóm cơ tập trung"
              value={formik.values.focusMuscleGroup}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.focusMuscleGroup &&
                Boolean(formik.errors.focusMuscleGroup)
              }
              helperText={
                formik.touched.focusMuscleGroup &&
                formik.errors.focusMuscleGroup
              }
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              name="estimatedDurationMin"
              label="Thời lượng (phút)"
              value={formik.values.estimatedDurationMin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.estimatedDurationMin &&
                Boolean(formik.errors.estimatedDurationMin)
              }
              helperText={
                formik.touched.estimatedDurationMin &&
                formik.errors.estimatedDurationMin
              }
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel>Bài tập</InputLabel>
              <Select
                multiple
                name="exerciseIds"
                label="Bài tập"
                value={formik.values.exerciseIds}
                onChange={formik.handleChange}
                input={<OutlinedInput label="Bài tập" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", gap: 0.7, flexWrap: "wrap" }}>
                    {(selected as number[]).map((id) => {
                      const found = exercises.find((item) => item.id === id);
                      return (
                        <Chip
                          key={id}
                          label={found?.name || id}
                          sx={{
                            backgroundColor: "rgba(249,115,22,0.15)",
                            color: "#fdba74",
                            borderRadius: 999,
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {exercises.map((exercise) => (
                  <MenuItem key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              name="note"
              label="Ghi chú"
              value={formik.values.note}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.note && Boolean(formik.errors.note)}
              helperText={formik.touched.note && formik.errors.note}
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
                {isEdit ? "Lưu thay đổi" : "Tạo ngày tập"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AddEditWorkoutPlanDayForm;