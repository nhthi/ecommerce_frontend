import { Add, Check, Close, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchAllCoupons } from "../../../state/admin/adminCouponSlice";
import { formatCurrencyVND } from "../../../utils/formatCurrencyVND";

const accountStatuses = [
  { status: "PENDING_VERIFICATION", title: "Chờ xác minh", description: "" },
  { status: "ACTIVE", title: "Đang hoạt động", description: "" },
  { status: "SUSPENDED", title: "Tạm khóa", description: "" },
  { status: "DEACTIVATED", title: "Ngừng kích hoạt", description: "" },
  { status: "BANNED", title: "Cấm vĩnh viễn", description: "" },
  { status: "CLOSED", title: "Đã đóng", description: "" },
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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)",
    transform: "translateY(-1px)",
    transition: "all 0.15s ease-in-out",
  },
  transition: "all 0.15s ease-in-out",
}));

const Coupon = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { coupon } = useAppSelector((store) => store);
  const [accountStatus, setAccountStatus] = useState("ACTIVE");

  const handleChange = (event: any) => {
    setAccountStatus(event.target.value);
  };

  useEffect(() => {
    dispatch(fetchAllCoupons());
  }, [dispatch]);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid rgba(148, 163, 184, 0.25)",
        boxShadow: "0 18px 45px rgba(15, 23, 42, 0.13)",
        p: 0,
      }}
    >
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
              Quản lý mã giảm giá
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý mã giảm giá hệ thống: thời gian, giá trị và trạng thái.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="account-status-label">
                Trạng thái tài khoản
              </InputLabel>
              <Select
                labelId="account-status-label"
                id="account-status-select"
                value={accountStatus}
                label="Trạng thái tài khoản"
                onChange={handleChange}
              >
                {accountStatuses.map((status) => (
                  <MenuItem key={status.status} value={status.status}>
                    {status.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/admin/add-coupon")}
              sx={{ borderRadius: 999, textTransform: "none" }}
            >
              Thêm mã giảm giá
            </Button>
          </Stack>
        </Box>
      </Box>

      <Divider />

      {/* Table */}
      <TableContainer>
        <Table sx={{ minWidth: 900 }} aria-label="coupon table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Tên</StyledTableCell>
              <StyledTableCell>Mã giảm giá</StyledTableCell>
              <StyledTableCell>Ngày bắt đầu</StyledTableCell>
              <StyledTableCell>Ngày kết thúc</StyledTableCell>
              <StyledTableCell align="right">
                Giá trị đơn tối thiểu
              </StyledTableCell>
              <StyledTableCell align="right">
                Giá trị đơn tối đa
              </StyledTableCell>
              <StyledTableCell align="right">% Giảm</StyledTableCell>
              <StyledTableCell align="center">Trạng thái</StyledTableCell>
              <StyledTableCell align="center">Xóa</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {coupon.coupons && coupon.coupons.length > 0 ? (
              coupon.coupons.map((row) => {
                const isActive = row.active;

                return (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{row.id}</StyledTableCell>
                    <StyledTableCell>{row.name}</StyledTableCell>
                    <StyledTableCell>{row.code}</StyledTableCell>
                    <StyledTableCell>{row.validityStartDate}</StyledTableCell>
                    <StyledTableCell>{row.validityEndDate}</StyledTableCell>
                    <StyledTableCell align="right">
                      {formatCurrencyVND(row.minimumOrderValue)}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {formatCurrencyVND(row.maximumOrderValue)}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.discountPercentage}%
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Chip
                        size="small"
                        variant="outlined"
                        label={isActive ? "Đang hoạt động" : "Không hoạt động"}
                        color={isActive ? "success" : "default"}
                        icon={
                          isActive ? (
                            <Check fontSize="small" />
                          ) : (
                            <Close fontSize="small" />
                          )
                        }
                        sx={{ borderRadius: 999, fontSize: 11 }}
                      />
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Tooltip title="Xóa mã giảm giá">
                        <IconButton size="small">
                          <Delete color="error" fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Hiện chưa có mã giảm giá nào.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Coupon;
