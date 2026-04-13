import * as React from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import BlogPostTable from "./BlogPostTable";
import BlogCategoryTable from "./BlogCategoryTable";
import BlogTagTable from "./BlogTagTable";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

export default function AdminBlogPage() {
  const [tab, setTab] = React.useState(0);
  const { isDark } = useSiteThemeMode();

  const pageWrapSx = {
    minHeight: "100%",
    background: isDark
      ? "radial-gradient(circle at top, rgba(249,115,22,0.08), transparent 30%), #0a0a0a"
      : "radial-gradient(circle at top, rgba(249,115,22,0.10), transparent 32%), #fffaf5",
    p: { xs: 2, md: 3 },
  };

  const heroCardSx = {
    borderRadius: "30px",
    border: isDark
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid rgba(15,23,42,0.08)",
    background: isDark
      ? "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))"
      : "linear-gradient(180deg, #ffffff, #fff7ed)",
    boxShadow: isDark
      ? "0 24px 60px rgba(0,0,0,0.28)"
      : "0 18px 45px rgba(15,23,42,0.08)",
    px: { xs: 2.2, md: 3 },
    py: { xs: 2.2, md: 3 },
    mb: 3,
  };

  const textPrimary = isDark ? "white" : "#111827";
  const textSecondary = isDark
    ? "rgba(255,255,255,0.64)"
    : "rgba(17,24,39,0.64)";

  return (
    <Box sx={pageWrapSx}>
      <Box sx={heroCardSx}>
        <Typography fontSize={{ xs: 26, md: 34 }} fontWeight={900} color={textPrimary}>
          Quản lý Blog Fitness
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
              color: isDark
                ? "rgba(255,255,255,0.64)"
                : "rgba(17,24,39,0.64)",
              textTransform: "none",
              fontWeight: 700,
              minHeight: 44,
              borderRadius: "12px",
              transition: "all 0.2s ease",
            },
            "& .MuiTab-root:hover": {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.04)"
                : "rgba(249,115,22,0.08)",
            },
            "& .Mui-selected": {
              color: "#fdba74 !important",
            },
          }}
        >
          <Tab
            icon={<ArticleOutlinedIcon />}
            iconPosition="start"
            label="Bài viết"
          />
          <Tab
            icon={<CategoryOutlinedIcon />}
            iconPosition="start"
            label="Danh mục"
          />
          <Tab
            icon={<LocalOfferOutlinedIcon />}
            iconPosition="start"
            label="Tag"
          />
        </Tabs>
      </Box>

      {tab === 0 && <BlogPostTable />}
      {tab === 1 && <BlogCategoryTable />}
      {tab === 2 && <BlogTagTable />}
    </Box>
  );
}