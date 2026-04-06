import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowBack, AutoAwesome, CalendarMonth, PersonOutline, VisibilityOutlined } from "@mui/icons-material";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import NotFound from "../NotFound/NotFound";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchAllBlogPosts, increaseBlogPostView } from "../../../state/admin/adminBlogPostSlice";
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
const buildSummary = (post: BlogPost) => {
  const text = stripHtml(post.content);
  return text.slice(0, 320) || post.shortDescription || "Bai viet dang duoc cap nhat.";
};

const BlogDetail = () => {
  const { slug } = useParams();
  const dispatch = useAppDispatch();
  const { posts, loading, error } = useAppSelector((store) => store.blogPost);
  const [summaryRequested, setSummaryRequested] = useState(false);
  const viewedRef = useRef<number | null>(null);
  const { isDark } = useSiteThemeMode();

  useEffect(() => {
    dispatch(fetchAllBlogPosts());
  }, [dispatch]);

  const publishedPosts = useMemo(
    () => posts.filter((item) => item.status === "PUBLISHED"),
    [posts],
  );

  const post = useMemo(() => publishedPosts.find((item) => normalizeBlogSlug(item.slug) === normalizeBlogSlug(slug)), [publishedPosts, slug]);

  useEffect(() => {
    if (!post || viewedRef.current === post.id) return;
    viewedRef.current = post.id;
    dispatch(increaseBlogPostView(post.id));
  }, [dispatch, post]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return publishedPosts
      .filter((item) => item.id !== post.id && item.category?.slug === post.category?.slug)
      .slice(0, 3);
  }, [post, publishedPosts]);

  if (!loading && !post && !error) return <NotFound />;

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
      <Box sx={{ mx: "auto", maxWidth: "1220px" }}>
        <Button
          component={Link}
          to="/blog"
          startIcon={<ArrowBack />}
          sx={{
            mb: 2.4,
            textTransform: "none",
            color: isDark ? "#fff7ed" : "#0f172a",
            borderRadius: 999,
            border: "1px solid rgba(249,115,22,0.22)",
            px: 2.2,
          }}
        >
          Quay lai blog
        </Button>

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

        {post ? (
          <>
            <Paper
              elevation={0}
              sx={{
                overflow: "hidden",
                borderRadius: "34px",
                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)",
                background: isDark ? "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(8,8,8,0.98))" : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
                boxShadow: isDark ? "0 28px 80px rgba(0,0,0,0.34)" : "0 28px 80px rgba(15,23,42,0.08)",
                color: isDark ? "white" : "#0f172a",
              }}
            >
              <Box
                component="img"
                src={
                  post.thumbnailUrl ||
                  post.category?.imageUrl ||
                  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80"
                }
                alt={post.title}
                sx={{ width: "100%", height: { xs: 280, md: 420 }, objectFit: "cover" }}
              />
              <Box sx={{ p: { xs: 2.5, md: 4 } }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    label={post.category?.name || "Chua phan loai"}
                    sx={{ color: "#fb923c", backgroundColor: "rgba(249,115,22,0.12)", fontWeight: 700 }}
                  />
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
                  <Chip
                    icon={<VisibilityOutlined sx={{ color: "#fb923c !important" }} />}
                    label={`${post.viewCount || 0} luot xem`}
                    variant="outlined"
                    sx={{ color: isDark ? "#fff7ed" : "#0f172a", borderColor: "rgba(249,115,22,0.22)" }}
                  />
                </Stack>

                <Typography fontSize={{ xs: 34, md: 52 }} fontWeight={900} lineHeight={1.04} sx={{ mt: 1.8 }}>
                  {post.title}
                </Typography>
                <Typography sx={{ mt: 1.5, color: isDark ? "rgba(255,255,255,0.74)" : "#475569", fontSize: 17, lineHeight: 1.8 }}>
                  {post.shortDescription || "Noi dung chi tiet duoc cap nhat tu bai viet do admin tao."}
                </Typography>

                {!!post.tags?.length && (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2.2 }}>
                    {post.tags.map((tag) => (
                      <Chip
                        key={tag.id}
                        label={`#${tag.name}`}
                        sx={{ color: isDark ? "#fff7ed" : "#0f172a", backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.04)" }}
                      />
                    ))}
                  </Stack>
                )}

                <Paper
                  elevation={0}
                  sx={{
                    mt: 2.8,
                    borderRadius: "24px",
                    border: "1px solid rgba(249,115,22,0.18)",
                    background: isDark ? "linear-gradient(180deg, rgba(249,115,22,0.08), rgba(255,255,255,0.03))" : "linear-gradient(180deg, rgba(249,115,22,0.10), rgba(255,255,255,0.92))",
                    p: 2,
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    spacing={1.5}
                    alignItems={{ xs: "flex-start", md: "center" }}
                  >
                    <Box>
                      <Typography fontSize={21} fontWeight={800}>
                        Tom tat bai viet bang AI
                      </Typography>
                      <Typography sx={{ mt: 0.7, color: isDark ? "rgba(255,255,255,0.7)" : "#475569", fontSize: 14.5 }}>
                        Day la UI placeholder de ban noi logic AI sau. Hien tai no mo khung tom tat mau dua tren noi dung that cua bai viet.
                      </Typography>
                    </Box>
                    <Button
                      startIcon={<AutoAwesome />}
                      variant="contained"
                      onClick={() => setSummaryRequested((prev) => !prev)}
                      sx={{
                        borderRadius: 999,
                        textTransform: "none",
                        fontWeight: 700,
                        background: "linear-gradient(135deg, #f97316, #ea580c)",
                      }}
                    >
                      Nho AI tom tat
                    </Button>
                  </Stack>

                  {summaryRequested && (
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 1.8,
                        borderRadius: "18px",
                        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)",
                        backgroundColor: isDark ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.82)",
                        p: 1.6,
                      }}
                    >
                      <Typography fontWeight={700} sx={{ color: isDark ? "#fff" : "#0f172a" }}>
                        Tom tat mau
                      </Typography>
                      <Typography sx={{ mt: 0.8, color: isDark ? "rgba(255,255,255,0.74)" : "#475569", fontSize: 14.8, lineHeight: 1.75 }}>
                        {buildSummary(post)}
                      </Typography>
                    </Paper>
                  )}
                </Paper>

                <Box
                  sx={{
                    mt: 3.2,
                    color: isDark ? "rgba(255,255,255,0.78)" : "#334155",
                    "& img": {
                      maxWidth: "100%",
                      borderRadius: "22px",
                      marginBlock: 2.5,
                    },
                    "& p": {
                      fontSize: 16,
                      lineHeight: 1.95,
                      marginTop: 0,
                      marginBottom: 1.8,
                    },
                    "& h1, & h2, & h3": {
                      color: isDark ? "white" : "#0f172a",
                      fontWeight: 800,
                      lineHeight: 1.2,
                      marginTop: 3,
                      marginBottom: 1.4,
                    },
                    "& h1": { fontSize: 34 },
                    "& h2": { fontSize: 28 },
                    "& h3": { fontSize: 22 },
                    "& ul, & ol": {
                      paddingLeft: 3,
                      marginBottom: 2,
                    },
                    "& li": {
                      marginBottom: 0.8,
                      lineHeight: 1.85,
                    },
                    "& blockquote": {
                      margin: 0,
                      padding: "16px 18px",
                      borderLeft: "4px solid rgba(249,115,22,0.65)",
                      backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(249,115,22,0.08)",
                      borderRadius: "0 18px 18px 0",
                    },
                    "& a": {
                      color: "#ea580c",
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: post.content || "" }}
                />
              </Box>
            </Paper>

            {relatedPosts.length > 0 && (
              <Box sx={{ mt: 2.8 }}>
                <Typography fontSize={28} fontWeight={800} color={isDark ? "white" : "#0f172a"}>
                  Bai viet lien quan
                </Typography>
                <Stack spacing={1.4} sx={{ mt: 1.6 }}>
                  {relatedPosts.map((item) => (
                    <Paper
                      key={item.id}
                      elevation={0}
                      sx={{
                        borderRadius: "22px",
                        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)",
                        background: isDark ? "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(10,10,10,0.99))" : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
                        color: isDark ? "white" : "#0f172a",
                        p: 1.8,
                      }}
                    >
                      <Typography fontSize={20} fontWeight={800}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ mt: 0.8, color: isDark ? "rgba(255,255,255,0.7)" : "#475569", fontSize: 14.5 }}>
                        {item.shortDescription || stripHtml(item.content).slice(0, 160) || "Bai viet dang duoc cap nhat."}
                      </Typography>
                      <Button
                        component={Link}
                        to={`/blog/${normalizeBlogSlug(item.slug)}`}
                        sx={{ mt: 1.1, px: 0, textTransform: "none", color: "#fb923c", fontWeight: 700 }}
                      >
                        Doc tiep
                      </Button>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}
          </>
        ) : (
          <Paper
            elevation={0}
            sx={{
              borderRadius: "28px",
              border: isDark ? "1px dashed rgba(255,255,255,0.12)" : "1px dashed rgba(15,23,42,0.14)",
              backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
              color: isDark ? "white" : "#0f172a",
              p: 4,
              textAlign: "center",
            }}
          >
            Dang tai bai viet...
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default BlogDetail;
