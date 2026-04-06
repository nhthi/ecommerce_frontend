import React from "react";
import { useNavigate } from "react-router-dom";
import { AccessTime, CalendarMonth, FitnessCenter, PersonOutline, TrendingUp } from "@mui/icons-material";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { TrainingSchedule } from "./trainingData";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const levelTone: Record<TrainingSchedule["level"], { color: string; bg: string }> = {
  Beginner: { color: "#fdba74", bg: "rgba(249,115,22,0.12)" },
  Intermediate: { color: "#fcd34d", bg: "rgba(250,204,21,0.12)" },
  Advanced: { color: "#fca5a5", bg: "rgba(239,68,68,0.12)" },
};

const goalTone: Record<TrainingSchedule["goal"], { color: string; bg: string }> = {
  "Fat Loss": { color: "#fb923c", bg: "rgba(249,115,22,0.12)" },
  "Muscle Gain": { color: "#86efac", bg: "rgba(34,197,94,0.12)" },
  Mobility: { color: "#93c5fd", bg: "rgba(59,130,246,0.12)" },
  Strength: { color: "#f5d0fe", bg: "rgba(168,85,247,0.12)" },
};

const TrainingCard = ({ item }: { item: TrainingSchedule }) => {
  const navigate = useNavigate();
  const { isDark } = useSiteThemeMode();

  return (
    <Paper
      elevation={0}
      sx={{
        overflow: "hidden",
        borderRadius: "28px",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)",
        background: isDark
          ? "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(10,10,10,0.99))"
          : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
        boxShadow: isDark ? "0 24px 60px rgba(0,0,0,0.28)" : "0 24px 60px rgba(15,23,42,0.08)",
        color: isDark ? "white" : "#0f172a",
        transition: "transform 0.22s ease, border-color 0.22s ease",
        "&:hover": { transform: "translateY(-4px)", borderColor: "rgba(249,115,22,0.26)" },
      }}
    >
      <Box sx={{ position: "relative", height: 240, overflow: "hidden" }}>
        <Box component="img" src={item.cover} alt={item.title} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.72))" }} />

        <Stack direction="row" spacing={1} sx={{ position: "absolute", top: 16, left: 16, right: 16, justifyContent: "space-between" }}>
          <Stack direction="row" spacing={1}>
            <Chip size="small" label={item.level} sx={{ color: levelTone[item.level].color, backgroundColor: levelTone[item.level].bg }} />
            <Chip size="small" label={item.goal} sx={{ color: goalTone[item.goal].color, backgroundColor: goalTone[item.goal].bg }} />
          </Stack>

          {item.featured && <Chip size="small" label="Noi bat" sx={{ color: "#050505", backgroundColor: "#fb923c", fontWeight: 700 }} />}
        </Stack>

        <Box sx={{ position: "absolute", left: 18, right: 18, bottom: 18 }}>
          <Typography fontSize={24} fontWeight={800} sx={{ color: "#fff" }}>{item.title}</Typography>
          <Typography sx={{ mt: 0.6, color: "rgba(255,255,255,0.78)", fontSize: 14.5 }}>{item.summary}</Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2.2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} flexWrap="wrap">
          <Chip icon={<CalendarMonth sx={{ color: "#fb923c !important" }} />} label={`${item.durationWeeks} tuan`} variant="outlined" sx={{ color: isDark ? "#fff7ed" : "#0f172a", borderColor: "rgba(249,115,22,0.22)" }} />
          <Chip icon={<AccessTime sx={{ color: "#fb923c !important" }} />} label={`${item.sessionsPerWeek} buoi / tuan`} variant="outlined" sx={{ color: isDark ? "#fff7ed" : "#0f172a", borderColor: "rgba(249,115,22,0.22)" }} />
          <Chip icon={<TrendingUp sx={{ color: "#fb923c !important" }} />} label={item.sessionLength} variant="outlined" sx={{ color: isDark ? "#fff7ed" : "#0f172a", borderColor: "rgba(249,115,22,0.22)" }} />
        </Stack>

        <Stack spacing={1} sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PersonOutline sx={{ fontSize: 18, color: "#fb923c" }} />
            <Typography sx={{ color: isDark ? "rgba(255,255,255,0.76)" : "#475569", fontSize: 14 }}>{item.coach}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="flex-start">
            <FitnessCenter sx={{ fontSize: 18, color: "#fb923c", mt: 0.2 }} />
            <Typography sx={{ color: isDark ? "rgba(255,255,255,0.76)" : "#475569", fontSize: 14 }}>{item.equipment.join(" • ")}</Typography>
          </Stack>
        </Stack>

        <Box sx={{ mt: 2.2, borderRadius: "20px", border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)", backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.78)", p: 1.6 }}>
          <Typography fontWeight={700} sx={{ color: isDark ? "#fff" : "#0f172a", mb: 1.1 }}>Lich tap mau</Typography>
          <Stack spacing={0.8}>
            {item.schedule.map((line) => (
              <Typography key={line} sx={{ color: isDark ? "rgba(255,255,255,0.7)" : "#475569", fontSize: 13.5 }}>{line}</Typography>
            ))}
          </Stack>
        </Box>

        <Button variant="contained" fullWidth onClick={() => navigate(`/training/${item.slug}`)} sx={{ mt: 2.2, borderRadius: 999, textTransform: "none", py: 1.15, fontWeight: 700, background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
          Xem chi tiet lich tap
        </Button>
      </Box>
    </Paper>
  );
};

export default TrainingCard;
