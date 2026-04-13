import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowForward, CalendarMonth, PersonOutline } from "@mui/icons-material";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { BlogPost } from "../../../types/BlogType";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const stripHtml = (html?: string) => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
};

const formatDate = (value?: string | null) => {
  if (!value) return "Chua xuat ban";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const normalizeBlogSlug = (slug?: string | null) => {
  return (slug || "").replace(/^#+/, "");
};

const getCategoryTone = (categoryName?: string) => {
  const name = (categoryName || "").toLowerCase();
  if (name.includes("tap")) return { color: "#fff7ed", bg: "rgba(120,53,15,0.88)" };
  if (name.includes("dinh")) return { color: "#ecfdf5", bg: "rgba(20,83,45,0.88)" };
  if (name.includes("phuc") || name.includes("recovery")) return { color: "#eff6ff", bg: "rgba(30,58,138,0.88)" };
  return { color: "#fb923c", bg: "rgba(249,115,22,0.12)" };
};

const BlogCard = ({ post }: { post: BlogPost }) => {
  const navigate = useNavigate();
  const tone = getCategoryTone(post.category?.name);
  const { isDark } = useSiteThemeMode();
  const excerpt =
    post.shortDescription?.trim() ||
    stripHtml(post.content).slice(0, 150) ||
    "Bai viet dang duoc cap nhat.";

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
        height: "100%",
        transition: "transform 0.22s ease, border-color 0.22s ease",
        "&:hover": { transform: "translateY(-4px)", borderColor: "rgba(249,115,22,0.26)" },
      }}
    >
      <Box sx={{ position: "relative", height: 250 }}>
        <Box
          component="img"
          src={
            post.thumbnailUrl ||
            post.category?.imageUrl ||
            "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80"
          }
          alt={post.title}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.76))" }} />
        <Chip
          label={post.category?.name || "Chua phan loai"}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            color: tone.color,
            backgroundColor: tone.bg,
            fontWeight: 800,
            border: "1px solid rgba(255,255,255,0.16)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.22)",
          }}
        />
      </Box>

      <Box sx={{ p: 2.2 }}>
        <Typography fontSize={24} fontWeight={800} sx={{ lineHeight: 1.15, color: isDark ? "white" : "#0f172a" }}>
          {post.title}
        </Typography>
        <Typography sx={{ mt: 1, color: isDark ? "rgba(255,255,255,0.72)" : "#475569", fontSize: 14.6, lineHeight: 1.75 }}>
          {excerpt}
        </Typography>

        <Stack direction="row" spacing={1.2} flexWrap="wrap" useFlexGap sx={{ mt: 1.8 }}>
          <Chip
            icon={<PersonOutline sx={{ color: "#fb923c !important" }} />}
            label={post.createdBy?.fullName || post.createdBy?.email || "Admin"}
            variant="outlined"
            sx={{ color: isDark ? "#fff7ed" : "#0f172a", borderColor: "rgba(249,115,22,0.22)" }}
          />
          <Chip
            icon={<CalendarMonth sx={{ color: "#fb923c !important" }} />}
            label={formatDate(post.publishedAt)}
            variant="outlined"
            sx={{ color: isDark ? "#fff7ed" : "#0f172a", borderColor: "rgba(249,115,22,0.22)" }}
          />
        </Stack>

        <Button
          endIcon={<ArrowForward />}
          onClick={() => navigate(`/blog/${normalizeBlogSlug(post.slug)}`)}
          sx={{ mt: 2.1, px: 0, textTransform: "none", color: "#fb923c", fontWeight: 700 }}
        >
          Đọc bài viết
        </Button>
      </Box>
    </Paper>
  );
};

export default BlogCard;
