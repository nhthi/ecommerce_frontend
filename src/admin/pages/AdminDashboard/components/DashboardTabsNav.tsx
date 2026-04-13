import React from "react";
import {
  Download,
  MenuBook,
  ShoppingBag,
  Storefront,
  Timeline,
} from "@mui/icons-material";
import { Paper, Tab, Tabs } from "@mui/material";
import { primary, primarySoft } from "../dashboardData";
import { cardSx } from "../dashboardStyles";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

interface DashboardTabsNavProps {
  tab: number;
  onChange: (value: number) => void;
}

const DashboardTabsNav = ({ tab, onChange }: DashboardTabsNavProps) => {
  const { isDark } = useSiteThemeMode();

  return (
    <Paper
      elevation={0}
      sx={{
        ...cardSx,
        p: 1.2,
        backgroundColor: isDark ? "#111111" : "#ffffff",
        border: isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(15,23,42,0.08)",
      }}
    >
      <Tabs
        value={tab}
        onChange={(_, value) => onChange(value)}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{
          "& .MuiTab-root": {
            textTransform: "none",
            minHeight: 48,
            fontWeight: 700,
            color: isDark ? "rgba(255,255,255,0.64)" : "#64748b",
            borderRadius: "14px",
            mr: 1,
            backgroundColor: "transparent",
          },
          "& .MuiTab-root:hover": {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.04)"
              : "rgba(15,23,42,0.04)",
          },
          "& .Mui-selected": {
            color: primary,
            backgroundColor: isDark ? "rgba(249,115,22,0.14)" : primarySoft,
          },
          "& .MuiTabs-indicator": {
            display: "none",
          },
        }}
      >
        <Tab icon={<Timeline />} iconPosition="start" label="Tổng quan" />
        <Tab icon={<ShoppingBag />} iconPosition="start" label="Đơn hàng" />
        <Tab icon={<Storefront />} iconPosition="start" label="Sản phẩm" />
        <Tab icon={<MenuBook />} iconPosition="start" label="Nội dung" />
        <Tab icon={<Download />} iconPosition="start" label="Báo cáo" />
      </Tabs>
    </Paper>
  );
};

export default DashboardTabsNav;