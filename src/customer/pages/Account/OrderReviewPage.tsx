import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Rating,
  Snackbar,
  TextField,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { format } from "date-fns";
import { Order } from "../../../types/OrderType";
import { uploadToCloundinary } from "../../../utils/uploadToCloudinary";
import { createReview } from "../../../state/customer/reviewSlice";
import { useAppDispatch } from "../../../state/Store";

interface OrderReviewPageProps {
  order: Order;
}

const quickTags = [
  "Đóng gói cẩn thận",
  "Giao hàng nhanh",
  "Đúng mô tả",
  "Chất lượng tốt",
  "Giá hợp lý",
  "Sẽ mua lại",
];

type ReviewItem = {
  orderItemId: number | string;
  rating: number;
  content: string;
  tags: string[];
  recommend: boolean;
  images: string[];
};

const OrderReviewPage: React.FC<OrderReviewPageProps> = ({ order }) => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const state = location.state as { orderItemId?: number } | undefined;
  const selectedOrderItemId = state?.orderItemId;
  const targetOrderItem =
    order.orderItems?.find((i) => i.id === selectedOrderItemId) ||
    order.orderItems?.[0];

  const [review, setReview] = useState<ReviewItem | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    if (targetOrderItem) {
      setReview({
        orderItemId: targetOrderItem.id,
        rating: 5,
        content: "",
        tags: [],
        recommend: true,
        images: [],
      });
    }
  }, [targetOrderItem]);

  const handleImageChange = async (files: FileList | null) => {
    if (!files || files.length === 0 || !review) return;

    const remainingSlots = Math.max(0, 3 - review.images.length);
    if (remainingSlots === 0) {
      setSnackbar({
        open: true,
        message: "Bạn chỉ có thể tải tối đa 3 ảnh.",
        severity: "error",
      });
      return;
    }

    const selectedFiles = Array.from(files).slice(0, remainingSlots);
    setUploadLoading(true);

    try {
      const uploadedUrls = await Promise.all(
        selectedFiles.map((file) => uploadToCloundinary(file, "image"))
      );

      setReview((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          images: [...prev.images, ...uploadedUrls].slice(0, 3),
        };
      });

      setSnackbar({
        open: true,
        message: "Tải ảnh thành công.",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error?.message || "Tải ảnh thất bại, vui lòng thử lại.",
        severity: "error",
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const onSubmit = async () => {
    if (!review || uploadLoading) return;

    try {
      const tagsString = review.tags.join(", ");
      const reviewText =
        review.tags.length > 0
          ? `${review.content}. Tags: ${tagsString}`
          : review.content;

      await dispatch(
        createReview({
          orderItemId: Number(review.orderItemId),
          reviewText,
          reviewRating: review.rating,
          productImages: review.images,
        })
      ).unwrap();

      setSnackbar({
        open: true,
        message: "Đánh giá thành công.",
        severity: "success",
      });
      navigate("/account/orders");
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error?.message || "Đánh giá thất bại, vui lòng thử lại.",
        severity: "error",
      });
    }
  };

  if (!targetOrderItem || !review) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-lg text-slate-400">
        Đang tải sản phẩm cần đánh giá...
      </div>
    );
  }

  const product = targetOrderItem.product;
  const sellerName =
    product?.seller?.businessDetails?.businessName || "NHTHI Fit";

  return (
    <div className="bg-transparent">
      <div className="rounded-[1.8rem] border border-orange-500/12 bg-[#141414] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:p-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <Button
              onClick={() => navigate(-1)}
              startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 16 }} />}
              sx={{
                minWidth: 0,
                px: 1.8,
                py: 0.7,
                borderRadius: "999px",
                border: "1px solid rgba(249,115,22,0.2)",
                color: "#fb923c",
                textTransform: "none",
                fontSize: 14,
                backgroundColor: "rgba(249,115,22,0.04)",
              }}
            >
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-black text-white md:text-4xl">
                Đánh giá đơn #{orderId || order.id}
              </h1>
              <p className="mt-2 text-base leading-7 text-slate-300">
                Đơn hàng đã giao{" "}
                {order.deliveryDate
                  ? format(new Date(order.deliveryDate), "dd/MM/yyyy")
                  : "N/A"}
                . Đánh giá ngắn gọn, thực tế sẽ hữu ích hơn cho người mua sau.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <Chip
            icon={<LocalShippingIcon sx={{ fontSize: 18 }} />}
            label="Đơn hàng đã giao thành công"
            sx={{
              backgroundColor: "rgba(249,115,22,0.1)",
              color: "#fb923c",
              fontSize: 13,
              height: 32,
              border: "1px solid rgba(249,115,22,0.2)",
            }}
          />
          <Chip
            icon={<StorefrontIcon sx={{ fontSize: 18 }} />}
            label="1 sản phẩm được chọn để đánh giá"
            sx={{
              fontSize: 13,
              height: 32,
              color: "#cbd5e1",
              backgroundColor: "rgba(255,255,255,0.04)",
            }}
          />
        </div>

        <Divider sx={{ borderColor: "rgba(249,115,22,0.12)", mb: 4 }} />

        <div className="space-y-4 rounded-[1.6rem] border border-white/6 bg-black/20 p-5">
          <div className="flex gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-2xl border border-white/6 bg-black">
              <img
                src={product?.images?.[0]}
                alt={product?.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-300">
                {sellerName}
              </p>
              <p className="mt-1 line-clamp-2 text-xl font-bold text-white">
                {product?.title}
              </p>
              <p className="mt-1 text-base text-slate-400">
                Số lượng: {targetOrderItem.quantity}
                {targetOrderItem.size?.name && (
                  <> • Kích thước: {targetOrderItem.size?.name}</>
                )}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Rating
                value={review.rating}
                onChange={(_, value) =>
                  setReview({ ...review, rating: value || 0 })
                }
                size="large"
                sx={{ "& .MuiRating-iconFilled": { color: "#fb923c" } }}
              />
              <span className="text-sm text-slate-400">
                {review.rating} / 5
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickTags.map((tag) => {
              const selected = review.tags.includes(tag);
              return (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() =>
                    setReview({
                      ...review,
                      tags: selected
                        ? review.tags.filter((t) => t !== tag)
                        : [...review.tags, tag],
                    })
                  }
                  sx={{
                    fontSize: 13,
                    borderRadius: "999px",
                    backgroundColor: selected
                      ? "#f97316"
                      : "rgba(255,255,255,0.04)",
                    color: selected ? "#050505" : "#cbd5e1",
                    border: selected
                      ? "none"
                      : "1px solid rgba(255,255,255,0.08)",
                    fontWeight: 700,
                  }}
                />
              );
            })}
          </div>

          <TextField
            multiline
            minRows={4}
            fullWidth
            placeholder="Viết ngắn gọn về chất lượng sản phẩm, đóng gói và trải nghiệm nhận hàng..."
            value={review.content}
            onChange={(e) =>
              setReview({ ...review, content: e.target.value })
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "18px",
                backgroundColor: "rgba(255,255,255,0.03)",
                color: "white",
                fontSize: 16,
                "& fieldset": {
                  borderColor: "rgba(249,115,22,0.14)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(249,115,22,0.34)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#f97316",
                },
              },
            }}
          />

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                component="label"
                variant="outlined"
                startIcon={
                  uploadLoading ? (
                    <CircularProgress size={16} sx={{ color: "#fb923c" }} />
                  ) : (
                    <AddPhotoAlternateIcon />
                  )
                }
                disabled={uploadLoading || review.images.length >= 3}
                sx={{
                  textTransform: "none",
                  fontSize: 14,
                  fontWeight: 700,
                  borderRadius: "999px",
                  borderColor: "rgba(249,115,22,0.28)",
                  color: "#fb923c",
                  px: 2.4,
                  opacity: uploadLoading ? 0.9 : 1,
                }}
              >
                {uploadLoading ? "Đang tải ảnh..." : "Thêm hình ảnh"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => handleImageChange(e.target.files)}
                />
              </Button>
              <span className="text-sm text-slate-500">
                Tối đa 3 ảnh.
              </span>
            </div>

            {uploadLoading && (
              <Alert
                severity="info"
                sx={{
                  borderRadius: "16px",
                  backgroundColor: "rgba(249,115,22,0.08)",
                  color: "#f8fafc",
                  border: "1px solid rgba(249,115,22,0.18)",
                }}
              >
                Ảnh đang được tải lên. Vui lòng chờ đến khi hoàn tất.
              </Alert>
            )}

            {review.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {review.images.map((url, imgIndex) => (
                  <div
                    key={imgIndex}
                    className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/8 bg-black"
                  >
                    <img
                      src={url}
                      alt={`preview-${imgIndex}`}
                      className="h-full w-full object-cover"
                    />
                    <IconButton
                      size="small"
                      disabled={uploadLoading}
                      onClick={() =>
                        setReview({
                          ...review,
                          images: review.images.filter(
                            (_, i) => i !== imgIndex
                          ),
                        })
                      }
                      sx={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        backgroundColor: "rgba(0,0,0,0.7)",
                        color: "white",
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-300">
            <span>
              Bạn có giới thiệu sản phẩm này cho người khác không?
            </span>
            <Button
              variant={review.recommend ? "contained" : "outlined"}
              size="small"
              onClick={() =>
                setReview({ ...review, recommend: true })
              }
              sx={{
                textTransform: "none",
                borderRadius: "999px",
                backgroundColor: review.recommend
                  ? "#f97316"
                  : "transparent",
                color: review.recommend ? "#050505" : "#fb923c",
                borderColor: "#f97316",
                fontWeight: 700,
              }}
            >
              Có
            </Button>
            <Button
              variant={!review.recommend ? "contained" : "outlined"}
              size="small"
              onClick={() =>
                setReview({ ...review, recommend: false })
              }
              sx={{
                textTransform: "none",
                borderRadius: "999px",
                backgroundColor: !review.recommend
                  ? "#ef4444"
                  : "transparent",
                color: !review.recommend ? "#fff" : "#f87171",
                borderColor: "#ef4444",
                fontWeight: 700,
              }}
            >
              Không
            </Button>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button
            variant="text"
            sx={{ textTransform: "none", color: "#94a3b8", fontSize: 15 }}
            onClick={() => navigate(-1)}
            disabled={uploadLoading}
          >
            Để sau
          </Button>
          <Button
            variant="contained"
            disabled={uploadLoading}
            sx={{
              textTransform: "none",
              background:
                "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              color: "#050505",
              borderRadius: "999px",
              px: 3.5,
              py: 1.2,
              fontWeight: 800,
              fontSize: 15,
              boxShadow: "none",
              opacity: uploadLoading ? 0.75 : 1,
            }}
            onClick={onSubmit}
          >
            {uploadLoading ? "Đang tải..." : "Gửi đánh giá"}
          </Button>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: "0.8rem" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OrderReviewPage;