import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Chip,
  Grid,
  Pagination,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  AutoStories,
  CalendarMonth,
  LocalFireDepartment,
} from "@mui/icons-material";
import BlogCard from "./BlogCard";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchAllBlogCategories } from "../../../state/admin/adminBlogCategorySlice";
import { fetchAllBlogPosts } from "../../../state/admin/adminBlogPostSlice";
import { fetchAllBlogTags } from "../../../state/admin/adminBlogTagSlice";
import { BlogPost } from "../../../types/BlogType";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const POSTS_PER_PAGE = 6;

const stripHtml = (html?: string) => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
};

const formatDate = (value?: string | null) => {
  if (!value) return "Chua cap nhat";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const getPostSummary = (post: BlogPost) => {
  return (
    post.shortDescription?.trim() ||
    stripHtml(post.content).slice(0, 180) ||
    "Bai viet dang duoc cap nhat noi dung."
  );
};

const Blog = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { posts, loading, error } = useAppSelector((store) => store.blogPost);
  const { categories } = useAppSelector((store) => store.blogCategory);
  const { tags } = useAppSelector((store) => store.blogTag);
  const [page, setPage] = useState(1);
  const { isDark } = useSiteThemeMode();

  useEffect(() => {
    dispatch(fetchAllBlogPosts());
    dispatch(fetchAllBlogCategories());
    dispatch(fetchAllBlogTags());
  }, [dispatch]);

  const publishedPosts = useMemo(
    () =>
      posts
        .filter((item) => item.status === "PUBLISHED")
        .slice()
        .sort((a, b) => {
          const first = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const second = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return second - first;
        }),
    [posts],
  );

  const categoryOptions = useMemo(
    () => [
      { label: "Tat ca", value: "" },
      ...categories.map((item) => ({ label: item.name, value: item.slug })),
    ],
    [categories],
  );

  const activeCategory = searchParams.get("category") || "";

  const filteredPosts = useMemo(() => {
    if (!activeCategory) return publishedPosts;
    return publishedPosts.filter((item) => item.category?.slug === activeCategory);
  }, [activeCategory, publishedPosts]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [currentPage, filteredPosts]);

  const featuredPost = filteredPosts[0];
  const highlightedTags = tags.slice(0, 4);

  const handleCategoryChange = (categorySlug: string) => {
    setPage(1);
    if (!categorySlug) {
      setSearchParams({});
      return;
    }
    setSearchParams({ category: categorySlug });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(180deg, #070707 0%, #111111 28%, #090909 100%)"
          : "linear-gradient(180deg, #f8fafc 0%, #eef2f7 28%, #f6f7fb 100%)",
        px: { xs: 2, md: 3 },
        py: { xs: 3, lg: 4 },
      }}
    >
      <Box sx={{ mx: "auto", maxWidth: "1460px" }}>
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            borderRadius: "34px",
            border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)",
            background: isDark
              ? "radial-gradient(circle at top left, rgba(249,115,22,0.22), transparent 28%), linear-gradient(180deg, rgba(20,20,20,0.98), rgba(8,8,8,0.98))"
              : "radial-gradient(circle at top left, rgba(249,115,22,0.14), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
            boxShadow: isDark ? "0 28px 80px rgba(0,0,0,0.34)" : "0 28px 80px rgba(15,23,42,0.08)",
            color: isDark ? "white" : "#0f172a",
            p: { xs: 2.5, md: 4 },
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, lg: 7 }}>
              <Chip
                label="Noi dung blog tu he thong admin"
                variant="outlined"
                sx={{
                  color: isDark ? "#fed7aa" : "#c2410c",
                  borderColor: "rgba(249,115,22,0.3)",
                  backgroundColor: "rgba(249,115,22,0.1)",
                }}
              />
              <Typography fontSize={{ xs: 34, md: 54 }} fontWeight={900} lineHeight={1.02} sx={{ mt: 1.8 }}>
                Blog chia se kinh nghiem tap luyen, dinh duong va phuc hoi.
              </Typography>
              <Typography
                sx={{ mt: 1.5, maxWidth: 760, color: isDark ? "rgba(255,255,255,0.72)" : "#475569", fontSize: { xs: 15, md: 17 } }}
              >
                Toan bo bai viet duoi day duoc lay tu du lieu that tu admin. Ban co the loc theo danh muc va doc chi tiet tung bai theo slug.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ mt: 2.4 }} useFlexGap flexWrap="wrap">
                <Chip
                  icon={<AutoStories sx={{ color: "#fb923c !important" }} />}
                  label={`${publishedPosts.length} bai viet da xuat ban`}
                  variant="outlined"
                  sx={{ color: isDark ? "#fff7ed" : "#0f172a", borderColor: "rgba(249,115,22,0.22)" }}
                />
                <Chip
                  icon={<CalendarMonth sx={{ color: "#fb923c !important" }} />}
                  label={`${categories.length} danh muc`}
                  variant="outlined"
                  sx={{ color: isDark ? "#fff7ed" : "#0f172a", borderColor: "rgba(249,115,22,0.22)" }}
                />
              </Stack>

              {highlightedTags.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2.2 }}>
                  {highlightedTags.map((tag) => (
                    <Chip
                      key={tag.id}
                      label={`#${tag.name}`}
                      sx={{
                        color: isDark ? "#fff7ed" : "#0f172a",
                        backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)",
                        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)",
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              {featuredPost ? (
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "26px",
                    overflow: "hidden",
                    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)",
                    backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.72)",
                  }}
                >
                  <Box
                    component="img"
                    src={
                      featuredPost.thumbnailUrl ||
                      featuredPost.category?.imageUrl ||
                      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={featuredPost.title}
                    sx={{ width: "100%", height: 250, objectFit: "cover" }}
                  />
                  <Box sx={{ p: 2.2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.2}>
                      <Typography fontSize={22} fontWeight={800} sx={{ color: isDark ? "white" : "#0f172a" }}>
                        {featuredPost.title}
                      </Typography>
                      <LocalFireDepartment sx={{ color: "#fb923c" }} />
                    </Stack>
                    <Typography sx={{ mt: 1, color: isDark ? "rgba(255,255,255,0.7)" : "#475569", fontSize: 14.5 }}>
                      {getPostSummary(featuredPost)}
                    </Typography>
                    <Typography sx={{ mt: 1.4, color: isDark ? "rgba(255,255,255,0.45)" : "#64748b", fontSize: 12.5 }}>
                      Dang ngay {formatDate(featuredPost.publishedAt)}
                    </Typography>
                  </Box>
                </Paper>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "26px",
                    border: isDark ? "1px dashed rgba(255,255,255,0.12)" : "1px dashed rgba(15,23,42,0.14)",
                    backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.72)",
                    p: 3,
                    color: isDark ? "rgba(255,255,255,0.72)" : "#475569",
                  }}
                >
                  Chua co bai viet nao da xuat ban.
                </Paper>
              )}
            </Grid>
          </Grid>
        </Paper>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2.4, mb: 2.2 }}>
          {categoryOptions.map((category) => (
            <Chip
              key={category.value || "all"}
              label={category.label}
              onClick={() => handleCategoryChange(category.value)}
              sx={{
                color: activeCategory === category.value ? "#050505" : isDark ? "#fff7ed" : "#0f172a",
                backgroundColor: activeCategory === category.value ? "#fb923c" : isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)",
                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)",
                fontWeight: 700,
              }}
            />
          ))}
        </Stack>

        {error && (
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              borderRadius: "22px",
              border: "1px solid rgba(248,113,113,0.22)",
              backgroundColor: "rgba(127,29,29,0.18)",
              color: "#fecaca",
              p: 2,
            }}
          >
            {error}
          </Paper>
        )}

        <Grid container spacing={2.2}>
          {paginatedPosts.map((post) => (
            <Grid key={post.id} size={{ xs: 12, xl: 4 }}>
              <BlogCard post={post} />
            </Grid>
          ))}

          {!loading && filteredPosts.length === 0 && (
            <Grid size={12}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "28px",
                  border: isDark ? "1px dashed rgba(255,255,255,0.12)" : "1px dashed rgba(15,23,42,0.14)",
                  backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.72)",
                  color: isDark ? "white" : "#0f172a",
                  p: 4,
                  textAlign: "center",
                }}
              >
                <Typography fontSize={24} fontWeight={800}>
                  Chua co bai viet phu hop
                </Typography>
                <Typography sx={{ mt: 1, color: isDark ? "rgba(255,255,255,0.68)" : "#475569" }}>
                  Thu doi danh muc hoac dang them bai viet moi tu trang admin.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

        {!loading && filteredPosts.length > POSTS_PER_PAGE && (
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: isDark ? "#fff7ed" : "#0f172a",
                  borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
                  backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
                },
                "& .Mui-selected": {
                  backgroundColor: "#fb923c !important",
                  color: "#050505",
                  fontWeight: 800,
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Blog;
