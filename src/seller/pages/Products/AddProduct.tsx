import { Add, AddPhotoAlternate, Close } from "@mui/icons-material";
import {
  Alert,
  AlertColor,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  Icon,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { upload } from "@testing-library/user-event/dist/upload";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { colors } from "../../../data/Filter/color";
import { mainCategory } from "../../../data/category/mainCategory";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { createProduct } from "../../../state/seller/sellerProductSlice";
import { uploadToCloundinary } from "../../../utils/uploadToCloudinary";
import { fetchAllCategory } from "../../../state/admin/adminCategorySlice";

const AddProduct = () => {
  const [uploadImage, setUploadImage] = useState(false);
  const { category } = useAppSelector((store) => store);
  const level3Categories = category.categories.filter((cat) => cat.level === 3);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      mrpPrice: "",
      sellingPrice: "",
      quantity: "",
      images: [],
      categoryId: "",
      sizes: [{ name: "", quantity: "" }],
      color: "",
    },
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const result = await dispatch(
          createProduct({ request: values })
        ).unwrap();

        setSnackbar({
          open: true,
          message: "Product added successfully!",
          severity: "success",
        });

        resetForm();
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to add product. Please try again.",
          severity: "error",
        });
        console.error("Create product error:", error);
      } finally {
        setLoading(false);
      }
    },
  });
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];
    setUploadImage(true);
    const image = await uploadToCloundinary(file, "image");
    formik.setFieldValue("images", [...formik.values.images, image]);
    setUploadImage(false);
  };

  const handleRemoveImage = (index: number) => {
    const uploadImages = [...formik.values.images];
    uploadImages.splice(index, 1);
    formik.setFieldValue("images", uploadImages);
  };

  useEffect(() => {
    dispatch(fetchAllCategory());
  }, []);
  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
        <Grid container spacing={2}>
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
                    alt={`Product ${index}`}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    className=""
                    size="small"
                    color="error"
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      outline: "none",
                    }}
                  >
                    <Close sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </div>
              ))}
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              id="mrp_price"
              name="mrpPrice"
              label="MRP Price"
              value={formik.values.mrpPrice}
              onChange={formik.handleChange}
              error={formik.touched.mrpPrice && Boolean(formik.errors.mrpPrice)}
              helperText={formik.touched.mrpPrice && formik.errors.mrpPrice}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              id="sellingPrice"
              name="sellingPrice"
              label="Selling Price"
              value={formik.values.sellingPrice}
              onChange={formik.handleChange}
              error={
                formik.touched.sellingPrice &&
                Boolean(formik.errors.sellingPrice)
              }
              helperText={
                formik.touched.sellingPrice && formik.errors.sellingPrice
              }
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl
              fullWidth
              error={formik.touched.color && Boolean(formik.errors.color)}
              required
            >
              <InputLabel id="color-label">Color</InputLabel>
              <Select
                labelId="color"
                id="color"
                name="color"
                value={formik.values.color}
                onChange={formik.handleChange}
                label="Color"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {colors.map((color, index) => (
                  <MenuItem value={color.name} key={index}>
                    <div className="flex gap-3">
                      <span
                        style={{ backgroundColor: color.hex }}
                        className={`h-5 w-5 rounded-full ${
                          color.name === "white" ? "border border-gray-400" : ""
                        }`}
                      ></span>
                      <p>{color.name}</p>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl
              fullWidth
              error={
                formik.touched.categoryId && Boolean(formik.errors.categoryId)
              }
              required
            >
              <InputLabel id="categoryId-label">Category</InputLabel>
              <Select
                labelId="categoryId"
                id="categoryId"
                name="categoryId"
                value={formik.values.categoryId}
                onChange={formik.handleChange}
                label="Category"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {level3Categories.map((category: any, index) => (
                  <MenuItem value={category.id} key={index}>
                    {category?.name +
                      " - " +
                      category.parentCategory?.name +
                      " - " +
                      category.parentCategory?.parentCategory.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <div className="space-y-2">
              <label className="block font-medium">Sizes</label>

              {formik.values.sizes.map((size, index) => (
                <div key={index} className="flex items-center gap-3">
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
            </div>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button fullWidth type="submit" variant="contained" color="primary">
              ADD PRODUCT
            </Button>
          </Grid>
        </Grid>
      </form>
      {/* ✅ Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* ✅ Modal Loading */}
      <Modal open={loading}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            bgcolor: "rgba(0, 0, 0, 0.4)",
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: "white" }} />
        </Box>
      </Modal>
    </div>
  );
};

export default AddProduct;
