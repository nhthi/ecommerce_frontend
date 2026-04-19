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
import { alpha, useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
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
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const UpdateProduct = () => {
  const { isDark } = useSiteThemeMode();
  const isLight = !isDark;

  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { category, adminProduct } = useAppSelector((store) => store);

  const ui = useMemo(
    () => ({
      textPrimary: isLight ? "#111827" : "#fff7ed",
      textSecondary: isLight ? "rgba(17,24,39,0.72)" : "rgba(255,237,213,0.72)",
      textMuted: isLight ? "rgba(17,24,39,0.56)" : "rgba(255,237,213,0.52)",
      panelBorder: isLight ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.08)",
      panelBackground: isLight
        ? "linear-gradient(180deg, #ffffff, #fff7ed)"
        : "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
      panelShadow: isLight
        ? "0 18px 45px rgba(15,23,42,0.08)"
        : "0 24px 60px rgba(0,0,0,0.28)",
      inputBg: isLight ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.03)",
      inputBorder: isLight ? "rgba(249,115,22,0.18)" : "rgba(251,146,60,0.18)",
      inputHover: isLight ? "rgba(249,115,22,0.34)" : "rgba(251,146,60,0.35)",
      focusRing: isLight
        ? "0 0 0 3px rgba(249,115,22,0.10)"
        : "0 0 0 3px rgba(249,115,22,0.12)",
      dashedBorder: isLight ? "rgba(249,115,22,0.28)" : "rgba(251,146,60,0.28)",
      sectionBorder: isLight ? "rgba(249,115,22,0.12)" : "rgba(251,146,60,0.12)",
      sectionBg: isLight ? "rgba(255,247,237,0.72)" : "rgba(255,255,255,0.02)",
      uploadTileBg: isLight ? "rgba(255,247,237,0.96)" : "rgba(0,0,0,0.2)",
      uploadTileText: isLight ? "#c2410c" : "#fed7aa",
      imageRemoveBg: isLight ? "rgba(255,255,255,0.92)" : "rgba(12,12,12,0.72)",
      modalBg: isLight ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)",
      menuBg: isLight ? "#ffffff" : "#171717",
      menuText: isLight ? "#111827" : "#fff7ed",
      buttonTextDark: isLight ? "#ffffff" : "#111111",
      loadingText: isLight ? "#111827" : "#ffffff",
    }),
    [isLight]
  );

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      color: ui.textPrimary,
      borderRadius: "18px",
      backgroundColor: ui.inputBg,
      "& fieldset": {
        borderColor: ui.inputBorder,
      },
      "&:hover fieldset": {
        borderColor: ui.inputHover,
      },
      "&.Mui-focused fieldset": {
        borderColor: "#f97316",
        boxShadow: ui.focusRing,
      },
    },
    "& .MuiInputLabel-root": {
      color: ui.textSecondary,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#fdba74",
    },
    "& .MuiFormHelperText-root": {
      color: ui.textMuted,
    },
  };

  const selectSx = {
    borderRadius: "18px",
    color: ui.textPrimary,
    backgroundColor: ui.inputBg,
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: ui.inputBorder,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: ui.inputHover,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#f97316",
      boxShadow: ui.focusRing,
    },
    ".MuiSvgIcon-root": {
      color: "#fdba74",
    },
  };

  const inputLabelSx = {
    color: ui.textSecondary,
    "&.Mui-focused": {
      color: "#fdba74",
    },
  };

  const panelSx = {
    borderRadius: "30px",
    border: `1px solid ${ui.panelBorder}`,
    background: ui.panelBackground,
    boxShadow: ui.panelShadow,
    overflow: "hidden",
  };

  const level3Categories = (category.categories || []).filter(
    (cat) => cat.level === 3
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
          updateAdminProduct({ id: Number(id), request: values })
        ).unwrap();
        setSnackbar({
          open: true,
          message: "Cập nhật sản phẩm thành công.",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Cập nhật sản phẩm thất bại.",
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
    return (
      <Box sx={{ p: 4 }}>
        <Typography color={ui.loadingText}>Đang tải sản phẩm...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={panelSx}>
      <Box
        sx={{
          px: 3,
          py: 3,
          borderBottom: `1px solid ${ui.panelBorder}`,
        }}
      >
        <Typography fontSize={26} fontWeight={800} color={ui.textPrimary}>
          Cập nhật sản phẩm
        </Typography>
        <Typography sx={{ mt: 0.7, color: ui.textSecondary, fontSize: 14.5 }}>
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
                border: `1px dashed ${ui.dashedBorder}`,
                backgroundColor: ui.sectionBg,
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
                <span
                  className="w-28 h-28 cursor-pointer flex flex-col gap-2 items-center justify-center p-3 border rounded-2xl"
                  style={{
                    borderColor: alpha("#fb923c", 0.3),
                    background: ui.uploadTileBg,
                    color: ui.uploadTileText,
                  }}
                >
                  <AddPhotoAlternate
                    sx={{ color: isLight ? "#f97316" : "#fdba74" }}
                  />
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
                      className="w-28 h-28 object-cover rounded-2xl"
                      style={{
                        border: `1px solid ${alpha("#fb923c", 0.2)}`,
                      }}
                    />
                    <IconButton
                      onClick={() => handleRemoveImage(index)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        color: isLight ? "#b91c1c" : "#fff7ed",
                        backgroundColor: ui.imageRemoveBg,
                        border: "1px solid rgba(239,68,68,0.25)",
                        "&:hover": {
                          backgroundColor: isLight
                            ? "rgba(254,226,226,0.95)"
                            : "rgba(127,29,29,0.72)",
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
                      bgcolor: ui.menuBg,
                      color: ui.menuText,
                      border: `1px solid ${alpha("#fb923c", 0.16)}`,
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em>Không chọn</em>
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
                      bgcolor: ui.menuBg,
                      color: ui.menuText,
                      border: `1px solid ${alpha("#fb923c", 0.16)}`,
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em>Không chọn</em>
                </MenuItem>
                {level3Categories.map((item: any) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name} - {item.parentCategory?.name} -{" "}
                    {item.parentCategory?.parentCategory?.name}
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
                border: `1px solid ${ui.sectionBorder}`,
                backgroundColor: ui.sectionBg,
              }}
            >
              <Typography fontWeight={700} color={ui.textPrimary} sx={{ mb: 2 }}>
                Kích thước
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
                  color: isLight ? "#c2410c" : "#fff7ed",
                  borderColor: "rgba(251,146,60,0.22)",
                  backgroundColor: isLight ? "rgba(255,255,255,0.68)" : "transparent",
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
    borderRadius: 999,
    textTransform: "none",
    px: 2.8,
    background: "linear-gradient(135deg, #f97316, #ea580c)",
    boxShadow: "none",
    "&:hover": {
      background: "linear-gradient(135deg, #ea580c, #c2410c)",
      boxShadow: "none",
    },
  }}
>
  <span style={{ color: "#fff", fontWeight: 700 }}>Cập nhật</span>
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
            bgcolor: ui.modalBg,
            backdropFilter: "blur(3px)",
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{ color: isLight ? "#f97316" : "white" }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default UpdateProduct;