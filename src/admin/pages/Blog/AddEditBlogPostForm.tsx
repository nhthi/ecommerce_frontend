import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { useNavigate } from "react-router-dom";
import {
  createBlogPost,
  updateBlogPost,
} from "../../../state/admin/adminBlogPostSlice";
import { fetchAllBlogCategories } from "../../../state/admin/adminBlogCategorySlice";
import { fetchAllBlogTags } from "../../../state/admin/adminBlogTagSlice";
import {
  BlogPost,
  BlogPostFormValues,
  BlogStatus,
} from "../../../types/BlogType";
import CustomLoading from "../../../customer/components/CustomLoading/CustomLoading";
import TiptapEditor from "./TiptapEditor";
import { uploadToCloundinary } from "../../../utils/uploadToCloudinary";
import { DeleteOutline, ImageOutlined } from "@mui/icons-material";

interface AddEditBlogPostFormProps {
  initialData?: BlogPost;
  isEdit?: boolean;
  currentUserId?: number;
}

const BLOG_STATUS_OPTIONS: BlogStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required("Tiêu đề không được để trống")
    .min(3, "Tiêu đề quá ngắn")
    .max(255, "Tiêu đề tối đa 255 ký tự"),
  slug: Yup.string()
    .trim()
    .required("Slug không được để trống")
    .min(3, "Slug quá ngắn")
    .max(300, "Slug tối đa 300 ký tự"),
  shortDescription: Yup.string().max(2000, "Mô tả ngắn quá dài"),
  content: Yup.string().trim().required("Nội dung không được để trống"),
  thumbnailUrl: Yup.string().url("Thumbnail URL không hợp lệ").nullable(),
  status: Yup.string().required("Vui lòng chọn trạng thái"),
  publishedAt: Yup.string().nullable(),
  categoryId: Yup.number().nullable().required("Vui lòng chọn danh mục"),
  tagIds: Yup.array().of(Yup.number()).nullable(),
});

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

const cardSx = {
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
};

type BlogPostFormInternalValues = {
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  thumbnailUrl: string;
  status: BlogStatus;
  publishedAt: string;
  categoryId: number | "";
  tagIds: number[];
};

const AddEditBlogPostForm = ({
  initialData,
  isEdit = false,
  currentUserId,
}: AddEditBlogPostFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { categories } = useAppSelector((store) => store.blogCategory);
  const { tags } = useAppSelector((store) => store.blogTag);
const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
const [thumbnailPreview, setThumbnailPreview] = useState<string>(
  initialData?.thumbnailUrl || ""
);
const [uploading, setUploading] = useState(false);

const handleThumbnailChange = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // validate
  if (!file.type.startsWith("image/")) {
    formik.setFieldError("thumbnailUrl", "Chỉ chọn file ảnh");
    return;
  }

  // preview ngay
  const previewUrl = URL.createObjectURL(file);
  setThumbnailFile(file);
  setThumbnailPreview(previewUrl);

  try {
    setUploading(true);

    const url = await uploadToCloundinary(file, "image");

    // set vào form
    formik.setFieldValue("thumbnailUrl", url);

    console.log("✅ Uploaded:", url);
  } catch (err) {
    formik.setFieldError("thumbnailUrl", "Upload thất bại");
  } finally {
    setUploading(false);
  }
};
useEffect(() => {
  setThumbnailPreview(initialData?.thumbnailUrl || "");
  setThumbnailFile(null);
}, [initialData]);
useEffect(() => {
  return () => {
    if (thumbnailPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }
  };
}, [thumbnailPreview]);
  useEffect(() => {
    dispatch(fetchAllBlogCategories());
    dispatch(fetchAllBlogTags());
  }, [dispatch]);

  const formik = useFormik<BlogPostFormInternalValues>({
    enableReinitialize: true,
    initialValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      shortDescription: initialData?.shortDescription || "",
      content: initialData?.content || "",
      thumbnailUrl: initialData?.thumbnailUrl || "",
      status: initialData?.status || "DRAFT",
      publishedAt: initialData?.publishedAt || "",
      categoryId: initialData?.category?.id || "",
      tagIds: initialData?.tags?.map((tag) => tag.id) || [],
    },
    validationSchema,
    onSubmit: async (values) => {
      const request: BlogPostFormValues = {
        title: values.title,
        slug: values.slug,
        shortDescription: values.shortDescription,
        content: values.content,
        thumbnailUrl: values.thumbnailUrl,
        status: values.status,
        publishedAt: values.publishedAt || null,
        category: values.categoryId ? { id: Number(values.categoryId) } : null,
        createdBy:
          initialData?.createdBy?.id || currentUserId
            ? { id: initialData?.createdBy?.id || Number(currentUserId) }
            : null,
        tags: values.tagIds.map((id) => ({ id })),
      };
      setLoading(true);
      if (isEdit && initialData?.id) {
        await dispatch(updateBlogPost({ id: initialData.id, request }));
      } else {
        await dispatch(createBlogPost(request));
        
      }
      setLoading(false);

      navigate("/admin/blog");
    },
  });

const handleRemoveThumbnail = () => {
  if (thumbnailPreview?.startsWith("blob:")) {
    URL.revokeObjectURL(thumbnailPreview);
  }
  setThumbnailFile(null);
  setThumbnailPreview("");
  formik.setFieldValue("thumbnailUrl", "");
};
  return (
    <Paper elevation={0} sx={{ ...cardSx, p: { xs: 3, lg: 4 } }}>
      {loading && <CustomLoading message="Đang xử lý..." />}

      <Typography fontSize={28} fontWeight={800} color="white">
        {isEdit ? "Cập nhật bài viết blog" : "Thêm bài viết blog mới"}
      </Typography>

      <Typography
        sx={{
          mt: 0.8,
          mb: 3,
          color: "rgba(255,255,255,0.62)",
          fontSize: 14.5,
        }}
      >
        Tạo nội dung blog cho website fitness như lịch tập, dinh dưỡng,
        supplement, giảm mỡ và tăng cơ.
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2.2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              name="title"
              label="Tiêu đề bài viết"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              name="slug"
              label="Slug"
              value={formik.values.slug}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.slug && Boolean(formik.errors.slug)}
              helperText={formik.touched.slug && formik.errors.slug}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              name="shortDescription"
              label="Mô tả ngắn"
              value={formik.values.shortDescription}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.shortDescription &&
                Boolean(formik.errors.shortDescription)
              }
              helperText={
                formik.touched.shortDescription &&
                formik.errors.shortDescription
              }
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
  <TiptapEditor
    content={formik.values.content}
    onChange={(html) => {
      if (formik.values.content !== html) {
        formik.setFieldValue("content", html, false);
      }
    }}
  />
</Grid>

          <Grid size={{ xs: 12, md: 6 }}>
  <Box>
    <Typography
      sx={{
        color: "rgba(255,255,255,0.72)",
        mb: 1,
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      Ảnh thumbnail
    </Typography>

    <input
      id="thumbnail-upload"
      type="file"
      accept="image/*"
      hidden
      onChange={handleThumbnailChange}
    />

    {!thumbnailPreview ? (
      <label htmlFor="thumbnail-upload">
        
        <Box
          sx={{
            border: "1px dashed rgba(255,255,255,0.16)",
            borderRadius: "20px",
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 1.2,
            cursor: "pointer",
            background: "rgba(255,255,255,0.02)",
            transition: "all .2s ease",
            "&:hover": {
              borderColor: "rgba(249,115,22,0.45)",
              background: "rgba(249,115,22,0.04)",
            },
          }}
        >

          <ImageOutlined sx={{ color: "#fdba74", fontSize: 34 }} />
          <Typography color="white" fontWeight={600}>
            Chọn ảnh thumbnail
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
            PNG, JPG, WEBP...
          </Typography>
        </Box>
      </label>
    ) : (
      <Box
        sx={{
          position: "relative",
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <Box
          component="img"
          src={thumbnailPreview}
          alt="Thumbnail preview"
          sx={{
            width: "100%",
            height: 260,
            objectFit: "cover",
            display: "block",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            gap: 1,
          }}
        >
          <label htmlFor="thumbnail-upload">
            <Button
              component="span"
              variant="contained"
              size="small"
              sx={{
                borderRadius: 999,
                textTransform: "none",
                background: "linear-gradient(135deg, #f97316, #ea580c)",
              }}
            >
              Đổi ảnh
            </Button>
          </label>

          <IconButton
            onClick={handleRemoveThumbnail}
            sx={{
              bgcolor: "rgba(0,0,0,0.55)",
              color: "white",
              "&:hover": {
                bgcolor: "rgba(220,38,38,0.85)",
              },
            }}
          >
            <DeleteOutline />
          </IconButton>
        </Box>

        {thumbnailFile && (
          <Box sx={{ p: 1.5 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>
              File đã chọn: {thumbnailFile.name}
            </Typography>
          </Box>
        )}
      </Box>
    )}

    {formik.touched.thumbnailUrl && formik.errors.thumbnailUrl && (
      <Typography sx={{ color: "#fca5a5", fontSize: 12, mt: 1 }}>
        {formik.errors.thumbnailUrl}
      </Typography>
    )}
  </Box>
</Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                label="Trạng thái"
                value={formik.values.status}
                onChange={formik.handleChange}
              >
                {BLOG_STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              name="publishedAt"
              label="Ngày xuất bản"
              type="datetime-local"
              value={formik.values.publishedAt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel>Danh mục</InputLabel>
              <Select
                name="categoryId"
                label="Danh mục"
                value={formik.values.categoryId}
                onChange={formik.handleChange}
                error={
                  formik.touched.categoryId && Boolean(formik.errors.categoryId)
                }
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel>Tag</InputLabel>
              <Select
                multiple
                name="tagIds"
                label="Tag"
                value={formik.values.tagIds}
                onChange={formik.handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", gap: 0.7, flexWrap: "wrap" }}>
                    {(selected as number[]).map((id) => {
                      const foundTag = tags.find((tag) => tag.id === id);
                      return (
                        <Chip
                          key={id}
                          label={foundTag?.name || id}
                          sx={{
                            backgroundColor: "rgba(249,115,22,0.15)",
                            color: "#fdba74",
                            borderRadius: 999,
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {tags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box
              display="flex"
              gap={1.2}
              justifyContent="flex-end"
              flexWrap="wrap"
            >
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/blog")}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  px: 2.5,
                  color: "rgba(255,255,255,0.82)",
                  borderColor: "rgba(255,255,255,0.12)",
                }}
              >
                Quay lại
              </Button>

<Button
  type="submit"
  variant="contained"
  disabled={uploading || loading}
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
  <span style={{ color: "#fff", fontWeight: 700 }}>
    {uploading ? "Đang upload ảnh..." : isEdit ? "Lưu thay đổi" : "Tạo bài viết"}
  </span>
</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AddEditBlogPostForm;










