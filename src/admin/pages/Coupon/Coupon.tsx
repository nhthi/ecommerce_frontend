import {
  Add,
  Check,
  Close,
  DeleteOutline,
  EditOutlined,
  LocalOffer,
  Search,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Switch,
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  deleteCoupon,
  fetchAllCoupons,
  updateCoupon,
} from "../../../state/admin/adminCouponSlice";
import { formatCurrencyVND } from "../../../utils/formatCurrencyVND";
import { Coupon as CouponType } from "../../../types/CouponType";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
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

const panelSx = {
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
  overflow: "hidden",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    borderRadius: "18px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(249,115,22,0.4)" },
    "&.Mui-focused fieldset": { borderColor: "#f97316" },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.58)" },
  "& .MuiFormHelperText-root": { color: "#fca5a5" },
};

type CouponFormState = {
  name: string;
  code: string;
  discountPercentage: number;
  validityStartDate: Dayjs | null;
  validityEndDate: Dayjs | null;
  minimumOrderValue: number;
  maximumOrderValue: number;
  quantity: number;
  active: boolean;
};

const createInitialFormState = (
  coupon?: CouponType | null
): CouponFormState => ({
  name: coupon?.name || "",
  code: coupon?.code || "",
  discountPercentage: coupon?.discountPercentage || 0,
  validityStartDate: coupon?.validityStartDate
    ? dayjs(coupon.validityStartDate)
    : null,
  validityEndDate: coupon?.validityEndDate
    ? dayjs(coupon.validityEndDate)
    : null,
  minimumOrderValue: coupon?.minimumOrderValue || 0,
  maximumOrderValue: coupon?.maximumOrderValue || 0,
  quantity: coupon?.quantity || 1,
  active: Boolean(coupon?.active),
});

const Coupon = () => {
    const { isDark } = useSiteThemeMode();
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { coupon } = useAppSelector((store) => store);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [editingCoupon, setEditingCoupon] = useState<CouponType | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<CouponType | null>(null);
  const [formValues, setFormValues] = useState<CouponFormState>(
    createInitialFormState()
  );
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchAllCoupons());
  }, [dispatch]);

  const filteredCoupons = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return (
      coupon.coupons?.filter((item) => {
        const matchStatus =
          statusFilter === "all"
            ? true
            : statusFilter === "active"
            ? item.active
            : !item.active;

        const matchKeyword = keyword
          ? item.code?.toLowerCase().includes(keyword) ||
            item.name?.toLowerCase().includes(keyword)
          : true;

        return matchStatus && matchKeyword;
      }) || []
    );
  }, [coupon.coupons, statusFilter, searchKeyword]);

  const paginatedCoupons = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredCoupons.slice(start, end);
  }, [filteredCoupons, page, rowsPerPage]);

  useEffect(() => {
    setPage(0);
  }, [statusFilter, searchKeyword]);

  useEffect(() => {
    const maxPage = Math.max(
      0,
      Math.ceil(filteredCoupons.length / rowsPerPage) - 1
    );
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filteredCoupons.length, rowsPerPage, page]);

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleOpenEdit = (couponItem: CouponType) => {
    setEditingCoupon(couponItem);
    setFormValues(createInitialFormState(couponItem));
  };

  const handleCloseEdit = () => {
    setEditingCoupon(null);
    setFormValues(createInitialFormState());
  };

  const handleFormChange = <K extends keyof CouponFormState>(
    key: K,
    value: CouponFormState[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitEdit = async () => {
    if (!editingCoupon?.id) return;
    setSubmitting(true);

    try {
      await dispatch(
        updateCoupon({
          id: editingCoupon.id,
          data: {
            id: editingCoupon.id,
            name: formValues.name,
            code: formValues.code,
            discountPercentage: Number(formValues.discountPercentage),
            validityStartDate: formValues.validityStartDate
              ? formValues.validityStartDate.toISOString()
              : null,
            validityEndDate: formValues.validityEndDate
              ? formValues.validityEndDate.toISOString()
              : null,
            minimumOrderValue: Number(formValues.minimumOrderValue),
            maximumOrderValue: Number(formValues.maximumOrderValue),
            quantity: Number(formValues.quantity),
            active: formValues.active,
          },
        })
      ).unwrap();

      setSnackbar({
        open: true,
        message: "Cap nhat coupon thanh cong",
        severity: "success",
      });
      handleCloseEdit();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error || "Cap nhat coupon that bai",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCoupon?.id) return;
    setSubmitting(true);
    try {
      await dispatch(deleteCoupon(deletingCoupon.id)).unwrap();
      setSnackbar({
        open: true,
        message: "Xoa coupon thanh cong",
        severity: "success",
      });
      setDeletingCoupon(null);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error || "Xoa coupon that bai",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={0} sx={panelSx}>
        {submitting && <CustomLoading message="Dang xu ly coupon..." />}

        <Box
          sx={{
            px: 3,
            py: 3,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Stack
            direction={{ xs: "column", lg: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontSize={26} fontWeight={800} color="white">
                Mã giảm giá
              </Typography>
              
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.2}
              alignItems="center"
              flexWrap="wrap"
            >
              <TextField
                size="small"
                placeholder="Tìm theo mã hoặc tên coupon..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                sx={{
                  minWidth: { xs: "100%", sm: 280 },
                  ...fieldSx,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#fb923c", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Select
                size="small"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                sx={{
                  minWidth: 180,
                  color: "white",
                  borderRadius: "16px",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.12)",
                  },
                  "& .MuiSvgIcon-root": { color: "#fb923c" },
                }}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="active">Đang hoạt động</MenuItem>
                <MenuItem value="inactive">Ngưng hoạt động</MenuItem>
              </Select>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate("/admin/add-coupon")}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  px: 2.5,
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                }}
              >
                Tạo mã mới
              </Button>
            </Stack>
          </Stack>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Tên</StyledTableCell>
<StyledTableCell>Mã</StyledTableCell>
<StyledTableCell>Ngày bắt đầu</StyledTableCell>
<StyledTableCell>Ngày kết thúc</StyledTableCell>
<StyledTableCell align="right">Đơn tối thiểu</StyledTableCell>
<StyledTableCell align="right">Đơn tối đa</StyledTableCell>
<StyledTableCell align="center">Giảm giá</StyledTableCell>
<StyledTableCell align="center">Trạng thái</StyledTableCell>
<StyledTableCell align="right">Thao tác</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedCoupons.length ? (
                paginatedCoupons.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <LocalOffer sx={{ color: "#fb923c" }} />
                        <Box>
                          <Typography fontWeight={700}>{row.name}</Typography>
                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.52)",
                              fontSize: 12.5,
                            }}
                          >
                            ID #{row.id}
                          </Typography>
                        </Box>
                      </Stack>
                    </StyledTableCell>

                    <StyledTableCell>{row.code}</StyledTableCell>
                    <StyledTableCell>{row.validityStartDate}</StyledTableCell>
                    <StyledTableCell>{row.validityEndDate}</StyledTableCell>
                    <StyledTableCell align="right">
                      {formatCurrencyVND(row.minimumOrderValue)}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {formatCurrencyVND(row.maximumOrderValue)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Chip
                        size="small"
                        label={`${row.discountPercentage}%`}
                        sx={{
                          color: "#fff7ed",
                          backgroundColor: "rgba(249,115,22,0.12)",
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Chip
                        size="small"
                        variant="outlined"
                        label={row.active ? "Đang hoạt động" : "Ngưng hoạt động"}
                        icon={
                          row.active ? (
                            <Check fontSize="small" />
                          ) : (
                            <Close fontSize="small" />
                          )
                        }
                        sx={{
                          borderRadius: 999,
                          color: row.active ? "#86efac" : "#d4d4d8",
                          borderColor: row.active
                            ? "rgba(34,197,94,0.35)"
                            : "rgba(161,161,170,0.25)",
                          backgroundColor: row.active
                            ? "rgba(34,197,94,0.08)"
                            : "rgba(161,161,170,0.08)",
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="flex-end"
                      >
                        <IconButton
                          size="small"
                          sx={{ color: "#fdba74" }}
                          onClick={() => handleOpenEdit(row)}
                        >
                          <EditOutlined fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "#fca5a5" }}
                          onClick={() => setDeletingCoupon(row)}
                        >
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      </Stack>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    align="center"
                    sx={{ py: 8, color: "rgba(255,255,255,0.6)" }}
                  >
                    Không tìm thấy mã giảm giá phù hợp
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.01)",
          }}
        >
          <TablePagination
            component="div"
            count={filteredCoupons.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20, 50]}
            labelRowsPerPage="So dong:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} / ${count !== -1 ? count : `hon ${to}`}`
            }
            sx={{
              color: "white",
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  color: "rgba(255,255,255,0.72)",
                },
              "& .MuiSvgIcon-root": {
                color: "#fb923c",
              },
              "& .MuiIconButton-root": {
                color: "white",
              },
              "& .Mui-disabled": {
                color: "rgba(255,255,255,0.28) !important",
              },
            }}
          />
        </Box>

<Dialog
  open={Boolean(editingCoupon)}
  onClose={handleCloseEdit}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: "28px",
      background: isDark
        ? "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(10,10,10,0.99))"
        : "linear-gradient(180deg, #ffffff, #fff7ed)",
      color: isDark ? "white" : "#111827",
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
    }}
  >
    Cập nhật coupon
  </DialogTitle>

  <DialogContent>
    <Grid container spacing={2.2} sx={{ mt: 0.2 }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Tên mã giảm giá"
          value={formValues.name}
          onChange={(e) => handleFormChange("name", e.target.value)}
          sx={fieldSx}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <TextField
          fullWidth
          label="Mã giảm giá"
          value={formValues.code}
          onChange={(e) => handleFormChange("code", e.target.value)}
          sx={fieldSx}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <TextField
          fullWidth
          type="number"
          label="Phần trăm giảm"
          value={formValues.discountPercentage}
          onChange={(e) =>
            handleFormChange(
              "discountPercentage",
              Number(e.target.value)
            )
          }
          sx={fieldSx}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <DatePicker
          label="Ngày bắt đầu"
          value={formValues.validityStartDate}
          onChange={(value) =>
            handleFormChange("validityStartDate", value)
          }
          sx={{ width: "100%", ...fieldSx }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <DatePicker
          label="Ngày kết thúc"
          value={formValues.validityEndDate}
          onChange={(value) =>
            handleFormChange("validityEndDate", value)
          }
          sx={{ width: "100%", ...fieldSx }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          type="number"
          label="Đơn tối thiểu"
          value={formValues.minimumOrderValue}
          onChange={(e) =>
            handleFormChange("minimumOrderValue", Number(e.target.value))
          }
          sx={fieldSx}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          type="number"
          label="Đơn tối đa"
          value={formValues.maximumOrderValue}
          onChange={(e) =>
            handleFormChange("maximumOrderValue", Number(e.target.value))
          }
          sx={fieldSx}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          type="number"
          label="Số lượng mã"
          value={formValues.quantity}
          onChange={(e) =>
            handleFormChange("quantity", Number(e.target.value))
          }
          sx={fieldSx}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Switch
            checked={formValues.active}
            onChange={(e) =>
              handleFormChange("active", e.target.checked)
            }
          />
          <Typography color={isDark ? "rgba(255,255,255,0.84)" : "rgba(17,24,39,0.84)"}>
            Kích hoạt Coupon
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2.5 }}>
    <Button
      onClick={handleCloseEdit}
      variant="outlined"
      sx={{
        borderRadius: 999,
        textTransform: "none",
        px: 2.5,
        color: isDark ? "rgba(255,255,255,0.82)" : "rgba(17,24,39,0.82)",
        borderColor: isDark
          ? "rgba(255,255,255,0.12)"
          : "rgba(15,23,42,0.12)",
        backgroundColor: isDark ? "transparent" : "rgba(255,255,255,0.68)",
      }}
    >
      Hủy
    </Button>

    <Button
      onClick={handleSubmitEdit}
      variant="contained"
      sx={{
        borderRadius: 999,
        textTransform: "none",
        px: 2.8,
        background: "linear-gradient(135deg, #f97316, #ea580c)",
      }}
    >
      Lưu thay đổi
    </Button>
  </DialogActions>
</Dialog>

        <Dialog
  open={Boolean(deletingCoupon)}
  onClose={() => setDeletingCoupon(null)}
  PaperProps={{
    sx: {
      borderRadius: "24px",
      background: isDark
        ? "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(10,10,10,0.99))"
        : "linear-gradient(180deg, #ffffff, #fff7ed)",
      color: isDark ? "white" : "#111827",
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
    }}
  >
    Xác nhận xóa Coupon
  </DialogTitle>

  <DialogContent>
    <Typography
      sx={{
        color: isDark ? "rgba(255,255,255,0.72)" : "rgba(17,24,39,0.72)",
        lineHeight: 1.8,
      }}
    >
      Bạn sắp xóa mã{" "}
      <Box component="span" sx={{ color: "#fdba74", fontWeight: 700 }}>
        {deletingCoupon?.name || deletingCoupon?.code}
      </Box>
      . Hành động này không thể hoàn tác.
    </Typography>
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2.5 }}>
    <Button
      onClick={() => setDeletingCoupon(null)}
      variant="outlined"
      sx={{
        borderRadius: 999,
        textTransform: "none",
        px: 2.5,
        color: isDark ? "rgba(255,255,255,0.82)" : "rgba(17,24,39,0.82)",
        borderColor: isDark
          ? "rgba(255,255,255,0.12)"
          : "rgba(15,23,42,0.12)",
        backgroundColor: isDark ? "transparent" : "rgba(255,255,255,0.68)",
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
        background: "linear-gradient(135deg, #ef4444, #dc2626)",
      }}
    >
      Xóa Coupon
    </Button>
  </DialogActions>
</Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </LocalizationProvider>
  );
};

export default Coupon;