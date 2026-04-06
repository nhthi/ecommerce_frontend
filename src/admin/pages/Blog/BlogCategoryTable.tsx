import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
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
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  deleteBlogCategory,
  fetchAllBlogCategories,
} from "../../../state/admin/adminBlogCategorySlice";
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

export default function BlogCategoryTable() {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((store) => store.blogCategory);
    const navigate = useNavigate()
  const [menuState, setMenuState] = React.useState<{
    anchorEl: HTMLElement | null;
    categoryId: number | null;
  }>({ anchorEl: null, categoryId: null });

  React.useEffect(() => {
    dispatch(fetchAllBlogCategories());
  }, [dispatch]);

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    categoryId: number
  ) => {
    setMenuState({ anchorEl: event.currentTarget, categoryId });
  };
  const handleClick = (categoryId: number) => {
    navigate(`/admin/blog/category/edit/${categoryId}`)
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
            Quản lý danh mục blog
          </Typography>
          <Typography
            sx={{ mt: 0.7, color: "rgba(255,255,255,0.62)", fontSize: 14.5 }}
          >
            Gom nhóm bài viết theo chủ đề fitness như dinh dưỡng, tập luyện, recovery.
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
          onClick={()=>navigate('/admin/blog/category/create')}
        >
          Thêm danh mục
        </Button>
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
            {categories?.length ? (
              categories.map((category: any) => (
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
                        <Typography fontWeight={700}>{category.name}</Typography>
                        <Typography
                          sx={{ color: "rgba(255,255,255,0.52)", fontSize: 12.5 }}
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
                        color: "rgba(255,255,255,0.72)",
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
                        color: "#fff7ed",
                        border: "1px solid rgba(255,255,255,0.12)",
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
                          backgroundColor: "#171717",
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "18px",
                          mt: 1,
                        },
                      }}
                    >
                      <MenuItem onClick={()=>handleClick(category.id)}>
                        <EditOutlinedIcon sx={{ mr: 1.2, fontSize: 18 }} />
                        Chỉnh sửa
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleDelete(category.id)}
                        sx={{ color: "#fca5a5" }}
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
                  sx={{ py: 8, color: "rgba(255,255,255,0.6)" }}
                >
                  {loading ? "Đang tải danh mục..." : "Chưa có danh mục blog nào."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}