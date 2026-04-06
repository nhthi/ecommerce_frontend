import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowBack,
  CalendarMonth,
  Close,
  FitnessCenter,
  PersonOutline,
  PlayCircleOutline,
  TimerOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import NotFound from "../NotFound/NotFound";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchAllWorkoutPlans } from "../../../state/admin/adminWorkoutPlanSlice";
import { fetchAllWorkoutPlanDays } from "../../../state/admin/adminWorkoutPlanDaySlice";
import { getTrainingBySlug, mapWorkoutPlansToTrainingSchedules } from "./trainingData";

const getEmbedUrl = (videoUrl?: string) => {
  if (!videoUrl) return "";

  try {
    const url = new URL(videoUrl);
    const host = url.hostname.replace("www.", "");

    if (host === "youtu.be") {
      const id = url.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (host.includes("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) {
        return videoUrl;
      }

      const id = url.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (host.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : "";
    }

    if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) {
      return videoUrl;
    }
  } catch (_error) {
    return "";
  }

  return "";
};

const TrainingDetail = () => {
  const { slug } = useParams();
  const dispatch = useAppDispatch();
  const [activeVideo, setActiveVideo] = useState<{ title: string; url: string } | null>(null);
  const { workoutPlans, loading: plansLoading } = useAppSelector((store) => store.adminWorkoutPlan);
  const { workoutPlanDays, loading: daysLoading } = useAppSelector((store) => store.adminWorkoutPlanDay);

  useEffect(() => {
    dispatch(fetchAllWorkoutPlans());
    dispatch(fetchAllWorkoutPlanDays());
  }, [dispatch]);

  const trainingSchedules = useMemo(
    () => mapWorkoutPlansToTrainingSchedules(workoutPlans, workoutPlanDays),
    [workoutPlans, workoutPlanDays],
  );

  const training = useMemo(
    () => (slug ? getTrainingBySlug(slug, workoutPlans, workoutPlanDays) : undefined),
    [slug, workoutPlans, workoutPlanDays],
  );

  const relatedSchedules = useMemo(() => {
    if (!training) return [];
    return trainingSchedules.filter((item) => item.slug !== training.slug && item.goal === training.goal).slice(0, 3);
  }, [training, trainingSchedules]);

  const activeVideoEmbedUrl = useMemo(() => getEmbedUrl(activeVideo?.url), [activeVideo]);

  if (!plansLoading && !daysLoading && !training) {
    return <NotFound />;
  }

  if (!training) {
    return (
      <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg, #070707 0%, #111111 30%, #090909 100%)", px: { xs: 2, md: 3 }, py: { xs: 3, lg: 4 } }}>
        <Paper elevation={0} sx={{ mx: "auto", maxWidth: "920px", borderRadius: "28px", border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(8,8,8,0.98))", color: "white", p: 4, textAlign: "center" }}>
          Dang tai lich tap...
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg, #070707 0%, #111111 30%, #090909 100%)", px: { xs: 2, md: 3 }, py: { xs: 3, lg: 4 } }}>
      <Box sx={{ mx: "auto", maxWidth: "1460px" }}>
        <Button component={Link} to="/training" startIcon={<ArrowBack />} sx={{ mb: 2.4, textTransform: "none", color: "#fff7ed", borderRadius: 999, border: "1px solid rgba(249,115,22,0.22)", px: 2.2 }}>
          Quay lai lich tap
        </Button>

        <Paper elevation={0} sx={{ overflow: "hidden", borderRadius: "34px", border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(8,8,8,0.98))", boxShadow: "0 28px 80px rgba(0,0,0,0.34)", color: "white" }}>
          <Grid container>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box component="img" src={training.cover} alt={training.title} sx={{ width: "100%", height: "100%", minHeight: 360, objectFit: "cover" }} />
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ p: { xs: 2.5, md: 4 } }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={training.level} sx={{ color: "#fdba74", backgroundColor: "rgba(249,115,22,0.12)" }} />
                  <Chip label={training.goal} sx={{ color: "#fff7ed", backgroundColor: "rgba(255,255,255,0.08)" }} />
                  <Chip label={`Huong dan boi ${training.coach}`} sx={{ color: "#fff7ed", backgroundColor: "rgba(255,255,255,0.08)" }} />
                </Stack>

                <Typography fontSize={{ xs: 32, md: 44 }} fontWeight={900} lineHeight={1.04} sx={{ mt: 1.8 }}>
                  {training.title}
                </Typography>

                <Typography sx={{ mt: 1.4, color: "rgba(255,255,255,0.74)", fontSize: 16, maxWidth: 620 }}>
                  {training.overview}
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} flexWrap="wrap" useFlexGap sx={{ mt: 2.5 }}>
                  <Chip icon={<CalendarMonth sx={{ color: "#fb923c !important" }} />} label={`${training.durationWeeks} tuan`} variant="outlined" sx={{ color: "#fff7ed", borderColor: "rgba(249,115,22,0.22)" }} />
                  <Chip icon={<TimerOutlined sx={{ color: "#fb923c !important" }} />} label={`${training.sessionsPerWeek} buoi / tuan`} variant="outlined" sx={{ color: "#fff7ed", borderColor: "rgba(249,115,22,0.22)" }} />
                  <Chip icon={<PersonOutline sx={{ color: "#fb923c !important" }} />} label={training.sessionLength} variant="outlined" sx={{ color: "#fff7ed", borderColor: "rgba(249,115,22,0.22)" }} />
                </Stack>

                <Box sx={{ mt: 2.5, borderRadius: "22px", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.03)", p: 1.8 }}>
                  <Typography fontWeight={800} sx={{ mb: 1.2 }}>
                    Ket qua huong den
                  </Typography>

                  <Stack spacing={0.9}>
                    {training.results.map((item) => (
                      <Typography key={item} sx={{ color: "rgba(255,255,255,0.72)", fontSize: 14.5 }}>
                        {item}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={2.4} sx={{ mt: 0.6 }}>
          <Grid size={{ xs: 12, lg: 8.5 }}>
            <Stack spacing={2.2}>
              {training.trainingDays.map((day) => (
                <Paper key={day.id} elevation={0} sx={{ borderRadius: "28px", border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(10,10,10,0.99))", boxShadow: "0 24px 60px rgba(0,0,0,0.28)", color: "white", p: { xs: 2, md: 2.4 } }}>
                  <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1.2}>
                    <Box>
                      <Typography sx={{ color: "#fdba74", fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                        {day.dayLabel}
                      </Typography>
                      <Typography fontSize={26} fontWeight={800} sx={{ mt: 0.4 }}>
                        {day.title}
                      </Typography>
                      <Typography sx={{ mt: 0.6, color: "rgba(255,255,255,0.68)", fontSize: 14.5 }}>
                        {day.duration} • Cuong do {day.intensity}
                      </Typography>
                    </Box>

                    <Chip icon={<FitnessCenter sx={{ color: "#fb923c !important" }} />} label={`${day.exercises.length} bai tap`} variant="outlined" sx={{ color: "#fff7ed", borderColor: "rgba(249,115,22,0.22)", alignSelf: "flex-start" }} />
                  </Stack>

                  <Stack spacing={1.4} sx={{ mt: 2 }}>
                    {day.exercises.map((exercise, index) => (
                      <Paper key={exercise.id} elevation={0} sx={{ borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.03)", p: 1.6 }}>
                        <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" spacing={1.4}>
                          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
                            <Box
                              sx={{
                                position: "relative",
                                width: { xs: "100%", md: 220 },
                                minWidth: { md: 220 },
                                height: { xs: 180, md: 150 },
                                overflow: "hidden",
                                borderRadius: "18px",
                                border: "1px solid rgba(255,255,255,0.08)",
                                background: exercise.imageUrl
                                  ? "rgba(255,255,255,0.04)"
                                  : "linear-gradient(135deg, rgba(249,115,22,0.24), rgba(17,17,17,0.86))",
                              }}
                            >
                              {exercise.imageUrl ? (
                                <Box component="img" src={exercise.imageUrl} alt={exercise.name} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ width: "100%", height: "100%", color: "#fed7aa" }}>
                                  <FitnessCenter sx={{ fontSize: 34 }} />
                                  <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                                    Dang cap nhat hinh bai tap
                                  </Typography>
                                </Stack>
                              )}

                              <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.66) 100%)" }} />

                              <Chip
                                label={`Bai ${index + 1}`}
                                sx={{
                                  position: "absolute",
                                  top: 12,
                                  left: 12,
                                  color: "#fff7ed",
                                  fontWeight: 800,
                                  backgroundColor: "rgba(15,15,15,0.72)",
                                  border: "1px solid rgba(255,255,255,0.12)",
                                }}
                              />
                            </Box>

                            <Stack justifyContent="space-between" spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
                              <Box>
                                <Typography fontSize={20} fontWeight={800} sx={{ color: "white" }}>
                                  {exercise.name}
                                </Typography>
                                <Typography sx={{ mt: 0.65, color: "rgba(255,255,255,0.72)", fontSize: 14 }}>
                                  {exercise.focus}
                                </Typography>
                                <Typography sx={{ mt: 0.8, color: "rgba(255,255,255,0.72)", fontSize: 14.5 }}>
                                  Do kho {exercise.difficulty}
                                </Typography>
                                <Typography sx={{ mt: 0.8, color: "#fed7aa", fontSize: 13.5 }}>
                                  {exercise.note}
                                </Typography>
                              </Box>

                              <Button
                                onClick={() => setActiveVideo({ title: exercise.name, url: exercise.videoUrl })}
                                variant="contained"
                                startIcon={<PlayCircleOutline />}
                                sx={{ alignSelf: "flex-start", borderRadius: 999, textTransform: "none", background: "linear-gradient(135deg, #f97316, #ea580c)" }}
                              >
                                Xem video
                              </Button>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 3.5 }}>
            <Stack spacing={2.2}>
              <Paper elevation={0} sx={{ borderRadius: "28px", border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(10,10,10,0.99))", boxShadow: "0 24px 60px rgba(0,0,0,0.28)", color: "white", p: 2.2 }}>
                <Typography fontSize={22} fontWeight={800}>Thong tin nhanh</Typography>

                <Stack spacing={1} sx={{ mt: 1.6 }}>
                  {training.equipment.map((item) => (
                    <Typography key={item} sx={{ color: "rgba(255,255,255,0.72)", fontSize: 14.5 }}>
                      {item}
                    </Typography>
                  ))}
                </Stack>

                <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.08)" }} />

                <Typography fontWeight={800}>Lich trong tuan</Typography>

                <Stack spacing={1} sx={{ mt: 1.4 }}>
                  {training.schedule.map((item) => (
                    <Typography key={item} sx={{ color: "rgba(255,255,255,0.72)", fontSize: 14.5 }}>
                      {item}
                    </Typography>
                  ))}
                </Stack>
              </Paper>

              {relatedSchedules.length > 0 && (
                <Paper elevation={0} sx={{ borderRadius: "28px", border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(10,10,10,0.99))", boxShadow: "0 24px 60px rgba(0,0,0,0.28)", color: "white", p: 2.2 }}>
                  <Typography fontSize={22} fontWeight={800}>Lich cung muc tieu</Typography>

                  <Stack spacing={1.4} sx={{ mt: 1.6 }}>
                    {relatedSchedules.map((item) => (
                      <Paper key={item.id} elevation={0} sx={{ borderRadius: "18px", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.03)", p: 1.4 }}>
                        <Typography sx={{ color: "white" }} fontWeight={700}>{item.title}</Typography>
                        <Typography sx={{ mt: 0.5, color: "rgba(255,255,255,0.66)", fontSize: 13.5 }}>{item.summary}</Typography>
                        <Button component={Link} to={`/training/${item.slug}`} sx={{ mt: 1, px: 0, textTransform: "none", color: "#fb923c" }}>
                          Xem lich nay
                        </Button>
                      </Paper>
                    ))}
                  </Stack>
                </Paper>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            overflow: "hidden",
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "linear-gradient(180deg, rgba(18,18,18,0.98), rgba(8,8,8,0.99))",
            color: "white",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2.2, py: 1.6, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <Box>
              <Typography fontSize={13} fontWeight={800} sx={{ color: "#fb923c", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Huong dan dong tac
              </Typography>
              <Typography fontSize={22} fontWeight={800} sx={{ mt: 0.4 }}>
                {activeVideo?.title}
              </Typography>
            </Box>
            <IconButton onClick={() => setActiveVideo(null)} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Stack>

          {activeVideo && activeVideoEmbedUrl ? (
            /\.(mp4|webm|ogg)$/i.test(activeVideoEmbedUrl) ? (
              <Box sx={{ backgroundColor: "black" }}>
                <Box component="video" controls autoPlay src={activeVideoEmbedUrl} sx={{ display: "block", width: "100%", aspectRatio: "16 / 9" }} />
              </Box>
            ) : (
              <Box sx={{ backgroundColor: "black" }}>
                <Box
                  component="iframe"
                  src={activeVideoEmbedUrl}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sx={{ display: "block", width: "100%", aspectRatio: "16 / 9", border: 0 }}
                />
              </Box>
            )
          ) : (
            <Stack spacing={1.4} sx={{ p: 2.2 }}>
              <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 14.5 }}>
                Link hien tai chua ho tro nhung truc tiep. Ban co the doi sang link YouTube, Vimeo hoac file video de hien modal xem ngay trong trang.
              </Typography>
              {activeVideo?.url && (
                <Button
                  component="a"
                  href={activeVideo.url}
                  target="_blank"
                  rel="noreferrer"
                  variant="contained"
                  sx={{ alignSelf: "flex-start", borderRadius: 999, textTransform: "none", background: "linear-gradient(135deg, #f97316, #ea580c)" }}
                >
                  Mo video goc
                </Button>
              )}
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TrainingDetail;
