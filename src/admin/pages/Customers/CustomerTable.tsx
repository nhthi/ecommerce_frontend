import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Menu,
  MenuItem,
  Paper,
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
import { Block, KeyboardArrowDown, Person } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchAllCustomer, updateUserStatus } from "../../../state/admin/adminUserSlice";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";

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
    <Paper elevation={0} sx={panelSx}>
      {loading && <CustomLoading message="Đang cập nhật trạng thái khách hàng..." />}

      <Box
        sx={{
          px: 3,
          py: 3,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography fontSize={26} fontWeight={800} color="white">
          Khách hàng
        </Typography>

        <Typography
          sx={{
            mt: 0.7,
            color: "rgba(255,255,255,0.62)",
            fontSize: 14.5,
          }}
        >
          Theo dõi tài khoản đang hoạt động, khóa tài khoản khi cần và xem nhanh địa chỉ giao hàng mặc định.
        </Typography>
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
            {adminUser.customers?.length ? (
              adminUser.customers.map((customer: any) => {
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
                          <Typography fontWeight={700}>
                            {customer.fullName}
                          </Typography>
                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.52)",
                              fontSize: 12.5,
                            }}
                          >
                            ID #{customer.id}
                          </Typography>
                        </Box>
                      </Box>
                    </StyledTableCell>

                    <StyledTableCell>{customer.email}</StyledTableCell>
                    <StyledTableCell>
                      {customer.mobile || "-"}
                    </StyledTableCell>
                    <StyledTableCell>
                      {customer.addresses?.[0]?.province ||
                        "Chưa có địa chỉ"}
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
                        onClick={(e) =>
                          handleOpenMenu(e, customer.id || 0)
                        }
                        sx={{
                          textTransform: "none",
                          borderRadius: 999,
                          px: 2,
                          color: "#fff7ed",
                          borderColor: "rgba(255,255,255,0.16)",
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
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  Chưa có khách hàng nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <Box
        sx={{
          px: 3,
          py: 2.2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 13.5,
          }}
        >
          {adminUser.customers?.length || 0} tài khoản khách hàng trong hệ thống
        </Typography>

        <Chip
          icon={<Block sx={{ color: "#fb923c !important" }} />}
          label="Kiểm soát tài khoản nhanh"
          variant="outlined"
          sx={{
            color: "#fff7ed",
            borderColor: "rgba(249,115,22,0.28)",
          }}
        />
      </Box>

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