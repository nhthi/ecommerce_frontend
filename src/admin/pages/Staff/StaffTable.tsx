import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
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
  Download,
  KeyboardArrowDown,
  PersonAddAlt1,
  Search,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { format } from "date-fns";
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

const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "ACTIVE", label: "Đang hoạt động" },
  { value: "BANNED", label: "Đã khóa" },
] as const;

const EXPORT_FIELD_OPTIONS = [
  { key: "id", label: "ID" },
  { key: "fullName", label: "Họ tên" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Số điện thoại" },
  { key: "role", label: "Vai trò" },
  { key: "status", label: "Trạng thái" },
] as const;

type ExportFieldKey = (typeof EXPORT_FIELD_OPTIONS)[number]["key"];
type StatusFilter = (typeof STATUS_OPTIONS)[number]["value"];

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

const getStatusLabel = (status?: string) => {
  return status === "ACTIVE" ? "Đang hoạt động" : "Đã khóa";
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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [selectedExportFields, setSelectedExportFields] = useState<
    ExportFieldKey[]
  >(["id", "fullName", "email", "mobile", "role", "status"]);

  const TEXT_PRIMARY = isDark ? "#fff7ed" : "#111827";
  const TEXT_SECONDARY = isDark
    ? "rgba(255,255,255,0.62)"
    : "rgba(17,24,39,0.68)";
  const TEXT_MUTED = isDark
    ? "rgba(255,255,255,0.52)"
    : "rgba(17,24,39,0.52)";
  const BORDER_SOFT = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(15,23,42,0.08)";

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
    () => (adminUser.staffs || []).filter((item) => item.status === "ACTIVE").length,
    [adminUser.staffs]
  );

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredStaffs = useMemo(() => {
    const staffs = adminUser.staffs || [];

    return staffs.filter((staff: User) => {
      const fullName = staff.fullName?.toLowerCase() || "";
      const email = staff.email?.toLowerCase() || "";
      const mobile = staff.mobile?.toLowerCase() || "";
      const role = staff.role?.toLowerCase() || "";
      const status = staff.status?.toLowerCase() || "";
      const id = String(staff.id || "");

      const matchesSearch =
        !normalizedSearch ||
        fullName.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        mobile.includes(normalizedSearch) ||
        role.includes(normalizedSearch) ||
        status.includes(normalizedSearch) ||
        id.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" || staff.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [adminUser.staffs, normalizedSearch, statusFilter]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, statusFilter]);

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

  const handleToggleExportField = (field: ExportFieldKey) => {
    setSelectedExportFields((prev) =>
      prev.includes(field)
        ? prev.filter((item) => item !== field)
        : [...prev, field]
    );
  };

  const handleSelectAllExportFields = () => {
    setSelectedExportFields(EXPORT_FIELD_OPTIONS.map((item) => item.key));
  };

  const handleClearAllExportFields = () => {
    setSelectedExportFields([]);
  };

  const handleExportExcel = () => {
    const sourceStaffs = filteredStaffs || [];

    if (!sourceStaffs.length) {
      alert("Không có dữ liệu nhân viên để xuất Excel");
      return;
    }

    if (!selectedExportFields.length) {
      alert("Vui lòng chọn ít nhất một mục để xuất");
      return;
    }

    const exportData = sourceStaffs.map((staff: User) => {
      const row: Record<string, string | number> = {};

      if (selectedExportFields.includes("id")) {
        row["ID"] = staff.id ?? "";
      }

      if (selectedExportFields.includes("fullName")) {
        row["Họ tên"] = staff.fullName ?? "";
      }

      if (selectedExportFields.includes("email")) {
        row["Email"] = staff.email ?? "";
      }

      if (selectedExportFields.includes("mobile")) {
        row["Số điện thoại"] = staff.mobile ?? "";
      }

      if (selectedExportFields.includes("role")) {
        row["Vai trò"] = staff.role ?? "";
      }

      if (selectedExportFields.includes("status")) {
        row["Trạng thái"] = getStatusLabel(staff.status);
      }

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    worksheet["!cols"] = [
      { wch: 10 },
      { wch: 24 },
      { wch: 30 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Staffs");

    const fileName = `staffs_${format(new Date(), "ddMMyyyy_HHmmss")}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    setOpenExportDialog(false);
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
              flexWrap="wrap"
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

              <TextField
                select
                size="small"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                sx={{
                  minWidth: { xs: "100%", sm: 190 },
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
                  "& .MuiSvgIcon-root": {
                    color: "#fb923c",
                  },
                }}
              >
                {STATUS_OPTIONS.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>


              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => setOpenExportDialog(true)}
                disabled={!filteredStaffs.length}
                sx={{
                  borderRadius: 999,
                  px: 2.3,
                  textTransform: "none",
                  fontWeight: 700,
                  color: "TEXT_PRIMARY",
                  borderColor: isDark
                    ? "rgba(249,115,22,0.28)"
                    : "rgba(249,115,22,0.22)",
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.02)"
                    : "rgba(255,255,255,0.72)",
                  "&:hover": {
                    borderColor: "rgba(249,115,22,0.45)",
                    backgroundColor: isDark
                      ? "rgba(249,115,22,0.08)"
                      : "rgba(255,247,237,0.92)",
                  },
                }}
              >
                Xuất Excel
              </Button>

              <Button
                variant="contained"
                onClick={() => setDialogOpen(true)}
                sx={{
                  borderRadius: 999,
                  px: 2.5,
                  textTransform: "none",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                  boxShadow: "none",
                  "&:hover": {
                    background: "linear-gradient(135deg, #ea580c, #c2410c)",
                    boxShadow: "none",
                  },
                }}
              >
                <span className="text-slate-100">Thêm nhân viên</span>
                
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
                <StyledTableCell align="right">Thao tác</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedStaffs.length ? (
                paginatedStaffs.map((staff: User) => (
                  <StyledTableRow key={staff.id}>
                    <StyledTableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          minWidth: 220,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor:
                              staff.status === "ACTIVE"
                                ? "rgba(34,197,94,0.14)"
                                : "rgba(239,68,68,0.12)",
                            color:
                              staff.status === "ACTIVE" ? "#86efac" : "#fca5a5",
                          }}
                        >
                          <AdminPanelSettings />
                        </Avatar>

                        <Box>
                          <Typography fontWeight={700} color={TEXT_PRIMARY}>
                            {staff.fullName || "Chưa có tên"}
                          </Typography>
                          <Typography
                            sx={{
                              color: TEXT_MUTED,
                              fontSize: 12.5,
                            }}
                          >
                            ID: #{staff.id}
                          </Typography>
                        </Box>
                      </Box>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Typography color={TEXT_PRIMARY}>
                        {staff.email || "-"}
                      </Typography>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Typography color={TEXT_PRIMARY}>
                        {staff.mobile || "-"}
                      </Typography>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Typography color={TEXT_SECONDARY} fontWeight={600}>
                        {staff.role || "-"}
                      </Typography>
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Chip
                        size="small"
                        label={getStatusLabel(staff.status)}
                        sx={{
                          borderRadius: 999,
                          fontWeight: 700,
                          border: "1px solid",
                          ...getStatusChipSx(staff.status),
                        }}
                      />
                    </StyledTableCell>

                    <StyledTableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        endIcon={<KeyboardArrowDown />}
                        onClick={(e) => handleOpenMenu(e, staff.id!)}
                        sx={{
                          textTransform: "none",
                          borderRadius: 999,
                          px: 2,
                          color: TEXT_PRIMARY,
                          borderColor: BORDER_SOFT,
                          backgroundColor: isDark
                            ? "transparent"
                            : "rgba(255,255,255,0.68)",
                        }}
                      >
                        Cập nhật
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      py: 7,
                      color: TEXT_SECONDARY,
                    }}
                  >
                    {searchTerm || statusFilter !== "ALL"
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
      </Paper>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
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
        <MenuItem onClick={() => handleChangeStatus("ACTIVE")}>
          Mở khóa tài khoản
        </MenuItem>
        <MenuItem onClick={() => handleChangeStatus("BANNED")}>
          Khóa tài khoản
        </MenuItem>
      </Menu>

      <Dialog
        open={openExportDialog}
        onClose={() => setOpenExportDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            background: isDark
              ? "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(10,10,10,0.99))"
              : "linear-gradient(180deg, #ffffff, #fff7ed)",
            color: isDark ? "white" : "#111827",
            borderRadius: "24px",
            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(15,23,42,0.08)",
            boxShadow: isDark
              ? "0 24px 60px rgba(0,0,0,0.28)"
              : "0 18px 45px rgba(15,23,42,0.08)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: isDark ? "white" : "#111827",
            pb: 1,
          }}
        >
          Chọn các mục muốn xuất Excel
        </DialogTitle>

        <DialogContent sx={{ pt: "8px !important" }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 1.8, flexWrap: "wrap", rowGap: 1 }}
          >
            <Button
              variant="outlined"
              onClick={handleSelectAllExportFields}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                color: TEXT_PRIMARY,
                borderColor: BORDER_SOFT,
              }}
            >
              Chọn tất cả
            </Button>

            <Button
              variant="outlined"
              onClick={handleClearAllExportFields}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                color: TEXT_PRIMARY,
                borderColor: BORDER_SOFT,
              }}
            >
              Bỏ chọn tất cả
            </Button>
          </Stack>

          <FormGroup>
            {EXPORT_FIELD_OPTIONS.map((field) => (
              <FormControlLabel
                key={field.key}
                control={
                  <Checkbox
                    checked={selectedExportFields.includes(field.key)}
                    onChange={() => handleToggleExportField(field.key)}
                    sx={{
                      color: "rgba(249,115,22,0.6)",
                      "&.Mui-checked": {
                        color: "#f97316",
                      },
                    }}
                  />
                }
                label={field.label}
                sx={{
                  color: TEXT_PRIMARY,
                  ".MuiFormControlLabel-label": {
                    fontSize: 14.5,
                  },
                }}
              />
            ))}
          </FormGroup>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenExportDialog(false)}
            sx={{
              textTransform: "none",
              color: isDark ? "rgba(255,255,255,0.72)" : "rgba(17,24,39,0.72)",
              backgroundColor: isDark
                ? "transparent"
                : "rgba(255,255,255,0.68)",
              borderRadius: 999,
            }}
          >
            Hủy
          </Button>

          <Button
            onClick={handleExportExcel}
            variant="contained"
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 2.8,
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              boxShadow: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #ea580c, #c2410c)",
                boxShadow: "none",
              },
            }}
          >
<span className="text-slate-100"><Download /> Xuất file</span>
          </Button>
        </DialogActions>
      </Dialog>

      <AddStaffForm open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
};

export default StaffTable;