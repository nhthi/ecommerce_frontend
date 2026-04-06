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
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { deleteExercise, fetchAllExercises } from "../../../state/admin/adminExerciseSlice";
import { Exercise } from "../../../types/ExerciseType";

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

export default function ExerciseTable() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { exercises, loading } = useAppSelector((store) => store.adminExercise);

  const [menuState, setMenuState] = React.useState<{
    anchorEl: HTMLElement | null;
    exerciseId: number | null;
  }>({
    anchorEl: null,
    exerciseId: null,
  });

  React.useEffect(() => {
    dispatch(fetchAllExercises());
  }, [dispatch]);

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
            Quản lý bài tập
          </Typography>
          <Typography
            sx={{
              mt: 0.7,
              color: "rgba(255,255,255,0.62)",
              fontSize: 14.5,
            }}
          >
            Quản lý thư viện bài tập, nhóm cơ, độ khó và video hướng dẫn.
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
          onClick={() => navigate("/admin/workout/exercise/create")}
        >
          Thêm bài tập
        </Button>
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
            {exercises?.length ? (
              exercises.map((exercise: Exercise) => (
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
                        <Typography fontWeight={700}>
                          {exercise.name}
                        </Typography>
                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.52)",
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
                            color: "#fff7ed",
                            backgroundColor: "rgba(255,255,255,0.06)",
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
                      onClick={(e) =>
                        handleOpenMenu(e, Number(exercise.id))
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
                      open={menuState.exerciseId === exercise.id}
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
                          navigate(
                            `/admin/workout/exercise/edit/${exercise.id}`
                          )
                        }
                      >
                        <EditOutlinedIcon
                          sx={{ mr: 1.2, fontSize: 18 }}
                        />
                        Chỉnh sửa
                      </MenuItem>

                      <MenuItem
                        onClick={() =>
                          handleDelete(Number(exercise.id))
                        }
                        sx={{ color: "#fca5a5" }}
                      >
                        <DeleteOutlineIcon
                          sx={{ mr: 1.2, fontSize: 18 }}
                        />
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
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {loading
                    ? "Đang tải danh sách bài tập..."
                    : "Chưa có bài tập nào."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}