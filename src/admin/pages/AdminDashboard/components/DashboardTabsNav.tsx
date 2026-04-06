import React from "react";
import { Download, MenuBook, ShoppingBag, Storefront, Timeline } from "@mui/icons-material";
import { Paper, Tab, Tabs } from "@mui/material";
import { primary, primarySoft } from "../dashboardData";
import { cardSx } from "../dashboardStyles";

interface DashboardTabsNavProps {
  tab: number;
  onChange: (value: number) => void;
}

const DashboardTabsNav = ({ tab, onChange }: DashboardTabsNavProps) => {
  return (
    <Paper elevation={0} sx={{ ...cardSx, p: 1.2 }}>
      <Tabs
        value={tab}
        onChange={(_, value) => onChange(value)}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{
          "& .MuiTab-root": { textTransform: "none", minHeight: 48, fontWeight: 700, color: "#64748b", borderRadius: "14px", mr: 1 },
          "& .Mui-selected": { color: primary, backgroundColor: primarySoft },
          "& .MuiTabs-indicator": { display: "none" },
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
