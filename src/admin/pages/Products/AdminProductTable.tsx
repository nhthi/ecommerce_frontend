import * as React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Chip,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TablePagination,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { ExpandMore, KeyboardArrowDown, Inventory2, Star } from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { Product } from "../../../types/ProductType";
import { fetchAllProducts, updateProductStatus } from "../../../state/admin/adminProduct";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
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
}));

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
      return { label: "Da duyet", sx: { color: "#86efac", borderColor: "rgba(34,197,94,0.35)", backgroundColor: "rgba(34,197,94,0.08)" } };
    case "PENDING":
      return { label: "Cho duyet", sx: { color: "#fdba74", borderColor: "rgba(249,115,22,0.35)", backgroundColor: "rgba(249,115,22,0.08)" } };
    case "REJECTED":
      return { label: "Tu choi", sx: { color: "#fca5a5", borderColor: "rgba(239,68,68,0.35)", backgroundColor: "rgba(239,68,68,0.08)" } };
    case "HIDDEN":
      return { label: "An", sx: { color: "#d4d4d8", borderColor: "rgba(161,161,170,0.25)", backgroundColor: "rgba(161,161,170,0.08)" } };
    default:
      return { label: status || "Khong ro", sx: { color: "#e5e7eb", borderColor: "rgba(255,255,255,0.16)" } };
  }
};

const panelSx = {
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
  overflow: "hidden",
};

export default function AdminProductTable() {
  const dispatch = useAppDispatch();
  const { adminProduct } = useAppSelector((store) => store);
  const [loading, setLoading] = React.useState(false);
  const [statusMenuAnchor, setStatusMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [selectedProductId, setSelectedProductId] = React.useState<number | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);

  React.useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  React.useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(adminProduct.products.length / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [adminProduct.products.length, page, rowsPerPage]);

  const handleOpenStatusMenu = (event: React.MouseEvent<HTMLButtonElement>, productId: number) => {
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

  const paginatedProducts = adminProduct.products.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper elevation={0} sx={panelSx}>
      {loading && <CustomLoading message="Dang cap nhat san pham..." />}

      <Box sx={{ px: 3, py: 3, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography fontSize={26} fontWeight={800} color="white">San pham</Typography>
            <Typography sx={{ mt: 0.7, color: "rgba(255,255,255,0.62)", fontSize: 14.5 }}>
              Duyet san pham, kiem tra ton kho va xu ly thong tin seller trong mot bang de doc.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Chip icon={<Inventory2 sx={{ color: "#fb923c !important" }} />} label={`${adminProduct.products.length} san pham`} variant="outlined" sx={{ color: "#fff7ed", borderColor: "rgba(249,115,22,0.28)" }} />
          </Stack>
        </Stack>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 1080 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>San pham</StyledTableCell>
              <StyledTableCell>Gia</StyledTableCell>
              <StyledTableCell>Mau</StyledTableCell>
              <StyledTableCell>Ton kho</StyledTableCell>
              <StyledTableCell>Trang thai</StyledTableCell>
              <StyledTableCell>Danh gia</StyledTableCell>
              <StyledTableCell>Seller</StyledTableCell>
              <StyledTableCell align="right">Tac vu</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((item: Product) => {
              const productStatus: ProductStatus | string = (item as any).status || "PENDING";
              const statusChip = getStatusChipProps(productStatus);
              const totalQuantity = (item as any).quantity ?? (Array.isArray((item as any).sizes)
                ? (item as any).sizes.reduce((sum: number, size: any) => sum + (Number(size.quantity) || 0), 0)
                : 0);

              return (
                <React.Fragment key={item.id}>
                  <StyledTableRow>
                    <StyledTableCell>#{item.id}</StyledTableCell>
                    <StyledTableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar variant="rounded" src={item.images?.[0] || ""} sx={{ width: 64, height: 64, borderRadius: "18px", bgcolor: "rgba(249,115,22,0.1)" }} />
                        <Box sx={{ maxWidth: 280 }}>
                          <Typography fontWeight={700}>{item.title}</Typography>
                          <Typography sx={{ mt: 0.4, color: "rgba(255,255,255,0.58)", fontSize: 13.5 }}>
                            {(item as any).category?.name || (item as any).categoryId || "Chua gan danh muc"}
                          </Typography>
                        </Box>
                      </Stack>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography fontWeight={700}>{item.sellingPrice}</Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 12.5 }}>MRP: {item.mrpPrice}</Typography>
                    </StyledTableCell>
                    <StyledTableCell>{item.color || "-"}</StyledTableCell>
                    <StyledTableCell>
                      <Chip size="small" label={`${totalQuantity} sp`} sx={{ color: "#fff7ed", backgroundColor: "rgba(249,115,22,0.12)" }} />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Chip size="small" variant="outlined" label={statusChip.label} sx={{ borderRadius: 999, ...statusChip.sx }} />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Stack direction="row" spacing={0.6} alignItems="center">
                        <Star sx={{ fontSize: 16, color: "#fb923c" }} />
                        <Typography>{item.numRatings || 0}</Typography>
                      </Stack>
                    </StyledTableCell>
                    <StyledTableCell>{item.seller?.businessDetails?.businessName || "Khong ro"}</StyledTableCell>
                    <StyledTableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        endIcon={<KeyboardArrowDown />}
                        onClick={(e) => handleOpenStatusMenu(e, item.id!)}
                        sx={{ borderRadius: 999, textTransform: "none", px: 2, color: "#fff7ed", borderColor: "rgba(255,255,255,0.16)" }}
                      >
                        Doi trang thai
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>

                  <TableRow>
                    <TableCell colSpan={9} sx={{ p: 0, border: 0, backgroundColor: "#0d0d0d" }}>
                      <Accordion elevation={0} sx={{ backgroundColor: "transparent", color: "white", boxShadow: "none", "&::before": { display: "none" } }}>
                        <AccordionSummary expandIcon={<ExpandMore sx={{ color: "#fb923c" }} />} sx={{ px: 3, minHeight: 52, borderTop: "1px dashed rgba(255,255,255,0.08)" }}>
                          <Typography sx={{ color: "#fdba74", fontWeight: 600, fontSize: 13.5 }}>Xem them chi tiet san pham</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 3, pb: 3 }}>
                          <Stack spacing={1}>
                            <Typography><strong>Mo ta:</strong> {(item as any).description || "Chua co mo ta"}</Typography>
                            <Typography>
                              <strong>Sizes:</strong>{" "}
                              {Array.isArray((item as any).sizes) && (item as any).sizes.length > 0
                                ? (item as any).sizes.map((s: any) => `${s.name}${s.quantity !== undefined ? ` (${s.quantity})` : ""}`).join(", ")
                                : "Khong co"}
                            </Typography>
                            <Typography>
                              <strong>Tao luc:</strong>{" "}
                              {(item as any).createAt ? format(parseISO((item as any).createAt), "dd/MM/yyyy HH:mm") : "-"}
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
      </TableContainer>

      <TablePagination
        component="div"
        count={adminProduct.products.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[6, 10, 20]}
        sx={{
          color: "rgba(255,255,255,0.78)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          ".MuiTablePagination-selectIcon": { color: "#fb923c" },
          ".MuiTablePagination-actions button": { color: "rgba(255,255,255,0.78)" },
        }}
      />

      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={handleCloseStatusMenu}
        PaperProps={{
          sx: {
            backgroundColor: "#171717",
            color: "white",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "18px",
            mt: 1,
          },
        }}
      >
        {PRODUCT_STATUSES.map((status) => (
          <MenuItem key={status} onClick={() => handleChangeProductStatus(status)}>
            {getStatusChipProps(status).label}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
}
