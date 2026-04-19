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
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  deleteExercise,
  fetchAllExercises,
} from "../../../state/admin/adminExerciseSlice";
import { Exercise } from "../../../types/ExerciseType";
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

export default function ExerciseTable() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { exercises, loading } = useAppSelector((store) => store.adminExercise);
  const { isDark } = useSiteThemeMode();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [menuState, setMenuState] = React.useState<{
    anchorEl: HTMLElement | null;
    exerciseId: number | null;
  }>({
    anchorEl: null,
    exerciseId: null,
  });

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
    
    boxShadow: isDark
      ? "0 24px 60px rgba(0,0,0,0.28)"
      : "0 18px 45px rgba(15,23,42,0.08)",
    overflow: "hidden",
  };

  React.useEffect(() => {
    dispatch(fetchAllExercises());
  }, [dispatch]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredExercises = React.useMemo(() => {
    if (!normalizedSearch) return exercises || [];

    return (exercises || []).filter((exercise: Exercise) => {
      const name = exercise.name?.toLowerCase() || "";
      const slug = exercise.slug?.toLowerCase() || "";
      const primary = exercise.muscleGroupPrimary?.toLowerCase() || "";
      const secondary = exercise.muscleGroupSecondary?.toLowerCase() || "";
      const difficulty = exercise.difficultyLevel?.toLowerCase() || "";
      const video = exercise.videoUrl ? "có video" : "chưa có";
      const id = String(exercise.id || "");

      return (
        name.includes(normalizedSearch) ||
        slug.includes(normalizedSearch) ||
        primary.includes(normalizedSearch) ||
        secondary.includes(normalizedSearch) ||
        difficulty.includes(normalizedSearch) ||
        video.includes(normalizedSearch) ||
        id.includes(normalizedSearch)
      );
    });
  }, [exercises, normalizedSearch]);

  React.useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  React.useEffect(() => {
    const maxPage = Math.max(
      0,
      Math.ceil(filteredExercises.length / rowsPerPage) - 1
    );
    if (page > maxPage) setPage(maxPage);
  }, [filteredExercises.length, page, rowsPerPage]);

  const paginatedExercises = filteredExercises.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    exerciseId: number
  ) => {
    setMenuState({ anchorEl: event.currentTarget, exerciseId });
  };

  const handleCloseMenu = () => {
    setMenuState({ anchorEl: null, exerciseId: null });
  };

  const handleDelete = async (id: number) => {
    await dispatch(deleteExercise(id));
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
            Quản lý bài tập
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <TextField
            size="small"
            placeholder="Tìm theo tên, nhóm cơ, độ khó..."
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
  onClick={() => navigate("/admin/workout/exercise/create")}
>
  <span style={{ color: "#fff", fontWeight: 700 }}>Thêm bài tập</span>
</Button>
        </Stack>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 1100 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Bài tập</StyledTableCell>
              <StyledTableCell>Nhóm cơ</StyledTableCell>
              <StyledTableCell>Độ khó</StyledTableCell>
              <StyledTableCell>Video</StyledTableCell>
              <StyledTableCell align="right">Thao tác</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedExercises.length ? (
              paginatedExercises.map((exercise: Exercise) => (
                <StyledTableRow key={exercise.id}>
                  <StyledTableCell>
                    <Stack direction="row" spacing={1.3} alignItems="center">
                      {exercise.imageUrl ? (
                        <Avatar
                          variant="rounded"
                          src={exercise.imageUrl}
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "16px",
                          }}
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
                          <FitnessCenterOutlinedIcon />
                        </Avatar>
                      )}
                      <Box>
                        <Typography fontWeight={700} color={TEXT_PRIMARY}>
                          {exercise.name}
                        </Typography>
                        <Typography
                          sx={{
                            color: TEXT_MUTED,
                            fontSize: 12.5,
                          }}
                        >
                          {exercise.slug
                            ? `/${exercise.slug}`
                            : `ID: #${exercise.id}`}
                        </Typography>
                      </Box>
                    </Stack>
                  </StyledTableCell>

                  <StyledTableCell>
                    <Stack direction="row" spacing={0.8} flexWrap="wrap">
                      {exercise.muscleGroupPrimary && (
                        <Chip
                          size="small"
                          label={exercise.muscleGroupPrimary}
                          sx={{
                            borderRadius: 999,
                            color: "#fdba74",
                            backgroundColor: "rgba(249,115,22,0.08)",
                          }}
                        />
                      )}
                      {exercise.muscleGroupSecondary && (
                        <Chip
                          size="small"
                          label={exercise.muscleGroupSecondary}
                          sx={{
                            borderRadius: 999,
                            color: isDark ? "#fff7ed" : "#111827",
                            backgroundColor: isDark
                              ? "rgba(255,255,255,0.06)"
                              : "rgba(15,23,42,0.06)",
                          }}
                        />
                      )}
                    </Stack>
                  </StyledTableCell>

                  <StyledTableCell>
                    {exercise.difficultyLevel || "-"}
                  </StyledTableCell>

                  <StyledTableCell>
                    {exercise.videoUrl ? "Có video" : "Chưa có"}
                  </StyledTableCell>

                  <StyledTableCell align="right">
                    <IconButton
                      onClick={(e) => handleOpenMenu(e, Number(exercise.id))}
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
                      open={menuState.exerciseId === exercise.id}
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
                      <MenuItem
                        onClick={() =>
                          navigate(`/admin/workout/exercise/edit/${exercise.id}`)
                        }
                      >
                        <EditOutlinedIcon sx={{ mr: 1.2, fontSize: 18 }} />
                        Chỉnh sửa
                      </MenuItem>

                      <MenuItem
                        onClick={() => handleDelete(Number(exercise.id))}
                        sx={{ color: "#fca5a5 !important" }}
                      >
                        <DeleteOutlineIcon sx={{ mr: 1.2, fontSize: 18 }} />
                        Xóa bài tập
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
                  sx={{
                    py: 8,
                    color: TEXT_SECONDARY,
                  }}
                >
                  {loading
                    ? "Đang tải danh sách bài tập..."
                    : searchTerm
                    ? "Không tìm thấy bài tập phù hợp."
                    : "Chưa có bài tập nào."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredExercises.length}
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