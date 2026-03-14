import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { Product } from "../../../types/ProductType";
import {
  Box,
  Button,
  Chip,
  Menu,
  MenuItem,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Edit, KeyboardArrowDown, ExpandMore } from "@mui/icons-material";
import {
  fetchAllProducts,
  updateProductStatus,
} from "../../../state/admin/adminProduct";
import { format, parseISO } from "date-fns";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";
// TODO: tạo thunk này nếu bạn có API update status
// import { updateProductStatus } from "../../../state/admin/adminProductSlice";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0097e6",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// ---- Product status mapping ----
const PRODUCT_STATUSES = ["PENDING", "APPROVED", "REJECTED", "HIDDEN"] as const;
type ProductStatus = (typeof PRODUCT_STATUSES)[number];

const getStatusChipProps = (status: ProductStatus | string | undefined) => {
  switch (status) {
    case "APPROVED":
      return { color: "success" as const, variant: "outlined" as const };
    case "PENDING":
      return { color: "warning" as const, variant: "outlined" as const };
    case "REJECTED":
      return { color: "error" as const, variant: "outlined" as const };
    case "HIDDEN":
      return { color: "default" as const, variant: "outlined" as const };
    default:
      return { color: "default" as const, variant: "outlined" as const };
  }
};

export default function AdminProductTable() {
  const dispatch = useAppDispatch();
  const { adminProduct } = useAppSelector((store) => store);
  const [loading, setLoading] = React.useState(false);

  const [statusMenuAnchor, setStatusMenuAnchor] =
    React.useState<null | HTMLElement>(null);
  const [selectedProductId, setSelectedProductId] = React.useState<
    number | null
  >(null);

  React.useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleOpenStatusMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    productId: number
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

    // TODO: gọi API/thunk thực tế
    await dispatch(updateProductStatus({ id: selectedProductId, status }));
    await dispatch(fetchAllProducts());
    console.log("Change product status:", selectedProductId, status);
    setLoading(false);

    handleCloseStatusMenu();
  };

  return (
    <TableContainer component={Paper}>
      {loading && <CustomLoading message="Đang cập nhật..." />}

      <Table sx={{ minWidth: 900 }} aria-label="admin product table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Images</StyledTableCell>
            <StyledTableCell align="right">Title</StyledTableCell>
            <StyledTableCell align="right">MRP</StyledTableCell>
            <StyledTableCell align="right">Selling Price</StyledTableCell>
            <StyledTableCell align="right">Color</StyledTableCell>
            <StyledTableCell align="right">Stock</StyledTableCell>
            <StyledTableCell align="right">Status</StyledTableCell>
            <StyledTableCell align="right">Rating</StyledTableCell>
            <StyledTableCell align="right">Seller</StyledTableCell>
            <StyledTableCell align="right">Change Status</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {adminProduct.products.map((item: Product) => {
            const productStatus: ProductStatus | string =
              (item as any).status || "PENDING";

            const statusChipProps = getStatusChipProps(productStatus);
            const primaryImage = item.images?.[0];
            const extraImages = (item.images?.length || 0) - 1;

            return (
              <React.Fragment key={item.id}>
                {/* === MAIN ROW === */}
                <StyledTableRow>
                  <StyledTableCell>{item.id}</StyledTableCell>

                  {/* Images */}
                  <StyledTableCell component="th" scope="item">
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {primaryImage ? (
                        <Box
                          sx={{
                            position: "relative",
                            width: 64,
                            height: 64,
                            borderRadius: 1.5,
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={primaryImage}
                            alt={item.title || "product"}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          {extraImages > 0 && (
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 4,
                                right: 4,
                                px: 0.6,
                                py: 0.2,
                                borderRadius: 999,
                                fontSize: 10,
                                backgroundColor: "rgba(0,0,0,0.7)",
                                color: "white",
                              }}
                            >
                              +{extraImages}
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 1.5,
                            border: "1px dashed rgba(148,163,184,0.7)",
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
                    </Box>
                  </StyledTableCell>

                  {/* Title */}
                  <StyledTableCell align="right">{item.title}</StyledTableCell>

                  {/* Prices */}
                  <StyledTableCell align="right">
                    {item.mrpPrice}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {item.sellingPrice}
                  </StyledTableCell>

                  {/* Color */}
                  <StyledTableCell align="right">{item.color}</StyledTableCell>

                  {/* Stock (placeholder) */}
                  <StyledTableCell align="right">
                    <Button size="small">in_stock</Button>
                  </StyledTableCell>

                  {/* Product Status */}
                  <StyledTableCell align="right">
                    <Chip
                      size="small"
                      label={productStatus}
                      {...statusChipProps}
                      sx={{ borderRadius: 999, fontSize: 11 }}
                    />
                  </StyledTableCell>

                  {/* Rating */}
                  <StyledTableCell align="right">
                    {item.numRatings}
                  </StyledTableCell>

                  {/* Seller */}
                  <StyledTableCell align="right">
                    {item.seller?.businessDetails?.businessName}
                  </StyledTableCell>

                  {/* Change Status Button */}
                  <StyledTableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      endIcon={<KeyboardArrowDown />}
                      onClick={(e) => handleOpenStatusMenu(e, item.id!)}
                      sx={{
                        borderRadius: 999,
                        textTransform: "none",
                        px: 2,
                        fontSize: 13,
                      }}
                    >
                      Change
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>

                {/* === DETAIL ROW (Accordion) === */}
                <TableRow>
                  <TableCell colSpan={11} sx={{ p: 0, border: 0 }}>
                    <Accordion
                      elevation={0}
                      sx={{
                        boxShadow: "none",
                        borderTop: "1px dashed rgba(148, 163, 184, 0.5)",
                        "&::before": { display: "none" },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls={`panel-${item.id}-content`}
                        id={`panel-${item.id}-header`}
                        sx={{
                          px: 3,
                          py: 0.5,
                          "& .MuiAccordionSummary-content": {
                            my: 0.6,
                          },
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          View more details
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 3, pb: 2 }}>
                        <Stack spacing={0.75}>
                          <Typography variant="body2">
                            <strong>Description:</strong>{" "}
                            {(item as any).description || "-"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Category:</strong>{" "}
                            {(item as any).category?.name ||
                              (item as any).categoryId ||
                              "-"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Sizes:</strong>{" "}
                            {Array.isArray((item as any).sizes) &&
                            (item as any).sizes.length > 0
                              ? (item as any).sizes
                                  .map(
                                    (s: any) =>
                                      `${s.name}${
                                        s.quantity !== undefined
                                          ? ` (${s.quantity})`
                                          : ""
                                      }`
                                  )
                                  .join(", ")
                              : "-"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Total Quantity:</strong>{" "}
                            {(item as any).quantity ??
                              (Array.isArray((item as any).sizes)
                                ? (item as any).sizes.reduce(
                                    (sum: number, s: any) =>
                                      sum + (Number(s.quantity) || 0),
                                    0
                                  )
                                : 0)}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Created At:</strong>{" "}
                            {(item as any).createAt
                              ? format(
                                  parseISO((item as any).createAt),
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
          })}
        </TableBody>
      </Table>

      {/* Menu đổi trạng thái sản phẩm */}
      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={handleCloseStatusMenu}
      >
        {PRODUCT_STATUSES.map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleChangeProductStatus(status)}
          >
            {status}
          </MenuItem>
        ))}
      </Menu>
    </TableContainer>
  );
}
