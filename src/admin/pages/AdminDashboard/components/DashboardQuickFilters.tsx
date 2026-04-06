import React from "react";
import { MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { cardSx, sectionTitleSx } from "../dashboardStyles";

interface DashboardQuickFiltersProps {
  overviewFilter: "month" | "year";
  selectedMonth: string;
  selectedYear: string;
  onOverviewFilterChange: (value: "month" | "year") => void;
  onSelectedMonthChange: (value: string) => void;
  onSelectedYearChange: (value: string) => void;
}

const DashboardQuickFilters = ({
  overviewFilter,
  selectedMonth,
  selectedYear,
  onOverviewFilterChange,
  onSelectedMonthChange,
  onSelectedYearChange,
}: DashboardQuickFiltersProps) => {
  return (
    <Paper elevation={0} sx={{ ...cardSx, p: 2.2 }}>
      <Stack direction={{ xs: "column", xl: "row" }} spacing={1.5} justifyContent="space-between">
        <Stack spacing={0.4}>
          <Typography sx={sectionTitleSx}>Bộ lọc chung</Typography>
          <Typography sx={{ color: "#64748b", fontSize: 14.5 }}>
            Áp dụng cùng một kỳ dữ liệu cho các tab Tổng quan, Đơn hàng, Sản phẩm và Nội dung.
          </Typography>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1.2} sx={{ width: { xs: "100%", xl: "auto" }, flexWrap: "wrap" }}>
          <TextField select size="small" value={overviewFilter} onChange={(e) => onOverviewFilterChange(e.target.value as "month" | "year")} sx={{ minWidth: 150 }} InputProps={{ sx: { borderRadius: "14px", backgroundColor: "#f8fafc" } }}>
            <MenuItem value="month">Theo tháng</MenuItem>
            <MenuItem value="year">Theo năm</MenuItem>
          </TextField>

          {overviewFilter === "month" && (
            <TextField select size="small" value={selectedMonth} onChange={(e) => onSelectedMonthChange(e.target.value)} sx={{ minWidth: 140 }} InputProps={{ sx: { borderRadius: "14px", backgroundColor: "#f8fafc" } }}>
              {Array.from({ length: 12 }, (_, i) => {
                const value = String(i + 1).padStart(2, "0");
                return <MenuItem key={value} value={value}>{`Tháng ${i + 1}`}</MenuItem>;
              })}
            </TextField>
          )}

          <TextField select size="small" value={selectedYear} onChange={(e) => onSelectedYearChange(e.target.value)} sx={{ minWidth: 140 }} InputProps={{ sx: { borderRadius: "14px", backgroundColor: "#f8fafc" } }}>
            <MenuItem value="2023">Năm 2023</MenuItem>
            <MenuItem value="2024">Năm 2024</MenuItem>
            <MenuItem value="2025">Năm 2025</MenuItem>
            <MenuItem value="2026">Năm 2026</MenuItem>
          </TextField>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default DashboardQuickFilters;
