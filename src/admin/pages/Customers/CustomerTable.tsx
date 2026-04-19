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
  Block,
  CheckCircle,
  Download,
  KeyboardArrowDown,
  Person,
  Search,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  fetchAllCustomer,
  updateUserStatus,
} from "../../../state/admin/adminUserSlice";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";
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
  { key: "status", label: "Trạng thái" },
  { key: "mainAddress", label: "Địa chỉ mặc định" },
  { key: "allAddresses", label: "Tất cả địa chỉ" },
  { key: "totalAddresses", label: "Số lượng địa chỉ" },
] as const;

type ExportFieldKey = (typeof EXPORT_FIELD_OPTIONS)[number]["key"];
type StatusFilter = (typeof STATUS_OPTIONS)[number]["value"];

const CustomerTable: React.FC = () => {
  const { isDark } = useSiteThemeMode();

  const dispatch = useAppDispatch();
  const { adminUser } = useAppSelector((store) => store);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [selectedExportFields, setSelectedExportFields] = useState<
    ExportFieldKey[]
  >([
    "id",
    "fullName",
    "email",
    "mobile",
    "status",
    "mainAddress",
  ]);

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
    boxShadow: isDark
      ? "0 24px 60px rgba(0,0,0,0.28)"
      : "0 18px 45px rgba(15,23,42,0.08)",
    overflow: "hidden",
  };

  useEffect(() => {
    dispatch(fetchAllCustomer());
  }, [dispatch]);

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    customerId: number
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCustomer(customerId);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedCustomer(null);
  };

  const handleChangeStatus = async (status: string) => {
    if (selectedCustomer !== null) {
      setLoading(true);
      await dispatch(updateUserStatus({ id: selectedCustomer, status }));
      await dispatch(fetchAllCustomer());
      setLoading(false);
    }
    handleCloseMenu();
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const getMainAddress = (customer: any) => {
    const defaultAddress = Array.isArray(customer.addresses)
      ? customer.addresses.find((addr: any) => addr.default)
      : null;

    const fallbackAddress =
      defaultAddress || customer.addresses?.[0] || null;

    if (!fallbackAddress) return "Chưa có địa chỉ";

    return [
      fallbackAddress.streetDetail,
      fallbackAddress.ward,
      fallbackAddress.district,
      fallbackAddress.province,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const getAllAddresses = (customer: any) => {
    if (!Array.isArray(customer.addresses) || !customer.addresses.length) {
      return "";
    }

    return customer.addresses
      .map((addr: any) =>
        [addr.streetDetail, addr.ward, addr.district, addr.province]
          .filter(Boolean)
          .join(", ")
      )
      .join(" | ");
  };

  const getStatusMeta = (status?: string) => {
    if (status === "ACTIVE") {
      return {
        label: "Đang hoạt động",
        color: "#86efac",
        borderColor: "rgba(34,197,94,0.35)",
        backgroundColor: "rgba(34,197,94,0.08)",
      };
    }

    return {
      label: "Đã khóa",
      color: "#fca5a5",
      borderColor: "rgba(239,68,68,0.35)",
      backgroundColor: "rgba(239,68,68,0.08)",
    };
  };

  const filteredCustomers = useMemo(() => {
    const customers = adminUser.customers || [];

    return customers.filter((customer: any) => {
      const fullName = customer.fullName?.toLowerCase() || "";
      const email = customer.email?.toLowerCase() || "";
      const mobile = customer.mobile?.toLowerCase() || "";
      const status = customer.status?.toLowerCase() || "";
      const id = String(customer.id || "");
      const province = customer.addresses?.[0]?.province?.toLowerCase() || "";
      const addressText = Array.isArray(customer.addresses)
        ? customer.addresses
            .map(
              (addr: any) =>
                `${addr.streetDetail || ""} ${addr.ward || ""} ${addr.district || ""} ${addr.province || ""}`
            )
            .join(" ")
            .toLowerCase()
        : "";

      const matchesSearch =
        !normalizedSearch ||
        fullName.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        mobile.includes(normalizedSearch) ||
        status.includes(normalizedSearch) ||
        id.includes(normalizedSearch) ||
        province.includes(normalizedSearch) ||
        addressText.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [adminUser.customers, normalizedSearch, statusFilter]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const maxPage = Math.max(
      0,
      Math.ceil(filteredCustomers.length / rowsPerPage) - 1
    );
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filteredCustomers.length, page, rowsPerPage]);

  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpenExportDialog = () => {
    setOpenExportDialog(true);
  };

  const handleCloseExportDialog = () => {
    setOpenExportDialog(false);
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
    const sourceCustomers = filteredCustomers || [];

    if (!sourceCustomers.length) {
      alert("Không có dữ liệu khách hàng để xuất Excel");
      return;
    }

    if (!selectedExportFields.length) {
      alert("Vui lòng chọn ít nhất một mục để xuất");
      return;
    }

    const exportData = sourceCustomers.map((customer: any) => {
      const row: Record<string, string | number> = {};

      if (selectedExportFields.includes("id")) {
        row["ID"] = customer.id ?? "";
      }

      if (selectedExportFields.includes("fullName")) {
        row["Họ tên"] = customer.fullName ?? "";
      }

      if (selectedExportFields.includes("email")) {
        row["Email"] = customer.email ?? "";
      }

      if (selectedExportFields.includes("mobile")) {
        row["Số điện thoại"] = customer.mobile ?? "";
      }

      if (selectedExportFields.includes("status")) {
        row["Trạng thái"] = getStatusMeta(customer.status).label;
      }

      if (selectedExportFields.includes("mainAddress")) {
        row["Địa chỉ mặc định"] = getMainAddress(customer);
      }

      if (selectedExportFields.includes("allAddresses")) {
        row["Tất cả địa chỉ"] = getAllAddresses(customer);
      }

      if (selectedExportFields.includes("totalAddresses")) {
        row["Số lượng địa chỉ"] = Array.isArray(customer.addresses)
          ? customer.addresses.length
          : 0;
      }

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    worksheet["!cols"] = [
      { wch: 10 },
      { wch: 24 },
      { wch: 32 },
      { wch: 18 },
      { wch: 18 },
      { wch: 42 },
      { wch: 70 },
      { wch: 18 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    const fileName = `customers_${format(
      new Date(),
      "ddMMyyyy_HHmmss"
    )}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    handleCloseExportDialog();
  };

  return (
    <Paper elevation={0} sx={panelSx}>
      {loading && (
        <CustomLoading message="Đang cập nhật trạng thái khách hàng..." />
      )}

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
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography fontSize={26} fontWeight={800} color={TEXT_PRIMARY}>
              Khách hàng
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
              placeholder="Tìm theo tên, email, số điện thoại..."
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

            <Chip
              label={`${filteredCustomers.length} khách hàng`}
              variant="outlined"
              sx={{
                color: TEXT_PRIMARY,
                borderColor: isDark
                  ? "rgba(249,115,22,0.28)"
                  : "rgba(249,115,22,0.22)",
                backgroundColor: isDark
                  ? "rgba(249,115,22,0.06)"
                  : "rgba(255,247,237,0.92)",
                fontWeight: 700,
              }}
            />

            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleOpenExportDialog}
              disabled={!filteredCustomers.length}
              sx={{
                borderRadius: 999,
                px: 2.3,
                textTransform: "none",
                fontWeight: 700,
                color: TEXT_PRIMARY,
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
          </Stack>
        </Stack>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 920 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Khách hàng</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Số điện thoại</StyledTableCell>
              <StyledTableCell>Địa chỉ</StyledTableCell>
              <StyledTableCell align="center">Trạng thái</StyledTableCell>
              <StyledTableCell align="right">Thao tác</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedCustomers.length ? (
              paginatedCustomers.map((customer: any) => {
                const active = customer.status === "ACTIVE";
                const statusMeta = getStatusMeta(customer.status);

                return (
                  <StyledTableRow key={customer.id}>
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
                            bgcolor: active
                              ? "rgba(34,197,94,0.14)"
                              : "rgba(239,68,68,0.12)",
                            color: active ? "#86efac" : "#fca5a5",
                          }}
                        >
                          <Person />
                        </Avatar>

                        <Box>
                          <Typography fontWeight={700} color={TEXT_PRIMARY}>
                            {customer.fullName || "Chưa có tên"}
                          </Typography>
                          <Typography
                            sx={{
                              color: TEXT_MUTED,
                              fontSize: 12.5,
                            }}
                          >
                            ID: #{customer.id}
                          </Typography>
                        </Box>
                      </Box>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Typography color={TEXT_PRIMARY}>
                        {customer.email || "-"}
                      </Typography>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Typography color={TEXT_PRIMARY}>
                        {customer.mobile || "-"}
                      </Typography>
                    </StyledTableCell>

                    <StyledTableCell sx={{ maxWidth: 280 }}>
                      <Typography
                        color={TEXT_SECONDARY}
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {getMainAddress(customer)}
                      </Typography>
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Chip
                        size="small"
                        label={statusMeta.label}
                        sx={{
                          borderRadius: 999,
                          fontWeight: 700,
                          color: statusMeta.color,
                          border: "1px solid",
                          borderColor: statusMeta.borderColor,
                          backgroundColor: statusMeta.backgroundColor,
                        }}
                      />
                    </StyledTableCell>

                    <StyledTableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={active ? <Block /> : <CheckCircle />}
                        endIcon={<KeyboardArrowDown />}
                        onClick={(e) => handleOpenMenu(e, customer.id)}
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
                );
              })
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
                    ? "Không tìm thấy khách hàng phù hợp."
                    : "Chưa có khách hàng nào."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredCustomers.length}
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
          <CheckCircle sx={{ fontSize: 18, color: "#22c55e", mr: 1 }} />
          Mở khóa tài khoản
        </MenuItem>
        <MenuItem onClick={() => handleChangeStatus("BANNED")}>
          <Block sx={{ fontSize: 18, color: "#ef4444", mr: 1 }} />
          Khóa tài khoản
        </MenuItem>
      </Menu>

      <Dialog
        open={openExportDialog}
        onClose={handleCloseExportDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {

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
            onClick={handleCloseExportDialog}
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
    </Paper>
  );
};

export default CustomerTable;