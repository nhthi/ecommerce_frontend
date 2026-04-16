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
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { colors } from "../../../data/Filter/color";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { uploadToCloundinary } from "../../../utils/uploadToCloudinary";
import { fetchAllCategory } from "../../../state/admin/adminCategorySlice";
import { useParams } from "react-router-dom";
import { Size } from "../../../types/ProductType";
import { fetchProductById } from "../../../state/customer/productSlice";
import { updateProduct } from "../../../state/seller/sellerProductSlice";

const UpdateProduct = () => {
  const { id } = useParams(); // 📌 /seller/update-product/:id
  const dispatch = useAppDispatch();
  const category = useAppSelector((store) => store.category);
  const products = useAppSelector((store) => store.product);

  const level3Categories = category.categories.filter((cat) => cat.level === 3);

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

  // ===========================
  // 1) Load Product Data
  // ===========================
  useEffect(() => {
    dispatch(fetchAllCategory());
    if (id) dispatch(fetchProductById({productId:Number(id)}));
  }, [id]);

  const product = products.product;

  // ===========================
  // 2) Init Formik
  // ===========================
  const formik = useFormik({
    enableReinitialize: true, // 📌 load lại dữ liệu khi product fetch xong
    initialValues: {
      title: product?.title || "",
      description: product?.description || "",
      mrpPrice: product?.mrpPrice || "",
      sellingPrice: product?.sellingPrice || "",
      quantity: product?.quantity || "",
      images: product?.images || [],
      categoryId: product?.category?.id || "",
      color: product?.color || "",
      sizes: product?.sizes?.map((s: Size) => ({
        name: s.name,
        quantity: s.quantity,
      })) || [{ name: "", quantity: "" }],
    },

    onSubmit: async (values) => {
      setLoading(true);
      try {
        await dispatch(updateProduct({ id, request: values })).unwrap();
        console.log("update product: ", values);

        setSnackbar({
          open: true,
          message: "Product updated successfully!",
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

  // ===========================
  // 3) Image Upload
  // ===========================
  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];
    setUploadImage(true);

    const image = await uploadToCloundinary(file, "image");

    formik.setFieldValue("images", [...formik.values.images, image]);

    setUploadImage(false);
  };

  const handleRemoveImage = (index: number) => {
    const imgs = [...formik.values.images];
    imgs.splice(index, 1);
    formik.setFieldValue("images", imgs);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!product) return <p className="p-4">Loading product...</p>;

  // ===========================
  // RENDER
  // ===========================
  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
        <Grid container spacing={2}>
          {/* Upload ảnh */}
          <Grid size={{ xs: 12 }} className="flex flex-wrap gap-5">
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />

            <label htmlFor="fileInput" className="relative">
              <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-400">
                <AddPhotoAlternate className="text-gray-700" />
              </span>
              {uploadImage && (
                <div className="absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center">
                  <CircularProgress />
                </div>
              )}
            </label>

            <div className="flex flex-wrap gap-2">
              {formik.values.images.map((image: any, index: number) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    size="small"
                    color="error"
                    sx={{ position: "absolute", top: 0, right: 0 }}
                  >
                    <Close sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </div>
              ))}
            </div>
          </Grid>

          {/* Title */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          {/* Description */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          {/* Prices */}
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              name="mrpPrice"
              label="MRP Price"
              value={formik.values.mrpPrice}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              name="sellingPrice"
              label="Selling Price"
              value={formik.values.sellingPrice}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          {/* Color */}
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth required>
              <InputLabel>Color</InputLabel>
              <Select
                label="Color"
                name="color"
                value={formik.values.color}
                onChange={formik.handleChange}
              >
                {colors.map((c, idx) => (
                  <MenuItem value={c.name} key={idx}>
                    <div className="flex gap-3">
                      <span
                        className={`h-5 w-5 rounded-full ${
                          c.name === "white" ? "border border-gray-400" : ""
                        }`}
                        style={{ background: c.hex }}
                      />
                      {c.name}
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Category */}
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryId"
                value={formik.values.categoryId}
                onChange={formik.handleChange}
                label="Category"
              >
                {level3Categories.map((cat: any) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name} - {cat.parentCategory?.name} -{" "}
                    {cat.parentCategory?.parentCategory?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sizes */}
          <Grid size={{ xs: 12 }}>
            <label className="block font-medium mb-2">Sizes</label>

            {formik.values.sizes.map((size, index) => (
              <div key={index} className="flex items-center gap-3 mb-2">
                <TextField
                  label="Size"
                  name={`sizes[${index}].name`}
                  value={size.name}
                  onChange={formik.handleChange}
                  required
                />

                <TextField
                  label="Quantity"
                  type="number"
                  name={`sizes[${index}].quantity`}
                  value={size.quantity}
                  onChange={formik.handleChange}
                  required
                />

                <IconButton
                  color="error"
                  onClick={() => {
                    const newSizes = [...formik.values.sizes];
                    newSizes.splice(index, 1);
                    formik.setFieldValue("sizes", newSizes);
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
            >
              Add Size
            </Button>
          </Grid>

          {/* Submit */}
          <Grid size={{ xs: 12 }}>
            <Button fullWidth type="submit" variant="contained" color="primary">
              UPDATE PRODUCT
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Loading Modal */}
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
    </div>
  );
};

export default UpdateProduct;
