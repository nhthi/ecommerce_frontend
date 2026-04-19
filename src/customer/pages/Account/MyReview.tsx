import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  clearReviewState,
  deleteReview,
  fetchMyReviews,
} from "../../../state/customer/reviewSlice";
import { MyReview as MyReviewType } from "../../../types/OrderType";
import { useNavigate } from "react-router-dom";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const chipSx = (active: boolean) => ({
  borderRadius: "999px",
  fontWeight: 700,
  px: 0.5,
  border: "1px solid",
  borderColor: active ? "rgba(249,115,22,0.55)" : "rgba(255,255,255,0.08)",
  backgroundColor: active ? "rgba(249,115,22,0.16)" : "rgba(255,255,255,0.03)",
  color: active ? "#fdba74" : "#e2e8f0",
  "& .MuiChip-icon": {
    color: active ? "#fb923c" : "#94a3b8",
  },
  "&:hover": {
    backgroundColor: active ? "rgba(249,115,22,0.22)" : "rgba(255,255,255,0.06)",
  },
});

const cardSx = {
  borderRadius: "26px",
  border: "1px solid rgba(249,115,22,0.10)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
};

const sectionTitleSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  color: "#94a3b8",
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.10em",
};

const MyReview = () => {
  const dispatch = useAppDispatch();
  const { review } = useAppSelector((store) => store);
    const { isDark } = useSiteThemeMode();
  
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [imageFilter, setImageFilter] = useState<"all" | "with" | "without">("all");
  const [reviewToDelete, setReviewToDelete] = useState<MyReviewType | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const navigate= useNavigate()
  useEffect(() => {
    dispatch(fetchMyReviews());

    return () => {
      dispatch(clearReviewState());
    };
  }, [dispatch]);

  const reviews = (review.myReviews || []) as MyReviewType[];

  const stats = useMemo(() => {
    const withImages = reviews.filter(
      (item) => item.productImages && item.productImages.length > 0
    ).length;

    const averageRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
            reviews.length
          ).toFixed(1)
        : "0.0";

    return {
      total: reviews.length,
      withImages,
      averageRating,
    };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((item) => {
      const matchRating =
        ratingFilter === "all" || Math.round(Number(item.rating)) === ratingFilter;

      const hasReviewImages = Boolean(
        item.productImages && item.productImages.length > 0
      );

      const matchImages =
        imageFilter === "all" ||
        (imageFilter === "with" && hasReviewImages) ||
        (imageFilter === "without" && !hasReviewImages);

      return matchRating && matchImages;
    });
  }, [reviews, ratingFilter, imageFilter]);

  const handleDelete = async () => {
    if (!reviewToDelete) return;
    await dispatch(deleteReview(reviewToDelete.reviewId));
    setReviewToDelete(null);
  };



  return (
    <div className="space-y-6">
      <div
        className="rounded-[30px] border border-orange-500/10 bg-[#0c0c0c] p-5 lg:p-7"
        style={{
          boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
        }}
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-orange-300">
              My reviews
            </p>
            <h2 className="mt-3 text-3xl font-black text-white lg:text-4xl">
              Đánh giá của bạn
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-white/6 bg-white/[0.03] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Tổng review
              </p>
              <p className="mt-2 text-3xl font-black text-white">{stats.total}</p>
            </div>

            <div className="rounded-[22px] border border-white/6 bg-white/[0.03] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Có ảnh Review
              </p>
              <p className="mt-2 text-3xl font-black text-white">
                {stats.withImages}
              </p>
            </div>

            <div className="rounded-[22px] border border-white/6 bg-white/[0.03] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Rating TB
              </p>
              <p className="mt-2 text-3xl font-black text-white">
                {stats.averageRating}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-4 z-20">
        <div
          className="rounded-[24px] border border-orange-500/10 bg-[#111111]/88 p-4 backdrop-blur-xl lg:p-5"
          style={{
            boxShadow: "0 14px 35px rgba(0,0,0,0.24)",
          }}
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/12 text-orange-300">
                <FilterAltOutlinedIcon />
              </div>
              <div>
                <p className="text-base font-black text-white">Bộ lọc đánh giá</p>
                <p className="text-sm text-slate-400">
                  Lọc nhanh theo số sao và tình trạng ảnh review.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex flex-wrap gap-2">
                <Chip
                  label="Tất cả"
                  clickable
                  onClick={() => setRatingFilter("all")}
                  sx={chipSx(ratingFilter === "all")}
                />

                {[5, 4, 3, 2, 1].map((star) => (
                  <Chip
                    key={star}
                    icon={<StarRoundedIcon />}
                    label={`${star} sao`}
                    clickable
                    onClick={() => setRatingFilter(star)}
                    sx={chipSx(ratingFilter === star)}
                  />
                ))}
              </div>

              <FormControl size="small" sx={{ minWidth: 190 }}>
                <InputLabel sx={{ color: "#94a3b8" }}>Ảnh review</InputLabel>
                <Select
                  value={imageFilter}
                  label="Ảnh review"
                  onChange={(e) =>
                    setImageFilter(e.target.value as "all" | "with" | "without")
                  }
                  sx={{
                    borderRadius: "14px",
                    color: "#fff",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.08)",
                    },
                    "& .MuiSvgIcon-root": { color: "#cbd5e1" },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(249,115,22,0.32)",
                    },
                  }}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="with">Có ảnh review</MenuItem>
                  <MenuItem value="without">Không có ảnh review</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
      </div>

      {review.error && (
        <Alert
          severity="error"
          sx={{
            borderRadius: "18px",
            backgroundColor: "rgba(127,29,29,0.28)",
            color: "#fecaca",
            border: "1px solid rgba(239,68,68,0.18)",
          }}
        >
          {review.error}
        </Alert>
      )}

      {review.successMessage && (
        <Alert
          severity="success"
          sx={{
            borderRadius: "18px",
            backgroundColor: "rgba(20,83,45,0.25)",
            color: "#bbf7d0",
            border: "1px solid rgba(34,197,94,0.18)",
          }}
        >
          {review.successMessage}
        </Alert>
      )}

      {review.myReviewsLoading ? (
        <div
          className="flex min-h-[340px] items-center justify-center rounded-[28px] border border-orange-500/10 bg-[#0c0c0c]"
          style={{ boxShadow: "0 18px 50px rgba(0,0,0,0.18)" }}
        >
          <div className="flex flex-col items-center gap-3 text-slate-300">
            <CircularProgress sx={{ color: "#f97316" }} />
            <p className="text-sm">Đang tải danh sách đánh giá...</p>
          </div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div
          className="rounded-[28px] border border-dashed border-white/10 bg-[#0c0c0c] p-10 text-center"
          style={{ boxShadow: "0 18px 50px rgba(0,0,0,0.14)" }}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-300">
            <RateReviewOutlinedIcon fontSize="large" />
          </div>
          <h3 className="mt-5 text-2xl font-black text-white">
            Chưa có đánh giá phù hợp
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-400 lg:text-base">
            Hãy thử thay đổi bộ lọc hoặc hoàn tất thêm đơn hàng để bắt đầu gửi
            đánh giá sản phẩm.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((item) => {
            const productName =
              item.productTitle || `Sản phẩm #${item.productId ?? item.reviewId}`;
            const hasReviewImages = Boolean(
              item.productImages && item.productImages.length > 0
            );

            return (
              <div key={item.reviewId}  style={cardSx} className={`p-0 ${isDark ? '' : 'bg-slate-100'}`}>
                <div className="grid gap-5 p-5 lg:grid-cols-[128px_minmax(0,1fr)_auto] lg:p-6">
                  <div>
                    <p style={sectionTitleSx as any}>
                      <Inventory2OutlinedIcon sx={{ fontSize: 16 }} />
                      Sản phẩm
                    </p>

                    <Box
                      sx={{
                        mt: 1.4,
                        width: "100%",
                        height: 128,
                        borderRadius: "18px",
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.08)",
                        backgroundColor: "rgba(255,255,255,0.03)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.productImage ? (
                        <Box
                          component="img"
                          src={item.productImage}
                          alt={productName}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Inventory2OutlinedIcon
                          sx={{ color: "#64748b", fontSize: 40 }}
                        />
                      )}
                    </Box>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-xl font-black text-white lg:text-2xl">
                            {productName}
                          </h3>

                          <Chip
                            icon={<ImageOutlinedIcon />}
                            label={
                              hasReviewImages ? "Có ảnh review" : "Không có ảnh"
                            }
                            sx={{
                              borderRadius: "999px",
                              fontWeight: 700,
                              backgroundColor: hasReviewImages
                                ? "rgba(249,115,22,0.12)"
                                : "rgba(148,163,184,0.12)",
                              color: hasReviewImages ? "#fdba74" : "#cbd5e1",
                              "& .MuiChip-icon": {
                                color: hasReviewImages ? "#fb923c" : "#94a3b8",
                              },
                            }}
                          />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                          <div className="flex items-center gap-2">
                            <Rating
                              readOnly
                              value={Number(item.rating)}
                              precision={0.5}
                              sx={{
                                "& .MuiRating-iconFilled": {
                                  color: "#fb923c",
                                },
                                "& .MuiRating-iconEmpty": {
                                  color: "rgba(255,255,255,0.16)",
                                },
                              }}
                            />
                            <span className="font-semibold text-orange-200">
                              {item.rating}/5
                            </span>
                          </div>

                          <span className="text-slate-500">•</span>
                          <span>{new Date(item.createdAt).toLocaleString("vi-VN")}</span>
                        </div>

                        <div className="mt-4">
                          <Button
                          onClick={()=>navigate(`/product-details/${item.productTitle}/${item.productId}`)}
                            variant="outlined"
                            startIcon={<OpenInNewRoundedIcon />}
                            sx={{
                              textTransform: "none",
                              fontWeight: 700,
                              borderRadius: "999px",
                              px: 2,
                              py: 1,
                              color: "#fdba74",
                              borderColor: "rgba(249,115,22,0.28)",
                              backgroundColor: "rgba(249,115,22,0.06)",
                              "&:hover": {
                                borderColor: "rgba(249,115,22,0.55)",
                                backgroundColor: "rgba(249,115,22,0.12)",
                              },
                            }}
                          >
                            Xem sản phẩm
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-[20px] border border-white/6 bg-white/[0.03] p-4">
                      <p style={sectionTitleSx as any}>
                        <RateReviewOutlinedIcon sx={{ fontSize: 16 }} />
                        Nội dung đánh giá
                      </p>
                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-200 lg:text-[15px]">
                        {item.reviewText || "Không có nội dung đánh giá."}
                      </p>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between gap-3">
                        <p style={sectionTitleSx as any}>
                          <ImageOutlinedIcon sx={{ fontSize: 16 }} />
                          Ảnh khách hàng đăng lên
                        </p>

                        {hasReviewImages && (
                          <span className="text-xs font-semibold text-slate-500">
                            {item.productImages.length} ảnh
                          </span>
                        )}
                      </div>

                      {hasReviewImages ? (
                        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                          {item.productImages.map((img, index) => (
                            <div
                              key={`${item.reviewId}-${index}`}
                              className="group relative overflow-hidden rounded-[18px] border border-white/8 bg-white/[0.03]"
                            >
                              <Box
                                component="img"
                                src={img}
                                alt={`review-${item.reviewId}-${index}`}
                                onClick={() => setPreviewImage(img)}
                                sx={{
                                  width: "100%",
                                  height: 120,
                                  objectFit: "cover",
                                  cursor: "pointer",
                                  transition: "transform 0.3s ease",
                                  ".group:hover &": {
                                    transform: "scale(1.04)",
                                  },
                                }}
                              />
                              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">
                                <div className="rounded-full bg-white/15 p-2 text-white backdrop-blur">
                                  <VisibilityOutlinedIcon fontSize="small" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3 rounded-[18px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-5 text-sm text-slate-400">
                          Review này không có ảnh do khách hàng tải lên.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end lg:justify-start">
                    <IconButton
                      onClick={() => setReviewToDelete(item)}
                      sx={{
                        alignSelf: "flex-start",
                        color: "#fca5a5",
                        border: "1px solid rgba(239,68,68,0.20)",
                        backgroundColor: "rgba(239,68,68,0.08)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "rgba(239,68,68,0.14)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog
        open={Boolean(reviewToDelete)}
        onClose={() => setReviewToDelete(null)}
        PaperProps={{
          sx: {
            borderRadius: "24px",
            backgroundColor: "#111111",
            color: "#fff",
            border: "1px solid rgba(249,115,22,0.12)",
            minWidth: { xs: 320, sm: 430 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>Xóa đánh giá</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#cbd5e1", lineHeight: 1.8 }}>
            Đánh giá này sẽ bị xóa khỏi tài khoản của bạn. Hành động này không thể
            hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setReviewToDelete(null)}
            sx={{ textTransform: "none", color: "#cbd5e1" }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: "999px",
              px: 2.5,
              backgroundColor: "#ef4444",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#dc2626",
                boxShadow: "none",
              },
            }}
          >
            Xóa đánh giá
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: "#0b0b0b",
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {previewImage && (
            <Box
              component="img"
              src={previewImage}
              alt="preview-review"
              sx={{
                width: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                backgroundColor: "#000",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyReview;