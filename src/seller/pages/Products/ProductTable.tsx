import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Stack,
  Box,
  Tooltip,
  Divider,
  Rating,
  TextField,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import { Edit, ExpandMore, Search } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchSellerProducts } from "../../../state/seller/sellerProductSlice";
import { Product } from "../../../types/ProductType";
import { useNavigate } from "react-router-dom";
import { tableCellClasses } from "@mui/material/TableCell";

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
    borderBottomColor: "rgba(0,0,0,0.04)",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)",
    transform: "translateY(-1px)",
    transition: "all 0.15s ease-in-out",
  },
  transition: "all 0.15s ease-in-out",
}));

function formatCurrency(value?: number | null) {
  const num = value ?? 0;
  return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export default function ProductTable() {
  const dispatch = useAppDispatch();
  const { sellerProduct } = useAppSelector((store) => store);
  const navigate = useNavigate();

  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    dispatch(fetchSellerProducts());
  }, [dispatch]);

  const products: Product[] = sellerProduct?.products ?? [];

  const normalizedSearch = search.trim().toLowerCase();
  const filteredProducts = products.filter((item) => {
    if (!normalizedSearch) return true;
    const target = `${item.title ?? ""} ${item.description ?? ""} ${
      item.color ?? ""
    } ${item.id ?? ""}`.toLowerCase();
    return target.includes(normalizedSearch);
  });

  // Reset page khi filter thay đổi
  React.useEffect(() => {
    setPage(0);
  }, [normalizedSearch, products.length]);

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
      <Box sx={{ px: 3, pt: 3, pb: 1 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Quản lý sản phẩm
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Danh sách tất cả sản phẩm bạn đang bán trên hệ thống.
            </Typography>
          </Box>

          {/* Tìm kiếm */}
          <Box minWidth={260}>
            <TextField
              size="small"
              placeholder="Tìm theo tên, màu, mô tả..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          {filteredProducts.length} sản phẩm được tìm thấy
        </Typography>
      </Box>

      <Divider />

      <TableContainer>
        <Table sx={{ minWidth: 900 }} aria-label="seller products table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Product</StyledTableCell>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell align="right">MRP</StyledTableCell>
              <StyledTableCell align="right">Selling</StyledTableCell>
              <StyledTableCell align="center">Color</StyledTableCell>
              <StyledTableCell align="center">Stock</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length ? (
              paginatedProducts.map((item: Product) => {
                const primaryImage = item.images?.[0];
                const extraImages = (item.images?.length || 0) - 1;

                const totalQuantity =
                  item.quantity ??
                  item.sizes?.reduce(
                    (sum, s) => sum + (Number(s.quantity) || 0),
                    0
                  ) ??
                  0;

                const inStock = totalQuantity > 0;

                return (
                  <React.Fragment key={item.id}>
                    <StyledTableRow>
                      {/* Product image + count */}
                      <StyledTableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box
                            sx={{
                              position: "relative",
                              width: 70,
                              height: 70,
                              borderRadius: 2,
                              overflow: "hidden",
                              border: "1px solid rgba(148, 163, 184, 0.4)",
                              background:
                                "radial-gradient(circle at top, #f4f4ff, #e2e8f0)",
                            }}
                          >
                            {primaryImage ? (
                              <img
                                src={primaryImage}
                                alt={item.title || "product"}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 11,
                                  color: "text.secondary",
                                }}
                              >
                                No image
                              </Box>
                            )}

                            {extraImages > 0 && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  bottom: 6,
                                  right: 6,
                                  px: 0.7,
                                  py: 0.3,
                                  borderRadius: 999,
                                  fontSize: 10,
                                  backgroundColor: "rgba(15, 23, 42, 0.7)",
                                  color: "white",
                                }}
                              >
                                +{extraImages}
                              </Box>
                            )}
                          </Box>
                        </Stack>
                      </StyledTableCell>

                      {/* Title */}
                      <StyledTableCell>
                        <Stack spacing={0.5}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{ maxWidth: 260 }}
                            noWrap
                          >
                            {item.title ?? "-"}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ maxWidth: 260 }}
                            noWrap
                          >
                            {item.description ?? "Không có mô tả"}
                          </Typography>
                        </Stack>
                      </StyledTableCell>

                      {/* Prices */}
                      <StyledTableCell align="right">
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: "line-through" }}
                        >
                          {formatCurrency(item.mrpPrice)}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Typography
                          variant="body1"
                          fontWeight={700}
                          sx={{ fontFeatureSettings: "'tnum' on" }}
                        >
                          {formatCurrency(item.sellingPrice)}
                        </Typography>
                        {item.discountPercent ? (
                          <Chip
                            size="small"
                            label={`-${item.discountPercent}%`}
                            sx={{
                              mt: 0.5,
                              fontSize: 11,
                              fontWeight: 600,
                              borderRadius: 999,
                            }}
                            color="success"
                            variant="outlined"
                          />
                        ) : null}
                      </StyledTableCell>

                      {/* Color */}
                      <StyledTableCell align="center">
                        {item.color ? (
                          <Chip
                            size="small"
                            label={item.color}
                            sx={{
                              textTransform: "capitalize",
                              borderRadius: 999,
                            }}
                            variant="outlined"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </StyledTableCell>

                      {/* Stock */}
                      <StyledTableCell align="center">
                        <Chip
                          size="small"
                          label={inStock ? "In stock" : "Out of stock"}
                          color={inStock ? "primary" : "default"}
                          sx={{
                            borderRadius: 999,
                            minWidth: 90,
                            fontWeight: 500,
                          }}
                          variant={inStock ? "filled" : "outlined"}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          mt={0.5}
                        >
                          {totalQuantity} items
                        </Typography>
                      </StyledTableCell>
                      {/* Product Status */}
                      <StyledTableCell align="right">
                        <Chip
                          size="small"
                          label={(item as any).status || "PENDING"}
                          sx={{ borderRadius: 999, fontSize: 11 }}
                        />
                      </StyledTableCell>
                      {/* Actions */}
                      <StyledTableCell align="center">
                        <Tooltip title="Edit product">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              navigate(`/seller/edit-product/${item.id}`)
                            }
                            sx={{
                              borderRadius: 2,
                              border: "1px solid rgba(59,130,246,0.3)",
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>

                    {/* Accordion chi tiết */}
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        sx={{ p: 0, borderBottom: "none" }}
                      >
                        <Accordion
                          elevation={0}
                          sx={{
                            boxShadow: "none",
                            borderTop: "1px dashed rgba(148,163,184,0.4)",
                            "&::before": { display: "none" },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls={`panel-${item.id}-content`}
                            id={`panel-${item.id}-header`}
                            sx={{
                              px: 3,
                              py: 0.6,
                              "& .MuiAccordionSummary-content": {
                                my: 0.8,
                              },
                            }}
                          >
                            <Typography
                              variant="caption"
                              fontWeight={600}
                              color="text.secondary"
                            >
                              View more details
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ px: 3, pb: 2 }}>
                            <Stack spacing={1}>
                              <Typography variant="body2">
                                <strong>Description:</strong>{" "}
                                {item.description ?? "-"}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Sizes:</strong>{" "}
                                {item.sizes && item.sizes.length > 0
                                  ? item.sizes
                                      .map(
                                        (s) => `${s.name} (${s.quantity || 0})`
                                      )
                                      .join(", ")
                                  : "-"}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Total Quantity:</strong> {totalQuantity}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Discount %:</strong>{" "}
                                {item.discountPercent ?? 0}%
                              </Typography>
                              <Stack
                                direction="row"
                                alignItems="center"
                                gap={1}
                              >
                                <Typography variant="body2">
                                  <strong>Rating:</strong>
                                </Typography>
                                <Rating
                                  size="small"
                                  precision={0.5}
                                  value={item.numRatings || 0}
                                  readOnly
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  ({item.numRatings ?? 0})
                                </Typography>
                              </Stack>
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
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    {products.length
                      ? "Không có sản phẩm nào khớp với từ khóa tìm kiếm."
                      : "Hiện chưa có sản phẩm nào."}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      {filteredProducts.length > 0 && (
        <Box sx={{ px: 2, py: 1 }}>
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25]}
            count={filteredProducts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage="Số dòng mỗi trang"
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}
    </Paper>
  );
}
