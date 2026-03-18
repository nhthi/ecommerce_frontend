import { Add, Check, Close, DeleteOutline, LocalOffer } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  Select,
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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchAllCoupons } from "../../../state/admin/adminCouponSlice";
import { formatCurrencyVND } from "../../../utils/formatCurrencyVND";

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
  background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
  overflow: "hidden",
};

const Coupon = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { coupon } = useAppSelector((store) => store);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAllCoupons());
  }, [dispatch]);

  const filteredCoupons = coupon.coupons?.filter((item) => {
    if (statusFilter === "all") return true;
    return statusFilter === "active" ? item.active : !item.active;
  }) || [];

  return (
    <Paper elevation={0} sx={panelSx}>
      <Box sx={{ px: 3, py: 3, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography fontSize={26} fontWeight={800} color="white">Ma giam gia</Typography>
            <Typography sx={{ mt: 0.7, color: "rgba(255,255,255,0.62)", fontSize: 14.5 }}>
              Quan ly coupon theo gia tri don, han su dung va trang thai kich hoat.
            </Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} alignItems="center">
            <Select
              size="small"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              sx={{
                minWidth: 180,
                color: "white",
                borderRadius: "16px",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.12)" },
                "& .MuiSvgIcon-root": { color: "#fb923c" },
              }}
            >
              <MenuItem value="all">Tat ca</MenuItem>
              <MenuItem value="active">Dang hoat dong</MenuItem>
              <MenuItem value="inactive">Ngung hoat dong</MenuItem>
            </Select>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/admin/add-coupon")}
              sx={{ borderRadius: 999, textTransform: "none", px: 2.5, background: "linear-gradient(135deg, #f97316, #ea580c)" }}
            >
              Tao coupon moi
            </Button>
          </Stack>
        </Stack>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 980 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Ten</StyledTableCell>
              <StyledTableCell>Ma</StyledTableCell>
              <StyledTableCell>Bat dau</StyledTableCell>
              <StyledTableCell>Ket thuc</StyledTableCell>
              <StyledTableCell align="right">Don toi thieu</StyledTableCell>
              <StyledTableCell align="right">Don toi da</StyledTableCell>
              <StyledTableCell align="center">Giam</StyledTableCell>
              <StyledTableCell align="center">Trang thai</StyledTableCell>
              <StyledTableCell align="right">Tac vu</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCoupons.length ? filteredCoupons.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <LocalOffer sx={{ color: "#fb923c" }} />
                    <Box>
                      <Typography fontWeight={700}>{row.name}</Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.52)", fontSize: 12.5 }}>ID #{row.id}</Typography>
                    </Box>
                  </Stack>
                </StyledTableCell>
                <StyledTableCell>{row.code}</StyledTableCell>
                <StyledTableCell>{row.validityStartDate}</StyledTableCell>
                <StyledTableCell>{row.validityEndDate}</StyledTableCell>
                <StyledTableCell align="right">{formatCurrencyVND(row.minimumOrderValue)}</StyledTableCell>
                <StyledTableCell align="right">{formatCurrencyVND(row.maximumOrderValue)}</StyledTableCell>
                <StyledTableCell align="center">
                  <Chip size="small" label={`${row.discountPercentage}%`} sx={{ color: "#fff7ed", backgroundColor: "rgba(249,115,22,0.12)" }} />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Chip
                    size="small"
                    variant="outlined"
                    label={row.active ? "Dang hoat dong" : "Ngung hoat dong"}
                    icon={row.active ? <Check fontSize="small" /> : <Close fontSize="small" />}
                    sx={{
                      borderRadius: 999,
                      color: row.active ? "#86efac" : "#d4d4d8",
                      borderColor: row.active ? "rgba(34,197,94,0.35)" : "rgba(161,161,170,0.25)",
                      backgroundColor: row.active ? "rgba(34,197,94,0.08)" : "rgba(161,161,170,0.08)",
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton size="small" sx={{ color: "#fca5a5" }}>
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 8, color: "rgba(255,255,255,0.6)" }}>
                  Chua co coupon nao.
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
