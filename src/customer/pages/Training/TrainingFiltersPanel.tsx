import React from "react";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";

export type TrainingFilters = {
  level: string;
  goal: string;
};

const levelLabels: Record<string, string> = {
  All: "Tat ca",
  Beginner: "Nguoi moi",
  Intermediate: "Trung cap",
  Advanced: "Nang cao",
};

const goalLabels: Record<string, string> = {
  All: "Tat ca",
  "Fat Loss": "Giam mo",
  "Muscle Gain": "Tang co",
  Mobility: "Linh hoat",
  Strength: "Suc manh",
};

const levels = ["All", "Beginner", "Intermediate", "Advanced"];
const goals = ["All", "Fat Loss", "Muscle Gain", "Mobility", "Strength"];

const TrainingFiltersPanel = ({
  filters,
  onChange,
}: {
  filters: TrainingFilters;
  onChange: (next: TrainingFilters) => void;
}) => {
  return (
    <Paper elevation={0} sx={{ position: { lg: "sticky" }, top: { lg: 108 }, borderRadius: "28px", border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(10,10,10,0.99))", boxShadow: "0 24px 60px rgba(0,0,0,0.28)", color: "white", p: 2.2 }}>
      <Typography fontSize={22} fontWeight={800}>Bo loc lich tap</Typography>
      <Typography sx={{ mt: 0.8, color: "rgba(255,255,255,0.62)", fontSize: 14 }}>
        Loc theo cap do va muc tieu de tim workout plan phu hop.
      </Typography>

      <Box sx={{ mt: 2.2 }}>
        <Typography fontWeight={700} sx={{ mb: 1.1 }}>Cap do</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {levels.map((level) => (
            <Chip key={level} label={levelLabels[level]} onClick={() => onChange({ ...filters, level })} sx={{ color: filters.level === level ? "#050505" : "#fff7ed", backgroundColor: filters.level === level ? "#fb923c" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontWeight: 700 }} />
          ))}
        </Stack>
      </Box>

      <Box sx={{ mt: 2.2 }}>
        <Typography fontWeight={700} sx={{ mb: 1.1 }}>Muc tieu</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {goals.map((goal) => (
            <Chip key={goal} label={goalLabels[goal]} onClick={() => onChange({ ...filters, goal })} sx={{ color: filters.goal === goal ? "#050505" : "#fff7ed", backgroundColor: filters.goal === goal ? "#fb923c" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontWeight: 700 }} />
          ))}
        </Stack>
      </Box>

      <Button variant="outlined" fullWidth onClick={() => onChange({ level: "All", goal: "All" })} sx={{ mt: 2.4, borderRadius: 999, textTransform: "none", color: "#fff7ed", borderColor: "rgba(249,115,22,0.26)" }}>
        Dat lai bo loc
      </Button>
    </Paper>
  );
};

export default TrainingFiltersPanel;
