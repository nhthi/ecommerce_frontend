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
  deleteWorkoutPlan,
  fetchAllWorkoutPlans,
} from "../../../state/admin/adminWorkoutPlanSlice";
import { WorkoutPlan } from "../../../types/WorkoutPlanType";

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

export default function WorkoutPlanTable() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { workoutPlans, loading } = useAppSelector(
    (store) => store.adminWorkoutPlan
  );

  const [menuState, setMenuState] = React.useState<{
    anchorEl: HTMLElement | null;
    workoutPlanId: number | null;
  }>({
    anchorEl: null,
    workoutPlanId: null,
  });

  React.useEffect(() => {
    dispatch(fetchAllWorkoutPlans());
  }, [dispatch]);

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    workoutPlanId: number
  ) => {
    setMenuState({ anchorEl: event.currentTarget, workoutPlanId });
  };

  const handleCloseMenu = () => {
    setMenuState({ anchorEl: null, workoutPlanId: null });
  };

  const handleDelete = async (id: number) => {
    await dispatch(deleteWorkoutPlan(id));
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
            Quản lý chương trình tập
          </Typography>
          <Typography
            sx={{
              mt: 0.7,
              color: "rgba(255,255,255,0.62)",
              fontSize: 14.5,
            }}
          >
            Theo dõi chương trình tập theo mục tiêu, cấp độ, số buổi tập và trạng
            thái phát hành.
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
          onClick={() => navigate("/admin/workout/plan/create")}
        >
          Thêm chương trình tập
        </Button>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 1100 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Chương trình</StyledTableCell>
              <StyledTableCell>Mục tiêu</StyledTableCell>
              <StyledTableCell align="center">Cấp độ</StyledTableCell>
              <StyledTableCell align="center">Thời lượng</StyledTableCell>
              <StyledTableCell align="center">Số buổi/tuần</StyledTableCell>
              <StyledTableCell align="center">Trạng thái</StyledTableCell>
              <StyledTableCell align="right">Thao tác</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {workoutPlans?.length ? (
              workoutPlans.map((plan: WorkoutPlan) => (
                <StyledTableRow key={plan.id}>
                  <StyledTableCell>
                    <Typography fontWeight={700}>{plan.name}</Typography>
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.58)",
                        fontSize: 13,
                        mt: 0.6,
                        maxWidth: 380,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {plan.description || "Chưa có mô tả"}
                    </Typography>
                  </StyledTableCell>

                  <StyledTableCell>
                    {plan.goal || "-"}
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    {plan.level || "-"}
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    {plan.durationWeeks
                      ? `${plan.durationWeeks} tuần`
                      : "-"}
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    <Stack
                      direction="row"
                      spacing={0.8}
                      justifyContent="center"
                      flexWrap="wrap"
                    >
                      <Chip
                        size="small"
                        label={plan.daysPerWeek || 0}
                        sx={{
                          borderRadius: 999,
                          color: "#fdba74",
                          backgroundColor:
                            "rgba(249,115,22,0.08)",
                          fontWeight: 700,
                        }}
                      />
                      {plan.isTemplate && (
                        <Chip
                          size="small"
                          label="Mẫu"
                          sx={{
                            borderRadius: 999,
                            color: "#fff7ed",
                            backgroundColor:
                              "rgba(255,255,255,0.06)",
                          }}
                        />
                      )}
                    </Stack>
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    <Chip
                      size="small"
                      label={plan.status || "Bản nháp"}
                      sx={{
                        borderRadius: 999,
                        color: "#fdba74",
                        border:
                          "1px solid rgba(249,115,22,0.26)",
                        backgroundColor:
                          "rgba(249,115,22,0.08)",
                      }}
                    />
                  </StyledTableCell>

                  <StyledTableCell align="right">
                    <IconButton
                      onClick={(e) =>
                        handleOpenMenu(e, Number(plan.id))
                      }
                      sx={{
                        color: "#fff7ed",
                        border:
                          "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      <MoreHorizIcon />
                    </IconButton>

                    <Menu
                      anchorEl={menuState.anchorEl}
                      open={menuState.workoutPlanId === plan.id}
                      onClose={handleCloseMenu}
                      PaperProps={{
                        sx: {
                          backgroundColor: "#171717",
                          color: "white",
                          border:
                            "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "18px",
                          mt: 1,
                        },
                      }}
                    >
                      <MenuItem
                        onClick={() =>
                          navigate(
                            `/admin/workout/plan/edit/${plan.id}`
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
                          handleDelete(Number(plan.id))
                        }
                        sx={{ color: "#fca5a5" }}
                      >
                        <DeleteOutlineIcon
                          sx={{ mr: 1.2, fontSize: 18 }}
                        />
                        Xóa chương trình
                      </MenuItem>
                    </Menu>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{
                    py: 8,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {loading
                    ? "Đang tải danh sách chương trình tập..."
                    : "Chưa có chương trình tập nào."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}