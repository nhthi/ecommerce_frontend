import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
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
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  deleteBlogCategory,
  fetchAllBlogCategories,
} from "../../../state/admin/adminBlogCategorySlice";
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

export default function BlogCategoryTable() {
  const { isDark } = useSiteThemeMode();

  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((store) => store.blogCategory);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [menuState, setMenuState] = React.useState<{
    anchorEl: HTMLElement | null;
    categoryId: number | null;
  }>({ anchorEl: null, categoryId: null });

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
    dispatch(fetchAllBlogCategories());
  }, [dispatch]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredCategories = React.useMemo(() => {
    if (!normalizedSearch) return categories || [];

    return (categories || []).filter((category: any) => {
      const name = category.name?.toLowerCase() || "";
      const slug = category.slug?.toLowerCase() || "";
      const description = category.description?.toLowerCase() || "";
      const id = String(category.id || "");
      const postsCount = String(category.blogPosts?.length || 0);

      return (
        name.includes(normalizedSearch) ||
        slug.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        id.includes(normalizedSearch) ||
        postsCount.includes(normalizedSearch)
      );
    });
  }, [categories, normalizedSearch]);

  React.useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  React.useEffect(() => {
    const maxPage = Math.max(
      0,
      Math.ceil(filteredCategories.length / rowsPerPage) - 1
    );
    if (page > maxPage) setPage(maxPage);
  }, [filteredCategories.length, page, rowsPerPage]);

  const paginatedCategories = filteredCategories.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    categoryId: number
  ) => {
    setMenuState({ anchorEl: event.currentTarget, categoryId });
  };

  const handleClick = (categoryId: number) => {
    navigate(`/admin/blog/category/edit/${categoryId}`);
  };

  const handleCloseMenu = () => {
    setMenuState({ anchorEl: null, categoryId: null });
  };

  const handleDelete = async (id: number) => {
    await dispatch(deleteBlogCategory(id));
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
            Quản lý danh mục blog
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <TextField
            size="small"
            placeholder="Tìm theo tên, slug, mô tả..."
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
    boxShadow: "none",
    "& .MuiButton-startIcon, & .MuiSvgIcon-root": {
      color: "#fff !important",
    },
    "&:hover": {
      background: "linear-gradient(135deg, #ea580c, #c2410c)",
      boxShadow: "none",
    },
  }}
  onClick={() => navigate("/admin/blog/category/create")}
>
  <span style={{ color: "#fff", fontWeight: 700 }}>Thêm danh mục</span>
</Button>
        </Stack>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 980 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Danh mục</StyledTableCell>
              <StyledTableCell>Slug</StyledTableCell>
              <StyledTableCell>Mô tả</StyledTableCell>
              <StyledTableCell align="center">Số bài viết</StyledTableCell>
              <StyledTableCell align="right">Tác vụ</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedCategories.length ? (
              paginatedCategories.map((category: any) => (
                <StyledTableRow key={category.id}>
                  <StyledTableCell>
                    <Stack direction="row" spacing={1.3} alignItems="center">
                      {category.imageUrl ? (
                        <Avatar
                          variant="rounded"
                          src={category.imageUrl}
                          sx={{ width: 56, height: 56, borderRadius: "16px" }}
                        />
                      ) : (
                        <Avatar
                          variant="rounded"
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "16px",
                            background: "rgba(249,115,22,0.12)",
                            color: "#fdba74",
                          }}
                        >
                          <FolderOutlinedIcon />
                        </Avatar>
                      )}
                      <Box>
                        <Typography fontWeight={700} color={TEXT_PRIMARY}>
                          {category.name}
                        </Typography>
                        <Typography
                          sx={{ color: TEXT_MUTED, fontSize: 12.5 }}
                        >
                          ID: #{category.id}
                        </Typography>
                      </Box>
                    </Stack>
                  </StyledTableCell>

                  <StyledTableCell>/{category.slug}</StyledTableCell>

                  <StyledTableCell>
                    <Typography
                      sx={{
                        color: isDark
                          ? "rgba(255,255,255,0.72)"
                          : "rgba(17,24,39,0.72)",
                        maxWidth: 400,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {category.description || "Chưa có mô tả"}
                    </Typography>
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    <Chip
                      size="small"
                      label={category.blogPosts?.length || 0}
                      sx={{
                        borderRadius: 999,
                        color: "#fdba74",
                        border: "1px solid rgba(249,115,22,0.26)",
                        backgroundColor: "rgba(249,115,22,0.08)",
                        fontWeight: 700,
                      }}
                    />
                  </StyledTableCell>

                  <StyledTableCell align="right">
                    <IconButton
                      onClick={(e) => handleOpenMenu(e, category.id)}
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
                      open={menuState.categoryId === category.id}
                      onClose={handleCloseMenu}
                      PaperProps={{
                        sx: {
                          
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
                      <MenuItem onClick={() => handleClick(category.id)}>
                        <EditOutlinedIcon sx={{ mr: 1.2, fontSize: 18 }} />
                        Chỉnh sửa
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleDelete(category.id)}
                        sx={{ color: "#fca5a5 !important" }}
                      >
                        <DeleteOutlineIcon sx={{ mr: 1.2, fontSize: 18 }} />
                        Xóa danh mục
                      </MenuItem>
                    </Menu>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ py: 8, color: TEXT_SECONDARY }}
                >
                  {loading
                    ? "Đang tải danh mục..."
                    : searchTerm
                    ? "Không tìm thấy danh mục phù hợp."
                    : "Chưa có danh mục blog nào."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredCategories.length}
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