import React from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

export type TrainingFilters = {
  level: string;
  goal: string;
};

const levels = [
  { value: "All", label: "Tất cả" },
  { value: "Beginner", label: "Người mới" },
  { value: "Intermediate", label: "Trung cấp" },
  { value: "Advanced", label: "Nâng cao" },
];

const goals = [
  { value: "All", label: "Tất cả" },
  { value: "Fat Loss", label: "Giảm mỡ" },
  { value: "Muscle Gain", label: "Tăng cơ" },
  { value: "Mobility", label: "Linh hoạt" },
  { value: "Strength", label: "Sức mạnh" },
];

type Props = {
  filters: TrainingFilters;
  onChange: (next: TrainingFilters) => void;
};

const TrainingFiltersPanel = ({ filters, onChange }: Props) => {
  const { isDark } = useSiteThemeMode();

  const activeCount =
    (filters.level !== "All" ? 1 : 0) +
    (filters.goal !== "All" ? 1 : 0);

  return (
    <Paper
      elevation={0}
      sx={{
        position: { lg: "sticky" },
        top: { lg: 104 },
        borderRadius: "20px",
        border: isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(15,23,42,0.07)",
        background: isDark ? "#111" : "#fff",
        boxShadow: isDark
          ? "0 10px 30px rgba(0,0,0,0.4)"
          : "0 10px 30px rgba(0,0,0,0.06)",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: 2.2,
          py: 2,
          borderBottom: isDark
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid rgba(15,23,42,0.06)",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                display: "grid",
                placeItems: "center",
                color: "#fff",
                background: "#f97316",
              }}
            >
              <FitnessCenterRoundedIcon sx={{ fontSize: 20 }} />
            </Box>

            <Typography fontWeight={800}>
              Bộ lọc
            </Typography>
          </Stack>

          {activeCount > 0 && (
            <Box
              sx={{
                px: 1,
                height: 28,
                borderRadius: "999px",
                fontSize: 12,
                fontWeight: 800,
                color: "#fff",
                background: "#f97316",
                display: "flex",
                alignItems: "center",
              }}
            >
              {activeCount}
            </Box>
          )}
        </Stack>
      </Box>

      {/* CONTENT */}
      <Box sx={{ p: 2.2 }}>
        <Stack spacing={2}>
          {/* LEVEL */}
          <FormControl fullWidth size="small">
            <Typography sx={{ mb: 0.5, fontSize: 13, fontWeight: 600 }}>
              Cấp độ
            </Typography>
            <Select
              value={filters.level}
              onChange={(e) =>
                onChange({ ...filters, level: e.target.value })
              }
              sx={{
                borderRadius: "12px",
                background: isDark ? "#1a1a1a" : "#f8fafc",
              }}
            >
              {levels.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* GOAL */}
          <FormControl fullWidth size="small">
            <Typography sx={{ mb: 0.5, fontSize: 13, fontWeight: 600 }}>
              Mục tiêu
            </Typography>
            <Select
              value={filters.goal}
              onChange={(e) =>
                onChange({ ...filters, goal: e.target.value })
              }
              sx={{
                borderRadius: "12px",
                background: isDark ? "#1a1a1a" : "#f8fafc",
              }}
            >
              {goals.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* RESET */}
          <Button
            fullWidth
            onClick={() => onChange({ level: "All", goal: "All" })}
            startIcon={<RestartAltRoundedIcon />}
            sx={{
              mt: 1,
              height: 44,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              background: isDark ? "#1a1a1a" : "#f1f5f9",
              color: isDark ? "#fff" : "#0f172a",
              "&:hover": {
                background: isDark ? "#222" : "#e2e8f0",
              },
            }}
          >
            Đặt lại
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default TrainingFiltersPanel;