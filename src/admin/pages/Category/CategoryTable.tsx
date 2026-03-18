import { DeleteOutline, Edit, FolderOpen } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
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
import { fetchAllCategory, updateCategory } from "../../../state/admin/adminCategorySlice";
import { Category as CategoryType } from "../../../types/CategoryType";
import { CategoryFormValues } from "./AddNewCategory";

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
  background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
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
  name: Yup.string().trim().required("Ten danh muc khong duoc de trong"),
  categoryId: Yup.string().trim().required("Ma danh muc khong duoc de trong").min(3).max(30),
  level: Yup.number().required("Vui long chon cap do"),
  parentId: Yup.string().nullable(),
});

const Category = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { category } = useAppSelector((store) => store);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [filterLevel, setFilterLevel] = useState<number | "all">("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const filteredCategories = filterLevel === "all" ? category.categories : category.categories.filter((item) => item.level === filterLevel);
  const paginatedCategories = filteredCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const formik = useFormik<CategoryFormValues>({
    initialValues: { name: "", categoryId: "", level: 1, parentId: null },
    validationSchema,
    onSubmit: async (values) => {
      if (!selectedCategory) return;
      await dispatch(updateCategory({ request: values, id: Number(selectedCategory.id) }));
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

  useEffect(() => {
    dispatch(fetchAllCategory());
  }, [dispatch]);

  return (
    <>
      <Paper elevation={0} sx={panelSx}>
        <Box sx={{ px: 3, py: 3, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap={2} alignItems="center">
            <Box>
              <Typography fontSize={26} fontWeight={800} color="white">Danh muc</Typography>
              <Typography sx={{ mt: 0.7, color: "rgba(255,255,255,0.62)", fontSize: 14.5 }}>
                Quan ly cau truc danh muc cho shop fitness, blog va khoa hoc.
              </Typography>
            </Box>
            <Box display="flex" gap={1.2} alignItems="center" flexWrap="wrap">
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel sx={{ color: "rgba(255,255,255,0.58)" }}>Loc cap do</InputLabel>
                <Select
                  value={filterLevel}
                  label="Loc cap do"
                  onChange={(event: SelectChangeEvent<string | number>) => setFilterLevel(event.target.value === "all" ? "all" : Number(event.target.value))}
                  sx={{ color: "white", borderRadius: "16px", ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.12)" }, "& .MuiSvgIcon-root": { color: "#fb923c" } }}
                >
                  <MenuItem value="all">Tat ca cap do</MenuItem>
                  <MenuItem value={1}>Level 1</MenuItem>
                  <MenuItem value={2}>Level 2</MenuItem>
                  <MenuItem value={3}>Level 3</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" onClick={() => navigate("/admin/add-category")} sx={{ borderRadius: 999, textTransform: "none", px: 2.5, background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
                Them danh muc
              </Button>
            </Box>
          </Box>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 920 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Danh muc</StyledTableCell>
                <StyledTableCell>Ma</StyledTableCell>
                <StyledTableCell>Level</StyledTableCell>
                <StyledTableCell>Danh muc cha</StyledTableCell>
                <StyledTableCell align="center">Cap nhat</StyledTableCell>
                <StyledTableCell align="center">Xoa</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCategories.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                      <FolderOpen sx={{ color: "#fb923c" }} />
                      <Typography fontWeight={700}>{row.name}</Typography>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>{row.categoryId}</StyledTableCell>
                  <StyledTableCell>
                    <Chip size="small" label={`Level ${row.level}`} sx={{ color: "#fff7ed", backgroundColor: "rgba(249,115,22,0.12)" }} />
                  </StyledTableCell>
                  <StyledTableCell>{row.parentCategory?.categoryId || "-"}</StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton onClick={() => handleEditClick(row)} sx={{ color: "#fdba74" }}>
                      <Edit />
                    </IconButton>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton sx={{ color: "#fca5a5" }}>
                      <DeleteOutline />
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
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[6, 10, 20]}
            sx={{ color: "rgba(255,255,255,0.72)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
          />
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { backgroundColor: "#111111", color: "white", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.08)" } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Cap nhat danh muc</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ mt: 0.5 }}>
            <Box display="grid" gap={2}>
              <TextField fullWidth name="name" label="Ten danh muc" value={formik.values.name} onChange={formik.handleChange} error={formik.touched.name && Boolean(formik.errors.name)} helperText={formik.touched.name && formik.errors.name} sx={fieldSx} />
              <TextField fullWidth name="categoryId" label="Ma danh muc" value={formik.values.categoryId} onChange={formik.handleChange} error={formik.touched.categoryId && Boolean(formik.errors.categoryId)} helperText={formik.touched.categoryId && formik.errors.categoryId} sx={fieldSx} />
              <FormControl fullWidth sx={fieldSx}>
                <InputLabel>Cap do</InputLabel>
                <Select name="level" value={formik.values.level} label="Cap do" onChange={formik.handleChange}>
                  <MenuItem value={1}>Level 1</MenuItem>
                  <MenuItem value={2}>Level 2</MenuItem>
                  <MenuItem value={3}>Level 3</MenuItem>
                </Select>
              </FormControl>
              {formik.values.level > 1 && (
                <FormControl fullWidth sx={fieldSx}>
                  <InputLabel>Danh muc cha</InputLabel>
                  <Select name="parentId" value={formik.values.parentId || ""} label="Danh muc cha" onChange={formik.handleChange}>
                    {category.categories.filter((item) => item.level === formik.values.level - 1).map((item) => (
                      <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleClose} sx={{ textTransform: "none", color: "rgba(255,255,255,0.72)" }}>Huy</Button>
            <Button type="submit" variant="contained" sx={{ borderRadius: 999, textTransform: "none", px: 2.5, background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
              Luu thay doi
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Category;
