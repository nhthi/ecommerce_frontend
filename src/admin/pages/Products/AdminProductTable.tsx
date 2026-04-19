import * as React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Chip,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import {
  Add,
  DeleteOutline,
  Download,
  EditOutlined,
  ExpandMore,
  Inventory2,
  KeyboardArrowDown,
  Search,
  Star,
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { Product } from "../../../types/ProductType";
import {
  deleteProduct,
  fetchAllProducts,
  updateProductStatus,
} from "../../../state/admin/adminProduct";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";



const PRODUCT_STATUSES = ["PENDING", "APPROVED", "REJECTED", "HIDDEN"] as const;
type ProductStatus = (typeof PRODUCT_STATUSES)[number];
type ProductStatusFilter = "ALL" | ProductStatus;

const EXPORT_FIELD_OPTIONS = [
  { key: "stt", label: "STT" },
  { key: "id", label: "ID" },
  { key: "title", label: "Tên sản phẩm" },
  { key: "category", label: "Danh mục" },
  { key: "sellingPrice", label: "Giá bán" },
  { key: "mrpPrice", label: "Giá gốc" },
  { key: "color", label: "Màu sắc" },
  { key: "quantity", label: "Tồn kho" },
  { key: "sold", label: "Lượt bán" },
  { key: "status", label: "Trạng thái" },
  { key: "numRatings", label: "Số đánh giá" },
  { key: "createdBy", label: "Người tạo" },
  { key: "createdAt", label: "Ngày tạo" },
] as const;

type ExportFieldKey = (typeof EXPORT_FIELD_OPTIONS)[number]["key"];

const formatCurrencyVND = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "0 đ";
  return new Intl.NumberFormat("vi-VN").format(value) + " đ";
};



const panelSx = {
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
  overflow: "hidden",
};

export default function AdminProductTable() {
  const [statusMenuPosition, setStatusMenuPosition] = React.useState<{
  top: number;
  left: number;
} | null>(null);
  const { isDark } = useSiteThemeMode();
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
    color: TEXT_PRIMARY,
    fontSize: 14,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
});
const getStatusChipProps = (status: ProductStatus | string | undefined) => {
  switch (status) {
    case "APPROVED":
      return {
        label: "Đã duyệt",
        sx: {
          color: "#bbf7d0",
          borderColor: "rgba(34,197,94,0.35)",
          backgroundColor: "rgba(34,197,94,0.08)",
        },
      };
    case "PENDING":
      return {
        label: "Chờ duyệt",
        sx: {
          color: "#fdba74",
          borderColor: "rgba(249,115,22,0.35)",
          backgroundColor: "rgba(249,115,22,0.08)",
        },
      };
    case "REJECTED":
      return {
        label: "Từ chối",
        sx: {
          color: "#fecaca",
          borderColor: "rgba(239,68,68,0.35)",
          backgroundColor: "rgba(239,68,68,0.08)",
        },
      };
    case "HIDDEN":
      return {
        label: "Ẩn",
        sx: {
          color: "#e5e7eb",
          borderColor: "rgba(161,161,170,0.25)",
          backgroundColor: "rgba(161,161,170,0.08)",
        },
      };
    default:
      return {
        label: status || "Không rõ",
        sx: { color: TEXT_PRIMARY, borderColor: "rgba(255,255,255,0.16)" },
      };
  }
};
const StyledTableRow = styled(TableRow)({
  "&:hover": {
    backgroundColor: "rgba(249,115,22,0.05)",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { adminProduct } = useAppSelector((store) => store);

  const [loading, setLoading] = React.useState(false);
const [statusMenuAnchor, setStatusMenuAnchor] = React.useState<HTMLElement | null>(null);
  const [selectedProductId, setSelectedProductId] = React.useState<
    number | null
  >(null);
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(
    null
  );
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] =
    React.useState<ProductStatusFilter>("ALL");

  const [openExportDialog, setOpenExportDialog] = React.useState(false);
  const [selectedExportFields, setSelectedExportFields] = React.useState<
    ExportFieldKey[]
  >([
    "stt",
    "id",
    "title",
    "category",
    "sellingPrice",
    "mrpPrice",
    "color",
    "quantity",
    "sold",
    "status",
    "numRatings",
    "createdBy",
    "createdAt",
  ]);

  React.useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredProducts = React.useMemo(() => {
    const products = adminProduct.products || [];

    return products.filter((item: Product) => {
      const title = item.title?.toLowerCase() || "";
      const categoryName = item.category?.name?.toLowerCase() || "";
      const color = item.color?.toLowerCase() || "";
      const createdBy =
        item.createdBy?.fullName?.toLowerCase() ||
        item.createdBy?.email?.toLowerCase() ||
        "";
      const productId = String(item.id || "");
      const status = (
        (item as Product & { status?: string }).status || ""
      ).toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        title.includes(normalizedSearch) ||
        categoryName.includes(normalizedSearch) ||
        color.includes(normalizedSearch) ||
        createdBy.includes(normalizedSearch) ||
        productId.includes(normalizedSearch) ||
        status.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        ((item as Product & { status?: string }).status || "PENDING") ===
          statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [adminProduct.products, normalizedSearch, statusFilter]);

  React.useEffect(() => {
    setPage(0);
  }, [searchTerm, statusFilter]);

  React.useEffect(() => {
    const maxPage = Math.max(
      0,
      Math.ceil(filteredProducts.length / rowsPerPage) - 1
    );
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filteredProducts.length, page, rowsPerPage]);

const handleOpenStatusMenu = (
  event: React.MouseEvent<HTMLElement>,
  productId: number
) => {
  event.stopPropagation();

  setStatusMenuPosition({
    top: event.clientY,
    left: event.clientX,
  });

  setSelectedProductId(productId);
};
const handleCloseStatusMenu = () => {
  setStatusMenuPosition(null);
  setSelectedProductId(null);
};
  const handleChangeProductStatus = async (status: ProductStatus) => {
    if (!selectedProductId) return;
    setLoading(true);
    await dispatch(updateProductStatus({ id: selectedProductId, status }));
    await dispatch(fetchAllProducts());
    setLoading(false);
    handleCloseStatusMenu();
  };

  const handleOpenDeleteDialog = (product: Product) => {
    setProductToDelete(product);
  };

  const handleCloseDeleteDialog = () => {
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete?.id) return;
    setLoading(true);
    await dispatch(deleteProduct(productToDelete.id));
    setLoading(false);
    handleCloseDeleteDialog();
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

  const handleExportExcel = () => {
    const sourceProducts = filteredProducts || [];

    if (!sourceProducts.length) {
      alert("Không có dữ liệu để xuất Excel");
      return;
    }

    if (!selectedExportFields.length) {
      alert("Vui lòng chọn ít nhất một mục để xuất");
      return;
    }

    const exportData = sourceProducts.map((item: Product, index: number) => {
      const productStatus =
        (item as Product & { status?: string }).status || "PENDING";

      const totalQuantity =
        item.quantity ??
        (Array.isArray(item.sizes)
          ? item.sizes.reduce(
              (sum: number, size: any) => sum + (Number(size.quantity) || 0),
              0
            )
          : 0);

      const soldCount = Number((item as Product & { sold?: number }).sold) || 0;

      const row: Record<string, string | number> = {};

      if (selectedExportFields.includes("stt")) {
        row["STT"] = index + 1;
      }
      if (selectedExportFields.includes("id")) {
        row["ID"] = item.id ?? "";
      }
      if (selectedExportFields.includes("title")) {
        row["Tên sản phẩm"] = item.title ?? "";
      }
      if (selectedExportFields.includes("category")) {
        row["Danh mục"] = item.category?.name ?? "";
      }
      if (selectedExportFields.includes("sellingPrice")) {
        row["Giá bán"] = item.sellingPrice ?? 0;
      }
      if (selectedExportFields.includes("mrpPrice")) {
        row["Giá gốc"] = item.mrpPrice ?? 0;
      }
      if (selectedExportFields.includes("color")) {
        row["Màu sắc"] = item.color ?? "";
      }
      if (selectedExportFields.includes("quantity")) {
        row["Tồn kho"] = totalQuantity;
      }
      if (selectedExportFields.includes("sold")) {
        row["Lượt bán"] = soldCount;
      }
      if (selectedExportFields.includes("status")) {
        row["Trạng thái"] = getStatusChipProps(productStatus).label;
      }
      if (selectedExportFields.includes("numRatings")) {
        row["Số đánh giá"] = item.numRatings ?? 0;
      }
      if (selectedExportFields.includes("createdBy")) {
        row["Người tạo"] =
          item.createdBy?.fullName || item.createdBy?.email || "";
      }
      if (selectedExportFields.includes("createdAt")) {
        row["Ngày tạo"] = item.createAt
          ? format(parseISO(String(item.createAt)), "dd/MM/yyyy HH:mm")
          : "";
      }

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 10 },
      { wch: 30 },
      { wch: 20 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 12 },
      { wch: 12 },
      { wch: 16 },
      { wch: 12 },
      { wch: 24 },
      { wch: 20 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const fileName = `products_${format(new Date(), "ddMMyyyy_HHmmss")}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    setOpenExportDialog(false);
  };

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper elevation={0} sx={panelSx}>
      {loading && <CustomLoading message="Đang cập nhật sản phẩm..." />}

      <Box
        sx={{
          px: 3,
          py: 3,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography fontSize={26} fontWeight={800} color={TEXT_PRIMARY}>
              Sản phẩm
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
              placeholder="Tìm theo tên, ID, danh mục, màu sắc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                minWidth: { xs: "100%", sm: 320 },
                "& .MuiOutlinedInput-root": {
                  color: TEXT_PRIMARY,
                  borderRadius: "999px",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.10)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(249,115,22,0.36)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f97316",
                  },
                },
                "& input::placeholder": {
                  color: "rgba(255,255,255,0.5)",
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
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as ProductStatusFilter)
              }
              sx={{
                minWidth: { xs: "100%", sm: 180 },
                "& .MuiOutlinedInput-root": {
                  color: TEXT_PRIMARY,
                  borderRadius: "999px",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.10)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(249,115,22,0.36)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f97316",
                  },
                },
                "& .MuiSvgIcon-root": {
                  color: "#fb923c",
                },
              }}
            >
              <MenuItem value="ALL">Tất cả trạng thái</MenuItem>
              {PRODUCT_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {getStatusChipProps(status).label}
                </MenuItem>
              ))}
            </TextField>

            <Chip
              icon={<Inventory2 sx={{ color: "#fb923c !important" }} />}
              label={`${filteredProducts.length} sản phẩm`}
              variant="outlined"
              sx={{
                color: TEXT_PRIMARY,
                borderColor: "rgba(249,115,22,0.28)",
                backgroundColor: "rgba(249,115,22,0.06)",
              }}
            />

            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => setOpenExportDialog(true)}
              disabled={!filteredProducts.length}
              sx={{
                borderRadius: 999,
                px: 2.3,
                textTransform: "none",
                fontWeight: 700,
                color: TEXT_PRIMARY,
                borderColor: "rgba(249,115,22,0.28)",
                backgroundColor: "rgba(255,255,255,0.02)",
                "&:hover": {
                  borderColor: "rgba(249,115,22,0.45)",
                  backgroundColor: "rgba(249,115,22,0.08)",
                },
              }}
            >
              Xuất Excel
            </Button>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/admin/products/create")}
              sx={{
                borderRadius: 999,
                px: 2.5,
                textTransform: "none",
                fontWeight: 700,
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                boxShadow: "0 14px 30px rgba(249,115,22,0.22)",
                "& .MuiButton-startIcon, & .MuiSvgIcon-root": {
                  color: "#fff !important",
                },
                "&:hover": {
                  background: "linear-gradient(135deg, #fb923c, #ea580c)",
                },
              }}
            >
              <span style={{ color: "#fff", fontWeight: 700 }}>
                Thêm sản phẩm
              </span>
            </Button>
          </Stack>
        </Stack>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 1320 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Sản phẩm</StyledTableCell>
              <StyledTableCell>Giá</StyledTableCell>
              <StyledTableCell>Màu</StyledTableCell>
              <StyledTableCell>Tồn kho</StyledTableCell>
              <StyledTableCell>Lượt bán</StyledTableCell>
              <StyledTableCell>Trạng thái</StyledTableCell>
              <StyledTableCell>Đánh giá</StyledTableCell>
              <StyledTableCell>Tạo bởi</StyledTableCell>
              <StyledTableCell align="right">Tác vụ</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((item: Product) => {
                const productStatus: ProductStatus | string =
                  (item as Product & { status?: string }).status || "PENDING";
                const statusChip = getStatusChipProps(productStatus);

                const totalQuantity =
                  item.quantity ??
                  (Array.isArray(item.sizes)
                    ? item.sizes.reduce(
                        (sum: number, size) =>
                          sum + (Number(size.quantity) || 0),
                        0
                      )
                    : 0);

                const soldCount =
                  Number((item as Product & { sold?: number }).sold) || 0;

                return (
                  <React.Fragment key={item.id}>
                    <StyledTableRow>
                      <StyledTableCell>#{item.id}</StyledTableCell>

                      <StyledTableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            variant="rounded"
                            src={item.images?.[0] || ""}
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: "18px",
                              bgcolor: "rgba(249,115,22,0.1)",
                            }}
                          />
                          <Box sx={{ maxWidth: 280 }}>
                            <Typography fontWeight={700} color={TEXT_PRIMARY}>
                              {item.title}
                            </Typography>
                            <Typography
                              sx={{
                                mt: 0.4,
                                color: TEXT_MUTED,
                                fontSize: 13.5,
                              }}
                            >
                              {item.category?.name || "Chưa gán danh mục"}
                            </Typography>
                          </Box>
                        </Stack>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Typography fontWeight={700} color={TEXT_PRIMARY}>
                          {formatCurrencyVND(item.sellingPrice)}
                        </Typography>
                        <Typography sx={{ color: TEXT_MUTED, fontSize: 12.5 }}>
                          Giá gốc: {formatCurrencyVND(item.mrpPrice)}
                        </Typography>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Typography color={TEXT_SECONDARY}>
                          {item.color || "-"}
                        </Typography>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Chip
                          size="small"
                          label={`${totalQuantity} sản phẩm`}
                          sx={{
                            color: TEXT_PRIMARY,
                            backgroundColor: "rgba(249,115,22,0.12)",
                            border: `1px solid ${BORDER_SOFT}`,
                          }}
                        />
                      </StyledTableCell>

                      <StyledTableCell>
                        <Chip
                          size="small"
                          label={`${soldCount}`}
                          sx={{
                            color: "#fde68a",
                            backgroundColor: "rgba(234,179,8,0.12)",
                            border: "1px solid rgba(234,179,8,0.2)",
                            fontWeight: 700,
                          }}
                        />
                      </StyledTableCell>

                      <StyledTableCell>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={statusChip.label}
                          sx={{
                            borderRadius: 999,
                            fontWeight: 700,
                            ...statusChip.sx,
                          }}
                        />
                      </StyledTableCell>

                      <StyledTableCell>
                        <Stack
                          direction="row"
                          spacing={0.6}
                          alignItems="center"
                        >
                          <Star sx={{ fontSize: 16, color: "#fb923c" }} />
                          <Typography color={TEXT_SECONDARY}>
                            {item.numRatings || 0}
                          </Typography>
                        </Stack>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Typography fontWeight={600} color={TEXT_SECONDARY}>
                          {item.createdBy?.fullName ||
                            item.createdBy?.email ||
                            "Không rõ"}
                        </Typography>
                      </StyledTableCell>

                      <StyledTableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                          alignItems="center"
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditOutlined />}
                            onClick={() =>
                              navigate(`/admin/products/edit/${item.id}`)
                            }
                            sx={{
                              borderRadius: 999,
                              textTransform: "none",
                              px: 1.8,
                              color: TEXT_PRIMARY,
                              borderColor: BORDER_SOFT,
                              backgroundColor: "rgba(255,255,255,0.02)",
                              "&:hover": {
                                borderColor: "rgba(249,115,22,0.4)",
                                backgroundColor: "rgba(249,115,22,0.08)",
                              },
                            }}
                          >
                            Sửa
                          </Button>

                          <Button
                            size="small"
                            variant="outlined"
                            endIcon={<KeyboardArrowDown />}
                            onClick={(e) => handleOpenStatusMenu(e, item.id!)}
                            sx={{
                              borderRadius: 999,
                              textTransform: "none",
                              px: 1.8,
                              color: TEXT_PRIMARY,
                              borderColor: BORDER_SOFT,
                              backgroundColor: "rgba(255,255,255,0.02)",
                              "&:hover": {
                                borderColor: "rgba(249,115,22,0.4)",
                                backgroundColor: "rgba(249,115,22,0.08)",
                              },
                            }}
                          >
                            Trạng thái
                          </Button>

                          <IconButton
                            sx={{
                              color: "#fecaca",
                              backgroundColor: "rgba(239,68,68,0.08)",
                              border: "1px solid rgba(239,68,68,0.18)",
                              "&:hover": {
                                backgroundColor: "rgba(239,68,68,0.14)",
                              },
                            }}
                            onClick={() => handleOpenDeleteDialog(item)}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </Stack>
                      </StyledTableCell>
                    </StyledTableRow>

                    <TableRow>
                      <TableCell
                        colSpan={10}
                        sx={{
                          p: 0,
                          border: 0,
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                        }}
                      >
                        <Accordion
                          elevation={0}
                          sx={{
                            backgroundColor: "transparent",
                            color: TEXT_PRIMARY,
                            boxShadow: "none",
                            "&::before": { display: "none" },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMore sx={{ color: "#fb923c" }} />}
                            sx={{
                              px: 3,
                              minHeight: 52,
                              borderTop: "1px dashed rgba(255,255,255,0.08)",
                              backgroundColor: "rgba(255,255,255,0.02)",
                              "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.04)",
                              },
                              "& .MuiAccordionSummary-content": {
                                my: 1.1,
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#fdba74",
                                fontWeight: 600,
                                fontSize: 13.5,
                              }}
                            >
                              Xem thêm chi tiết sản phẩm
                            </Typography>
                          </AccordionSummary>

                          <AccordionDetails
                            sx={{
                              px: 3,
                              pb: 3,
                              pt: 2,
                              background:
                                "linear-gradient(180deg, rgba(255,248,240,0.035), rgba(255,255,255,0.015))",
                              borderTop: "1px solid rgba(255,255,255,0.04)",
                            }}
                          >
                            <Stack spacing={1.2}>
                              <Typography color={TEXT_SECONDARY}>
                                <strong>Mô tả:</strong>{" "}
                                {item.description || "Chưa có mô tả"}
                              </Typography>

                              <Typography color={TEXT_SECONDARY}>
                                <strong>Kích thước:</strong>{" "}
                                {Array.isArray(item.sizes) &&
                                item.sizes.length > 0
                                  ? item.sizes
                                      .map(
                                        (size) =>
                                          `${size.name}${
                                            size.quantity !== undefined
                                              ? ` (${size.quantity})`
                                              : ""
                                          }`
                                      )
                                      .join(", ")
                                  : "Không có"}
                              </Typography>

                              <Typography color={TEXT_SECONDARY}>
                                <strong>Lượt bán:</strong> {soldCount}
                              </Typography>

                              <Typography color={TEXT_SECONDARY}>
                                <strong>Ngày tạo:</strong>{" "}
                                {item.createAt
                                  ? format(
                                      parseISO(String(item.createAt)),
                                      "dd/MM/yyyy HH:mm"
                                    )
                                  : "-"}
                              </Typography>
                            </Stack>
                          </AccordionDetails>
                        </Accordion>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={10}
                  align="center"
                  sx={{
                    py: 5,
                    color: "rgba(255,255,255,0.62)",
                    borderBottomColor: "rgba(255,255,255,0.06)",
                  }}
                >
                  Không tìm thấy sản phẩm phù hợp
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredProducts.length}
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
          borderTop: "1px solid rgba(255,255,255,0.08)",
          ".MuiTablePagination-selectIcon": { color: "#fb923c" },
          ".MuiTablePagination-actions button": {
            color: TEXT_PRIMARY,
          },
          ".MuiTablePagination-select": {
            color: TEXT_PRIMARY,
          },
          ".MuiTablePagination-displayedRows": {
            color: TEXT_PRIMARY,
          },
        }}
      />

<Menu
  open={Boolean(statusMenuPosition)}
  onClose={handleCloseStatusMenu}
  anchorReference="anchorPosition"
  {...(statusMenuPosition && {
    anchorPosition: {
      top: statusMenuPosition.top,
      left: statusMenuPosition.left,
    },
  })}
  transformOrigin={{
    vertical: "top",
    horizontal: "left",
  }}
  disableScrollLock
  PaperProps={{
    sx: {
      mt: 1,
      minWidth: 180,
      
      color: TEXT_PRIMARY,
      border: isDark
        ? "1px solid rgba(255,255,255,0.08)"
        : "1px solid rgba(15,23,42,0.08)",
      borderRadius: "18px",
      boxShadow: isDark
        ? "0 18px 40px rgba(0,0,0,0.28)"
        : "0 14px 32px rgba(15,23,42,0.08)",
    },
  }}
>
  {PRODUCT_STATUSES.map((status) => (
    <MenuItem
      key={status}
      onClick={() => handleChangeProductStatus(status)}
    >
      {getStatusChipProps(status).label}
    </MenuItem>
  ))}
</Menu>

      <Dialog
        open={openExportDialog}
        onClose={() => setOpenExportDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {

            color: TEXT_PRIMARY,
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
            pb: 1,
            color: TEXT_PRIMARY,
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
            onClick={() => setOpenExportDialog(false)}
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
            startIcon={<Download />}
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
            <span className="text-slate-100">Xuất file</span>
            
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(productToDelete)}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: "24px",
            background: isDark
              ? "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(10,10,10,0.99))"
              : "linear-gradient(180deg, #ffffff, #fff7ed)",
            color: TEXT_PRIMARY,
            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(15,23,42,0.08)",
            boxShadow: isDark
              ? "0 24px 60px rgba(0,0,0,0.28)"
              : "0 18px 45px rgba(15,23,42,0.08)",
            minWidth: { xs: "auto", sm: 460 },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            pb: 1,
            color: TEXT_PRIMARY,
          }}
        >
          Xác nhận xóa sản phẩm
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            sx={{
              color: TEXT_SECONDARY,
              lineHeight: 1.8,
            }}
          >
            Bạn sắp xóa sản phẩm
            <Box component="span" sx={{ color: "#fdba74", fontWeight: 700 }}>
              {` ${productToDelete?.title || ""} `}
            </Box>
            khỏi hệ thống. Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 2.5,
              borderColor: isDark ? BORDER_SOFT : "rgba(249,115,22,0.22)",
              backgroundColor: isDark
                ? "transparent"
                : "rgba(255,255,255,0.68)",
            }}
          >
            Hủy
          </Button>

          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 2.8,
              color: "#fff7ed",
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
            }}
          >
            Xóa sản phẩm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}