import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Chip,
  Divider,
  Rating,
  TextField,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { format } from "date-fns";
import { Order } from "../../../types/OrderType";
import { uploadToCloundinary } from "../../../utils/uploadToCloudinary";
import CustomLoading from "../../components/CustomLoading/CustomLoading";
import { createReview } from "../../../state/customer/reviewSlice";
import { useAppDispatch } from "../../../state/Store";

const primary = "#0097e6";

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

  // 👇 Lấy orderItemId được truyền từ OrderDetails (state)
  const state = location.state as { orderItemId?: number } | undefined;
  const selectedOrderItemId = state?.orderItemId;

  // Nếu có orderItemId thì tìm đúng item, không thì fallback item đầu
  const targetOrderItem =
    order.orderItems?.find((i) => i.id === selectedOrderItemId) ||
    order.orderItems?.[0];

  const [review, setReview] = useState<ReviewItem | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

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

  const handleRatingChange = (value: number | null) => {
    if (!review) return;
    setReview({ ...review, rating: value || 0 });
  };

  const handleContentChange = (value: string) => {
    if (!review) return;
    setReview({ ...review, content: value });
  };

  const handleToggleTag = (tag: string) => {
    if (!review) return;
    const exists = review.tags.includes(tag);
    setReview({
      ...review,
      tags: exists
        ? review.tags.filter((t) => t !== tag)
        : [...review.tags, tag],
    });
  };

  const handleRecommendToggle = (value: boolean) => {
    if (!review) return;
    setReview({ ...review, recommend: value });
  };

  const handleImageChange = async (files: FileList | null) => {
    if (!files || files.length === 0 || !review) return;

    const selectedFiles = Array.from(files).slice(0, 3);

    setUploadLoading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of selectedFiles) {
        const url = await uploadToCloundinary(file, "image");
        uploadedUrls.push(url);
      }

      setReview({
        ...review,
        images: [...review.images, ...uploadedUrls].slice(0, 3),
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleRemoveImage = (imgIndex: number) => {
    if (!review) return;
    const copy = [...review.images];
    copy.splice(imgIndex, 1);
    setReview({ ...review, images: copy });
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const onSubmit = async () => {
    if (!review) return;

    try {
      const tagsString = review.tags.join(", ");
      const reviewText =
        review.tags.length > 0
          ? `${review.content}. Tags: ${tagsString}`
          : review.content;

      const payload = {
        orderItemId: Number(review.orderItemId),
        reviewText,
        reviewRating: review.rating,
        productImages: review.images,
      };

      await dispatch(createReview(payload)).unwrap();

      setSnackbar({
        open: true,
        message: "Đánh giá thành công!",
        severity: "success",
      });

      navigate("/account/orders");
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error?.message || "Đánh giá thất bại, vui lòng thử lại!",
        severity: "error",
      });
    }
  };

  if (!targetOrderItem || !review) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-sm text-slate-500">
        Đang tải sản phẩm cần đánh giá...
      </div>
    );
  }

  const product = targetOrderItem.product;
  const sellerName =
    product?.seller?.businessDetails?.businessName || "Nhà bán";

  return (
    <div className="bg-[#f0f3fa] p-4 md:p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-md p-6 md:p-9 border border-gray-100">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate(-1)}
              startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 16 }} />}
              sx={{
                minWidth: 0,
                px: 1.8,
                py: 0.7,
                borderRadius: "999px",
                border: "1px solid #e0e0e0",
                color: "#555",
                textTransform: "none",
                fontSize: 13,
                backgroundColor: "#fafafa",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              Quay lại
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                Đánh giá đơn hàng #{orderId || order.id}
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Đơn hàng đã được giao{" "}
                <span className="font-semibold text-gray-800">
                  {order.deliveryDate
                    ? format(new Date(order.deliveryDate), "dd/MM/yyyy")
                    : "N/A"}
                </span>
                . Hãy chia sẻ trải nghiệm để giúp cộng đồng mua sắm tốt hơn.
              </p>
            </div>
          </div>
        </div>

        {/* STATUS / INFO NHANH */}
        <div className="flex flex-wrap items-center gap-3 mb-5 text-xs md:text-sm text-gray-600">
          <Chip
            icon={<LocalShippingIcon sx={{ fontSize: 18 }} />}
            label="Đơn hàng đã giao thành công"
            sx={{
              backgroundColor: "#e3f6ff",
              color: "#0077b6",
              fontSize: 12,
              height: 28,
            }}
          />
          <Chip
            icon={<StorefrontIcon sx={{ fontSize: 18 }} />}
            label={`1 sản phẩm được chọn để đánh giá`}
            sx={{ fontSize: 12, height: 28 }}
          />
        </div>

        <Divider className="!my-5" />

        {/* FORM ĐÁNH GIÁ 1 SẢN PHẨM */}
        <div className="space-y-7">
          <div className="bg-[#f8fbff] border border-[#e0f0ff] rounded-2xl p-4 md:p-5 space-y-3">
            {/* PRODUCT HEADER */}
            <div className="flex gap-3">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-white border">
                <img
                  src={product?.images?.[0]}
                  alt={product?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#0097e6] font-semibold">
                  {sellerName}
                </p>
                <p className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2">
                  {product?.title}
                </p>
                <p className="text-[11px] md:text-xs text-gray-500 mt-0.5">
                  Số lượng: {targetOrderItem.quantity}{" "}
                  {targetOrderItem.size?.name && (
                    <>· Size: {targetOrderItem.size?.name}</>
                  )}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] md:text-xs text-gray-500">
                  Đánh giá sản phẩm
                </span>
                <Rating
                  value={review.rating}
                  onChange={(_, value) => handleRatingChange(value)}
                  size="medium"
                  sx={{
                    "& .MuiRating-iconFilled": { color: "#ffb703" },
                  }}
                />
                <span className="text-[10px] text-gray-500">
                  {review.rating} / 5
                </span>
              </div>
            </div>

            {/* QUICK TAGS */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {quickTags.map((tag) => {
                const selected = review.tags.includes(tag);
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => handleToggleTag(tag)}
                    size="small"
                    sx={{
                      fontSize: 11,
                      borderRadius: "999px",
                      backgroundColor: selected ? primary : "#ffffff",
                      color: selected ? "#ffffff" : "#555",
                      border: selected ? "none" : "1px solid #e0e0e0",
                      "&:hover": {
                        backgroundColor: selected ? "#00a8ff" : "#f5f5f5",
                      },
                    }}
                  />
                );
              })}
            </div>

            {/* TEXTAREA */}
            <TextField
              multiline
              minRows={3}
              fullWidth
              placeholder="Chia sẻ chi tiết trải nghiệm: chất lượng sản phẩm, đóng gói, giao hàng, dịch vụ từ nhà bán..."
              value={review.content}
              onChange={(e) => handleContentChange(e.target.value)}
              sx={{
                mt: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "18px",
                  backgroundColor: "#ffffff",
                  fontSize: 13,
                },
                "& fieldset": {
                  borderColor: "#e0e7ff",
                },
                "&:hover fieldset": {
                  borderColor: "#0097e6",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0097e6",
                },
              }}
            />

            {/* UPLOAD ẢNH */}
            <div className="mt-2 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outlined"
                  size="small"
                  component="label"
                  startIcon={<AddPhotoAlternateIcon />}
                  sx={{
                    textTransform: "none",
                    fontSize: 11,
                    borderRadius: "999px",
                    borderColor: "#0097e6",
                    color: "#0097e6",
                    paddingX: 1.8,
                    "&:hover": {
                      borderColor: "#00a8ff",
                      backgroundColor: "#e6f7ff",
                    },
                  }}
                >
                  Thêm hình ảnh thực tế
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) => handleImageChange(e.target.files)}
                  />
                </Button>
                <span className="text-[10px] md:text-xs text-gray-500">
                  Tối đa 3 ảnh · Ưu tiên ảnh rõ, không chứa thông tin nhạy cảm.
                </span>
              </div>

              {/* PREVIEW ẢNH */}
              {review.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {review.images.map((url, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border bg-white"
                    >
                      <img
                        src={url}
                        alt={`preview-${imgIndex}`}
                        className="w-full h-full object-cover"
                      />

                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(imgIndex)}
                        sx={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          color: "white",
                          "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </div>
                  ))}
                  {uploadLoading && (
                    <div className="mt-2 flex items-center gap-2">
                      <CustomLoading />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RECOMMEND TOGGLE */}
            <div className="flex items-center gap-3 text-[11px] md:text-xs mt-1">
              <span className="text-gray-600">
                Bạn có muốn giới thiệu sản phẩm / nhà bán này cho người khác?
              </span>
              <Button
                variant={review.recommend ? "contained" : "outlined"}
                size="small"
                onClick={() => handleRecommendToggle(true)}
                sx={{
                  textTransform: "none",
                  fontSize: 10,
                  px: 1.7,
                  borderRadius: "999px",
                  backgroundColor: review.recommend ? primary : "transparent",
                  color: review.recommend ? "#fff" : primary,
                  borderColor: primary,
                  "&:hover": {
                    backgroundColor: review.recommend
                      ? "#00a8ff"
                      : "rgba(0,151,230,0.06)",
                  },
                }}
              >
                Có
              </Button>
              <Button
                variant={!review.recommend ? "contained" : "outlined"}
                size="small"
                onClick={() => handleRecommendToggle(false)}
                sx={{
                  textTransform: "none",
                  fontSize: 10,
                  px: 1.7,
                  borderRadius: "999px",
                  backgroundColor: !review.recommend
                    ? "#e74c3c"
                    : "transparent",
                  color: !review.recommend ? "#fff" : "#e74c3c",
                  borderColor: "#e74c3c",
                  "&:hover": {
                    backgroundColor: !review.recommend
                      ? "#ff6b6b"
                      : "rgba(231,76,60,0.06)",
                  },
                }}
              >
                Không
              </Button>
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="mt-9 flex justify-end gap-3">
          <Button
            variant="text"
            sx={{
              textTransform: "none",
              color: "#7f8c8d",
              fontSize: 13,
            }}
            onClick={() => navigate(-1)}
          >
            Để sau
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: primary,
              "&:hover": { backgroundColor: "#00a8ff" },
              borderRadius: "999px",
              px: 3.5,
              py: 1,
              fontWeight: 600,
              fontSize: 14,
            }}
            onClick={onSubmit}
          >
            Gửi đánh giá
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
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OrderReviewPage;
