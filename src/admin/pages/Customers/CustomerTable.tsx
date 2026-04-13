import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
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
import { Block, KeyboardArrowDown, Person, Search } from "@mui/icons-material";
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

const CustomerTable: React.FC = () => {
  const { isDark } = useSiteThemeMode();

  const dispatch = useAppDispatch();
  const { adminUser } = useAppSelector((store) => store);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
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

  const filteredCustomers = useMemo(() => {
    const customers = adminUser.customers || [];

    if (!normalizedSearch) return customers;

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

      return (
        fullName.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        mobile.includes(normalizedSearch) ||
        status.includes(normalizedSearch) ||
        id.includes(normalizedSearch) ||
        province.includes(normalizedSearch) ||
        addressText.includes(normalizedSearch)
      );
    });
  }, [adminUser.customers, normalizedSearch]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

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
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Box>
            <Typography fontSize={26} fontWeight={800} color={TEXT_PRIMARY}>
              Khách hàng
            </Typography>
          </Box>

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
        </Box>
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

                return (
                  <StyledTableRow key={customer.id}>
                    <StyledTableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "rgba(249,115,22,0.14)",
                            color: "#fb923c",
                          }}
                        >
                          <Person />
                        </Avatar>

                        <Box>
                          <Typography fontWeight={700} color={TEXT_PRIMARY}>
                            {customer.fullName}
                          </Typography>
                          <Typography
                            sx={{
                              color: TEXT_MUTED,
                              fontSize: 12.5,
                            }}
                          >
                            ID #{customer.id}
                          </Typography>
                        </Box>
                      </Box>
                    </StyledTableCell>

                    <StyledTableCell>{customer.email}</StyledTableCell>

                    <StyledTableCell>{customer.mobile || "-"}</StyledTableCell>

                    <StyledTableCell>
                      {customer.addresses?.[0]?.province || "Chưa có địa chỉ"}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Chip
                        size="small"
                        variant="outlined"
                        label={active ? "Hoạt động" : "Đã khóa"}
                        sx={{
                          borderRadius: 999,
                          color: active ? "#86efac" : "#fca5a5",
                          borderColor: active
                            ? "rgba(34,197,94,0.35)"
                            : "rgba(239,68,68,0.35)",
                          backgroundColor: active
                            ? "rgba(34,197,94,0.08)"
                            : "rgba(239,68,68,0.08)",
                        }}
                      />
                    </StyledTableCell>

                    <StyledTableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        endIcon={<KeyboardArrowDown />}
                        onClick={(e) => handleOpenMenu(e, customer.id || 0)}
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
                        Thay đổi trạng thái
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
                    py: 8,
                    color: TEXT_SECONDARY,
                  }}
                >
                  {searchTerm
                    ? "Không tìm thấy khách hàng phù hợp."
                    : "Chưa có khách hàng nào."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider
        sx={{
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(15,23,42,0.08)",
        }}
      />

      <Box
        sx={{
          px: 3,
          py: 2.2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Typography
          sx={{
            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(17,24,39,0.5)",
            fontSize: 13.5,
          }}
        >
          {filteredCustomers.length} tài khoản khách hàng trong hệ thống
        </Typography>

        <Chip
          icon={<Block sx={{ color: "#fb923c !important" }} />}
          label="Kiểm soát tài khoản nhanh"
          variant="outlined"
          sx={{
            color: TEXT_PRIMARY,
            borderColor: "rgba(249,115,22,0.28)",
            backgroundColor: isDark ? "transparent" : "rgba(255,255,255,0.68)",
          }}
        />
      </Box>

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
          Hoạt động
        </MenuItem>
        <MenuItem onClick={() => handleChangeStatus("BANNED")}>
          Khóa tài khoản
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default CustomerTable;