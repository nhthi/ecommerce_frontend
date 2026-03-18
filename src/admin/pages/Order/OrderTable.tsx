import * as React from "react";
import { vi } from "date-fns/locale";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
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
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ExpandMore, LocalShipping, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchSellerOrders, getAllOrders, updateOrderStatus } from "../../../state/seller/sellerOrderSlice";
import { OrderStatus } from "../../../types/OrderType";
import { formatCurrencyVND } from "../../../utils/formatCurrencyVND";
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
  background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
  overflow: "hidden",
};

const orderStatusColors: Record<string, { color: string; label: string }> = {
  PENDING: { color: "#fdba74", label: "Cho xu ly" },
  PLACED: { color: "#fb923c", label: "Da dat" },
  CONFIRMED: { color: "#facc15", label: "Da xac nhan" },
  CANCELLED: { color: "#f87171", label: "Da huy" },
  SHIPPED: { color: "#93c5fd", label: "Da gui" },
  ARRIVING: { color: "#c4b5fd", label: "Sap giao" },
  DELIVERED: { color: "#86efac", label: "Hoan tat" },
};

export default function OrderTable() {
  const dispatch = useAppDispatch();
  const { sellerOrder } = useAppSelector((store) => store);
  const [loading, setLoading] = React.useState(false);
  const [menuState, setMenuState] = React.useState<{ anchorEl: HTMLElement | null; orderId: number | null }>({ anchorEl: null, orderId: null });
  const [openRow, setOpenRow] = React.useState<number | null>(null);

  React.useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const handleClickMenuStatus = (event: React.MouseEvent<HTMLButtonElement>, orderId: number) => {
    setMenuState({ anchorEl: event.currentTarget, orderId });
  };

  const handleCloseMenuStatus = () => {
    setMenuState({ anchorEl: null, orderId: null });
  };

  const handleUpdateOrderStatus = async (orderId: number, value: OrderStatus) => {
    setLoading(true);
    await dispatch(updateOrderStatus({ orderId, orderStatus: value }));
    await dispatch(fetchSellerOrders());
    setLoading(false);
    handleCloseMenuStatus();
  };

  return (
    <Paper elevation={0} sx={panelSx}>
      {loading && <CustomLoading message="Dang cap nhat don hang..." />}
      <Box sx={{ px: 3, py: 3, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Typography fontSize={26} fontWeight={800} color="white">Don hang</Typography>
        <Typography sx={{ mt: 0.7, color: "rgba(255,255,255,0.62)", fontSize: 14.5 }}>
          Xem nhanh thanh toan, chi tiet san pham va cap nhat trang thai van chuyen.
        </Typography>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 1080 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell />
              <StyledTableCell>Don hang</StyledTableCell>
              <StyledTableCell>Khach hang</StyledTableCell>
              <StyledTableCell>Seller</StyledTableCell>
              <StyledTableCell>Thanh toan</StyledTableCell>
              <StyledTableCell align="right">Tong</StyledTableCell>
              <StyledTableCell align="center">Trang thai</StyledTableCell>
              <StyledTableCell align="right">Tac vu</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sellerOrder.orders?.length ? sellerOrder.orders.map((order) => {
              const status = orderStatusColors[order.orderStatus] || { color: "#d4d4d8", label: order.orderStatus };
              return (
                <React.Fragment key={order.id}>
                  <StyledTableRow>
                    <StyledTableCell>
                      <Button
                        size="small"
                        onClick={() => setOpenRow(openRow === order.id ? null : order.id)}
                        sx={{ minWidth: 0, color: "#fb923c" }}
                      >
                        {openRow === order.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography fontWeight={700}>#{order.id}</Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.52)", fontSize: 12.5 }}>
                        {format(new Date(order.orderDate), "dd/MM/yyyy HH:mm", { locale: vi })}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography fontWeight={700}>{order.user.fullName}</Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.52)", fontSize: 12.5 }}>{order.shippingAddress?.phoneNumber}</Typography>
                    </StyledTableCell>
                    <StyledTableCell>{(order as any).seller?.businessDetails?.businessName || "Khong ro"}</StyledTableCell>
                    <StyledTableCell>
                      <Typography>{order.paymentMethod}</Typography>
                      <Chip
                        size="small"
                        label={order.paymentStatus}
                        sx={{
                          mt: 0.7,
                          borderRadius: 999,
                          color: order.paymentStatus === "PAID" ? "#86efac" : "#fdba74",
                          border: "1px solid",
                          borderColor: order.paymentStatus === "PAID" ? "rgba(34,197,94,0.35)" : "rgba(249,115,22,0.35)",
                          backgroundColor: order.paymentStatus === "PAID" ? "rgba(34,197,94,0.08)" : "rgba(249,115,22,0.08)",
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="right" sx={{ fontWeight: 700 }}>{formatCurrencyVND(order.totalPrice)}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Chip size="small" label={status.label} variant="outlined" sx={{ borderRadius: 999, color: status.color, borderColor: `${status.color}55`, backgroundColor: `${status.color}14` }} />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<LocalShipping />}
                        onClick={(e) => handleClickMenuStatus(e, order.id)}
                        sx={{ textTransform: "none", borderRadius: 999, px: 2, color: "#fff7ed", borderColor: "rgba(255,255,255,0.16)" }}
                      >
                        Cap nhat
                      </Button>
                      <Menu
                        anchorEl={menuState.anchorEl}
                        open={menuState.orderId === order.id}
                        onClose={handleCloseMenuStatus}
                        PaperProps={{ sx: { backgroundColor: "#171717", color: "white", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", mt: 1 } }}
                      >
                        {Object.entries(orderStatusColors).map(([key, item]) => (
                          <MenuItem key={key} onClick={() => handleUpdateOrderStatus(order.id, key as OrderStatus)}>
                            <Box sx={{ width: 8, height: 8, borderRadius: 999, backgroundColor: item.color, mr: 1.2 }} />
                            {item.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    </StyledTableCell>
                  </StyledTableRow>
                  <TableRow>
                    <TableCell colSpan={8} sx={{ p: 0, border: 0, backgroundColor: "#0d0d0d" }}>
                      <Collapse in={openRow === order.id} timeout="auto" unmountOnExit>
                        <Box sx={{ px: 3.5, pb: 3, pt: 1.5 }}>
                          <Stack direction={{ xs: "column", xl: "row" }} spacing={2.5}>
                            <Box flex={2}>
                              <Typography fontWeight={800} fontSize={18}>San pham trong don</Typography>
                              <Stack spacing={1.2} sx={{ mt: 1.5 }}>
                                {order.orderItems.map((item) => (
                                  <Paper key={item.id} elevation={0} sx={{ p: 1.5, borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.03)" }}>
                                    <Stack direction="row" spacing={1.4} alignItems="center">
                                      <Avatar variant="rounded" src={item.product.images[0]} sx={{ width: 64, height: 64, borderRadius: "16px" }} />
                                      <Box>
                                        <Typography fontWeight={700}>{item.product.title}</Typography>
                                        <Typography sx={{ color: "rgba(255,255,255,0.58)", fontSize: 13.5 }}>
                                          Mau {item.product.color} • Size {item.size.name}
                                        </Typography>
                                        <Typography sx={{ mt: 0.4, color: "#fdba74", fontSize: 13.5 }}>
                                          {formatCurrencyVND(item.sellingPrice)} x {item.quantity}
                                        </Typography>
                                      </Box>
                                    </Stack>
                                  </Paper>
                                ))}
                              </Stack>
                            </Box>
                            <Box flex={1.2}>
                              <Typography fontWeight={800} fontSize={18}>Giao hang</Typography>
                              <Paper elevation={0} sx={{ mt: 1.5, p: 1.8, borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.03)" }}>
                                <Typography fontWeight={700}>{order.shippingAddress.receiverName}</Typography>
                                <Typography sx={{ mt: 0.5, color: "rgba(255,255,255,0.68)", fontSize: 13.5 }}>{order.shippingAddress.phoneNumber}</Typography>
                                <Typography sx={{ mt: 1, color: "rgba(255,255,255,0.68)", fontSize: 13.5 }}>
                                  {order.shippingAddress.streetDetail}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.province}
                                </Typography>
                              </Paper>
                            </Box>
                          </Stack>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            }) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8, color: "rgba(255,255,255,0.6)" }}>
                  Chua co don hang nao.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
