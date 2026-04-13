import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AddIcon from "@mui/icons-material/Add";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  deleteBlogPost,
  fetchAllBlogPosts,
} from "../../../state/admin/adminBlogPostSlice";
import { BlogPost } from "../../../types/BlogType";
import { useNavigate } from "react-router-dom";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const StyledTableCell = styled(TableCell)({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#171717",
    color: "#fed7aa",
    borderBottomColor: "rgba(249,115,22,0.22)",
    fontWeight: 700,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  [`&.${tableCellClasses.body}`]: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
});

const StyledTableRow = styled(TableRow)({
  "&:hover": { backgroundColor: "rgba(249,115,22,0.05)" },
});

const statusMap: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Bản nháp", color: "#c4b5fd" },
  PUBLISHED: { label: "Đã xuất bản", color: "#86efac" },
  ARCHIVED: { label: "Lưu trữ", color: "#fda4af" },
};

function stripHtml(html?: string) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").trim();
}

export default function BlogPostTable() {
  const { isDark } = useSiteThemeMode();

  const dispatch = useAppDispatch();
  const { posts, loading } = useAppSelector((store) => store.blogPost);
  const navigate = useNavigate();

  const [openRow, setOpenRow] = React.useState<number | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [menuState, setMenuState] = React.useState<{
    anchorEl: HTMLElement | null;
    postId: number | null;
  }>({ anchorEl: null, postId: null });

  const TEXT_PRIMARY = isDark ? "#fff7ed" : "#111827";
  const TEXT_SECONDARY = isDark
    ? "rgba(255,255,255,0.62)"
    : "rgba(17,24,39,0.64)";
  const TEXT_MUTED = isDark
    ? "rgba(255,255,255,0.52)"
    : "rgba(17,24,39,0.52)";

  const panelSx = {
    borderRadius: "28px",
    border: isDark
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid rgba(15,23,42,0.08)",
    background: isDark
      ? "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))"
      : "linear-gradient(180deg, #ffffff, #fff7ed)",
    boxShadow: isDark
      ? "0 24px 60px rgba(0,0,0,0.28)"
      : "0 18px 45px rgba(15,23,42,0.08)",
    overflow: "hidden",
  };

  React.useEffect(() => {
    dispatch(fetchAllBlogPosts());
  }, [dispatch]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredPosts = React.useMemo(() => {
    if (!normalizedSearch) return posts || [];

    return (posts || []).filter((post: BlogPost) => {
      const title = post.title?.toLowerCase() || "";
      const slug = post.slug?.toLowerCase() || "";
      const shortDescription = post.shortDescription?.toLowerCase() || "";
      const content = stripHtml(post.content).toLowerCase();
      const category = post.category?.name?.toLowerCase() || "";
      const author =
        post.createdBy?.fullName?.toLowerCase() ||
        post.createdBy?.email?.toLowerCase() ||
        "";
      const status = post.status?.toLowerCase() || "";
      const tags = (post.tags || [])
        .map((tag) => tag.name?.toLowerCase() || "")
        .join(" ");

      return (
        title.includes(normalizedSearch) ||
        slug.includes(normalizedSearch) ||
        shortDescription.includes(normalizedSearch) ||
        content.includes(normalizedSearch) ||
        category.includes(normalizedSearch) ||
        author.includes(normalizedSearch) ||
        status.includes(normalizedSearch) ||
        tags.includes(normalizedSearch)
      );
    });
  }, [posts, normalizedSearch]);

  React.useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  React.useEffect(() => {
    const maxPage = Math.max(
      0,
      Math.ceil(filteredPosts.length / rowsPerPage) - 1
    );
    if (page > maxPage) setPage(maxPage);
  }, [filteredPosts.length, page, rowsPerPage]);

  const paginatedPosts = filteredPosts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    postId: number
  ) => {
    setMenuState({ anchorEl: event.currentTarget, postId });
  };

  const handleClick = (postId: number) => {
    navigate(`/admin/blog/post/edit/${postId}`);
  };

  const handleCloseMenu = () => {
    setMenuState({ anchorEl: null, postId: null });
  };

  const handleDelete = async (id: number) => {
    await dispatch(deleteBlogPost(id));
    handleCloseMenu();
  };

  return (
    <Paper elevation={0} sx={panelSx}>
      <Box
        sx={{
          px: 3,
          py: 3,
          borderBottom: isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(15,23,42,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography fontSize={26} fontWeight={800} color={TEXT_PRIMARY}>
            Quản lý bài viết
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <TextField
            size="small"
            placeholder="Tìm theo tiêu đề, slug, danh mục, tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              minWidth: { xs: "100%", sm: 320 },
              "& .MuiOutlinedInput-root": {
                color: TEXT_PRIMARY,
                borderRadius: "999px",
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(255,255,255,0.82)",
                "& fieldset": {
                  borderColor: isDark
                    ? "rgba(255,255,255,0.10)"
                    : "rgba(15,23,42,0.10)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(249,115,22,0.34)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#f97316",
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: TEXT_MUTED,
                opacity: 1,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#fb923c", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 2.2,
              fontWeight: 700,
              background: "linear-gradient(135deg, #f97316, #ea580c)",
            }}
            onClick={() => navigate("/admin/blog/post/create")}
          >
            Thêm bài viết
          </Button>
        </Stack>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 1180 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell />
              <StyledTableCell>Bài viết</StyledTableCell>
              <StyledTableCell>Danh mục</StyledTableCell>
              <StyledTableCell>Tag</StyledTableCell>
              <StyledTableCell align="center">Trạng thái</StyledTableCell>
              <StyledTableCell align="center">Lượt xem</StyledTableCell>
              <StyledTableCell>Tác giả</StyledTableCell>
              <StyledTableCell align="right">Tác vụ</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedPosts.length ? (
              paginatedPosts.map((post: BlogPost) => {
                const status = statusMap[post.status] || {
                  label: post.status,
                  color: "#d4d4d8",
                };

                return (
                  <React.Fragment key={post.id}>
                    <StyledTableRow>
                      <StyledTableCell>
                        <Button
                          size="small"
                          onClick={() =>
                            setOpenRow(openRow === post.id ? null : post.id)
                          }
                          sx={{ minWidth: 0, color: "#fb923c" }}
                        >
                          {openRow === post.id ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </Button>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Stack direction="row" spacing={1.4} alignItems="center">
                          <Avatar
                            variant="rounded"
                            src={post.thumbnailUrl}
                            sx={{ width: 64, height: 64, borderRadius: "16px" }}
                          />
                          <Box>
                            <Typography fontWeight={700} color={TEXT_PRIMARY}>
                              {post.title}
                            </Typography>
                            <Typography
                              sx={{
                                color: TEXT_MUTED,
                                fontSize: 12.5,
                                mt: 0.3,
                              }}
                            >
                              /{post.slug}
                            </Typography>
                            <Typography
                              sx={{
                                color: isDark
                                  ? "rgba(255,255,255,0.58)"
                                  : "rgba(17,24,39,0.58)",
                                fontSize: 13,
                                mt: 0.7,
                                maxWidth: 340,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {post.shortDescription || "Chưa có mô tả ngắn"}
                            </Typography>
                          </Box>
                        </Stack>
                      </StyledTableCell>

                      <StyledTableCell>
                        {post.category ? post.category.name : "Chưa phân loại"}
                      </StyledTableCell>

                      <StyledTableCell>
                        <Stack direction="row" spacing={0.8} flexWrap="wrap">
                          {post.tags?.length ? (
                            post.tags.slice(0, 3).map((tag) => (
                              <Chip
                                key={tag.id}
                                size="small"
                                label={tag.name}
                                sx={{
                                  borderRadius: 999,
                                  color: "#fdba74",
                                  border: "1px solid rgba(249,115,22,0.26)",
                                  backgroundColor: "rgba(249,115,22,0.08)",
                                }}
                              />
                            ))
                          ) : (
                            <Typography
                              sx={{ color: TEXT_MUTED, fontSize: 13 }}
                            >
                              Không có tag
                            </Typography>
                          )}
                        </Stack>
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Chip
                          size="small"
                          label={status.label}
                          variant="outlined"
                          sx={{
                            borderRadius: 999,
                            color: status.color,
                            borderColor: `${status.color}55`,
                            backgroundColor: `${status.color}14`,
                          }}
                        />
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Stack
                          direction="row"
                          spacing={0.8}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <VisibilityOutlinedIcon
                            sx={{ fontSize: 18, color: "#fdba74" }}
                          />
                          <Typography fontWeight={700} color={TEXT_PRIMARY}>
                            {post.viewCount || 0}
                          </Typography>
                        </Stack>
                      </StyledTableCell>

                      <StyledTableCell>
                        {post.createdBy?.fullName ||
                          post.createdBy?.email ||
                          "Không rõ"}
                      </StyledTableCell>

                      <StyledTableCell align="right">
                        <IconButton
                          onClick={(e) => handleOpenMenu(e, post.id)}
                          sx={{
                            color: TEXT_PRIMARY,
                            border: isDark
                              ? "1px solid rgba(255,255,255,0.12)"
                              : "1px solid rgba(15,23,42,0.12)",
                            backgroundColor: isDark
                              ? "transparent"
                              : "rgba(255,255,255,0.68)",
                          }}
                        >
                          <MoreHorizIcon />
                        </IconButton>

                        <Menu
                          anchorEl={menuState.anchorEl}
                          open={menuState.postId === post.id}
                          onClose={handleCloseMenu}
                          PaperProps={{
                            sx: {
                              background: isDark
                                ? "#171717"
                                : "linear-gradient(180deg, #ffffff, #fff7ed)",
                              color: isDark ? "white" : "#111827",
                              border: isDark
                                ? "1px solid rgba(255,255,255,0.08)"
                                : "1px solid rgba(15,23,42,0.08)",
                              borderRadius: "18px",
                              boxShadow: isDark
                                ? "0 18px 40px rgba(0,0,0,0.28)"
                                : "0 14px 32px rgba(15,23,42,0.08)",
                              mt: 1,
                              ".MuiMenuItem-root": {
                                color: isDark ? "white" : "#111827",
                              },
                              ".MuiMenuItem-root:hover": {
                                backgroundColor: isDark
                                  ? "rgba(249,115,22,0.1)"
                                  : "rgba(249,115,22,0.08)",
                              },
                            },
                          }}
                        >
                          <MenuItem onClick={() => handleClick(post.id)}>
                            <EditOutlinedIcon sx={{ mr: 1.2, fontSize: 18 }} />
                            Chỉnh sửa
                          </MenuItem>
                          <MenuItem onClick={handleCloseMenu}>
                            <LocalOfferOutlinedIcon
                              sx={{ mr: 1.2, fontSize: 18 }}
                            />
                            Quản lý tag
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleDelete(post.id)}
                            sx={{ color: "#fca5a5 !important" }}
                          >
                            <DeleteOutlineIcon
                              sx={{ mr: 1.2, fontSize: 18 }}
                            />
                            Xóa bài viết
                          </MenuItem>
                        </Menu>
                      </StyledTableCell>
                    </StyledTableRow>

                    <TableRow>
                      <TableCell
                        colSpan={8}
                        sx={{
                          p: 0,
                          border: 0,
                          background: isDark
                            ? "#0d0d0d"
                            : "linear-gradient(180deg, rgba(255,247,237,0.72), rgba(255,255,255,0.92))",
                        }}
                      >
                        <Collapse in={openRow === post.id} timeout="auto" unmountOnExit>
                          <Box sx={{ px: 3.5, pb: 3, pt: 1.8 }}>
                            <Stack direction={{ xs: "column", xl: "row" }} spacing={2.5}>
                              <Box flex={2}>
                                <Typography
                                  fontWeight={800}
                                  fontSize={18}
                                  color={TEXT_PRIMARY}
                                >
                                  Nội dung nhanh
                                </Typography>
                                <Paper
                                  elevation={0}
                                  sx={{
                                    mt: 1.5,
                                    p: 2,
                                    borderRadius: "20px",
                                    border: isDark
                                      ? "1px solid rgba(255,255,255,0.08)"
                                      : "1px solid rgba(15,23,42,0.08)",
                                    background: isDark
                                      ? "rgba(255,255,255,0.03)"
                                      : "rgba(255,255,255,0.86)",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      color: isDark
                                        ? "rgba(255,255,255,0.76)"
                                        : "rgba(17,24,39,0.76)",
                                      fontSize: 14,
                                      lineHeight: 1.75,
                                      whiteSpace: "pre-wrap",
                                    }}
                                  >
                                    {stripHtml(post.content).slice(0, 450) ||
                                      "Không có nội dung"}
                                    {stripHtml(post.content).length > 450 ? "..." : ""}
                                  </Typography>
                                </Paper>
                              </Box>

                              <Box flex={1.2}>
                                <Typography
                                  fontWeight={800}
                                  fontSize={18}
                                  color={TEXT_PRIMARY}
                                >
                                  Thông tin bài viết
                                </Typography>
                                <Paper
                                  elevation={0}
                                  sx={{
                                    mt: 1.5,
                                    p: 2,
                                    borderRadius: "20px",
                                    border: isDark
                                      ? "1px solid rgba(255,255,255,0.08)"
                                      : "1px solid rgba(15,23,42,0.08)",
                                    background: isDark
                                      ? "rgba(255,255,255,0.03)"
                                      : "rgba(255,255,255,0.86)",
                                  }}
                                >
                                  <Stack spacing={1.1}>
                                    <Typography
                                      sx={{
                                        color: isDark
                                          ? "rgba(255,255,255,0.7)"
                                          : "rgba(17,24,39,0.7)",
                                      }}
                                    >
                                      <b>Slug:</b> {post.slug}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        color: isDark
                                          ? "rgba(255,255,255,0.7)"
                                          : "rgba(17,24,39,0.7)",
                                      }}
                                    >
                                      <b>Danh mục:</b> {post.category?.name || "Chưa có"}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        color: isDark
                                          ? "rgba(255,255,255,0.7)"
                                          : "rgba(17,24,39,0.7)",
                                      }}
                                    >
                                      <b>Ngày đăng:</b> {post.publishedAt || "Chưa xuất bản"}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        color: isDark
                                          ? "rgba(255,255,255,0.7)"
                                          : "rgba(17,24,39,0.7)",
                                      }}
                                    >
                                      <b>Số tag:</b> {post.tags?.length || 0}
                                    </Typography>
                                  </Stack>
                                </Paper>
                              </Box>
                            </Stack>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                  sx={{ py: 8, color: TEXT_SECONDARY }}
                >
                  {loading
                    ? "Đang tải bài viết..."
                    : searchTerm
                    ? "Không tìm thấy bài viết phù hợp."
                    : "Chưa có bài viết nào."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredPosts.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[6, 10, 20]}
        labelRowsPerPage="Số dòng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} trên ${count !== -1 ? count : `hơn ${to}`}`
        }
        sx={{
          color: TEXT_SECONDARY,
          borderTop: isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(15,23,42,0.08)",
          ".MuiTablePagination-selectIcon": {
            color: "#fb923c",
          },
          ".MuiTablePagination-actions button": {
            color: TEXT_PRIMARY,
          },
          ".MuiTablePagination-select": {
            color: TEXT_PRIMARY,
          },
          ".MuiTablePagination-displayedRows": {
            color: TEXT_SECONDARY,
          },
        }}
      />
    </Paper>
  );
}