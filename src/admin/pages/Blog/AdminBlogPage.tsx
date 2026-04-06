import * as React from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import BlogPostTable from "./BlogPostTable";
import BlogCategoryTable from "./BlogCategoryTable";
import BlogTagTable from "./BlogTagTable";


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

export default function AdminBlogPage() {
  const [tab, setTab] = React.useState(0);

  return (
    <Box sx={pageWrapSx}>
      <Box sx={heroCardSx}>
        <Typography fontSize={{ xs: 26, md: 34 }} fontWeight={900} color="white">
          Quản lý Blog Fitness
        </Typography>
        <Typography
          sx={{
            mt: 1,
            color: "rgba(255,255,255,0.64)",
            fontSize: 14.5,
            maxWidth: 820,
          }}
        >
          Quản lý nội dung bài viết, danh mục và thẻ blog theo phong cách đồng bộ
          với trang admin hiện tại.
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
          <Tab icon={<ArticleOutlinedIcon />} iconPosition="start" label="Bài viết" />
          <Tab icon={<CategoryOutlinedIcon />} iconPosition="start" label="Danh mục" />
          <Tab icon={<LocalOfferOutlinedIcon />} iconPosition="start" label="Tag" />
        </Tabs>
      </Box>

      {tab === 0 && <BlogPostTable />}
      {tab === 1 && <BlogCategoryTable />}
      {tab === 2 && <BlogTagTable />}
    </Box>
  );
}