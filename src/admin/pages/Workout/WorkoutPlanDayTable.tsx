import * as React from "react";
import {
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
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  deleteWorkoutPlanDay,
  fetchAllWorkoutPlanDays,
} from "../../../state/admin/adminWorkoutPlanDaySlice";
import { WorkoutPlanDay } from "../../../types/WorkoutPlanDayType";
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

export default function WorkoutPlanDayTable() {
  const { isDark } = useSiteThemeMode();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { workoutPlanDays, loading } = useAppSelector(
    (store) => store.adminWorkoutPlanDay
  );

  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [menuState, setMenuState] = React.useState<{
    anchorEl: HTMLElement | null;
    dayId: number | null;
  }>({
    anchorEl: null,
    dayId: null,
  });

  const TEXT_PRIMARY = isDark ? "#fff7ed" : "#111827";
  const TEXT_SECONDARY = isDark
    ? "rgba(255,255,255,0.62)"
    : "rgba(17,24,39,0.64)";
  const TEXT_MUTED = isDark
    ? "rgba(255,255,255,0.58)"
    : "rgba(17,24,39,0.58)";

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
    dispatch(fetchAllWorkoutPlanDays());
  }, [dispatch]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredDays = React.useMemo(() => {
    if (!normalizedSearch) return workoutPlanDays || [];

    return (workoutPlanDays || []).filter((day: WorkoutPlanDay) => {
      const dayNumber = String(day.dayNumber || "");
      const dayName = day.dayName?.toLowerCase() || "";
      const title = day.title?.toLowerCase() || "";
      const focusMuscleGroup = day.focusMuscleGroup?.toLowerCase() || "";
      const note = day.note?.toLowerCase() || "";
      const workoutPlanName = day.workoutPlan?.name?.toLowerCase() || "";
      const duration = String(day.estimatedDurationMin || "");
      const exercisesCount = String(day.exercises?.length || 0);
      const id = String(day.id || "");

      return (
        dayNumber.includes(normalizedSearch) ||
        dayName.includes(normalizedSearch) ||
        title.includes(normalizedSearch) ||
        focusMuscleGroup.includes(normalizedSearch) ||
        note.includes(normalizedSearch) ||
        workoutPlanName.includes(normalizedSearch) ||
        duration.includes(normalizedSearch) ||
        exercisesCount.includes(normalizedSearch) ||
        id.includes(normalizedSearch)
      );
    });
  }, [workoutPlanDays, normalizedSearch]);

  React.useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  React.useEffect(() => {
    const maxPage = Math.max(
      0,
      Math.ceil(filteredDays.length / rowsPerPage) - 1
    );
    if (page > maxPage) setPage(maxPage);
  }, [filteredDays.length, page, rowsPerPage]);

  const paginatedDays = filteredDays.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    dayId: number
  ) => {
    setMenuState({ anchorEl: event.currentTarget, dayId });
  };

  const handleCloseMenu = () => {
    setMenuState({ anchorEl: null, dayId: null });
  };

  const handleDelete = async (id: number) => {
    await dispatch(deleteWorkoutPlanDay(id));
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
            Quản lý ngày tập
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <TextField
            size="small"
            placeholder="Tìm theo ngày, kế hoạch tập, nhóm cơ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              minWidth: { xs: "100%", sm: 340 },
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
            onClick={() => navigate("/admin/workout/day/create")}
          >
            Thêm ngày tập
          </Button>
        </Stack>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Ngày tập</StyledTableCell>
              <StyledTableCell>Kế hoạch tập</StyledTableCell>
              <StyledTableCell align="center">Thời lượng</StyledTableCell>
              <StyledTableCell align="center">Số bài tập</StyledTableCell>
              <StyledTableCell>Ghi chú</StyledTableCell>
              <StyledTableCell align="right">Thao tác</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedDays.length ? (
              paginatedDays.map((day: WorkoutPlanDay) => (
                <StyledTableRow key={day.id}>
                  <StyledTableCell>
                    <Typography fontWeight={700} color={TEXT_PRIMARY}>
                      Ngày {day.dayNumber} {day.dayName ? `- ${day.dayName}` : ""}
                    </Typography>

                    <Typography
                      sx={{
                        color: isDark
                          ? "rgba(255,255,255,0.66)"
                          : "rgba(17,24,39,0.66)",
                        fontSize: 13.5,
                        mt: 0.6,
                      }}
                    >
                      {day.title || day.focusMuscleGroup || "Chưa đặt tiêu đề"}
                    </Typography>
                  </StyledTableCell>

                  <StyledTableCell>
                    {day.workoutPlan?.name || "-"}
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    {day.estimatedDurationMin
                      ? `${day.estimatedDurationMin} phút`
                      : "-"}
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    <Chip
                      size="small"
                      label={day.exercises?.length || 0}
                      sx={{
                        borderRadius: 999,
                        color: "#fdba74",
                        border: "1px solid rgba(249,115,22,0.26)",
                        backgroundColor: "rgba(249,115,22,0.08)",
                        fontWeight: 700,
                      }}
                    />
                  </StyledTableCell>

                  <StyledTableCell>
                    <Stack
                      direction="row"
                      spacing={0.8}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {day.focusMuscleGroup && (
                        <Chip
                          size="small"
                          label={day.focusMuscleGroup}
                          sx={{
                            borderRadius: 999,
                            color: isDark ? "#fff7ed" : "#111827",
                            backgroundColor: isDark
                              ? "rgba(255,255,255,0.06)"
                              : "rgba(15,23,42,0.06)",
                          }}
                        />
                      )}

                      <Typography
                        sx={{
                          color: TEXT_MUTED,
                          fontSize: 13,
                          maxWidth: 320,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {day.note || "Không có ghi chú"}
                      </Typography>
                    </Stack>
                  </StyledTableCell>

                  <StyledTableCell align="right">
                    <IconButton
                      onClick={(e) => handleOpenMenu(e, Number(day.id))}
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
                      open={menuState.dayId === day.id}
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
                      <MenuItem
                        onClick={() =>
                          navigate(`/admin/workout/day/edit/${day.id}`)
                        }
                      >
                        <EditOutlinedIcon sx={{ mr: 1.2, fontSize: 18 }} />
                        Chỉnh sửa
                      </MenuItem>

                      <MenuItem
                        onClick={() => handleDelete(Number(day.id))}
                        sx={{ color: "#fca5a5 !important" }}
                      >
                        <DeleteOutlineIcon sx={{ mr: 1.2, fontSize: 18 }} />
                        Xóa ngày tập
                      </MenuItem>
                    </Menu>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ py: 8, color: TEXT_SECONDARY }}
                >
                  {loading
                    ? "Đang tải dữ liệu ngày tập..."
                    : searchTerm
                    ? "Không tìm thấy ngày tập phù hợp."
                    : "Chưa có ngày tập nào."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredDays.length}
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