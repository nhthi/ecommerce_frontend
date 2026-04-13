import * as React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  EditOutlined,
  ExpandMore,
  Inventory2,
  KeyboardArrowDown,
  Search,
  Star,
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";
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

const TEXT_PRIMARY = "#fff7ed";
const TEXT_SECONDARY = "rgba(255, 237, 213, 0.78)";
const TEXT_MUTED = "rgba(255, 237, 213, 0.58)";
const BORDER_SOFT = "rgba(251, 146, 60, 0.14)";

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

const StyledTableRow = styled(TableRow)({
  "&:hover": {
    backgroundColor: "rgba(249,115,22,0.05)",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
});

const PRODUCT_STATUSES = ["PENDING", "APPROVED", "REJECTED", "HIDDEN"] as const;
type ProductStatus = (typeof PRODUCT_STATUSES)[number];

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

const panelSx = {
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
  overflow: "hidden",
};

export default function AdminProductTable() {
  const { isDark } = useSiteThemeMode();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { adminProduct } = useAppSelector((store) => store);

  const [loading, setLoading] = React.useState(false);
  const [statusMenuAnchor, setStatusMenuAnchor] =
    React.useState<null | HTMLElement>(null);
  const [selectedProductId, setSelectedProductId] = React.useState<
    number | null
  >(null);
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(
    null,
  );
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredProducts = React.useMemo(() => {
    const products = adminProduct.products || [];

    if (!normalizedSearch) return products;

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

      return (
        title.includes(normalizedSearch) ||
        categoryName.includes(normalizedSearch) ||
        color.includes(normalizedSearch) ||
        createdBy.includes(normalizedSearch) ||
        productId.includes(normalizedSearch) ||
        status.includes(normalizedSearch)
      );
    });
  }, [adminProduct.products, normalizedSearch]);

  React.useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  React.useEffect(() => {
    const maxPage = Math.max(
      0,
      Math.ceil(filteredProducts.length / rowsPerPage) - 1,
    );
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filteredProducts.length, page, rowsPerPage]);

  const handleOpenStatusMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    productId: number,
  ) => {
    setStatusMenuAnchor(event.currentTarget);
    setSelectedProductId(productId);
  };

  const handleCloseStatusMenu = () => {
    setStatusMenuAnchor(null);
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

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
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
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/admin/products/create")}
              sx={{
                borderRadius: 999,
                px: 2.5,
                textTransform: "none",
                fontWeight: 700,
                color: "#111111",
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                boxShadow: "0 14px 30px rgba(249,115,22,0.22)",
                "&:hover": {
                  background: "linear-gradient(135deg, #fb923c, #ea580c)",
                },
              }}
            >
              Thêm sản phẩm
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
                        0,
                      )
                    : 0);

                const soldCount =
                  Number((item as Product & { sold?: number }).sold) || 0;

                return (
                  <React.Fragment key={item.id}>
                    <StyledTableRow>
                      <StyledTableCell>#{item.id}</StyledTableCell>

                      <StyledTableCell>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
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
                          {item.sellingPrice}
                        </Typography>
                        <Typography sx={{ color: TEXT_MUTED, fontSize: 12.5 }}>
                          Giá gốc: {item.mrpPrice}
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
                            expandIcon={
                              <ExpandMore sx={{ color: "#fb923c" }} />
                            }
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
                                          }`,
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
                                      "dd/MM/yyyy HH:mm",
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
            color: TEXT_SECONDARY,
          },
        }}
      />

      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={handleCloseStatusMenu}
        PaperProps={{
          sx: {
            background: isDark
              ? "#171717"
              : "linear-gradient(180deg, #ffffff, #fff7ed)",
            color: TEXT_PRIMARY,
            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(15,23,42,0.08)",
            borderRadius: "18px",
            boxShadow: isDark
              ? "0 18px 40px rgba(0,0,0,0.28)"
              : "0 14px 32px rgba(15,23,42,0.08)",
            mt: 1,
            ".MuiMenuItem-root": {
              color: TEXT_PRIMARY,
            },
            ".MuiMenuItem-root:hover": {
              backgroundColor: isDark
                ? "rgba(249,115,22,0.1)"
                : "rgba(249,115,22,0.08)",
            },
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
              // color: TEXT_PRIMARY,
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
