import * as React from "react";
import {
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
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  deleteBlogTag,
  fetchAllBlogTags,
} from "../../../state/admin/adminBlogTagSlice";
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

export default function BlogTagTable() {
  const dispatch = useAppDispatch();
  const { tags, loading } = useAppSelector((store) => store.blogTag);
  const navigate = useNavigate()
  const [menuState, setMenuState] = React.useState<{
    anchorEl: HTMLElement | null;
    tagId: number | null;
  }>({ anchorEl: null, tagId: null });

  React.useEffect(() => {
    dispatch(fetchAllBlogTags());
  }, [dispatch]);

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    tagId: number
  ) => {
    setMenuState({ anchorEl: event.currentTarget, tagId });
  };

    const handleClick = (
    tagId: number
  ) => {
    navigate(`/admin/blog/tag/edit/${tagId}`)
  };

  const handleCloseMenu = () => {
    setMenuState({ anchorEl: null, tagId: null });
  };

  const handleDelete = async (id: number) => {
    await dispatch(deleteBlogTag(id));
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
            Quản lý tag blog
          </Typography>
          <Typography
            sx={{ mt: 0.7, color: "rgba(255,255,255,0.62)", fontSize: 14.5 }}
          >
            Quản lý các thẻ như gym, whey, cardio, fat-loss, hypertrophy...
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
          onClick={()=>navigate('/admin/blog/tag/create')}
        >
          Thêm tag
        </Button>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Tag</StyledTableCell>
              <StyledTableCell>Slug</StyledTableCell>
              <StyledTableCell align="center">Số bài viết</StyledTableCell>
              <StyledTableCell align="right">Tác vụ</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tags?.length ? (
              tags.map((tag: any) => (
                <StyledTableRow key={tag.id}>
                  <StyledTableCell>
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: "14px",
                          display: "grid",
                          placeItems: "center",
                          backgroundColor: "rgba(249,115,22,0.12)",
                          border: "1px solid rgba(249,115,22,0.18)",
                          color: "#fdba74",
                        }}
                      >
                        <LocalOfferOutlinedIcon fontSize="small" />
                      </Box>
                      <Box>
                        <Typography fontWeight={700}>{tag.name}</Typography>
                        <Typography
                          sx={{ color: "rgba(255,255,255,0.52)", fontSize: 12.5 }}
                        >
                          ID: #{tag.id}
                        </Typography>
                      </Box>
                    </Stack>
                  </StyledTableCell>

                  <StyledTableCell>/{tag.slug}</StyledTableCell>

                  <StyledTableCell align="center">
                    <Chip
                      size="small"
                      label={tag.blogPosts?.length || 0}
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
                      onClick={(e) => handleOpenMenu(e, tag.id)}
                      sx={{
                        color: "#fff7ed",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      <MoreHorizIcon />
                    </IconButton>

                    <Menu
                      anchorEl={menuState.anchorEl}
                      open={menuState.tagId === tag.id}
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
                      <MenuItem onClick={()=>handleClick(tag.id)}>
                        <EditOutlinedIcon sx={{ mr: 1.2, fontSize: 18 }} />
                        Chỉnh sửa
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleDelete(tag.id)}
                        sx={{ color: "#fca5a5" }}
                      >
                        <DeleteOutlineIcon sx={{ mr: 1.2, fontSize: 18 }} />
                        Xóa tag
                      </MenuItem>
                    </Menu>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{ py: 8, color: "rgba(255,255,255,0.6)" }}
                >
                  {loading ? "Đang tải tag..." : "Chưa có tag blog nào."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}