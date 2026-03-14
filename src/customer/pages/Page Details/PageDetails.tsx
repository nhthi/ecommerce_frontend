import {
  Add,
  AddShoppingCart,
  FavoriteBorder,
  LocalShipping,
  ModeComment,
  Remove,
  Shield,
  Star,
  Wallet,
  WorkspacePremium,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Button,
  ButtonGroup,
  CircularProgress,
  Divider,
  Snackbar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SimilarProduct from "./SimilarProduct";
import Review from "../Home/Review/Review";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchProductById,
  fetchSameProduct,
} from "../../../state/customer/productSlice";
import { addProductToWishlist } from "../../../state/customer/wishlistSlice";
import { Size } from "../../../types/ProductType";
import { addItemToCart } from "../../../state/customer/cartSlice";
import { formatCurrencyVND } from "../../../utils/formatCurrencyVND";
import { createChat } from "../../../state/customer/chatSlice";

const PageDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<Size>();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const products = useAppSelector((store) => store.product);
  const dispatch = useAppDispatch();
  const { productId } = useParams();
  const [activeImage, setActiveImage] = useState(0);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await dispatch(addProductToWishlist(Number(productId))).unwrap();
      setSnackbar({
        open: true,
        message: "Đã thêm vào danh sách yêu thích 💙",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err || "Không thể thêm vào danh sách yêu thích.",
        severity: "error",
      });
    }
  };

  const handleChatSeller = async () => {
    const sellerId = products.product?.seller?.id;
    if (sellerId) {
      await dispatch(createChat({ sellerId: Number(sellerId) }));
      navigate("/message");
    }
  };

  // 🧠 Thêm sản phẩm vào giỏ
  const handleBuy = async () => {
    if (!selectedSize) {
      setError("Vui lòng chọn size trước khi thêm vào giỏ hàng!");
      return;
    }

    setLoading(true);
    setError("");

    // Hiệu ứng “bay vào giỏ”
    const productImg = document.querySelector(".main-product-img");
    const cartIcon = document.querySelector(".cart-icon");
    if (productImg && cartIcon) {
      const imgRect = productImg.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      const clone = productImg.cloneNode(true) as HTMLElement;
      clone.style.position = "fixed";
      clone.style.left = `${imgRect.left}px`;
      clone.style.top = `${imgRect.top}px`;
      clone.style.width = "180px";
      clone.style.zIndex = "1000";
      clone.style.borderRadius = "16px";
      clone.style.transition = "all 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      document.body.appendChild(clone);

      setTimeout(() => {
        clone.style.left = `${cartRect.left}px`;
        clone.style.top = `${cartRect.top}px`;
        clone.style.width = "0px";
        clone.style.opacity = "0";
      }, 50);

      setTimeout(() => {
        document.body.removeChild(clone);
      }, 950);
    }

    const req = {
      productId: Number(productId),
      sizeId: selectedSize.id,
      quantity: quantity,
    };

    try {
      await dispatch(addItemToCart(req)).unwrap();

      setSnackbar({
        open: true,
        message: "Đã thêm sản phẩm vào giỏ hàng 🛒",
        severity: "success",
      });
    } catch (err: any) {
      console.error("Add to cart failed:", err);
      setSnackbar({
        open: true,
        message: err || "Thêm sản phẩm vào giỏ thất bại!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const product = products.product;

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(Number(productId)));
    }
  }, [productId, dispatch]);
  useEffect(() => {
    if (product) {
      dispatch(
        fetchSameProduct({
          query: product?.category?.name || "",
          id: productId,
        })
      );
    }
  }, [product, dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 lg:px-20 pt-10 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-3xl shadow-md p-5 lg:p-8">
        {/* LEFT: Hình ảnh sản phẩm */}
        <section className="flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-[18%] flex flex-wrap lg:flex-col gap-3">
            {product?.images.map((item, index) => (
              <img
                key={index}
                onClick={() => setActiveImage(index)}
                alt={product?.title}
                src={item}
                className={`lg:w-full w-[60px] h-[70px] lg:h-20 object-cover rounded-xl cursor-pointer border transition
                ${
                  activeImage === index
                    ? "border-primary-color shadow-sm"
                    : "border-slate-200 hover:border-primary-color/70"
                }`}
              />
            ))}
          </div>
          <div className="w-full lg:w-[82%]">
            <img
              alt={product?.title}
              src={product?.images[activeImage]}
              className="w-full rounded-2xl main-product-img object-cover max-h-[480px] shadow-sm"
            />
          </div>
        </section>

        {/* RIGHT: Thông tin chi tiết */}
        <section className="space-y-5">
          {/* Seller + tên sản phẩm */}
          <div className="space-y-3">
            {/* Shop Info */}
            <div className="flex items-center gap-3 pb-1">
              <Avatar src={product?.seller?.avatar || ""}>A</Avatar>

              <div>
                <h1 className="font-semibold text-sm text-primary-color uppercase tracking-wide">
                  {product?.seller?.businessDetails?.businessName}
                </h1>

                {/* Nút Xem shop */}
                <button
                  onClick={() => navigate(`/store/${product?.seller?.id}`)}
                  className="text-xs text-sky-600 underline hover:text-sky-800 transition"
                >
                  Xem shop →
                </button>
              </div>
            </div>

            {/* Product Title */}
            <p className="text-slate-800 font-semibold text-lg leading-snug">
              {product?.title}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex justify-between items-center py-2 border border-slate-200 rounded-full px-4 shadow-sm bg-slate-50/60">
              <div className="flex gap-1 items-center">
                <span className="font-semibold text-sm text-slate-800">
                  {product?.numRatings || 0}
                </span>
                <Star sx={{ color: "#fbbf24", fontSize: "18px" }} />
              </div>
              <Divider
                orientation="vertical"
                flexItem
                className="!mx-3 !border-slate-200"
              />
              <span className="text-xs text-slate-600">
                {product?.reviews?.length || 0} đánh giá
              </span>
            </div>
          </div>

          {/* Giá */}
          <div>
            <div className="flex items-end gap-3 mt-4">
              <span className="font-bold text-2xl text-slate-900">
                {formatCurrencyVND(Number(product?.sellingPrice))}
              </span>
              <span className="thin-line-through text-slate-400 text-base">
                {formatCurrencyVND(Number(product?.mrpPrice))}
              </span>
              {product?.discountPercent && (
                <span className="text-primary-color font-semibold text-base">
                  -{product.discountPercent}%
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Đã bao gồm thuế · Miễn phí giao hàng cho đơn từ{" "}
              <span className="font-semibold text-slate-700">150.000đ</span>.
            </p>
          </div>

          {/* Cam kết */}
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="flex items-center gap-3">
              <Shield sx={{ color: "#0097e6" }} />
              <p>Hàng chính hãng · Chất lượng được kiểm duyệt</p>
            </div>
            <div className="flex items-center gap-3">
              <WorkspacePremium sx={{ color: "#0097e6" }} />
              <p>Đảm bảo hoàn tiền 100% nếu sản phẩm lỗi</p>
            </div>
            <div className="flex items-center gap-3">
              <LocalShipping sx={{ color: "#0097e6" }} />
              <p>Giao hàng nhanh, hỗ trợ đổi trả dễ dàng</p>
            </div>
            <div className="flex items-center gap-3">
              <Wallet sx={{ color: "#0097e6" }} />
              <p>
                Hỗ trợ{" "}
                <span className="font-medium text-slate-800">
                  thanh toán khi nhận hàng (COD)
                </span>{" "}
                tùy khu vực
              </p>
            </div>
          </div>

          {/* Size */}
          <div className="mt-5 space-y-2">
            <h1 className="font-semibold text-sm text-slate-800">Chọn size</h1>
            <ButtonGroup>
              <div className="flex flex-wrap items-center gap-2">
                {product?.sizes.map((size: Size) => (
                  <Button
                    key={size.id}
                    variant={
                      selectedSize?.id === size.id ? "contained" : "outlined"
                    }
                    color={selectedSize?.id === size.id ? "primary" : "inherit"}
                    onClick={() => {
                      setSelectedSize(size);
                      setError("");
                    }}
                    disabled={size.quantity === 0}
                    sx={{
                      minWidth: 52,
                      borderRadius: "999px",
                      textTransform: "none",
                      fontSize: 13,
                      px: 2,
                      py: 0.5,
                    }}
                  >
                    {size.name}
                    {size.quantity === 0 && (
                      <span className="ml-1 text-[10px] text-red-500">
                        (hết)
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </ButtonGroup>
            {selectedSize && (
              <p className="text-gray-600 mt-1 text-xs">
                Size đã chọn:{" "}
                <span className="font-semibold text-slate-800">
                  {selectedSize.name}
                </span>{" "}
                · Còn lại{" "}
                <span className="font-semibold">{selectedSize.quantity}</span>{" "}
                sản phẩm
              </p>
            )}
          </div>

          {/* Số lượng */}
          <div className="mt-5 space-y-2">
            <h1 className="font-semibold text-sm text-slate-800">Số lượng</h1>
            <div className="flex items-center gap-2 w-[150px] justify-between rounded-full border border-slate-200 bg-slate-50 px-1">
              <Button
                onClick={() => setQuantity(quantity - 1)}
                disabled={quantity === 1}
                sx={{
                  minWidth: 40,
                  borderRadius: "999px",
                }}
              >
                <Remove />
              </Button>
              <span className="font-semibold text-slate-800">{quantity}</span>
              <Button
                onClick={() => {
                  if (selectedSize) {
                    if (quantity + 1 > Number(selectedSize.quantity)) {
                      setSnackbar({
                        open: true,
                        message: `Size ${selectedSize.name} chỉ còn ${selectedSize.quantity} sản phẩm!`,
                        severity: "error",
                      });
                      return;
                    }
                  }
                  setQuantity(quantity + 1);
                }}
                sx={{
                  minWidth: 40,
                  borderRadius: "999px",
                }}
              >
                <Add />
              </Button>
            </div>
          </div>

          {/* Lỗi chọn size */}
          {error && (
            <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>
          )}

          {/* Nút hành động chính */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-3">
            <Button
              fullWidth
              variant="contained"
              startIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <AddShoppingCart />
                )
              }
              sx={{
                py: "0.9rem",
                textTransform: "none",
                borderRadius: "999px",
                fontWeight: 600,
                fontSize: 14,
              }}
              onClick={handleBuy}
              disabled={loading}
            >
              {loading ? "Đang thêm vào giỏ..." : "Thêm vào giỏ hàng"}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<FavoriteBorder />}
              sx={{
                py: "0.9rem",
                textTransform: "none",
                borderRadius: "999px",
                fontWeight: 500,
                fontSize: 14,
              }}
              onClick={handleWishlist}
            >
              Thêm vào yêu thích
            </Button>
          </div>

          {/* Nút nhắn tin người bán */}
          <div className="mt-3">
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ModeComment />}
              sx={{
                py: "0.8rem",
                textTransform: "none",
                borderRadius: "999px",
                fontWeight: 500,
                fontSize: 14,
                borderStyle: "dashed",
              }}
              onClick={handleChatSeller}
            >
              Nhắn tin với người bán
            </Button>
          </div>

          {/* Mô tả sản phẩm */}
          <div className="mt-5">
            <h2 className="font-semibold text-sm text-slate-800 mb-1.5">
              Mô tả sản phẩm
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {product?.description || "Chưa có mô tả cho sản phẩm này."}
            </p>
          </div>
        </section>
      </div>

      {/* Đánh giá sản phẩm */}
      <div className="mt-12 bg-white rounded-3xl shadow-sm p-5 lg:p-8">
        <Review reviews={product?.reviews || []} product={product || null} />
        <Divider className="!mt-6" />
      </div>

      {/* Sản phẩm tương tự */}
      <div className="mt-12">
        <h1 className="text-lg font-bold px-1 mb-3 text-slate-900">
          Sản phẩm tương tự
        </h1>
        <div className="pt-2">
          <SimilarProduct products={products.products} />
        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
    </div>
  );
};

export default PageDetails;
