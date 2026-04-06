import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
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
import {
  AdminPanelSettings,
  KeyboardArrowDown,
  PersonAddAlt1,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  fetchAllStaff,
  updateUserStatus,
} from "../../../state/admin/adminUserSlice";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";
import { User } from "../../../types/UserType";
import AddStaffForm from "./AddStaffForm";

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

const getStatusChipSx = (status?: string) => {
  if (status === "ACTIVE") {
    return {
      color: "#86efac",
      borderColor: "rgba(34,197,94,0.35)",
      backgroundColor: "rgba(34,197,94,0.08)",
    };
  }

  return {
    color: "#fca5a5",
    borderColor: "rgba(239,68,68,0.35)",
    backgroundColor: "rgba(239,68,68,0.08)",
  };
};

const StaffTable = () => {
  const dispatch = useAppDispatch();
  const { adminUser } = useAppSelector((store) => store);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllStaff());
  }, [dispatch]);

  const activeCount = useMemo(
    () => adminUser.staffs.filter((item) => item.status === "ACTIVE").length,
    [adminUser.staffs],
  );

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    staffId: number,
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedStaffId(staffId);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedStaffId(null);
  };

  const handleChangeStatus = async (status: string) => {
    if (!selectedStaffId) return;
    setLoading(true);
    await dispatch(updateUserStatus({ id: selectedStaffId, status }));
    await dispatch(fetchAllStaff());
    setLoading(false);
    handleCloseMenu();
  };

  return (
    <>
      <Paper elevation={0} sx={panelSx}>
        {loading && <CustomLoading message="Dang xu ly tai khoan nhan vien..." />}

        <Box sx={{ px: 3, py: 3, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography fontSize={26} fontWeight={800} color="white">
                Nhan vien
              </Typography>
              <Typography sx={{ mt: 0.7, color: "rgba(255,255,255,0.62)", fontSize: 14.5 }}>
                Quan ly tai khoan noi bo, them nhan vien moi va khoa tai khoan khi can.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.2} alignItems="center">
              <Chip
                icon={<AdminPanelSettings sx={{ color: "#fb923c !important" }} />}
                label={`${activeCount}/${adminUser.staffs.length} dang hoat dong`}
                variant="outlined"
                sx={{ color: "#fff7ed", borderColor: "rgba(249,115,22,0.28)" }}
              />
              <Button
                variant="contained"
                startIcon={<PersonAddAlt1 />}
                onClick={() => setDialogOpen(true)}
                sx={{
                  borderRadius: 999,
                  px: 2.5,
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#111111",
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                }}
              >
                Them nhan vien
              </Button>
            </Stack>
          </Stack>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Nhan vien</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>So dien thoai</StyledTableCell>
                <StyledTableCell>Vai tro</StyledTableCell>
                <StyledTableCell align="center">Trang thai</StyledTableCell>
                <StyledTableCell align="right">Tac vu</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {adminUser.staffs?.length ? (
                adminUser.staffs.map((staff: User) => (
                  <StyledTableRow key={staff.id}>
                    <StyledTableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: "rgba(249,115,22,0.14)", color: "#fb923c" }}>
                          <AdminPanelSettings />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={700}>{staff.fullName || "Nhan vien"}</Typography>
                          <Typography sx={{ color: "rgba(255,255,255,0.52)", fontSize: 12.5 }}>
                            ID #{staff.id}
                          </Typography>
                        </Box>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>{staff.email}</StyledTableCell>
                    <StyledTableCell>{staff.mobile || "-"}</StyledTableCell>
                    <StyledTableCell>{staff.role || "ROLE_STAFF"}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Chip
                        size="small"
                        variant="outlined"
                        label={staff.status === "ACTIVE" ? "Hoat dong" : "Da khoa"}
                        sx={{ borderRadius: 999, ...getStatusChipSx(staff.status) }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        endIcon={<KeyboardArrowDown />}
                        onClick={(e) => handleOpenMenu(e, staff.id || 0)}
                        sx={{
                          textTransform: "none",
                          borderRadius: 999,
                          px: 2,
                          color: "#fff7ed",
                          borderColor: "rgba(255,255,255,0.16)",
                        }}
                      >
                        Trang thai
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8, color: "rgba(255,255,255,0.6)" }}>
                    Chua co nhan vien nao.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
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
          <MenuItem onClick={() => handleChangeStatus("ACTIVE")}>
            Mo khoa / Hoat dong
          </MenuItem>
          <MenuItem onClick={() => handleChangeStatus("BANNED")}>
            Khoa tai khoan
          </MenuItem>
        </Menu>
      </Paper>

      <AddStaffForm open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
};

export default StaffTable;
