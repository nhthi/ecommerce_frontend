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
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  deleteWorkoutPlanDay,
  fetchAllWorkoutPlanDays,
} from "../../../state/admin/adminWorkoutPlanDaySlice";
import { WorkoutPlanDay } from "../../../types/WorkoutPlanDayType";

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
  background:
    "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
  overflow: "hidden",
};

export default function WorkoutPlanDayTable() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { workoutPlanDays, loading } = useAppSelector(
    (store) => store.adminWorkoutPlanDay
  );

  const [menuState, setMenuState] = React.useState<{
    anchorEl: HTMLElement | null;
    dayId: number | null;
  }>({
    anchorEl: null,
    dayId: null,
  });

  React.useEffect(() => {
    dispatch(fetchAllWorkoutPlanDays());
  }, [dispatch]);

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
            Quản lý ngày tập
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              color: "rgba(255,255,255,0.62)",
              fontSize: 14.5,
            }}
          >
            Quản lý từng ngày trong kế hoạch tập, nhóm cơ mục tiêu và danh sách bài tập được gán.
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
          onClick={() => navigate("/admin/workout/day/create")}
        >
          Thêm ngày tập
        </Button>
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
            {workoutPlanDays?.length ? (
              workoutPlanDays.map((day: WorkoutPlanDay) => (
                <StyledTableRow key={day.id}>
                  <StyledTableCell>
                    <Typography fontWeight={700}>
                      Ngày {day.dayNumber}{" "}
                      {day.dayName ? `- ${day.dayName}` : ""}
                    </Typography>

                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.66)",
                        fontSize: 13.5,
                        mt: 0.6,
                      }}
                    >
                      {day.title ||
                        day.focusMuscleGroup ||
                        "Chưa đặt tiêu đề"}
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
                            color: "#fff7ed",
                            backgroundColor: "rgba(255,255,255,0.06)",
                          }}
                        />
                      )}

                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.58)",
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
                      onClick={(e) =>
                        handleOpenMenu(e, Number(day.id))
                      }
                      sx={{
                        color: "#fff7ed",
                        border: "1px solid rgba(255,255,255,0.12)",
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
                          backgroundColor: "#171717",
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "18px",
                          mt: 1,
                        },
                      }}
                    >
                      <MenuItem
                        onClick={() =>
                          navigate(`/admin/workout/day/edit/${day.id}`)
                        }
                      >
                        <EditOutlinedIcon
                          sx={{ mr: 1.2, fontSize: 18 }}
                        />
                        Chỉnh sửa
                      </MenuItem>

                      <MenuItem
                        onClick={() => handleDelete(Number(day.id))}
                        sx={{ color: "#fca5a5" }}
                      >
                        <DeleteOutlineIcon
                          sx={{ mr: 1.2, fontSize: 18 }}
                        />
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
                  sx={{ py: 8, color: "rgba(255,255,255,0.6)" }}
                >
                  {loading
                    ? "Đang tải dữ liệu ngày tập..."
                    : "Chưa có ngày tập nào."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}