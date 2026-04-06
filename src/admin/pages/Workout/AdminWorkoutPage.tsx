import * as React from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import CalendarViewWeekOutlinedIcon from "@mui/icons-material/CalendarViewWeekOutlined";
import SportsGymnasticsOutlinedIcon from "@mui/icons-material/SportsGymnasticsOutlined";
import WorkoutPlanTable from "./WorkoutPlanTable";
import WorkoutPlanDayTable from "./WorkoutPlanDayTable";
import ExerciseTable from "./ExerciseTable";

const pageWrapSx = {
  minHeight: "100%",
  background:
    "radial-gradient(circle at top, rgba(249,115,22,0.08), transparent 30%), #0a0a0a",
  p: { xs: 2, md: 3 },
};

const heroCardSx = {
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
  px: { xs: 2.2, md: 3 },
  py: { xs: 2.2, md: 3 },
  mb: 3,
};

export default function AdminWorkoutPage() {
  const [tab, setTab] = React.useState(0);

  return (
    <Box sx={pageWrapSx}>
      <Box sx={heroCardSx}>
        <Typography fontSize={{ xs: 26, md: 34 }} fontWeight={900} color="white">
          Quản lý Workout & Bài tập
        </Typography>

        <Typography
          sx={{
            mt: 1,
            color: "rgba(255,255,255,0.64)",
            fontSize: 14.5,
            maxWidth: 860,
          }}
        >
          Quản lý kế hoạch tập luyện, từng ngày tập và thư viện bài tập trong một khu vực, đồng bộ với giao diện quản trị hiện tại.
        </Typography>

        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          sx={{
            mt: 2.5,
            "& .MuiTabs-indicator": {
              backgroundColor: "#f97316",
              height: 3,
              borderRadius: 999,
            },
            "& .MuiTab-root": {
              color: "rgba(255,255,255,0.64)",
              textTransform: "none",
              fontWeight: 700,
              minHeight: 44,
            },
            "& .Mui-selected": {
              color: "#fdba74 !important",
            },
          }}
        >
          <Tab
            icon={<FitnessCenterOutlinedIcon />}
            iconPosition="start"
            label="Kế hoạch tập"
          />

          <Tab
            icon={<CalendarViewWeekOutlinedIcon />}
            iconPosition="start"
            label="Ngày tập"
          />

          <Tab
            icon={<SportsGymnasticsOutlinedIcon />}
            iconPosition="start"
            label="Bài tập"
          />
        </Tabs>
      </Box>

      {tab === 0 && <WorkoutPlanTable />}
      {tab === 1 && <WorkoutPlanDayTable />}
      {tab === 2 && <ExerciseTable />}
    </Box>
  );
}