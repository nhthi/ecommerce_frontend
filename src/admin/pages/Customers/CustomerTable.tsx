import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  Divider,
  Menu,
  MenuItem,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  fetchAllCustomer,
  updateUserStatus,
} from "../../../state/admin/adminUserSlice";
import { KeyboardArrowDown } from "@mui/icons-material";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";

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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const CustomerTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { adminUser } = useAppSelector((store) => store);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

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
        <Typography variant="h6" fontWeight={700}>
          Quản lý khách hàng
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Danh sách khách hàng và trạng thái hoạt động của tài khoản.
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          {adminUser.customers?.length || 0} khách hàng được tìm thấy
        </Typography>
      </Box>

      <Divider />

      <TableContainer>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Họ và tên</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Số điện thoại</StyledTableCell>
              <StyledTableCell>Địa chỉ</StyledTableCell>
              <StyledTableCell align="center">Trạng thái</StyledTableCell>
              <StyledTableCell align="center">
                Thay đổi trạng thái
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {adminUser.customers?.length > 0 ? (
              adminUser.customers.map((c) => (
                <StyledTableRow key={c.id}>
                  <StyledTableCell>{c.id}</StyledTableCell>
                  <StyledTableCell>{c.fullName}</StyledTableCell>
                  <StyledTableCell>{c.email}</StyledTableCell>
                  <StyledTableCell>{c.mobile}</StyledTableCell>
                  <StyledTableCell>
                    {c.addresses?.[0]?.province || "-"}
                  </StyledTableCell>

                  {/* STATUS CHIP */}
                  <StyledTableCell align="center">
                    <Chip
                      size="small"
                      label={
                        c.status === "ACTIVE"
                          ? "Hoạt động"
                          : c.status === "BANNED"
                          ? "Đã khóa"
                          : c.status
                      }
                      color={c.status === "ACTIVE" ? "success" : "error"}
                      variant="outlined"
                      sx={{ borderRadius: 999, fontSize: 11 }}
                    />
                  </StyledTableCell>

                  {/* BUTTON */}
                  <StyledTableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => handleOpenMenu(e, c.id || 0)}
                      endIcon={<KeyboardArrowDown />}
                      sx={{
                        textTransform: "none",
                        borderRadius: 999,
                        px: 2,
                      }}
                    >
                      Thay đổi
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    Không có khách hàng nào.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* MENU CHANGE STATUS */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => handleChangeStatus("ACTIVE")}>
            Hoạt động
          </MenuItem>
          <MenuItem onClick={() => handleChangeStatus("BANNED")}>
            Khóa tài khoản
          </MenuItem>
        </Menu>
      </TableContainer>
    </Paper>
  );
};

export default CustomerTable;
