import { Add, AddPhotoAlternate, Close } from "@mui/icons-material";
import {
  Alert,
  AlertColor,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { colors } from "../../../data/Filter/color";
import { fetchAllCategory } from "../../../state/admin/adminCategorySlice";
import {
  fetchAdminProductById,
  updateAdminProduct,
} from "../../../state/admin/adminProduct";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { Size } from "../../../types/ProductType";
import { uploadToCloundinary } from "../../../utils/uploadToCloudinary";

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff7ed",
    borderRadius: "18px",
    backgroundColor: "rgba(255,255,255,0.03)",
    "& fieldset": {
      borderColor: "rgba(251,146,60,0.18)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(251,146,60,0.35)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#f97316",
      boxShadow: "0 0 0 3px rgba(249,115,22,0.12)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,237,213,0.72)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#fdba74",
  },
  "& .MuiFormHelperText-root": {
    color: "rgba(255,237,213,0.52)",
  },
};

const selectSx = {
  borderRadius: "18px",
  color: "#fff7ed",
  backgroundColor: "rgba(255,255,255,0.03)",
  ".MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(251,146,60,0.18)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(251,146,60,0.35)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#f97316",
    boxShadow: "0 0 0 3px rgba(249,115,22,0.12)",
  },
  ".MuiSvgIcon-root": {
    color: "#fdba74",
  },
};

const inputLabelSx = {
  color: "rgba(255,237,213,0.72)",
  "&.Mui-focused": {
    color: "#fdba74",
  },
};

const panelSx = {
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
  overflow: "hidden",
};

const UpdateProduct = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { category, adminProduct } = useAppSelector((store) => store);

  const level3Categories = (category.categories || []).filter(
    (cat) => cat.level === 3,
  );

  const [uploadImage, setUploadImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchAllCategory());
    if (id) {
      dispatch(fetchAdminProductById(Number(id)));
    }
  }, [dispatch, id]);

  const product = adminProduct.product;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: product?.title || "",
      description: product?.description || "",
      mrpPrice: product?.mrpPrice || "",
      sellingPrice: product?.sellingPrice || "",
      quantity: product?.quantity || "",
      images: product?.images || [],
      categoryId: product?.category?.id || "",
      color: product?.color || "",
      sizes:
        product?.sizes?.map((size: Size) => ({
          name: size.name,
          quantity: size.quantity,
        })) || [{ name: "", quantity: "" }],
    },
    onSubmit: async (values) => {
      if (!id) return;

      setLoading(true);
      try {
        await dispatch(
          updateAdminProduct({ id: Number(id), request: values }),
        ).unwrap();
        setSnackbar({
          open: true,
          message: "Product updated successfully.",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to update product.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadImage(true);
    try {
      const image = await uploadToCloundinary(file, "image");
      formik.setFieldValue("images", [...formik.values.images, image]);
    } finally {
      setUploadImage(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const nextImages = [...formik.values.images];
    nextImages.splice(index, 1);
    formik.setFieldValue("images", nextImages);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (!product && adminProduct.loading) {
    return <p className="p-4 text-white">Loading product...</p>;
  }

  return (
    <Box sx={panelSx}>
      <Box sx={{ px: 3, py: 3, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Typography fontSize={26} fontWeight={800} color="#fff7ed">
          Cập nhật sản phẩm
        </Typography>
        <Typography sx={{ mt: 0.7, color: "rgba(255,237,213,0.72)", fontSize: 14.5 }}>
          Chỉnh sửa thông tin sản phẩm, hình ảnh và danh mục trong luồng admin.
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: "22px",
                border: "1px dashed rgba(251,146,60,0.28)",
                backgroundColor: "rgba(255,255,255,0.02)",
              }}
              className="flex flex-wrap gap-5"
            >
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

              <label htmlFor="fileInput" className="relative">
                <span className="w-28 h-28 cursor-pointer flex flex-col gap-2 items-center justify-center p-3 border rounded-2xl border-orange-400/30 bg-black/20 text-orange-200">
                  <AddPhotoAlternate className="text-orange-300" />
                  <span className="text-xs font-medium">Thêm ảnh</span>
                </span>
                {uploadImage && (
                  <div className="absolute left-0 right-0 top-0 bottom-0 w-28 h-28 flex justify-center items-center">
                    <CircularProgress sx={{ color: "#f97316" }} />
                  </div>
                )}
              </label>

              <div className="flex flex-wrap gap-3">
                {formik.values.images.map((image: string, index: number) => (
                  <div key={`${image}-${index}`} className="relative">
                    <img
                      src={image}
                      alt={`Product ${index}`}
                      className="w-28 h-28 object-cover rounded-2xl border border-orange-400/20"
                    />
                    <IconButton
                      onClick={() => handleRemoveImage(index)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        color: "#fff7ed",
                        backgroundColor: "rgba(12,12,12,0.72)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        "&:hover": {
                          backgroundColor: "rgba(127,29,29,0.72)",
                        },
                      }}
                    >
                      <Close sx={{ fontSize: "1rem" }} />
                    </IconButton>
                  </div>
                ))}
              </div>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="title"
              label="Tên sản phẩm"
              value={formik.values.title}
              onChange={formik.handleChange}
              required
              sx={textFieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="description"
              label="Mô tả"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              required
              sx={textFieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              name="mrpPrice"
              label="Giá nhập"
              value={formik.values.mrpPrice}
              onChange={formik.handleChange}
              required
              sx={textFieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              name="sellingPrice"
              label="Giá bán"
              value={formik.values.sellingPrice}
              onChange={formik.handleChange}
              required
              sx={textFieldSx}
            />
          </Grid>

          {/* <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              name="quantity"
              label="Quantity"
              type="number"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              required
              sx={textFieldSx}
            />
          </Grid> */}

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth required>
              <InputLabel sx={inputLabelSx}>Màu sắc</InputLabel>
              <Select
                label="Màu sắc"
                name="color"
                value={formik.values.color}
                onChange={formik.handleChange}
                sx={selectSx}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "#171717",
                      color: "#fff7ed",
                      border: "1px solid rgba(251,146,60,0.16)",
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {colors.map((item, idx) => (
                  <MenuItem value={item.name} key={idx}>
                    <div className="flex gap-3">
                      <span
                        className={`h-5 w-5 rounded-full ${
                          item.name === "white" ? "border border-gray-400" : ""
                        }`}
                        style={{ background: item.hex }}
                      />
                      {item.name}
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <FormControl fullWidth required>
              <InputLabel sx={inputLabelSx}>Danh mục</InputLabel>
              <Select
                name="categoryId"
                value={formik.values.categoryId}
                onChange={formik.handleChange}
                label="Danh mục"
                sx={selectSx}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "#171717",
                      color: "#fff7ed",
                      border: "1px solid rgba(251,146,60,0.16)",
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {level3Categories.map((item: any) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name} - {item.parentCategory?.name} - {item.parentCategory?.parentCategory?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: "22px",
                border: "1px solid rgba(251,146,60,0.12)",
                backgroundColor: "rgba(255,255,255,0.02)",
              }}
            >
              <Typography fontWeight={700} color="#fff7ed" sx={{ mb: 2 }}>
                Sizes
              </Typography>

              {formik.values.sizes.map((size, index) => (
                <div key={index} className="flex items-center gap-3 mb-3 flex-wrap">
                  <TextField
                    label="Size"
                    name={`sizes[${index}].name`}
                    value={size.name}
                    onChange={formik.handleChange}
                    required
                    sx={{ ...textFieldSx, minWidth: 180 }}
                  />

                  <TextField
                    label="Số lượng"
                    type="number"
                    name={`sizes[${index}].quantity`}
                    value={size.quantity}
                    onChange={formik.handleChange}
                    required
                    sx={{ ...textFieldSx, minWidth: 180 }}
                  />

                  <IconButton
                    onClick={() => {
                      const nextSizes = [...formik.values.sizes];
                      nextSizes.splice(index, 1);
                      formik.setFieldValue("sizes", nextSizes);
                    }}
                    sx={{
                      color: "#fecaca",
                      backgroundColor: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.18)",
                    }}
                  >
                    <Close />
                  </IconButton>
                </div>
              ))}

              <Button
                startIcon={<Add />}
                variant="outlined"
                onClick={() =>
                  formik.setFieldValue("sizes", [
                    ...formik.values.sizes,
                    { name: "", quantity: "" },
                  ])
                }
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  px: 2.2,
                  color: "#fff7ed",
                  borderColor: "rgba(251,146,60,0.22)",
                }}
              >
                Thêm Size
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                borderRadius: "18px",
                py: 1.5,
                fontWeight: 800,
                color: "#111111",
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                boxShadow: "0 18px 40px rgba(249,115,22,0.22)",
                "&:hover": {
                  background: "linear-gradient(135deg, #fb923c, #ea580c)",
                },
              }}
            >
              Cập nhật
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      <Modal open={loading}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.4)",
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: "white" }} />
        </Box>
      </Modal>
    </Box>
  );
};

export default UpdateProduct;
