import {
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
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
import { KeyboardArrowDown, Storefront } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchAllSellers, updateSellerStatus } from "../../../state/admin/adminUserSlice";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";

const accountStatuses = [
  { status: "all", title: "Tat ca" },
  { status: "PENDING_VERIFICATION", title: "Cho xac minh" },
  { status: "ACTIVE", title: "Dang hoat dong" },
  { status: "BANNED", title: "Bi khoa" },
];

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

const getChipSx = (status: string) => {
  if (status === "ACTIVE") return { color: "#86efac", borderColor: "rgba(34,197,94,0.35)", backgroundColor: "rgba(34,197,94,0.08)" };
  if (status === "PENDING_VERIFICATION") return { color: "#fdba74", borderColor: "rgba(249,115,22,0.35)", backgroundColor: "rgba(249,115,22,0.08)" };
  return { color: "#fca5a5", borderColor: "rgba(239,68,68,0.35)", backgroundColor: "rgba(239,68,68,0.08)" };
};

const SellerTable = () => {
  const dispatch = useAppDispatch();
  const { adminUser } = useAppSelector((store) => store);
  const [accountStatus, setAccountStatus] = useState("all");
  const [loading, setLoading] = React.useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllSellers(accountStatus));
  }, [accountStatus, dispatch]);

  const handleOpenStatusMenu = (event: React.MouseEvent<HTMLButtonElement>, sellerId: number) => {
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
    <Paper elevation={0} sx={panelSx}>
      {loading && <CustomLoading message="Dang cap nhat seller..." />}
      <Box sx={{ px: 3, py: 3, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap={2} alignItems="center">
          <Box>
            <Typography fontSize={26} fontWeight={800} color="white">Seller</Typography>
            <Typography sx={{ mt: 0.7, color: "rgba(255,255,255,0.62)", fontSize: 14.5 }}>
              Theo doi nha ban, xac minh ho so va xu ly tai khoan can canh bao.
            </Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel sx={{ color: "rgba(255,255,255,0.62)" }}>Loc trang thai</InputLabel>
            <Select
              value={accountStatus}
              label="Loc trang thai"
              onChange={(event) => setAccountStatus(event.target.value)}
              sx={{
                color: "white",
                borderRadius: "16px",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.12)" },
                "& .MuiSvgIcon-root": { color: "#fb923c" },
              }}
            >
              {accountStatuses.map((status) => (
                <MenuItem key={status.status} value={status.status}>{status.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 1040 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Seller</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>So dien thoai</StyledTableCell>
              <StyledTableCell>Doanh nghiep</StyledTableCell>
              <StyledTableCell>MST</StyledTableCell>
              <StyledTableCell align="center">Trang thai</StyledTableCell>
              <StyledTableCell align="right">Tac vu</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminUser.seller?.length ? adminUser.seller.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: "rgba(249,115,22,0.14)", color: "#fb923c" }}>
                      <Storefront />
                    </Avatar>
                    <Box>
                      <Typography fontWeight={700}>{row.sellerName}</Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.52)", fontSize: 12.5 }}>ID #{row.id}</Typography>
                    </Box>
                  </Box>
                </StyledTableCell>
                <StyledTableCell>{row.email}</StyledTableCell>
                <StyledTableCell>{row.mobile || "-"}</StyledTableCell>
                <StyledTableCell>{row.businessDetails?.businessName || "-"}</StyledTableCell>
                <StyledTableCell>{row.gstin || "-"}</StyledTableCell>
                <StyledTableCell align="center">
                  <Chip size="small" variant="outlined" label={accountStatuses.find((item) => item.status === row.accountStatus)?.title || row.accountStatus} sx={{ borderRadius: 999, ...getChipSx(row.accountStatus || "") }} />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    endIcon={<KeyboardArrowDown />}
                    onClick={(e) => handleOpenStatusMenu(e, row.id || 0)}
                    sx={{ textTransform: "none", borderRadius: 999, px: 2, color: "#fff7ed", borderColor: "rgba(255,255,255,0.16)" }}
                  >
                    Doi trang thai
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8, color: "rgba(255,255,255,0.6)" }}>
                  Chua co seller nao.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseStatusMenu}
        PaperProps={{ sx: { backgroundColor: "#171717", color: "white", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", mt: 1 } }}
      >
        {accountStatuses.filter((item) => item.status !== "all").map((item) => (
          <MenuItem key={item.status} onClick={() => handleChangeSellerStatus(item.status)}>{item.title}</MenuItem>
        ))}
      </Menu>
    </Paper>
  );
};

export default SellerTable;
