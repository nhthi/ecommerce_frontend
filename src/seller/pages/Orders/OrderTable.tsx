import * as React from "react";
import { styled } from "@mui/material/styles";
import { vi } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Menu,
  MenuItem,
  Collapse,
  Box,
  IconButton,
  Typography,
  Chip,
  Stack,
  Divider,
  Tooltip,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  fetchSellerOrders,
  updateOrderStatus,
} from "../../../state/seller/sellerOrderSlice";
import { OrderStatus } from "../../../types/OrderType";
import { formatCurrencyVND } from "../../../utils/formatCurrencyVND";
import { format } from "date-fns";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";

// =================== STYLED COMPONENTS ===================
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
    borderBottomColor: "rgba(148, 163, 184, 0.3)",
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

// =================== ORDER STATUS COLORS ===================
interface OrderStatusColor {
  value: OrderStatus;
  color: string;
}

const orderStatusColors: OrderStatusColor[] = [
  { value: OrderStatus.PENDING, color: "#FFC107" },
  { value: OrderStatus.PLACED, color: "#1E90FF" },
  { value: OrderStatus.CONFIRMED, color: "#32CD32" },
  { value: OrderStatus.CANCELLED, color: "#FF0000" },
  { value: OrderStatus.SHIPPED, color: "#9370DB" },
  { value: OrderStatus.ARRIVING, color: "#87CEFA" },
  { value: OrderStatus.DELIVERED, color: "#008000" },
];

// =================== MAIN COMPONENT ===================
export default function OrderTable() {
  const dispatch = useAppDispatch();
  const { sellerOrder } = useAppSelector((store) => store);
  const [loading, setLoading] = React.useState(false);
  const [menuState, setMenuState] = React.useState<{
    anchorEl: HTMLElement | null;
    orderId: number | null;
  }>({ anchorEl: null, orderId: null });

  const [openRow, setOpenRow] = React.useState<number | null>(null);

  const handleClickMenuStatus = (
    event: React.MouseEvent<HTMLButtonElement>,
    orderId: number
  ) => {
    setMenuState({ anchorEl: event.currentTarget, orderId });
  };

  const handleCloseMenuStatus = () => {
    setMenuState({ anchorEl: null, orderId: null });
  };

  const handleUpdateOrderStatus = async (
    orderId: number,
    value: OrderStatus
  ) => {
    setLoading(true);
    await dispatch(updateOrderStatus({ orderId, orderStatus: value }));
    await dispatch(fetchSellerOrders());
    setLoading(false);
    handleCloseMenuStatus();
  };

  React.useEffect(() => {
    dispatch(fetchSellerOrders());
  }, [dispatch]);

  const getStatusColor = (status: OrderStatus) =>
    orderStatusColors.find((s) => s.value === status)?.color || "#64748b";

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
      {loading && <CustomLoading message="Đang cập nhật đơn hàng..." />}

      <Box sx={{ px: 3, pt: 3, pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          Quản lý đơn hàng
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Xem trạng thái, chi tiết sản phẩm và cập nhật tiến trình đơn hàng.
        </Typography>
      </Box>

      <Divider />

      <TableContainer>
        <Table sx={{ minWidth: 1000 }} aria-label="order table">
          <TableHead>
            <TableRow>
              <StyledTableCell />
              <StyledTableCell>Order ID</StyledTableCell>
              <StyledTableCell>Customer</StyledTableCell>
              <StyledTableCell align="right">Total</StyledTableCell>
              <StyledTableCell align="right">Payment</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
              <StyledTableCell align="center">Update</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sellerOrder.orders && sellerOrder.orders.length > 0 ? (
              sellerOrder.orders.map((order) => (
                <React.Fragment key={order.id}>
                  {/* ============ MAIN ROW ============ */}
                  <StyledTableRow>
                    <StyledTableCell>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setOpenRow(openRow === order.id ? null : order.id)
                        }
                      >
                        {openRow === order.id ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowDown />
                        )}
                      </IconButton>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        #{order.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(order.orderDate), "dd/MM/yyyy HH:mm", {
                          locale: vi,
                        })}
                      </Typography>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {order.user.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.shippingAddress?.phoneNumber}
                      </Typography>
                    </StyledTableCell>

                    <StyledTableCell align="right">
                      <Typography variant="body1" fontWeight={700}>
                        {formatCurrencyVND(order.totalPrice)}
                      </Typography>
                    </StyledTableCell>

                    <StyledTableCell align="right">
                      <Stack alignItems="flex-end" spacing={0.5}>
                        <Typography variant="body2">
                          {order.paymentMethod}
                        </Typography>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={order.paymentStatus}
                          sx={{
                            borderRadius: 999,
                            fontSize: 11,
                            height: 22,
                            borderColor:
                              order.paymentStatus === "PAID"
                                ? "success.main"
                                : "warning.main",
                            color:
                              order.paymentStatus === "PAID"
                                ? "success.main"
                                : "warning.main",
                          }}
                        />
                      </Stack>
                    </StyledTableCell>

                    <StyledTableCell align="right">
                      <Chip
                        size="small"
                        variant="outlined"
                        label={order.orderStatus}
                        sx={{
                          borderRadius: 999,
                          minWidth: 120,
                          fontWeight: 600,
                          borderColor: getStatusColor(order.orderStatus),
                          color: getStatusColor(order.orderStatus),
                          backgroundColor: "transparent",
                        }}
                      />
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Tooltip title="Cập nhật trạng thái đơn hàng">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={(e) => handleClickMenuStatus(e, order.id)}
                          sx={{
                            borderRadius: 999,
                            textTransform: "none",
                            fontSize: 13,
                            px: 2.2,
                          }}
                        >
                          Update
                        </Button>
                      </Tooltip>
                      <Menu
                        anchorEl={menuState.anchorEl}
                        open={menuState.orderId === order.id}
                        onClose={handleCloseMenuStatus}
                      >
                        {orderStatusColors.map((item) => (
                          <MenuItem
                            key={item.value}
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, item.value)
                            }
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                mr: 1,
                                backgroundColor: item.color,
                              }}
                            />
                            {item.value}
                          </MenuItem>
                        ))}
                      </Menu>
                    </StyledTableCell>
                  </StyledTableRow>

                  {/* ============ COLLAPSIBLE DETAIL ROW ============ */}
                  <StyledTableRow>
                    <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                      <Collapse
                        in={openRow === order.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ px: 4, pb: 3, pt: 1.5 }}>
                          <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={3}
                            alignItems="flex-start"
                          >
                            {/* Products */}
                            <Box flex={2}>
                              <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                gutterBottom
                              >
                                Products
                              </Typography>
                              <Stack spacing={1.5}>
                                {order.orderItems.map((item) => (
                                  <Box
                                    key={item.id}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 2,
                                      p: 1.2,
                                      borderRadius: 2,
                                      border:
                                        "1px dashed rgba(148,163,184,0.7)",
                                      background:
                                        "radial-gradient(circle at top, #f9fafb, #e5e7eb)",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        flexShrink: 0,
                                      }}
                                    >
                                      <img
                                        src={item.product.images[0]}
                                        alt={item.product.title}
                                        width={72}
                                        height={72}
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </Box>
                                    <Box>
                                      <Typography
                                        variant="subtitle2"
                                        fontWeight={600}
                                      >
                                        {item.product.title}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        Color: {item.product.color} • Size:{" "}
                                        {item.size.name}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        sx={{ mt: 0.5 }}
                                      >
                                        <strong>Price:</strong>{" "}
                                        {formatCurrencyVND(item.sellingPrice)} x{" "}
                                        {item.quantity}
                                      </Typography>
                                    </Box>
                                  </Box>
                                ))}
                              </Stack>
                            </Box>

                            {/* Shipping + Info */}
                            <Box flex={1.4}>
                              <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                gutterBottom
                              >
                                Shipping Address
                              </Typography>
                              <Typography variant="body2">
                                {order.shippingAddress.receiverName} -{" "}
                                {order.shippingAddress.phoneNumber}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {order.shippingAddress.streetDetail},{" "}
                                {order.shippingAddress.ward},{" "}
                                {order.shippingAddress.district},{" "}
                                {order.shippingAddress.province}
                              </Typography>

                              <Divider sx={{ my: 2 }} />

                              <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                gutterBottom
                              >
                                Order Info
                              </Typography>
                              <Typography variant="body2">
                                <strong>Order Date:</strong>{" "}
                                {format(
                                  new Date(order.orderDate),
                                  "dd/MM/yyyy HH:mm",
                                  { locale: vi }
                                )}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Total:</strong>{" "}
                                {formatCurrencyVND(order.totalPrice)}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </StyledTableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    Hiện chưa có đơn hàng nào.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
