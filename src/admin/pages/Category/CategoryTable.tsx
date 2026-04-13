import { DeleteOutline, Edit, FolderOpen, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  deleteCategory,
  fetchAllCategory,
  updateCategory,
} from "../../../state/admin/adminCategorySlice";
import { Category as CategoryType } from "../../../types/CategoryType";
import { CategoryFormValues } from "./AddNewCategory";
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
    borderRadius: "16px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(249,115,22,0.4)" },
    "&.Mui-focused fieldset": { borderColor: "#f97316" },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.58)" },
  "& .MuiFormHelperText-root": { color: "#fca5a5" },
};

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Tên danh mục không được để trống"),
  categoryId: Yup.string()
    .trim()
    .required("Mã danh mục không được để trống")
    .min(3)
    .max(30),
  level: Yup.number().required("Vui lòng chọn cấp độ"),
  parentId: Yup.string().nullable(),
});

const Category = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { category } = useAppSelector((store) => store);
  const { isDark } = useSiteThemeMode();

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryType | null>(null);
  const [filterLevel, setFilterLevel] = useState<number | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const categoryList = Array.isArray(category?.categories)
    ? category.categories
    : [];

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredCategories = categoryList.filter((item) => {
    const matchLevel =
      filterLevel === "all" ? true : item.level === filterLevel;

    const matchSearch =
      normalizedSearch === "" ||
      item.name?.toLowerCase().includes(normalizedSearch) ||
      item.categoryId?.toLowerCase().includes(normalizedSearch) ||
      item.parentCategory?.name?.toLowerCase().includes(normalizedSearch) ||
      item.parentCategory?.categoryId?.toLowerCase().includes(normalizedSearch);

    return matchLevel && matchSearch;
  });

  const paginatedCategories = filteredCategories.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formik = useFormik<CategoryFormValues>({
    initialValues: { name: "", categoryId: "", level: 1, parentId: null },
    validationSchema,
    onSubmit: async (values) => {
      if (!selectedCategory) return;
      await dispatch(
        updateCategory({ request: values, id: Number(selectedCategory.id) })
      );
      handleClose();
    },
    enableReinitialize: true,
  });

  const handleEditClick = (categoryItem: CategoryType) => {
    setSelectedCategory(categoryItem);
    formik.setValues({
      name: categoryItem.name || "",
      categoryId: categoryItem.categoryId,
      level: categoryItem.level,
      parentId: categoryItem.parentCategory?.id || null,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
    formik.resetForm();
  };

  const handleOpenDeleteDialog = (categoryItem: CategoryType) => {
    setDeleteTarget(categoryItem);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id) return;
    await dispatch(deleteCategory(Number(deleteTarget.id)));
    handleCloseDeleteDialog();
  };

  useEffect(() => {
    dispatch(fetchAllCategory());
  }, [dispatch]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, filterLevel]);

  return (
    <>
      <Paper elevation={0} sx={panelSx}>
        <Box
          sx={{
            px: 3,
            py: 3,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={2}
            alignItems="center"
          >
            <Box>
              <Typography fontSize={26} fontWeight={800} color="white">
                Danh mục
              </Typography>
              
            </Box>

            <Box display="flex" gap={1.2} alignItems="center" flexWrap="wrap">
              <TextField
                size="small"
                placeholder="Tìm theo tên, mã, danh mục cha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  minWidth: 300,
                  ...fieldSx,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "rgba(255,255,255,0.5)" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel sx={{ color: "rgba(255,255,255,0.58)" }}>
                  Lọc cấp độ
                </InputLabel>
                <Select
                  value={filterLevel}
                  label="Lọc cấp độ"
                  onChange={(event: SelectChangeEvent<string | number>) =>
                    setFilterLevel(
                      event.target.value === "all"
                        ? "all"
                        : Number(event.target.value)
                    )
                  }
                  sx={{
                    color: "white",
                    borderRadius: "16px",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.12)",
                    },
                    "& .MuiSvgIcon-root": { color: "#fb923c" },
                  }}
                >
                  <MenuItem value="all">Tất cả cấp độ</MenuItem>
                  <MenuItem value={1}>Cấp 1</MenuItem>
                  <MenuItem value={2}>Cấp 2</MenuItem>
                  <MenuItem value={3}>Cấp 3</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={() => navigate("/admin/add-category")}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  px: 2.5,
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                }}
              >
                Thêm danh mục
              </Button>
            </Box>
          </Box>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 920 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Danh mục</StyledTableCell>
                <StyledTableCell>Mã</StyledTableCell>
                <StyledTableCell>Cấp độ</StyledTableCell>
                <StyledTableCell>Danh mục cha</StyledTableCell>
                <StyledTableCell align="center">Cập nhật</StyledTableCell>
                <StyledTableCell align="center">Xóa</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedCategories.length > 0 ? (
                paginatedCategories.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.2 }}
                      >
                        <FolderOpen sx={{ color: "#fb923c" }} />
                        <Typography fontWeight={700}>{row.name}</Typography>
                      </Box>
                    </StyledTableCell>

                    <StyledTableCell>{row.categoryId}</StyledTableCell>

                    <StyledTableCell>
                      <Chip
                        size="small"
                        label={`Cấp ${row.level}`}
                        sx={{
                          color: "#fff7ed",
                          backgroundColor: "rgba(249,115,22,0.12)",
                        }}
                      />
                    </StyledTableCell>

                    <StyledTableCell>
                      {row.parentCategory?.categoryId || "-"}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <IconButton
                        onClick={() => handleEditClick(row)}
                        sx={{ color: "#fdba74" }}
                      >
                        <Edit />
                      </IconButton>
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <IconButton
                        sx={{ color: "#fca5a5" }}
                        onClick={() => handleOpenDeleteDialog(row)}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      py: 5,
                      color: "rgba(255,255,255,0.6)",
                      borderBottomColor: "rgba(255,255,255,0.06)",
                    }}
                  >
                    Không tìm thấy danh mục phù hợp
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={filteredCategories.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[6, 10, 20]}
            labelRowsPerPage="Số dòng mỗi trang:"
            sx={{
              color: "rgba(255,255,255,0.72)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          />
        </TableContainer>
      </Paper>

<Dialog
  open={open}
  onClose={handleClose}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    sx: {
      background: isDark
        ? "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(10,10,10,0.99))"
        : "linear-gradient(180deg, #ffffff, #fff7ed)",
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
    }}
  >
    Cập nhật danh mục
  </DialogTitle>

  <form onSubmit={formik.handleSubmit}>
    <DialogContent sx={{ mt: 0.5 }}>
      <Box display="grid" gap={2}>
        <TextField
          fullWidth
          name="name"
          label="Tên danh mục"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          sx={fieldSx}
        />

        <TextField
          fullWidth
          name="categoryId"
          label="Mã danh mục"
          value={formik.values.categoryId}
          onChange={formik.handleChange}
          error={
            formik.touched.categoryId &&
            Boolean(formik.errors.categoryId)
          }
          helperText={
            formik.touched.categoryId && formik.errors.categoryId
          }
          sx={fieldSx}
        />

        <FormControl fullWidth sx={fieldSx}>
          <InputLabel>Cấp độ</InputLabel>
          <Select
            name="level"
            value={formik.values.level}
            label="Cấp độ"
            onChange={formik.handleChange}
          >
            <MenuItem value={1}>Cấp 1</MenuItem>
            <MenuItem value={2}>Cấp 2</MenuItem>
            <MenuItem value={3}>Cấp 3</MenuItem>
          </Select>
        </FormControl>

        {formik.values.level > 1 && (
          <FormControl fullWidth sx={fieldSx}>
            <InputLabel>Danh mục cha</InputLabel>
            <Select
              name="parentId"
              value={formik.values.parentId || ""}
              label="Danh mục cha"
              onChange={formik.handleChange}
            >
              {category.categories
                .filter((item) => item.level === formik.values.level - 1)
                .map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
      </Box>
    </DialogContent>

    <DialogActions sx={{ px: 3, pb: 3 }}>
      <Button
        onClick={handleClose}
        sx={{
          textTransform: "none",
          color: isDark ? "rgba(255,255,255,0.72)" : "rgba(17,24,39,0.72)",
          backgroundColor: isDark ? "transparent" : "rgba(255,255,255,0.68)",
          borderRadius: 999,
        }}
      >
        Hủy
      </Button>

      <Button
        type="submit"
        variant="contained"
        sx={{
          borderRadius: 999,
          textTransform: "none",
          px: 2.5,
          background: "linear-gradient(135deg, #f97316, #ea580c)",
        }}
      >
        Lưu thay đổi
      </Button>
    </DialogActions>
  </form>
</Dialog>

      <Dialog
  open={Boolean(deleteTarget)}
  onClose={handleCloseDeleteDialog}
  PaperProps={{
    sx: {
      background: isDark
        ? "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(10,10,10,0.99))"
        : "linear-gradient(180deg, #ffffff, #fff7ed)",
      color: isDark ? "white" : "#111827",
      borderRadius: "24px",
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
      color: isDark ? "white" : "#111827",
    }}
  >
    Xác nhận xóa danh mục
  </DialogTitle>

  <DialogContent>
    <DialogContentText
      sx={{
        color: isDark ? "rgba(255,255,255,0.72)" : "rgba(17,24,39,0.72)",
        lineHeight: 1.8,
      }}
    >
      Bạn sắp xóa danh mục
      <Box component="span" sx={{ color: "#fdba74", fontWeight: 700 }}>
        {` ${deleteTarget?.name || ""} `}
      </Box>
      khỏi hệ thống. Hành động này không thể hoàn tác.
    </DialogContentText>
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 3 }}>
    <Button
      onClick={handleCloseDeleteDialog}
      sx={{
        textTransform: "none",
        color: isDark ? "rgba(255,255,255,0.72)" : "rgba(17,24,39,0.72)",
        backgroundColor: isDark ? "transparent" : "rgba(255,255,255,0.68)",
        borderRadius: 999,
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
        px: 2.5,
        background: "linear-gradient(135deg, #ef4444, #dc2626)",
      }}
    >
      Xóa danh mục
    </Button>
  </DialogActions>
</Dialog>
    </>
  );
};

export default Category;