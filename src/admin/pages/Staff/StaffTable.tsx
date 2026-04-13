import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
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
import {
  AdminPanelSettings,
  KeyboardArrowDown,
  PersonAddAlt1,
  Search,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  fetchAllStaff,
  updateUserStatus,
} from "../../../state/admin/adminUserSlice";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";
import { User } from "../../../types/UserType";
import AddStaffForm from "./AddStaffForm";
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
  const { isDark } = useSiteThemeMode();

  const dispatch = useAppDispatch();
  const { adminUser } = useAppSelector((store) => store);

  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const TEXT_PRIMARY = isDark ? "#fff7ed" : "#111827";
  const TEXT_SECONDARY = isDark
    ? "rgba(255,255,255,0.62)"
    : "rgba(17,24,39,0.68)";
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

  useEffect(() => {
    dispatch(fetchAllStaff());
  }, [dispatch]);

  const activeCount = useMemo(
    () => adminUser.staffs.filter((item) => item.status === "ACTIVE").length,
    [adminUser.staffs]
  );

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredStaffs = useMemo(() => {
    const staffs = adminUser.staffs || [];

    if (!normalizedSearch) return staffs;

    return staffs.filter((staff: User) => {
      const fullName = staff.fullName?.toLowerCase() || "";
      const email = staff.email?.toLowerCase() || "";
      const mobile = staff.mobile?.toLowerCase() || "";
      const role = staff.role?.toLowerCase() || "";
      const status = staff.status?.toLowerCase() || "";
      const id = String(staff.id || "");

      return (
        fullName.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        mobile.includes(normalizedSearch) ||
        role.includes(normalizedSearch) ||
        status.includes(normalizedSearch) ||
        id.includes(normalizedSearch)
      );
    });
  }, [adminUser.staffs, normalizedSearch]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  useEffect(() => {
    const maxPage = Math.max(
      0,
      Math.ceil(filteredStaffs.length / rowsPerPage) - 1
    );
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filteredStaffs.length, page, rowsPerPage]);

  const paginatedStaffs = filteredStaffs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    staffId: number
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
        {loading && <CustomLoading message="Đang xử lý tài khoản nhân viên..." />}

        <Box
          sx={{
            px: 3,
            py: 3,
            borderBottom: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(15,23,42,0.08)",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontSize={26} fontWeight={800} color={TEXT_PRIMARY}>
                Nhân viên
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.2}
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <TextField
                size="small"
                placeholder="Tìm theo tên, email, vai trò..."
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
                      <Search sx={{ color: "#fb923c", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Chip
                icon={
                  <AdminPanelSettings sx={{ color: "#fb923c !important" }} />
                }
                label={`${activeCount}/${adminUser.staffs.length} đang hoạt động`}
                variant="outlined"
                sx={{
                  color: TEXT_PRIMARY,
                  borderColor: "rgba(249,115,22,0.28)",
                  backgroundColor: isDark
                    ? "transparent"
                    : "rgba(255,255,255,0.68)",
                }}
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
                Thêm nhân viên
              </Button>
            </Stack>
          </Stack>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Nhân viên</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Số điện thoại</StyledTableCell>
                <StyledTableCell>Vai trò</StyledTableCell>
                <StyledTableCell align="center">Trạng thái</StyledTableCell>
                <StyledTableCell align="right">Tác vụ</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedStaffs.length ? (
                paginatedStaffs.map((staff: User) => (
                  <StyledTableRow key={staff.id}>
                    <StyledTableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "rgba(249,115,22,0.14)",
                            color: "#fb923c",
                          }}
                        >
                          <AdminPanelSettings />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={700} color={TEXT_PRIMARY}>
                            {staff.fullName || "Nhân viên"}
                          </Typography>
                          <Typography
                            sx={{ color: TEXT_MUTED, fontSize: 12.5 }}
                          >
                            ID #{staff.id}
                          </Typography>
                        </Box>
                      </Box>
                    </StyledTableCell>

                    <StyledTableCell>{staff.email}</StyledTableCell>
                    <StyledTableCell>{staff.mobile || "-"}</StyledTableCell>
                    <StyledTableCell>
                      {staff.role || "ROLE_STAFF"}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Chip
                        size="small"
                        variant="outlined"
                        label={staff.status === "ACTIVE" ? "Hoạt động" : "Đã khóa"}
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
                          color: TEXT_PRIMARY,
                          borderColor: isDark
                            ? "rgba(255,255,255,0.16)"
                            : "rgba(15,23,42,0.12)",
                          backgroundColor: isDark
                            ? "transparent"
                            : "rgba(255,255,255,0.68)",
                        }}
                      >
                        Trạng thái
                      </Button>
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
                    {searchTerm
                      ? "Không tìm thấy nhân viên phù hợp."
                      : "Chưa có nhân viên nào."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredStaffs.length}
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

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
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
          <MenuItem onClick={() => handleChangeStatus("ACTIVE")}>
            Mở khóa / Hoạt động
          </MenuItem>
          <MenuItem onClick={() => handleChangeStatus("BANNED")}>
            Khóa tài khoản
          </MenuItem>
        </Menu>
      </Paper>

      <AddStaffForm open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
};

export default StaffTable;