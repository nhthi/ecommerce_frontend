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
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import {
  AutoStories,
  CalendarMonth,
  Search as SearchIcon,
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
    stripHtml(post.content).slice(0, 140) ||
    "Bai viet dang duoc cap nhat noi dung."
  );
};

const Blog = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { posts, loading, error } = useAppSelector((store) => store.blogPost);
  const { categories } = useAppSelector((store) => store.blogCategory);
  const { tags } = useAppSelector((store) => store.blogTag);
  const { isDark } = useSiteThemeMode();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

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
    [posts]
  );

  const categoryOptions = useMemo(
    () => [
      { label: "Tat ca", value: "" },
      ...categories.map((item) => ({ label: item.name, value: item.slug })),
    ],
    [categories]
  );

  const activeCategory = searchParams.get("category") || "";

  const filteredPosts = useMemo(() => {
    let result = publishedPosts;

    if (activeCategory) {
      result = result.filter((item) => item.category?.slug === activeCategory);
    }

    if (search.trim()) {
      const keyword = search.toLowerCase();
      result = result.filter((item) => {
        return (
          item.title?.toLowerCase().includes(keyword) ||
          stripHtml(item.content).toLowerCase().includes(keyword)
        );
      });
    }

    return result;
  }, [activeCategory, search, publishedPosts]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, search]);

  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [currentPage, filteredPosts]);

  const featuredPost = filteredPosts[0];

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
        background: isDark ? "#0b0b0b" : "#f8fafc",
        px: { xs: 2, md: 3 },
        py: { xs: 3, lg: 4 },
      }}
    >
      <Box sx={{ mx: "auto", maxWidth: "1200px" }}>
        {/* HEADER */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "20px",
            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(15,23,42,0.08)",
            background: isDark ? "#111" : "#fff",
            boxShadow: isDark
              ? "0 10px 30px rgba(0,0,0,0.4)"
              : "0 10px 30px rgba(0,0,0,0.06)",
            p: 3,
          }}
        >
          <Stack spacing={2}>
            <Typography fontSize={26} fontWeight={800}>
              Blog
            </Typography>

            <Stack direction="row" spacing={1}>
              <Chip
                icon={<AutoStories />}
                label={`${publishedPosts.length} bai viet`}
              />
              <Chip
                icon={<CalendarMonth />}
                label={`${categories.length} danh muc`}
              />
            </Stack>

            {featuredPost && (
              <Box>
                <Typography fontWeight={700}>
                  {featuredPost.title}
                </Typography>
                <Typography fontSize={14} sx={{ opacity: 0.7 }}>
                  {getPostSummary(featuredPost)}
                </Typography>
                <Typography fontSize={12} sx={{ opacity: 0.5 }}>
                  {formatDate(featuredPost.publishedAt)}
                </Typography>
              </Box>
            )}
          </Stack>
        </Paper>

        {/* SEARCH + CATEGORY */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          justifyContent="space-between"
          sx={{ mt: 2 }}
        >
          <TextField
            placeholder="Tim kiem bai viet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", md: 320 },
              background: isDark ? "#111" : "#fff",
              borderRadius: "12px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", md: 240 },
              background: isDark ? "#111" : "#fff",
              borderRadius: "12px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          >
            <Select
              displayEmpty
              value={activeCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              renderValue={(selected) => {
                if (!selected) return "Tat ca danh muc";
                return (
                  categoryOptions.find((item) => item.value === selected)?.label ||
                  "Tat ca danh muc"
                );
              }}
              sx={{
                fontWeight: 600,
                color: isDark ? "#fff" : "#0f172a",
              }}
            >
              {categoryOptions.map((category) => (
                <MenuItem
                  key={category.value || "all"}
                  value={category.value}
                >
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* ERROR */}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {/* POSTS */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {paginatedPosts.map((post) => (
            <Grid key={post.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <BlogCard post={post} />
            </Grid>
          ))}

          {!loading && filteredPosts.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Typography textAlign="center">
                Khong co bai viet phu hop
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* PAGINATION */}
        {!loading && filteredPosts.length > POSTS_PER_PAGE && (
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={(_, value) => setPage(value)}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Blog;