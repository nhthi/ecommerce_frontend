import { Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  fetchAllCategory,
  updateCategory,
} from "../../../state/admin/adminCategorySlice";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { CategoryFormValues } from "./AddNewCategory";
import * as Yup from "yup";
import { Category as CategoryType } from "../../../types/CategoryType";

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
    borderBottomColor: "rgba(148, 163, 184, 0.25)",
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

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Tên danh mục không được để trống"),
  categoryId: Yup.string()
    .trim()
    .required("Mã danh mục không được để trống")
    .min(3, "Mã danh mục phải có ít nhất 3 ký tự")
    .max(30, "Mã danh mục không được vượt quá 30 ký tự"),
  level: Yup.number().required("Vui lòng chọn cấp độ (Level)"),
  parentId: Yup.string().nullable(),
});

const Category = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { category } = useAppSelector((store) => store);

  const [open, setOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );

  // Filter level
  const [filterLevel, setFilterLevel] = useState<number | "all">("all");
  const handleFilterChange = (event: SelectChangeEvent<string | number>) => {
    const value = event.target.value;
    setFilterLevel(value === "all" ? "all" : Number(value));
  };

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCategories =
    filterLevel === "all"
      ? category.categories
      : category.categories.filter((c) => c.level === filterLevel);

  const paginatedCategories = filteredCategories.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Formik
  const formik = useFormik<CategoryFormValues>({
    initialValues: {
      name: "",
      categoryId: "",
      level: 1,
      parentId: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (selectedCategory) {
        await dispatch(
          updateCategory({ request: values, id: Number(selectedCategory.id) })
        );
        handleClose();
      }
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

  useEffect(() => {
    dispatch(fetchAllCategory());
  }, [dispatch]);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid rgba(148, 163, 184, 0.25)",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.13)",
          p: 0,
        }}
      >
        {/* Header */}
        <Box sx={{ px: 3, pt: 3, pb: 1 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Quản lý danh mục
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quản lý danh mục sản phẩm theo cấp độ (Level 1, 2, 3).
              </Typography>
            </Box>

            <Box display="flex" gap={2} alignItems="center">
              {/* Filter */}
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="filter-level-label">Lọc theo cấp độ</InputLabel>
                <Select
                  labelId="filter-level-label"
                  label="Lọc theo cấp độ"
                  value={filterLevel}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="all">Tất cả cấp độ</MenuItem>
                  <MenuItem value={1}>Level 1 (Danh mục cha)</MenuItem>
                  <MenuItem value={2}>Level 2 (Danh mục con)</MenuItem>
                  <MenuItem value={3}>Level 3 (Danh mục cháu)</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={() => navigate("/admin/add-category")}
                sx={{ borderRadius: 999, textTransform: "none" }}
              >
                Thêm danh mục mới
              </Button>
            </Box>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            {filteredCategories.length} danh mục được tìm thấy
          </Typography>
        </Box>

        <Divider />

        {/* Table */}
        <TableContainer>
          <Table sx={{ minWidth: 900 }} aria-label="category table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Mã danh mục</StyledTableCell>
                <StyledTableCell>Tên danh mục</StyledTableCell>
                <StyledTableCell>Cấp độ</StyledTableCell>
                <StyledTableCell>Danh mục cha</StyledTableCell>
                <StyledTableCell align="center">Sửa</StyledTableCell>
                <StyledTableCell align="center">Xóa</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedCategories.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell>{row.id}</StyledTableCell>
                  <StyledTableCell>{row.categoryId}</StyledTableCell>
                  <StyledTableCell>{row.name}</StyledTableCell>
                  <StyledTableCell>{row.level}</StyledTableCell>
                  <StyledTableCell>
                    {row.parentCategory?.categoryId || "—"}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton onClick={() => handleEditClick(row)}>
                      <Edit />
                    </IconButton>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton>
                      <Delete color="error" />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={filteredCategories.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </TableContainer>
      </Paper>

      {/* Modal Update */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Cập nhật danh mục</DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              {/* Name */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  name="name"
                  label="Tên danh mục"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>

              {/* Category ID */}
              <Grid size={{ xs: 12 }}>
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
                />
              </Grid>

              {/* Level */}
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel id="level-label">Cấp độ</InputLabel>
                  <Select
                    label="Cấp độ"
                    labelId="level-label"
                    name="level"
                    value={formik.values.level}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value={1}>Level 1 (Danh mục cha)</MenuItem>
                    <MenuItem value={2}>Level 2 (Danh mục con)</MenuItem>
                    <MenuItem value={3}>Level 3 (Danh mục cháu)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Parent category */}
              {formik.values.level > 1 && (
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel id="parent-label">Danh mục cha</InputLabel>
                    <Select
                      labelId="parent-label"
                      name="parentId"
                      label="Danh mục cha"
                      value={formik.values.parentId || ""}
                      onChange={formik.handleChange}
                    >
                      {category.categories
                        .filter((cat) => cat.level === formik.values.level - 1)
                        .map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose}>Hủy</Button>
            <Button type="submit" variant="contained">
              Lưu thay đổi
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Category;
