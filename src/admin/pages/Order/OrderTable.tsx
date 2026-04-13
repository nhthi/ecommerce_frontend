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
  TablePagination,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  LocalShipping,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Search,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  fetchSellerOrders,
  getAllOrders,
  updateOrderStatus,
} from "../../../state/seller/sellerOrderSlice";
import { OrderStatus } from "../../../types/OrderType";
import { formatCurrencyVND } from "../../../utils/formatCurrencyVND";
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

const orderStatusColors: Record<string, { color: string; label: string }> = {
  PENDING: { color: "#fdba74", label: "Chờ xử lý" },
  PLACED: { color: "#fb923c", label: "Đã đặt" },
  CONFIRMED: { color: "#facc15", label: "Đã xác nhận" },
  CANCELLED: { color: "#f87171", label: "Đã hủy" },
  SHIPPED: { color: "#93c5fd", label: "Đã gửi" },
  ARRIVING: { color: "#c4b5fd", label: "Sắp giao" },
  DELIVERED: { color: "#86efac", label: "Hoàn tất" },
};

export default function OrderTable() {
  const { isDark } = useSiteThemeMode();

  const dispatch = useAppDispatch();
  const { sellerOrder } = useAppSelector((store) => store);

  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [menuState, setMenuState] = React.useState<{
    anchorEl: HTMLElement | null;
    orderId: number | null;
  }>({ anchorEl: null, orderId: null });
  const [openRow, setOpenRow] = React.useState<number | null>(null);

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
    background: isDark
      ? "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))"
      : "linear-gradient(180deg, #ffffff, #fff7ed)",
    boxShadow: isDark
      ? "0 24px 60px rgba(0,0,0,0.28)"
      : "0 18px 45px rgba(15,23,42,0.08)",
    overflow: "hidden",
  };

  React.useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

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
    await dispatch(
      updateOrderStatus({
        orderId,
        orderStatus: value,
      })
    );
    await dispatch(fetchSellerOrders());
    setLoading(false);
    handleCloseMenuStatus();
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredOrders = React.useMemo(() => {
    const orders = sellerOrder.orders || [];

    if (!normalizedSearch) return orders;

    return orders.filter((order: any) => {
      const orderId = String(order.orderCode?.toLowerCase() || "");
      const customerName = order.user?.fullName?.toLowerCase() || "";
      const phone = order.shippingAddress?.phoneNumber?.toLowerCase() || "";
      const paymentMethod = order.paymentMethod?.toLowerCase() || "";
      const paymentStatus = order.paymentStatus?.toLowerCase() || "";
      const orderStatus = order.orderStatus?.toLowerCase() || "";
      const receiverName =
        order.shippingAddress?.receiverName?.toLowerCase() || "";
      const address = [
        order.shippingAddress?.streetDetail,
        order.shippingAddress?.ward,
        order.shippingAddress?.district,
        order.shippingAddress?.province,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const productText = Array.isArray(order.orderItems)
        ? order.orderItems
            .map(
              (item: any) =>
                `${item.product?.title || ""} ${item.product?.color || ""} ${item.size?.name || ""}`
            )
            .join(" ")
            .toLowerCase()
        : "";

      return (
        orderId.includes(normalizedSearch) ||
        customerName.includes(normalizedSearch) ||
        phone.includes(normalizedSearch) ||
        paymentMethod.includes(normalizedSearch) ||
        paymentStatus.includes(normalizedSearch) ||
        orderStatus.includes(normalizedSearch) ||
        receiverName.includes(normalizedSearch) ||
        address.includes(normalizedSearch) ||
        productText.includes(normalizedSearch)
      );
    });
  }, [sellerOrder.orders, normalizedSearch]);

  React.useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  React.useEffect(() => {
    const maxPage = Math.max(
      0,
      Math.ceil(filteredOrders.length / rowsPerPage) - 1
    );
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filteredOrders.length, page, rowsPerPage]);

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper elevation={0} sx={panelSx}>
      {loading && <CustomLoading message="Đang cập nhật đơn hàng..." />}

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
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography fontSize={26} fontWeight={800} color={TEXT_PRIMARY}>
              Đơn hàng
            </Typography>

          </Box>

          <TextField
            size="small"
            placeholder="Tìm theo mã đơn, khách hàng, sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              minWidth: { xs: "100%", md: 320 },
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
        </Stack>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 1080 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell />
              <StyledTableCell>Đơn hàng</StyledTableCell>
              <StyledTableCell>Khách hàng</StyledTableCell>
              <StyledTableCell>Thanh toán</StyledTableCell>
              <StyledTableCell align="right">Tổng tiền</StyledTableCell>
              <StyledTableCell align="center">Trạng thái</StyledTableCell>
              <StyledTableCell align="right">Thao tác</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedOrders.length ? (
              paginatedOrders.map((order: any) => {
                const status = orderStatusColors[order.orderStatus] || {
                  color: "#d4d4d8",
                  label: order.orderStatus,
                };

                return (
                  <React.Fragment key={order.id}>
                    <StyledTableRow>
                      <StyledTableCell>
                        <Button
                          size="small"
                          onClick={() =>
                            setOpenRow(openRow === order.id ? null : order.id)
                          }
                          sx={{ minWidth: 0, color: "#fb923c" }}
                        >
                          {openRow === order.id ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </Button>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Typography fontWeight={700} color={TEXT_PRIMARY}>
                          #{order.orderCode}
                        </Typography>
                        <Typography
                          sx={{
                            color: TEXT_MUTED,
                            fontSize: 12.5,
                          }}
                        >
                          {format(new Date(order.orderDate), "dd/MM/yyyy HH:mm", {
                            locale: vi,
                          })}
                        </Typography>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Typography fontWeight={700} color={TEXT_PRIMARY}>
                          {order.user.fullName}
                        </Typography>
                        <Typography
                          sx={{
                            color: TEXT_MUTED,
                            fontSize: 12.5,
                          }}
                        >
                          {order.shippingAddress?.phoneNumber}
                        </Typography>
                      </StyledTableCell>

                     

                      <StyledTableCell>
                        <Typography color={TEXT_PRIMARY}>
                          {order.paymentMethod}
                        </Typography>
                        <Chip
                          size="small"
                          label={order.paymentStatus}
                          sx={{
                            mt: 0.7,
                            borderRadius: 999,
                            color:
                              order.paymentStatus === "PAID"
                                ? "#86efac"
                                : "#fdba74",
                            border: "1px solid",
                            borderColor:
                              order.paymentStatus === "PAID"
                                ? "rgba(34,197,94,0.35)"
                                : "rgba(249,115,22,0.35)",
                            backgroundColor:
                              order.paymentStatus === "PAID"
                                ? "rgba(34,197,94,0.08)"
                                : "rgba(249,115,22,0.08)",
                          }}
                        />
                      </StyledTableCell>

                      <StyledTableCell
                        align="right"
                        sx={{ fontWeight: 700, color: TEXT_PRIMARY }}
                      >
                        {formatCurrencyVND(order.totalPrice)}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Chip
                          size="small"
                          label={status.label}
                          variant="outlined"
                          sx={{
                            borderRadius: 999,
                            color: status.color,
                            borderColor: `${status.color}55`,
                            backgroundColor: `${status.color}14`,
                          }}
                        />
                      </StyledTableCell>

                      <StyledTableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<LocalShipping />}
                          onClick={(e) => handleClickMenuStatus(e, order.id)}
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
                          Cập nhật
                        </Button>

                        <Menu
                          anchorEl={menuState.anchorEl}
                          open={menuState.orderId === order.id}
                          onClose={handleCloseMenuStatus}
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
                          {Object.entries(orderStatusColors).map(([key, item]) => (
                            <MenuItem
                              key={key}
                              onClick={() =>
                                handleUpdateOrderStatus(
                                  order.id,
                                  key as OrderStatus
                                )
                              }
                            >
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: 999,
                                  backgroundColor: item.color,
                                  mr: 1.2,
                                }}
                              />
                              {item.label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </StyledTableCell>
                    </StyledTableRow>

                    <TableRow>
                      <TableCell
                        colSpan={8}
                        sx={{
                          p: 0,
                          border: 0,
                          background: isDark
                            ? "#0d0d0d"
                            : "linear-gradient(180deg, rgba(255,247,237,0.72), rgba(255,255,255,0.92))",
                        }}
                      >
                        <Collapse
                          in={openRow === order.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ px: 3.5, pb: 3, pt: 1.5 }}>
                            <Stack
                              direction={{
                                xs: "column",
                                xl: "row",
                              }}
                              spacing={2.5}
                            >
                              <Box flex={2}>
                                <Typography
                                  fontWeight={800}
                                  fontSize={18}
                                  color={TEXT_PRIMARY}
                                >
                                  Sản phẩm trong đơn
                                </Typography>

                                <Stack spacing={1.2} sx={{ mt: 1.5 }}>
                                  {order.orderItems.map((item: any) => (
                                    <Paper
                                      key={item.id}
                                      elevation={0}
                                      sx={{
                                        p: 1.5,
                                        borderRadius: "20px",
                                        border: isDark
                                          ? "1px solid rgba(255,255,255,0.08)"
                                          : "1px solid rgba(15,23,42,0.08)",
                                        background: isDark
                                          ? "rgba(255,255,255,0.03)"
                                          : "rgba(255,255,255,0.86)",
                                      }}
                                    >
                                      <Stack
                                        direction="row"
                                        spacing={1.4}
                                        alignItems="center"
                                      >
                                        <Avatar
                                          variant="rounded"
                                          src={item.product.images[0]}
                                          sx={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: "16px",
                                          }}
                                        />

                                        <Box>
                                          <Typography
                                            fontWeight={700}
                                            color={TEXT_PRIMARY}
                                          >
                                            {item.product.title}
                                          </Typography>

                                          <Typography
                                            sx={{
                                              color: isDark
                                                ? "rgba(255,255,255,0.58)"
                                                : "rgba(17,24,39,0.58)",
                                              fontSize: 13.5,
                                            }}
                                          >
                                            Màu {item.product.color} • Size{" "}
                                            {item.size.name}
                                          </Typography>

                                          <Typography
                                            sx={{
                                              mt: 0.4,
                                              color: "#fdba74",
                                              fontSize: 13.5,
                                            }}
                                          >
                                            {formatCurrencyVND(item.sellingPrice)} ×{" "}
                                            {item.quantity}
                                          </Typography>
                                        </Box>
                                      </Stack>
                                    </Paper>
                                  ))}
                                </Stack>
                              </Box>

                              <Box flex={1.2}>
                                <Typography
                                  fontWeight={800}
                                  fontSize={18}
                                  color={TEXT_PRIMARY}
                                >
                                  Thông tin giao hàng
                                </Typography>

                                <Paper
                                  elevation={0}
                                  sx={{
                                    mt: 1.5,
                                    p: 1.8,
                                    borderRadius: "20px",
                                    border: isDark
                                      ? "1px solid rgba(255,255,255,0.08)"
                                      : "1px solid rgba(15,23,42,0.08)",
                                    background: isDark
                                      ? "rgba(255,255,255,0.03)"
                                      : "rgba(255,255,255,0.86)",
                                  }}
                                >
                                  <Typography fontWeight={700} color={TEXT_PRIMARY}>
                                    {order.shippingAddress.receiverName}
                                  </Typography>

                                  <Typography
                                    sx={{
                                      mt: 0.5,
                                      color: isDark
                                        ? "rgba(255,255,255,0.68)"
                                        : "rgba(17,24,39,0.68)",
                                      fontSize: 13.5,
                                    }}
                                  >
                                    {order.shippingAddress.phoneNumber}
                                  </Typography>

                                  <Typography
                                    sx={{
                                      mt: 1,
                                      color: isDark
                                        ? "rgba(255,255,255,0.68)"
                                        : "rgba(17,24,39,0.68)",
                                      fontSize: 13.5,
                                    }}
                                  >
                                    {order.shippingAddress.streetDetail},{" "}
                                    {order.shippingAddress.ward},{" "}
                                    {order.shippingAddress.district},{" "}
                                    {order.shippingAddress.province}
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
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                  sx={{
                    py: 8,
                    color: TEXT_SECONDARY,
                  }}
                >
                  {searchTerm
                    ? "Không tìm thấy đơn hàng phù hợp."
                    : "Chưa có đơn hàng nào."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredOrders.length}
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
    </Paper>
  );
}