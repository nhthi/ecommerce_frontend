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
import { colors } from "../../../data/Filter/color";
import { fetchAllCategory } from "../../../state/admin/adminCategorySlice";
import { createAdminProduct } from "../../../state/admin/adminProduct";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { uploadToCloundinary } from "../../../utils/uploadToCloudinary";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const AddProduct = () => {
const { isDark } = useSiteThemeMode();
  const isLight = !isDark;


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

  const dispatch = useAppDispatch();
  const { category } = useAppSelector((store) => store);
  const level3Categories = (category.categories || []).filter(
    (cat) => cat.level === 3
  );

  useEffect(() => {
    dispatch(fetchAllCategory());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      mrpPrice: "",
      sellingPrice: "",
      quantity: "",
      images: [] as string[],
      categoryId: "",
      sizes: [{ name: "", quantity: "" }],
      color: "",
    },
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        await dispatch(createAdminProduct(values)).unwrap();
        setSnackbar({
          open: true,
          message: "Thêm sản phẩm thành công.",
          severity: "success",
        });
        resetForm();
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Thêm sản phẩm thất bại. Vui lòng thử lại.",
          severity: "error",
        });
        console.error("Create product error:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

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
          Thêm sản phẩm mới
        </Typography>
        <Typography sx={{ mt: 0.7, color: ui.textSecondary, fontSize: 14.5 }}>
          Tạo sản phẩm mới, upload hình ảnh và gán đúng danh mục trong luồng admin.
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
                {formik.values.images.map((image, index) => (
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
              id="title"
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
              id="description"
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
              <InputLabel id="color-label" sx={inputLabelSx}>
                Màu sắc
              </InputLabel>
              <Select
                labelId="color-label"
                id="color"
                name="color"
                value={formik.values.color}
                onChange={formik.handleChange}
                label="Màu sắc"
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
                {colors.map((color, index) => (
                  <MenuItem value={color.name} key={index}>
                    <div className="flex gap-3">
                      <span
                        style={{ backgroundColor: color.hex }}
                        className={`h-5 w-5 rounded-full ${
                          color.name === "white" ? "border border-gray-400" : ""
                        }`}
                      />
                      <p>{color.name}</p>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <FormControl fullWidth required>
              <InputLabel id="categoryId-label" sx={inputLabelSx}>
                Danh mục
              </InputLabel>
              <Select
                labelId="categoryId-label"
                id="categoryId"
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
                  <MenuItem value={item.id} key={item.id}>
                    {item?.name +
                      " - " +
                      item.parentCategory?.name +
                      " - " +
                      item.parentCategory?.parentCategory?.name}
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
                Thêm size
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
                color: ui.buttonTextDark,
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                boxShadow: "0 18px 40px rgba(249,115,22,0.22)",
                "&:hover": {
                  background: "linear-gradient(135deg, #fb923c, #ea580c)",
                },
              }}
            >
              Thêm mới
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
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
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

export default AddProduct;