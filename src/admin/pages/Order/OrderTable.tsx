import * as React from "react";
import { vi } from "date-fns/locale";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Checkbox,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
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
  Download,
  LocalShipping,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Search,
} from "@mui/icons-material";
import { format } from "date-fns";
import * as XLSX from "xlsx";
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

const paymentStatusLabel: Record<string, string> = {
  PENDING: "Chưa thanh toán",
  COMPLETED: "Đã thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thất bại",
  REFUNDED: "Đã hoàn tiền",
};

const EXPORT_FIELD_OPTIONS = [
  { key: "orderCode", label: "Mã đơn hàng" },
  { key: "customerName", label: "Khách hàng" },
  { key: "phoneNumber", label: "Số điện thoại" },
  { key: "receiverName", label: "Người nhận" },
  { key: "address", label: "Địa chỉ giao hàng" },
  { key: "paymentMethod", label: "Phương thức thanh toán" },
  { key: "paymentStatus", label: "Trạng thái thanh toán" },
  { key: "orderStatus", label: "Trạng thái đơn hàng" },
  { key: "totalPrice", label: "Tổng tiền" },
  { key: "totalItems", label: "Số lượng sản phẩm" },
  { key: "productNames", label: "Danh sách sản phẩm" },
  { key: "createdAt", label: "Ngày tạo" },
] as const;

type ExportFieldKey = (typeof EXPORT_FIELD_OPTIONS)[number]["key"];
type RecentFilter = "ALL" | "TODAY" | "7_DAYS" | "30_DAYS";

export default function OrderTable() {
  const { isDark } = useSiteThemeMode();

  const dispatch = useAppDispatch();
  const { sellerOrder } = useAppSelector((store) => store);

  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("ALL");
  const [recentFilter, setRecentFilter] = React.useState<RecentFilter>("ALL");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [menuState, setMenuState] = React.useState<{
    anchorEl: HTMLElement | null;
    orderId: number | null;
  }>({ anchorEl: null, orderId: null });
  const [openRow, setOpenRow] = React.useState<number | null>(null);

  const [openExportDialog, setOpenExportDialog] = React.useState(false);
  const [selectedExportFields, setSelectedExportFields] =
    React.useState<ExportFieldKey[]>([
      "orderCode",
      "customerName",
      "phoneNumber",
      "paymentMethod",
      "paymentStatus",
      "orderStatus",
      "totalPrice",
      "createdAt",
    ]);

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
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    return orders
      .filter((order: any) => {
        const orderId = String(order.orderCode || "").toLowerCase();
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
              .map((item: any) =>
                [
                  item.product?.title,
                  item.product?.color,
                  item.size?.name,
                  item.productName,
                ]
                  .filter(Boolean)
                  .join(" ")
              )
              .join(" ")
              .toLowerCase()
          : "";

        const matchesSearch =
          !normalizedSearch ||
          orderId.includes(normalizedSearch) ||
          customerName.includes(normalizedSearch) ||
          phone.includes(normalizedSearch) ||
          paymentMethod.includes(normalizedSearch) ||
          paymentStatus.includes(normalizedSearch) ||
          orderStatus.includes(normalizedSearch) ||
          receiverName.includes(normalizedSearch) ||
          address.includes(normalizedSearch) ||
          productText.includes(normalizedSearch);

        const matchesStatus =
          selectedStatus === "ALL" || order.orderStatus === selectedStatus;

        const orderDateValue = order.orderDate || order.createdAt;
        const orderDate = orderDateValue ? new Date(orderDateValue) : null;

        let matchesRecent = true;

        if (recentFilter === "TODAY") {
          matchesRecent = !!orderDate && orderDate >= startOfToday;
        } else if (recentFilter === "7_DAYS") {
          matchesRecent = !!orderDate && orderDate >= sevenDaysAgo;
        } else if (recentFilter === "30_DAYS") {
          matchesRecent = !!orderDate && orderDate >= thirtyDaysAgo;
        }

        return matchesSearch && matchesStatus && matchesRecent;
      })
      .sort((a: any, b: any) => {
        const aTime = new Date(a.orderDate || a.createdAt || 0).getTime();
        const bTime = new Date(b.orderDate || b.createdAt || 0).getTime();
        return bTime - aTime;
      });
  }, [sellerOrder.orders, normalizedSearch, selectedStatus, recentFilter]);

  React.useEffect(() => {
    setPage(0);
  }, [searchTerm, selectedStatus, recentFilter]);

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

  const handleToggleRow = (orderId: number) => {
    setOpenRow((prev) => (prev === orderId ? null : orderId));
  };

  const handleOpenExportDialog = () => {
    setOpenExportDialog(true);
  };

  const handleCloseExportDialog = () => {
    setOpenExportDialog(false);
  };

  const handleToggleExportField = (field: ExportFieldKey) => {
    setSelectedExportFields((prev) =>
      prev.includes(field)
        ? prev.filter((item) => item !== field)
        : [...prev, field]
    );
  };

  const handleSelectAllExportFields = () => {
    setSelectedExportFields(EXPORT_FIELD_OPTIONS.map((item) => item.key));
  };

  const handleClearAllExportFields = () => {
    setSelectedExportFields([]);
  };

  const getOrderStatusLabel = (status?: string) => {
    return orderStatusColors[status || ""]?.label || status || "";
  };

  const getPaymentStatusLabel = (status?: string) => {
    return paymentStatusLabel[status || ""] || status || "";
  };

  const getOrderAddress = (order: any) => {
    return [
      order.shippingAddress?.streetDetail,
      order.shippingAddress?.ward,
      order.shippingAddress?.district,
      order.shippingAddress?.province,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const getOrderProductNames = (order: any) => {
    if (!Array.isArray(order.orderItems)) return "";
    return order.orderItems
      .map((item: any) => {
        const title = item.product?.title || item.productName || "";
        const color = item.product?.color ? `Màu ${item.product.color}` : "";
        const size = item.size?.name ? `Size ${item.size.name}` : "";
        const quantity = item.quantity ? `x${item.quantity}` : "";
        return [title, color, size, quantity].filter(Boolean).join(" - ");
      })
      .join(" | ");
  };

  const handleExportExcel = () => {
    const sourceOrders = filteredOrders || [];

    if (!sourceOrders.length) {
      alert("Không có dữ liệu để xuất Excel");
      return;
    }

    if (!selectedExportFields.length) {
      alert("Vui lòng chọn ít nhất một mục để xuất");
      return;
    }

    const exportData = sourceOrders.map((order: any) => {
      const row: Record<string, string | number> = {};

      if (selectedExportFields.includes("orderCode")) {
        row["Mã đơn hàng"] = order.orderCode || "";
      }

      if (selectedExportFields.includes("customerName")) {
        row["Khách hàng"] = order.user?.fullName || "";
      }

      if (selectedExportFields.includes("phoneNumber")) {
        row["Số điện thoại"] = order.shippingAddress?.phoneNumber || "";
      }

      if (selectedExportFields.includes("receiverName")) {
        row["Người nhận"] = order.shippingAddress?.receiverName || "";
      }

      if (selectedExportFields.includes("address")) {
        row["Địa chỉ giao hàng"] = getOrderAddress(order);
      }

      if (selectedExportFields.includes("paymentMethod")) {
        row["Phương thức thanh toán"] = order.paymentMethod || "";
      }

      if (selectedExportFields.includes("paymentStatus")) {
        row["Trạng thái thanh toán"] = getPaymentStatusLabel(
          order.paymentStatus
        );
      }

      if (selectedExportFields.includes("orderStatus")) {
        row["Trạng thái đơn hàng"] = getOrderStatusLabel(order.orderStatus);
      }

      if (selectedExportFields.includes("totalPrice")) {
        row["Tổng tiền"] = order.totalSellingPrice ?? order.totalPrice ?? 0;
      }

      if (selectedExportFields.includes("totalItems")) {
        row["Số lượng sản phẩm"] = Array.isArray(order.orderItems)
          ? order.orderItems.reduce(
              (sum: number, item: any) => sum + (Number(item.quantity) || 0),
              0
            )
          : 0;
      }

      if (selectedExportFields.includes("productNames")) {
        row["Danh sách sản phẩm"] = getOrderProductNames(order);
      }

      if (selectedExportFields.includes("createdAt")) {
        row["Ngày tạo"] = order.orderDate
          ? format(new Date(order.orderDate), "dd/MM/yyyy HH:mm")
          : order.createdAt
          ? format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")
          : "";
      }

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    worksheet["!cols"] = [
      { wch: 18 },
      { wch: 22 },
      { wch: 16 },
      { wch: 20 },
      { wch: 40 },
      { wch: 20 },
      { wch: 22 },
      { wch: 20 },
      { wch: 16 },
      { wch: 16 },
      { wch: 60 },
      { wch: 20 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const fileName = `orders_${format(new Date(), "ddMMyyyy_HHmmss")}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    handleCloseExportDialog();
  };

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
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography fontSize={26} fontWeight={800} color={TEXT_PRIMARY}>
              Đơn hàng
            </Typography>
            
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.2}
            alignItems={{ xs: "stretch", sm: "center" }}
            flexWrap="wrap"
          >
            <TextField
              size="small"
              placeholder="Tìm theo mã đơn, khách hàng, sản phẩm, địa chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                minWidth: { xs: "100%", sm: 340 },
                "& .MuiOutlinedInput-root": {
                  color: TEXT_PRIMARY,
                  borderRadius: "999px",
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(255,255,255,0.78)",
                  "& fieldset": {
                    borderColor: isDark
                      ? "rgba(255,255,255,0.10)"
                      : "rgba(15,23,42,0.12)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(249,115,22,0.36)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f97316",
                  },
                },
                "& input::placeholder": {
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

            <TextField
              select
              size="small"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              sx={{
                minWidth: { xs: "100%", sm: 170 },
                "& .MuiOutlinedInput-root": {
                  color: TEXT_PRIMARY,
                  borderRadius: "999px",
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(255,255,255,0.78)",
                  "& fieldset": {
                    borderColor: isDark
                      ? "rgba(255,255,255,0.10)"
                      : "rgba(15,23,42,0.12)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(249,115,22,0.36)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f97316",
                  },
                },
              }}
            >
              <MenuItem value="ALL">Tất cả trạng thái</MenuItem>
              {Object.entries(orderStatusColors).map(([key, item]) => (
                <MenuItem key={key} value={key}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              value={recentFilter}
              onChange={(e) =>
                setRecentFilter(e.target.value as RecentFilter)
              }
              sx={{
                minWidth: { xs: "100%", sm: 150 },
                "& .MuiOutlinedInput-root": {
                  color: TEXT_PRIMARY,
                  borderRadius: "999px",
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(255,255,255,0.78)",
                  "& fieldset": {
                    borderColor: isDark
                      ? "rgba(255,255,255,0.10)"
                      : "rgba(15,23,42,0.12)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(249,115,22,0.36)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f97316",
                  },
                },
              }}
            >
              <MenuItem value="ALL">Tất cả</MenuItem>
              <MenuItem value="TODAY">Hôm nay</MenuItem>
              <MenuItem value="7_DAYS">7 ngày qua</MenuItem>
              <MenuItem value="30_DAYS">30 ngày qua</MenuItem>
            </TextField>

            <Chip
              label={`${filteredOrders.length} đơn hàng`}
              variant="outlined"
              sx={{
                color: TEXT_PRIMARY,
                borderColor: isDark
                  ? "rgba(249,115,22,0.28)"
                  : "rgba(249,115,22,0.22)",
                backgroundColor: isDark
                  ? "rgba(249,115,22,0.06)"
                  : "rgba(255,247,237,0.92)",
                fontWeight: 700,
              }}
            />

            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleOpenExportDialog}
              disabled={!filteredOrders.length}
              sx={{
                borderRadius: 999,
                px: 2.3,
                textTransform: "none",
                fontWeight: 700,
                color: TEXT_PRIMARY,
                borderColor: isDark
                  ? "rgba(249,115,22,0.28)"
                  : "rgba(249,115,22,0.22)",
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(255,255,255,0.72)",
                "&:hover": {
                  borderColor: "rgba(249,115,22,0.45)",
                  backgroundColor: isDark
                    ? "rgba(249,115,22,0.08)"
                    : "rgba(255,247,237,0.92)",
                },
              }}
            >
              Xuất Excel
            </Button>
          </Stack>
        </Stack>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 1280 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell />
              <StyledTableCell>Mã đơn</StyledTableCell>
              <StyledTableCell>Khách hàng</StyledTableCell>
              <StyledTableCell>Thanh toán</StyledTableCell>
              <StyledTableCell>Trạng thái</StyledTableCell>
              <StyledTableCell>Tổng tiền</StyledTableCell>
              <StyledTableCell>Ngày tạo</StyledTableCell>
              <StyledTableCell align="right">Tác vụ</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order: any) => {
                const statusMeta = orderStatusColors[order.orderStatus] || {
                  color: "#d1d5db",
                  label: order.orderStatus || "Không rõ",
                };

                const orderDate = order.orderDate || order.createdAt;

                return (
                  <React.Fragment key={order.id}>
                    <StyledTableRow>
                      <StyledTableCell width={70}>
                        <Button
                          variant="outlined"
                          onClick={() => handleToggleRow(order.id)}
                          sx={{
                            minWidth: 40,
                            width: 40,
                            height: 40,
                            borderRadius: 999,
                            p: 0,
                            color: TEXT_PRIMARY,
                            borderColor: isDark
                              ? "rgba(255,255,255,0.12)"
                              : "rgba(15,23,42,0.10)",
                            backgroundColor: isDark
                              ? "transparent"
                              : "rgba(255,255,255,0.7)",
                          }}
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
                          #{order.orderCode || order.id}
                        </Typography>
                        <Typography
                          sx={{ mt: 0.4, color: TEXT_MUTED, fontSize: 13.5 }}
                        >
                          {Array.isArray(order.orderItems)
                            ? `${order.orderItems.length} dòng sản phẩm`
                            : "0 sản phẩm"}
                        </Typography>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Typography fontWeight={700} color={TEXT_PRIMARY}>
                          {order.user?.fullName || "Khách hàng"}
                        </Typography>
                        <Typography
                          sx={{ mt: 0.4, color: TEXT_MUTED, fontSize: 13.5 }}
                        >
                          {order.shippingAddress?.phoneNumber || "-"}
                        </Typography>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Typography fontWeight={700} color={TEXT_PRIMARY}>
                          {order.paymentMethod || "-"}
                        </Typography>
                        <Typography
                          sx={{ mt: 0.4, color: TEXT_MUTED, fontSize: 13.5 }}
                        >
                          {getPaymentStatusLabel(order.paymentStatus)}
                        </Typography>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Chip
                          label={statusMeta.label}
                          size="small"
                          sx={{
                            color: statusMeta.color,
                            border: `1px solid ${statusMeta.color}40`,
                            backgroundColor: `${statusMeta.color}14`,
                            fontWeight: 700,
                            borderRadius: 999,
                          }}
                        />
                      </StyledTableCell>

                      <StyledTableCell>
                        <Typography fontWeight={800} color="#fdba74">
                          {formatCurrencyVND(
                            order.totalSellingPrice ?? order.totalPrice ?? 0
                          )}
                        </Typography>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Typography color={TEXT_SECONDARY}>
                          {orderDate
                            ? format(new Date(orderDate), "dd/MM/yyyy", {
                                locale: vi,
                              })
                            : "-"}
                        </Typography>
                        <Typography
                          sx={{ mt: 0.4, color: TEXT_MUTED, fontSize: 13.5 }}
                        >
                          {orderDate
                            ? format(new Date(orderDate), "HH:mm", {
                                locale: vi,
                              })
                            : ""}
                        </Typography>
                      </StyledTableCell>

                      <StyledTableCell align="right">
                        <Button
                          variant="outlined"
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
                          {Object.entries(orderStatusColors).map(
                            ([key, item]) => (
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
                            )
                          )}
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
                                          src={item.product?.images?.[0]}
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
                                            {item.product?.title ||
                                              item.productName}
                                          </Typography>

                                          <Typography
                                            sx={{
                                              color: isDark
                                                ? "rgba(255,255,255,0.58)"
                                                : "rgba(17,24,39,0.58)",
                                              fontSize: 13.5,
                                            }}
                                          >
                                            Màu {item.product?.color} • Size{" "}
                                            {item.size?.name}
                                          </Typography>

                                          <Typography
                                            sx={{
                                              mt: 0.4,
                                              color: "#fdba74",
                                              fontSize: 13.5,
                                            }}
                                          >
                                            {formatCurrencyVND(
                                              item.sellingPrice
                                            )}{" "}
                                            × {item.quantity}
                                          </Typography>
                                        </Box>
                                      </Stack>
                                    </Paper>
                                  ))}
                                </Stack>
                              </Box>

                              <Box flex={1}>
                                <Typography
                                  fontWeight={800}
                                  fontSize={18}
                                  color={TEXT_PRIMARY}
                                >
                                  Giao hàng
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
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                  >
                                    <LocalShipping
                                      sx={{ color: "#fb923c", fontSize: 18 }}
                                    />
                                    <Typography
                                      fontWeight={700}
                                      color={TEXT_PRIMARY}
                                    >
                                      Thông tin nhận hàng
                                    </Typography>
                                  </Stack>

                                  <Typography
                                    sx={{
                                      mt: 1.2,
                                      fontWeight: 700,
                                      color: TEXT_PRIMARY,
                                    }}
                                  >
                                    {order.shippingAddress?.receiverName}
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
                                    {order.shippingAddress?.phoneNumber}
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
                                    {order.shippingAddress?.streetDetail},{" "}
                                    {order.shippingAddress?.ward},{" "}
                                    {order.shippingAddress?.district},{" "}
                                    {order.shippingAddress?.province}
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
                  {searchTerm || selectedStatus !== "ALL" || recentFilter !== "ALL"
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

      <Dialog
        open={openExportDialog}
        onClose={handleCloseExportDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            color: isDark ? "white" : "#111827",
            borderRadius: "24px",
            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(15,23,42,0.08)",
            boxShadow: isDark
              ? "0 24px 60px rgba(0,0,0,0.28)"
              : "0 18px 45px rgba(15,23,42,0.08)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: isDark ? "white" : "#111827",
            pb: 1,
          }}
        >
          Chọn các mục muốn xuất Excel
        </DialogTitle>

        <DialogContent sx={{ pt: "8px !important" }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 1.8, flexWrap: "wrap", rowGap: 1 }}
          >
            <Button
              variant="outlined"
              onClick={handleSelectAllExportFields}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                color: TEXT_PRIMARY,
                borderColor: BORDER_SOFT,
              }}
            >
              Chọn tất cả
            </Button>

            <Button
              variant="outlined"
              onClick={handleClearAllExportFields}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                color: TEXT_PRIMARY,
                borderColor: BORDER_SOFT,
              }}
            >
              Bỏ chọn tất cả
            </Button>
          </Stack>

          <FormGroup>
            {EXPORT_FIELD_OPTIONS.map((field) => (
              <FormControlLabel
                key={field.key}
                control={
                  <Checkbox
                    checked={selectedExportFields.includes(field.key)}
                    onChange={() => handleToggleExportField(field.key)}
                    sx={{
                      color: "rgba(249,115,22,0.6)",
                      "&.Mui-checked": {
                        color: "#f97316",
                      },
                    }}
                  />
                }
                label={field.label}
                sx={{
                  color: TEXT_PRIMARY,
                  ".MuiFormControlLabel-label": {
                    fontSize: 14.5,
                  },
                }}
              />
            ))}
          </FormGroup>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseExportDialog}
            sx={{
              textTransform: "none",
              color: isDark ? "rgba(255,255,255,0.72)" : "rgba(17,24,39,0.72)",
              backgroundColor: isDark
                ? "transparent"
                : "rgba(255,255,255,0.68)",
              borderRadius: 999,
            }}
          >
            Hủy
          </Button>

          <Button
            onClick={handleExportExcel}
            variant="contained"
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 2.8,
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              boxShadow: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #ea580c, #c2410c)",
                boxShadow: "none",
              },
            }}
          >
            <span className="text-slate-100">
              <Download /> Xuất file
            </span>
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}