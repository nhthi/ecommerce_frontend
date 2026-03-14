import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Menu,
  Paper,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
} from "@mui/material";
import { Edit, KeyboardArrowDown } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  fetchAllSellers,
  updateSellerStatus,
} from "../../../state/admin/adminUserSlice";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";

// trạng thái tài khoản (filter)
const accountStatuses = [
  { status: "all", title: "Tất cả", description: "" },
  { status: "PENDING_VERIFICATION", title: "Chờ xác minh", description: "" },
  { status: "ACTIVE", title: "Đang hoạt động", description: "" },
  { status: "BANNED", title: "Bị khóa", description: "" },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: "linear-gradient(90deg, #0052d4, #4364f7, #6fb1fc)",
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderBottomColor: "rgba(148, 163, 184, 0.25)",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)",
    transform: "translateY(-1px)",
    transition: "all 0.15s ease-in-out",
  },
  transition: "all 0.15s ease-in-out",
}));

// màu chip theo trạng thái
const getAccountStatusChipProps = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return { color: "success" as const, variant: "outlined" as const };
    case "PENDING_VERIFICATION":
      return { color: "warning" as const, variant: "outlined" as const };
    case "BANNED":
      return { color: "error" as const, variant: "outlined" as const };
    default:
      return { color: "default" as const, variant: "outlined" as const };
  }
};

const SellerTable = () => {
  const dispatch = useAppDispatch();
  const { adminUser } = useAppSelector((store) => store);

  const [accountStatus, setAccountStatus] = useState("all");
  const [loading, setLoading] = React.useState(false);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null);

  const handleChangeFilterStatus = (event: any) => {
    setAccountStatus(event.target.value);
  };

  useEffect(() => {
    dispatch(fetchAllSellers(accountStatus));
  }, [accountStatus, dispatch]);

  const handleOpenStatusMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    sellerId: number
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedSellerId(sellerId);
  };

  const handleCloseStatusMenu = () => {
    setMenuAnchor(null);
    setSelectedSellerId(null);
  };

  const handleChangeSellerStatus = async (status: string) => {
    if (!selectedSellerId) return;

    setLoading(true);
    await dispatch(updateSellerStatus({ id: selectedSellerId, status }));
    await dispatch(fetchAllSellers(accountStatus));
    setLoading(false);

    handleCloseStatusMenu();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid rgba(148, 163, 184, 0.25)",
        boxShadow: "0 18px 45px rgba(15, 23, 42, 0.13)",
      }}
    >
      {loading && <CustomLoading message="Đang cập nhật..." />}

      {/* Header */}
      <Box sx={{ px: 3, pt: 3, pb: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Quản lý Seller
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Danh sách các seller trên hệ thống và trạng thái tài khoản.
            </Typography>
          </Box>

          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="seller-account-status-label">
              Trạng thái tài khoản
            </InputLabel>

            <Select
              labelId="seller-account-status-label"
              id="seller-account-status-select"
              value={accountStatus}
              label="Trạng thái tài khoản"
              onChange={handleChangeFilterStatus}
            >
              {accountStatuses.map((status) => (
                <MenuItem key={status.status} value={status.status}>
                  {status.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          {adminUser.seller?.length || 0} seller được tìm thấy
        </Typography>
      </Box>

      <Divider />

      {/* Table */}
      <TableContainer>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Tên Seller</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Số điện thoại</StyledTableCell>
              <StyledTableCell>MST (GSTIN)</StyledTableCell>
              <StyledTableCell>Tên doanh nghiệp</StyledTableCell>
              <StyledTableCell align="center">
                Trạng thái tài khoản
              </StyledTableCell>
              <StyledTableCell align="center">Thay đổi</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {adminUser.seller && adminUser.seller.length > 0 ? (
              adminUser.seller.map((row) => {
                const chipProps = getAccountStatusChipProps(
                  row.accountStatus || ""
                );
                return (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{row.id}</StyledTableCell>

                    <StyledTableCell>{row.sellerName}</StyledTableCell>

                    <StyledTableCell>{row.email}</StyledTableCell>
                    <StyledTableCell>{row.mobile}</StyledTableCell>
                    <StyledTableCell>{row.gstin}</StyledTableCell>
                    <StyledTableCell>
                      {row.businessDetails?.businessName}
                    </StyledTableCell>

                    {/* Status chip */}
                    <StyledTableCell align="center">
                      <Chip
                        size="small"
                        label={
                          row.accountStatus === "ACTIVE"
                            ? "Đang hoạt động"
                            : row.accountStatus === "PENDING_VERIFICATION"
                            ? "Chờ xác minh"
                            : row.accountStatus === "BANNED"
                            ? "Bị khóa"
                            : row.accountStatus
                        }
                        {...chipProps}
                        sx={{ borderRadius: 999, fontSize: 11 }}
                      />
                    </StyledTableCell>

                    {/* Change status button */}
                    <StyledTableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        endIcon={<KeyboardArrowDown />}
                        onClick={(e) => handleOpenStatusMenu(e, row.id || 0)}
                        sx={{
                          borderRadius: 999,
                          textTransform: "none",
                          px: 2,
                          fontSize: 13,
                        }}
                      >
                        Thay đổi
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Hiện chưa có seller nào.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Menu đổi trạng thái */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleCloseStatusMenu}
        >
          {accountStatuses
            .filter((s) => s.status !== "all")
            .map((s) => (
              <MenuItem
                key={s.status}
                onClick={() => handleChangeSellerStatus(s.status)}
              >
                {s.title}
              </MenuItem>
            ))}
        </Menu>
      </TableContainer>
    </Paper>
  );
};

export default SellerTable;
