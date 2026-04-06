import React, { useEffect, useMemo, useState } from "react";
import { Box, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { CalendarMonth, FitnessCenter, Groups2, LocalFireDepartment } from "@mui/icons-material";
import TrainingCard from "./TrainingCard";
import TrainingFiltersPanel, { TrainingFilters } from "./TrainingFiltersPanel";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchAllWorkoutPlans } from "../../../state/admin/adminWorkoutPlanSlice";
import { fetchAllWorkoutPlanDays } from "../../../state/admin/adminWorkoutPlanDaySlice";
import { mapWorkoutPlansToTrainingSchedules } from "./trainingData";

const Training = () => {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<TrainingFilters>({ level: "All", goal: "All" });
  const { workoutPlans, loading: plansLoading, error: plansError } = useAppSelector((store) => store.adminWorkoutPlan);
  const { workoutPlanDays, loading: daysLoading, error: daysError } = useAppSelector((store) => store.adminWorkoutPlanDay);

  useEffect(() => {
    dispatch(fetchAllWorkoutPlans());
    dispatch(fetchAllWorkoutPlanDays());
  }, [dispatch]);

  const trainingSchedules = useMemo(
    () => mapWorkoutPlansToTrainingSchedules(workoutPlans, workoutPlanDays),
    [workoutPlans, workoutPlanDays],
  );

  const filteredSchedules = useMemo(() => {
    return trainingSchedules.filter((item) => {
      const matchLevel = filters.level === "All" || item.level === filters.level;
      const matchGoal = filters.goal === "All" || item.goal === filters.goal;
      return matchLevel && matchGoal;
    });
  }, [filters, trainingSchedules]);

  const featuredSchedule = filteredSchedules.find((item) => item.featured) || filteredSchedules[0];
  const loading = plansLoading || daysLoading;
  const error = plansError || daysError;

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg, #070707 0%, #111111 28%, #090909 100%)", px: { xs: 2, md: 3 }, py: { xs: 3, lg: 4 } }}>
      <Box sx={{ mx: "auto", maxWidth: "1460px" }}>
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            borderRadius: "34px",
            border: "1px solid rgba(255,255,255,0.08)",
            background:
              "radial-gradient(circle at top left, rgba(249,115,22,0.22), transparent 28%), linear-gradient(180deg, rgba(20,20,20,0.98), rgba(8,8,8,0.98))",
            boxShadow: "0 28px 80px rgba(0,0,0,0.34)",
            color: "white",
            p: { xs: 2.5, md: 4 },
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, lg: 7 }}>
              <Chip label="Lich tap lay tu du lieu that" variant="outlined" sx={{ color: "#fed7aa", borderColor: "rgba(249,115,22,0.3)", backgroundColor: "rgba(249,115,22,0.1)" }} />
              <Typography fontSize={{ xs: 34, md: 54 }} fontWeight={900} lineHeight={1.02} sx={{ mt: 1.8 }}>
                Lich tap duoc cap nhat tu he thong admin.
              </Typography>
              <Typography sx={{ mt: 1.5, maxWidth: 760, color: "rgba(255,255,255,0.72)", fontSize: { xs: 15, md: 17 } }}>
                Cac workout plan, workout day va exercise duoi day duoc map truc tiep tu API. Ban co the loc theo cap do va muc tieu ngay tren trang customer.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ mt: 2.4 }}>
                <Chip icon={<CalendarMonth sx={{ color: "#fb923c !important" }} />} label={`${trainingSchedules.length} lich tap san sang`} variant="outlined" sx={{ color: "#fff7ed", borderColor: "rgba(249,115,22,0.22)" }} />
                <Chip icon={<Groups2 sx={{ color: "#fb923c !important" }} />} label="Cap nhat boi admin" variant="outlined" sx={{ color: "#fff7ed", borderColor: "rgba(249,115,22,0.22)" }} />
                <Chip icon={<FitnessCenter sx={{ color: "#fb923c !important" }} />} label="Su dung du lieu workout that" variant="outlined" sx={{ color: "#fff7ed", borderColor: "rgba(249,115,22,0.22)" }} />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, lg: 5 }}>
              {featuredSchedule && (
                <Paper elevation={0} sx={{ borderRadius: "26px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.03)" }}>
                  <Box component="img" src={featuredSchedule.cover} alt={featuredSchedule.title} sx={{ width: "100%", height: 250, objectFit: "cover" }} />
                  <Box sx={{ p: 2.2 }}>
                    <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="center">
                      <Typography fontSize={22} fontWeight={800} sx={{ color: "white" }}>{featuredSchedule.title}</Typography>
                      <LocalFireDepartment sx={{ color: "#fb923c" }} />
                    </Stack>
                    <Typography sx={{ mt: 1, color: "rgba(255,255,255,0.7)", fontSize: 14.5 }}>{featuredSchedule.summary}</Typography>
                  </Box>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Paper elevation={0} sx={{ mt: 2, borderRadius: "20px", border: "1px solid rgba(248,113,113,0.22)", backgroundColor: "rgba(127,29,29,0.18)", color: "#fecaca", p: 2 }}>
            {error}
          </Paper>
        )}

        <Grid container spacing={2.4} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, lg: 3.2 }}>
            <TrainingFiltersPanel filters={filters} onChange={setFilters} />
          </Grid>
          <Grid size={{ xs: 12, lg: 8.8 }}>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={1.5} sx={{ mb: 2 }}>
              <Box>
                <Typography fontSize={28} fontWeight={800} color="white">Danh sach lich tap</Typography>
                <Typography sx={{ mt: 0.6, color: "rgba(255,255,255,0.62)", fontSize: 14.5 }}>
                  {loading ? "Dang tai du lieu workout..." : `${filteredSchedules.length} lich tap dang duoc hien thi.`}
                </Typography>
              </Box>
            </Stack>

            <Grid container spacing={2.2}>
              {filteredSchedules.map((item) => (
                <Grid key={item.id} size={{ xs: 12, xl: 6 }}>
                  <TrainingCard item={item} />
                </Grid>
              ))}
            </Grid>

            {!loading && filteredSchedules.length === 0 && (
              <Paper elevation={0} sx={{ mt: 1.2, borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.12)", backgroundColor: "rgba(255,255,255,0.03)", color: "white", p: 3, textAlign: "center" }}>
                Chua co workout plan phu hop voi bo loc hien tai.
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Training;
