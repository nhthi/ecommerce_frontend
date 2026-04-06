import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
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
  TableRow,
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
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  deleteBlogPost,
  fetchAllBlogPosts,
} from "../../../state/admin/adminBlogPostSlice";
import { BlogPost } from "../../../types/BlogType";
import { useNavigate } from "react-router-dom";

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

const panelSx = {
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
  overflow: "hidden",
};

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
  const dispatch = useAppDispatch();
  const { posts, loading } = useAppSelector((store) => store.blogPost);
    const navigate = useNavigate()
  const [openRow, setOpenRow] = React.useState<number | null>(null);
  const [menuState, setMenuState] = React.useState<{
    anchorEl: HTMLElement | null;
    postId: number | null;
  }>({ anchorEl: null, postId: null });

  React.useEffect(() => {
    dispatch(fetchAllBlogPosts());
  }, [dispatch]);

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    postId: number
  ) => {
    setMenuState({ anchorEl: event.currentTarget, postId });
  };
  const handleClick = (
    postId: number
  ) => {
    navigate(`/admin/blog/post/edit/${postId}`)
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
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography fontSize={26} fontWeight={800} color="white">
            Quản lý bài viết
          </Typography>
          <Typography
            sx={{ mt: 0.7, color: "rgba(255,255,255,0.62)", fontSize: 14.5 }}
          >
            Theo dõi nội dung blog, trạng thái xuất bản, lượt xem và tag liên quan.
          </Typography>
        </Box>

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
          onClick={()=>navigate('/admin/blog/post/create')}

        >
          Thêm bài viết
        </Button>
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
            {posts?.length ? (
              posts.map((post: BlogPost) => {
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
                            <Typography fontWeight={700}>{post.title}</Typography>
                            <Typography
                              sx={{
                                color: "rgba(255,255,255,0.52)",
                                fontSize: 12.5,
                                mt: 0.3,
                              }}
                            >
                              /{post.slug}
                            </Typography>
                            <Typography
                              sx={{
                                color: "rgba(255,255,255,0.58)",
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
                              sx={{ color: "rgba(255,255,255,0.46)", fontSize: 13 }}
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
                          <VisibilityOutlinedIcon sx={{ fontSize: 18, color: "#fdba74" }} />
                          <Typography fontWeight={700}>{post.viewCount || 0}</Typography>
                        </Stack>
                      </StyledTableCell>

                      <StyledTableCell>
                        {post.createdBy?.fullName || post.createdBy?.email || "Không rõ"}
                      </StyledTableCell>

                      <StyledTableCell align="right">
                        <IconButton
                          onClick={(e) => handleOpenMenu(e, post.id)}
                          sx={{
                            color: "#fff7ed",
                            border: "1px solid rgba(255,255,255,0.12)",
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
                              backgroundColor: "#171717",
                              color: "white",
                              border: "1px solid rgba(255,255,255,0.08)",
                              borderRadius: "18px",
                              mt: 1,
                            },
                          }}
                        >
                          <MenuItem onClick={()=>handleClick(post.id)}>
                            <EditOutlinedIcon sx={{ mr: 1.2, fontSize: 18 }} />
                            Chỉnh sửa
                          </MenuItem>
                          <MenuItem onClick={handleCloseMenu}>
                            <LocalOfferOutlinedIcon sx={{ mr: 1.2, fontSize: 18 }} />
                            Quản lý tag
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleDelete(post.id)}
                            sx={{ color: "#fca5a5" }}
                          >
                            <DeleteOutlineIcon sx={{ mr: 1.2, fontSize: 18 }} />
                            Xóa bài viết
                          </MenuItem>
                        </Menu>
                      </StyledTableCell>
                    </StyledTableRow>

                    <TableRow>
                      <TableCell
                        colSpan={8}
                        sx={{ p: 0, border: 0, backgroundColor: "#0d0d0d" }}
                      >
                        <Collapse in={openRow === post.id} timeout="auto" unmountOnExit>
                          <Box sx={{ px: 3.5, pb: 3, pt: 1.8 }}>
                            <Stack direction={{ xs: "column", xl: "row" }} spacing={2.5}>
                              <Box flex={2}>
                                <Typography fontWeight={800} fontSize={18} color="white">
                                  Nội dung nhanh
                                </Typography>
                                <Paper
                                  elevation={0}
                                  sx={{
                                    mt: 1.5,
                                    p: 2,
                                    borderRadius: "20px",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    backgroundColor: "rgba(255,255,255,0.03)",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      color: "rgba(255,255,255,0.76)",
                                      fontSize: 14,
                                      lineHeight: 1.75,
                                      whiteSpace: "pre-wrap",
                                    }}
                                  >
                                    {stripHtml(post.content).slice(0, 450) || "Không có nội dung"}
                                    {stripHtml(post.content).length > 450 ? "..." : ""}
                                  </Typography>
                                </Paper>
                              </Box>

                              <Box flex={1.2}>
                                <Typography fontWeight={800} fontSize={18} color="white">
                                  Thông tin bài viết
                                </Typography>
                                <Paper
                                  elevation={0}
                                  sx={{
                                    mt: 1.5,
                                    p: 2,
                                    borderRadius: "20px",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    backgroundColor: "rgba(255,255,255,0.03)",
                                  }}
                                >
                                  <Stack spacing={1.1}>
                                    <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
                                      <b>Slug:</b> {post.slug}
                                    </Typography>
                                    <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
                                      <b>Danh mục:</b> {post.category?.name || "Chưa có"}
                                    </Typography>
                                    <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
                                      <b>Ngày đăng:</b> {post.publishedAt || "Chưa xuất bản"}
                                    </Typography>
                                    <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
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
                  sx={{ py: 8, color: "rgba(255,255,255,0.6)" }}
                >
                  {loading ? "Đang tải bài viết..." : "Chưa có bài viết nào."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}