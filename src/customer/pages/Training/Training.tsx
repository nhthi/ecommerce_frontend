import React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
} from "@mui/material";
import {
  CalendarMonth,
  FitnessCenter,
  Groups2,
  LocalFireDepartment,
  PlayArrow,
  Search,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import TrainingCard from "./TrainingCard";
import TrainingFiltersPanel, { TrainingFilters } from "./TrainingFiltersPanel";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchAllWorkoutPlans } from "../../../state/admin/adminWorkoutPlanSlice";
import { fetchAllWorkoutPlanDays } from "../../../state/admin/adminWorkoutPlanDaySlice";
import { mapWorkoutPlansToTrainingSchedules } from "./trainingData";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const getEmbedUrl = (url?: string) => {
  if (!url) return null;

  try {
    const directYoutube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/i);
    if (directYoutube?.[1]) {
      return `https://www.youtube.com/embed/${directYoutube[1]}?autoplay=1&mute=1&controls=1&loop=1&playlist=${directYoutube[1]}&modestbranding=1&rel=0`;
    }

    const embedYoutube = url.match(/youtube\.com\/embed\/([^&?/]+)/i);
    if (embedYoutube?.[1]) {
      return `https://www.youtube.com/embed/${embedYoutube[1]}?autoplay=1&mute=1&controls=1&loop=1&playlist=${embedYoutube[1]}&modestbranding=1&rel=0`;
    }

    return null;
  } catch {
    return null;
  }
};

const normalizeText = (value?: string) =>
  (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const Training = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isDark } = useSiteThemeMode();

  const [filters, setFilters] = useState<TrainingFilters>({
    level: "All",
    goal: "All",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  const {
    workoutPlans,
    loading: plansLoading,
    error: plansError,
  } = useAppSelector((store) => store.adminWorkoutPlan);

  const {
    workoutPlanDays,
    loading: daysLoading,
    error: daysError,
  } = useAppSelector((store) => store.adminWorkoutPlanDay);

  useEffect(() => {
    dispatch(fetchAllWorkoutPlans());
    dispatch(fetchAllWorkoutPlanDays());
  }, [dispatch]);

  const trainingSchedules = useMemo(
    () => mapWorkoutPlansToTrainingSchedules(workoutPlans, workoutPlanDays),
    [workoutPlans, workoutPlanDays],
  );

  const filteredSchedules = useMemo(() => {
    const keyword = normalizeText(searchTerm);

    return trainingSchedules.filter((item) => {
      const matchLevel = filters.level === "All" || item.level === filters.level;
      const matchGoal = filters.goal === "All" || item.goal === filters.goal;

      const searchableContent = normalizeText(
        [
          item.title,
          item.summary,
          item.goal,
          item.level,
          item.durationWeeks,
          item.featured,
          ...(item.schedule || []),
          ...(item.trainingDays || []).flatMap((day) => [
            day.dayLabel,
            ...(day.exercises || []).map((exercise) => exercise.name),
          ]),
        ]
          .filter(Boolean)
          .join(" "),
      );

      const matchSearch = !keyword || searchableContent.includes(keyword);

      return matchLevel && matchGoal && matchSearch;
    });
  }, [filters, searchTerm, trainingSchedules]);

  useEffect(() => {
    setPage(1);
  }, [filters, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredSchedules.length / ITEMS_PER_PAGE));

  const paginatedSchedules = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredSchedules.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSchedules, page]);

  const featuredSchedule =
    filteredSchedules.find((item) => item.featured) || filteredSchedules[0];

  const randomPreview = useMemo(() => {
    if (trainingSchedules.length === 0) return null;

    const randomSchedule =
      trainingSchedules[Math.floor(Math.random() * trainingSchedules.length)];
    const allExercises = randomSchedule.trainingDays.flatMap(
      (day) => day.exercises || [],
    );
    const previewExercise =
      allExercises.find((exercise) => exercise.videoUrl) || allExercises[0];

    if (!previewExercise) return null;

    return {
      schedule: randomSchedule,
      exercise: previewExercise,
      embedUrl: getEmbedUrl(previewExercise.videoUrl),
    };
  }, [trainingSchedules]);

  const loading = plansLoading || daysLoading;
  const error = plansError || daysError;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        
        px: { xs: 2, md: 3 },
        py: { xs: 3, lg: 4 },
      }}
    >
      <Box sx={{ mx: "auto", maxWidth: "1460px" }}>
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            borderRadius: "34px",
            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(15,23,42,0.08)",
            
            boxShadow: isDark
              ? "0 28px 80px rgba(0,0,0,0.34)"
              : "0 28px 80px rgba(15,23,42,0.08)",
            color: isDark ? "white" : "#0f172a",
            p: { xs: 2.5, md: 4 },
          }}
        >
          <Grid container spacing={3} alignItems="stretch">
            <Grid size={{ xs: 12, xl: 7.2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Chip
                  label="Workout preview"
                  variant="outlined"
                  sx={{
                    alignSelf: "flex-start",
                    color: isDark ? "#fed7aa" : "#c2410c",
                    borderColor: "rgba(249,115,22,0.3)",
                    backgroundColor: "rgba(249,115,22,0.1)",
                  }}
                />

                <Typography
                  fontSize={{ xs: 34, md: 52 }}
                  fontWeight={900}
                  lineHeight={1.02}
                  sx={{ mt: 1.8 }}
                >
                  Tìm lịch tập phù hợp với bạn
                </Typography>

                <Typography
                  sx={{
                    mt: 1.5,
                    maxWidth: 760,
                    color: isDark ? "rgba(255,255,255,0.72)" : "#475569",
                    fontSize: { xs: 15, md: 17 },
                  }}
                >
                  Xem nhanh bài tập và chọn kế hoạch luyện tập phù hợp với mục tiêu của bạn.
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.2}
                  sx={{ mt: 2.4 }}
                  useFlexGap
                  flexWrap="wrap"
                >
                  <Chip
                    icon={<CalendarMonth sx={{ color: "#fb923c !important" }} />}
                    label={`${trainingSchedules.length} lịch tập`}
                    variant="outlined"
                    sx={{
                      color: isDark ? "#fff7ed" : "#0f172a",
                      borderColor: "rgba(249,115,22,0.22)",
                    }}
                  />
                  <Chip
                    icon={<Groups2 sx={{ color: "#fb923c !important" }} />}
                    label="Cập nhật liên tục"
                    variant="outlined"
                    sx={{
                      color: isDark ? "#fff7ed" : "#0f172a",
                      borderColor: "rgba(249,115,22,0.22)",
                    }}
                  />
                  <Chip
                    icon={<FitnessCenter sx={{ color: "#fb923c !important" }} />}
                    label="Bài tập thực tế"
                    variant="outlined"
                    sx={{
                      color: isDark ? "#fff7ed" : "#0f172a",
                      borderColor: "rgba(249,115,22,0.22)",
                    }}
                  />
                </Stack>

                {featuredSchedule && (
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 2.6,
                      p: 2.2,
                      borderRadius: "26px",
                      border: isDark
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "1px solid rgba(15,23,42,0.08)",
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(255,255,255,0.82)",
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={2}
                      alignItems={{ xs: "flex-start", md: "center" }}
                      justifyContent="space-between"
                    >
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocalFireDepartment sx={{ color: "#fb923c" }} />
                          <Typography
                            fontSize={13}
                            fontWeight={800}
                            letterSpacing={1.2}
                            textTransform="uppercase"
                            color="#fb923c"
                          >
                            Nổi bật
                          </Typography>
                        </Stack>

                        <Typography
                          fontSize={{ xs: 24, md: 28 }}
                          fontWeight={900}
                          sx={{ mt: 1, color: isDark ? "white" : "#0f172a" }}
                        >
                          {featuredSchedule.title}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 1,
                            color: isDark ? "rgba(255,255,255,0.72)" : "#475569",
                            maxWidth: 620,
                          }}
                        >
                          {featuredSchedule.summary}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        startIcon={<PlayArrow />}
                        onClick={() => navigate(`/training/${featuredSchedule.slug}`)}
                        sx={{
                          borderRadius: "999px",
                          px: 3,
                          py: 1.1,
                          textTransform: "none",
                          fontWeight: 800,
                          background:
                            "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                          color: "#fff",
                          boxShadow: "0 18px 40px rgba(249,115,22,0.18)",
                        }}
                      >
                        Xem ngay
                      </Button>
                    </Stack>
                  </Paper>
                )}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, xl: 4.8 }}>
              {randomPreview ? (
                <Paper
                  elevation={0}
                  sx={{
                    overflow: "hidden",
                    borderRadius: "30px",
                    height: "100%",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(15,23,42,0.08)",
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(255,255,255,0.82)",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      aspectRatio: "16 / 10",
                      overflow: "hidden",
                      backgroundColor: "#000",
                    }}
                  >
                    {randomPreview.embedUrl ? (
                      <iframe
                        src={randomPreview.embedUrl}
                        title={randomPreview.exercise.name}
                        style={{ width: "100%", height: "100%", border: 0 }}
                        allow="autoplay; encrypted-media; picture-in-picture"
                      />
                    ) : (
                      <Box
                        component="img"
                        src={
                          randomPreview.exercise.imageUrl ||
                          randomPreview.schedule.cover
                        }
                        alt={randomPreview.exercise.name}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.78))",
                      }}
                    />

                    <Box sx={{ position: "absolute", left: 18, top: 18 }}>
                      <Chip
                        label="Video tập nhanh"
                        sx={{
                          backgroundColor: "#f97316",
                          color: "#fff",
                          fontWeight: 800,
                        }}
                      />
                    </Box>

                    <Box sx={{ position: "absolute", insetX: 0, bottom: 0, p: 2.4 }}>
                      <p className="text-slate-100 uppercase font-extrabold text-2xl">
                        {randomPreview.schedule.goal} / {randomPreview.schedule.level}
                      </p>
                      <p className="text-2xl text-slate-100 mt-1 font-bold">
                        {randomPreview.exercise.name}
                      </p>
                      <p className="mt-1 text-slate-100">
                        Thuộc lịch tập {randomPreview.schedule.title}
                      </p>
                    </Box>
                  </Box>

                  <Box sx={{ p: 2.3 }}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.4}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      justifyContent="space-between"
                    >
                      <Box>
                        <Typography
                          fontSize={21}
                          fontWeight={900}
                          color={isDark ? "white" : "#0f172a"}
                        >
                          Xem nhanh một bài tập trước khi bắt đầu
                        </Typography>
                        
                      </Box>
                      <Button
                        variant="outlined"
                        startIcon={<PlayArrow />}
                        onClick={() =>
                          navigate(`/training/${randomPreview.schedule.slug}`)
                        }
                        sx={{
                          borderRadius: "999px",
                          textTransform: "none",
                          fontWeight: 700,
                          borderColor: "#f97316",
                          color: isDark ? "#fb923c" : "#ea580c",
                        }}
                      >
                        Mở lịch tập
                      </Button>
                    </Stack>
                  </Box>
                </Paper>
              ) : null}
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Paper
            elevation={0}
            sx={{
              mt: 2,
              borderRadius: "20px",
              border: "1px solid rgba(248,113,113,0.22)",
              backgroundColor: "rgba(127,29,29,0.18)",
              color: "#fecaca",
              p: 2,
            }}
          >
            {error}
          </Paper>
        )}

        <Grid container spacing={2.4} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, lg: 3.2 }}>
            <TrainingFiltersPanel filters={filters} onChange={setFilters} />
          </Grid>

          <Grid size={{ xs: 12, lg: 8.8 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", md: "center" }}
              spacing={1.5}
              sx={{ mb: 2 }}
            >
              <Box>
                <Typography
                  fontSize={28}
                  fontWeight={800}
                  color={isDark ? "white" : "#0f172a"}
                >
                  Danh sách lịch tập
                </Typography>
                <Typography
                  sx={{
                    mt: 0.6,
                    color: isDark ? "rgba(255,255,255,0.62)" : "#475569",
                    fontSize: 14.5,
                  }}
                >
                  {loading
                    ? "Đang tải dữ liệu..."
                    : `${filteredSchedules.length} lịch tập đang được hiển thị.`}
                </Typography>
              </Box>

              <TextField
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên lịch tập, mục tiêu, cấp độ..."
                size="small"
                sx={{
                  minWidth: { xs: "100%", md: 360 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "999px",
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(255,255,255,0.82)",
                    color: isDark ? "#fff" : "#0f172a",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: isDark
                      ? "rgba(255,255,255,0.10)"
                      : "rgba(15,23,42,0.10)",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: isDark ? "rgba(255,255,255,0.5)" : "#64748b",
                    opacity: 1,
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: isDark ? "rgba(255,255,255,0.55)" : "#64748b" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>

            <Grid container spacing={2.2}>
              {paginatedSchedules.map((item) => (
                <Grid key={item.id} size={{ xs: 12, xl: 6 }}>
                  <TrainingCard item={item} />
                </Grid>
              ))}
            </Grid>

            {!loading && filteredSchedules.length > 0 && totalPages > 1 && (
              <Stack alignItems="center" sx={{ mt: 3 }}>
                <Pagination
                  page={page}
                  count={totalPages}
                  onChange={(_, value) => setPage(value)}
                  shape="rounded"
                  color="standard"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: isDark ? "#fff" : "#0f172a",
                      borderColor: isDark
                        ? "rgba(255,255,255,0.10)"
                        : "rgba(15,23,42,0.10)",
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(255,255,255,0.82)",
                    },
                    "& .Mui-selected": {
                      backgroundColor: isDark ? "#ffffff" : "#111111",
                      color: isDark ? "#111111" : "#ffffff",
                    },
                  }}
                />
              </Stack>
            )}

            {!loading && filteredSchedules.length === 0 && (
              <Paper
                elevation={0}
                sx={{
                  mt: 1.2,
                  borderRadius: "24px",
                  border: isDark
                    ? "1px dashed rgba(255,255,255,0.12)"
                    : "1px dashed rgba(15,23,42,0.14)",
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(255,255,255,0.72)",
                  color: isDark ? "white" : "#0f172a",
                  p: 3,
                  textAlign: "center",
                }}
              >
                Chưa có lịch tập phù hơp.
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Training;