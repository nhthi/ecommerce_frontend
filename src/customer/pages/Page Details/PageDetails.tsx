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
  Bolt,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Snackbar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";
import { fetchRecommendations, fetchSameProducts } from "../../../state/customer/recommendationSlice";

const infoPoints = [
  {
    icon: <Shield sx={{ color: "#fb923c" }} />,
    text: "Sản phẩm được kiểm tra kỹ trước khi đóng gói.",
  },
  {
    icon: <WorkspacePremium sx={{ color: "#fb923c" }} />,
    text: "Hỗ trợ đổi trả theo chính sách nếu sản phẩm có lỗi.",
  },
  {
    icon: <LocalShipping sx={{ color: "#fb923c" }} />,
    text: "Giao hàng toàn quốc, cập nhật trạng thái đơn hàng liên tục.",
  },
  {
    icon: <Wallet sx={{ color: "#fb923c" }} />,
    text: "Đa dạng phương thức thanh toán tùy khu vực và đơn hàng.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

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
  const recommendationSlice = useAppSelector((store) => store.recommendationSlice);

  const dispatch = useAppDispatch();
  const { productId } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAppSelector(store=>store.auth)
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const { isDark } = useSiteThemeMode();

  const product = products.product;
  const numericProductId = Number(productId);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await dispatch(addProductToWishlist(numericProductId)).unwrap();
      setSnackbar({
        open: true,
        message: "Đã thêm vào danh sách yêu thích.",
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
    const sellerId = product?.seller?.id;
    if (sellerId) {
      await dispatch(createChat({ sellerId: Number(sellerId) }));
      navigate("/message");
    }
  };

  const handleBuy = async () => {
    if (!selectedSize) {
      setError("Hãy chọn size trước khi thêm vào giỏ hàng.");
      return;
    }

    if (quantity > Number(selectedSize.quantity)) {
      setError(`Size ${selectedSize.name} chỉ còn ${selectedSize.quantity} sản phẩm.`);
      return;
    }

    setLoading(true);
    setError("");

    const productImg = document.querySelector(".main-product-img") as HTMLElement | null;
    const cartIcon = document.querySelector('[data-cart-target="true"]') as HTMLElement | null;

    if (productImg && cartIcon) {
      const imgRect = productImg.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      const flyImage = document.createElement("img");
      flyImage.src = product?.images?.[activeImage] || product?.images?.[0] || "";
      flyImage.alt = product?.title || "product";
      flyImage.style.position = "fixed";
      flyImage.style.left = `${imgRect.left + 24}px`;
      flyImage.style.top = `${imgRect.top + 24}px`;
      flyImage.style.width = "160px";
      flyImage.style.height = "160px";
      flyImage.style.objectFit = "cover";
      flyImage.style.borderRadius = "20px";
      flyImage.style.zIndex = "1000";
      flyImage.style.pointerEvents = "none";
      flyImage.style.boxShadow = "0 24px 80px rgba(0,0,0,0.38)";
      flyImage.style.transition =
        "transform 0.95s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.95s ease, filter 0.95s ease";
      document.body.appendChild(flyImage);

      const deltaX = cartRect.left - imgRect.left;
      const deltaY = cartRect.top - imgRect.top;

      requestAnimationFrame(() => {
        flyImage.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.12) rotate(10deg)`;
        flyImage.style.opacity = "0.2";
        flyImage.style.filter = "saturate(1.2)";
      });

      cartIcon.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.18)" },
          { transform: "scale(0.96)" },
          { transform: "scale(1)" },
        ],
        {
          duration: 520,
          delay: 620,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        }
      );

      setTimeout(() => {
        flyImage.remove();
      }, 980);
    }

    const req = {
      productId: numericProductId,
      sizeId: selectedSize.id,
      quantity: quantity,
    };

    try {
      await dispatch(addItemToCart(req)).unwrap();
      setSnackbar({
        open: true,
        message: "Đã thêm sản phẩm vào giỏ hàng.",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err || "Thêm vào giỏ thất bại.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
const getErrorMessage = (err: any): string => {
  if (!err) return "Đã xảy ra lỗi.";

  if (typeof err === "string") return err;

  if (typeof err === "object") {
    if (typeof err.message === "string") return err.message;
    if (typeof err.details === "string") return err.details;
    return JSON.stringify(err);
  }

  return "Đã xảy ra lỗi.";
};
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId || Number.isNaN(numericProductId)) {
        setPageLoading(false);
        setPageError("Không tìm thấy sản phẩm.");
        return;
      }

      try {
        setPageLoading(true);
        setPageError("");
        setActiveImage(0);
        setSelectedSize(undefined);
        setQuantity(1);
        setError("");

        await dispatch(
  fetchProductById({
    productId: numericProductId,
    userId: auth.user?.id, // 👈 thêm vào đây
  })
).unwrap();
      } catch (err: any) {
        setPageError(getErrorMessage(err));
      } finally {
        setPageLoading(false);
      }
    };

    loadProduct();
  }, [productId, numericProductId, dispatch]);

useEffect(() => {
  if (pageLoading || !product?.id) return;

  if (auth.user?.id) {
    dispatch(
      fetchRecommendations({
        userId: auth.user.id,
        productId: product.id,
        topN: 10,
      })
    );
  } else {
    dispatch(
      fetchSameProducts({
        productId: product.id,
        topN: 10,
      })
    );
  }
}, [pageLoading, product?.id, auth.user?.id, dispatch]);
  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
        <div className={isDark ? "flex flex-col items-center gap-4 text-white" : "flex flex-col items-center gap-4 text-slate-900"}>
          <CircularProgress sx={{ color: "#f97316" }} />
          <p className="text-sm text-slate-300">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (pageError || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
        <div className="w-full max-w-md rounded-[1.5rem] border border-red-500/20 bg-[#101010] p-6 text-center text-white">
          <h2 className="text-xl font-bold text-red-300">Không thể hiển thị sản phẩm</h2>
          <p className={isDark ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-600"}>
            {pageError || "Sản phẩm không tồn tại hoặc đã bị xóa."}
          </p>
          <Button
            onClick={() => navigate(-1)}
            variant="contained"
            sx={{
              mt: 3,
              textTransform: "none",
              borderRadius: "999px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              color: "#050505",
            }}
          >
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={isDark ? "min-h-screen bg-[#080808] px-4 pb-16 pt-8 text-white lg:px-16" : "min-h-screen bg-[#f6f7fb] px-4 pb-16 pt-8 text-slate-900 lg:px-16"}>
      <div className="mx-auto max-w-[1320px] space-y-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className={isDark ? "overflow-hidden rounded-[2rem] border border-orange-500/12 bg-[#101010] shadow-[0_30px_100px_rgba(0,0,0,0.32)]" : "overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]"}
        >
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <section className={isDark ? "border-b border-orange-500/10 p-5 lg:border-b-0 lg:border-r lg:p-8" : "border-b border-slate-200 p-5 lg:border-b-0 lg:border-r lg:p-8"}>
              <div className="grid gap-4 lg:grid-cols-[100px_minmax(0,1fr)]">
                <div className="order-2 flex gap-3 overflow-auto lg:order-1 lg:flex-col">
                  {product?.images?.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`overflow-hidden rounded-[1.2rem] border transition ${
                        activeImage === index
                          ? "border-orange-400 shadow-[0_0_0_1px_rgba(249,115,22,0.25)]"
                          : "border-white/8 hover:border-orange-500/40"
                      }`}
                    >
                      <img
                        alt={product?.title}
                        src={item}
                        className="h-[88px] w-[82px] object-cover lg:h-[108px] lg:w-full"
                      />
                    </button>
                  ))}
                </div>

                <div className="order-1 lg:order-2">
                  <div className={isDark ? "relative overflow-hidden rounded-[1.8rem] bg-black" : "relative overflow-hidden rounded-[1.8rem] bg-slate-100"}>
                    <img
                      alt={product?.title}
                      src={product?.images?.[activeImage] || product?.images?.[0] || ""}
                      className="main-product-img max-h-[620px] w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.14),transparent_24%)]" />
                    {product?.discountPercent ? (
                      <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-black">
                        <Bolt sx={{ fontSize: 14 }} />
                        -{product.discountPercent}%
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            <section className="p-5 lg:p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Avatar src={product?.seller?.avatar || ""}>A</Avatar>
                  <div>
                    <h1 className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">
                      {product?.seller?.businessDetails?.businessName || "NHTHI Fit"}
                    </h1>
                    <button
                      onClick={() => navigate(`/store/${product?.seller?.id}`)}
                      className={isDark ? "mt-1 text-sm font-semibold text-slate-300 transition hover:text-orange-300" : "mt-1 text-sm font-semibold text-slate-600 transition hover:text-orange-600"}
                    >
                      Xem cửa hàng
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className={isDark ? "max-w-[640px] text-3xl font-black leading-tight text-white lg:text-[2.4rem]" : "max-w-[640px] text-3xl font-black leading-tight text-slate-900 lg:text-[2.4rem]"}>
                    {product?.title}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
  <div
    className={
      isDark
        ? "inline-flex items-center gap-3 rounded-full border border-orange-500/15 bg-black/20 px-4 py-2 text-sm text-slate-300"
        : "inline-flex items-center gap-3 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm text-slate-600"
    }
  >
    <span
      className={
        isDark
          ? "inline-flex items-center gap-1 font-semibold text-white"
          : "inline-flex items-center gap-1 font-semibold text-slate-900"
      }
    >
      {product?.numRatings || 0}
      <Star sx={{ color: "#fb923c", fontSize: 18 }} />
    </span>

    <Divider
      orientation="vertical"
      flexItem
      sx={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)" }}
    />

    <span>{product?.reviews?.length || 0} đánh giá</span>

    <Divider
      orientation="vertical"
      flexItem
      sx={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)" }}
    />

    <span>Đã bán {Number(product?.sold ?? 0)}</span>
  </div>
</div>

                <div className={isDark ? "rounded-[1.4rem] border border-orange-500/12 bg-black/20 p-5" : "rounded-[1.4rem] border border-orange-100 bg-orange-50/70 p-5"}>
                  <div className="flex flex-wrap items-end gap-3">
                    <span className="text-3xl font-black text-orange-400">
                      {formatCurrencyVND(Number(product?.sellingPrice))}
                    </span>
                    <span className={isDark ? "pb-1 text-base text-slate-500 line-through" : "pb-1 text-base text-slate-400 line-through"}>
                      {formatCurrencyVND(Number(product?.mrpPrice))}
                    </span>
                  </div>
                  <p className={isDark ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-600"}>
                    Giá đã bao gồm thuế. Phí giao hàng sẽ thay đổi tùy khu vực.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {infoPoints.map((item) => (
                    <div
                      key={item.text}
                      className={isDark ? "flex items-start gap-3 rounded-[1.2rem] border border-white/6 bg-white/[0.03] px-4 py-4 text-sm text-slate-300" : "flex items-start gap-3 rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600"}
                    >
                      {item.icon}
                      <p className="leading-6">{item.text}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-orange-300">
                    Chọn size
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product?.sizes?.map((size: Size) => (
                      <Button
                        key={size.id}
                        variant={selectedSize?.id === size.id ? "contained" : "outlined"}
                        onClick={() => {
                          setSelectedSize(size);
                          setError("");
                          if (quantity > Number(size.quantity)) {
                            setQuantity(1);
                          }
                        }}
                        disabled={size.quantity === 0}
                        sx={{
                          minWidth: 56,
                          borderRadius: "999px",
                          textTransform: "none",
                          fontWeight: 700,
                          px: 2,
                          py: 0.9,
                          color: selectedSize?.id === size.id ? "#050505" : isDark ? "#fff" : "#0f172a",
                          backgroundColor:
                            selectedSize?.id === size.id ? "#f97316" : "transparent",
                          borderColor: isDark ? "rgba(249,115,22,0.25)" : "rgba(249,115,22,0.32)",
                          "&:hover": {
                            borderColor: "#fb923c",
                            backgroundColor:
                              selectedSize?.id === size.id
                                ? "#fb923c"
                                : isDark ? "rgba(249,115,22,0.08)" : "rgba(249,115,22,0.10)",
                          },
                          "&.Mui-disabled": {
                            color: isDark ? "rgba(255,255,255,0.24)" : "rgba(15,23,42,0.28)",
                            borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.10)",
                          },
                        }}
                      >
                        {size.name}
                      </Button>
                    ))}
                  </div>
                  {selectedSize && (
                    <p className={isDark ? "text-sm text-slate-400" : "text-sm text-slate-600"}>
                      Còn lại{" "}
                      <span className={isDark ? "font-bold text-white" : "font-bold text-slate-900"}>{selectedSize.quantity}</span> sản
                      phẩm cho size {selectedSize.name}.
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-orange-300">
                    Số lượng
                  </h3>
                  <div className={isDark ? "inline-flex items-center gap-2 rounded-full border border-orange-500/15 bg-black/20 p-1" : "inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 p-1"}>
                    <Button
                      onClick={() => setQuantity(quantity - 1)}
                      disabled={quantity === 1}
                      sx={{ minWidth: 42, borderRadius: "999px", color: isDark ? "white" : "#0f172a" }}
                    >
                      <Remove />
                    </Button>
                    <span className={isDark ? "min-w-[28px] text-center font-bold text-white" : "min-w-[28px] text-center font-bold text-slate-900"}>
                      {quantity}
                    </span>
                    <Button
                      onClick={() => {
                        if (!selectedSize) {
                          setSnackbar({
                            open: true,
                            message: "Hãy chọn size trước.",
                            severity: "error",
                          });
                          return;
                        }

                        if (quantity + 1 > Number(selectedSize.quantity)) {
                          setSnackbar({
                            open: true,
                            message: `Size ${selectedSize.name} chỉ còn ${selectedSize.quantity} sản phẩm.`,
                            severity: "error",
                          });
                          return;
                        }

                        setQuantity(quantity + 1);
                      }}
                      sx={{ minWidth: 42, borderRadius: "999px", color: isDark ? "white" : "#0f172a" }}
                    >
                      <Add />
                    </Button>
                  </div>
                </div>

                {error && <p className="text-sm font-medium text-red-300">{error}</p>}

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={
                      loading ? <CircularProgress size={18} color="inherit" /> : <AddShoppingCart />
                    }
                    sx={{
                      py: "0.95rem",
                      textTransform: "none",
                      borderRadius: "999px",
                      fontWeight: 800,
                      fontSize: 14,
                      background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                      color: "#fff",
                      boxShadow: "none",
                      "&:hover": {
                        background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                        boxShadow: "none",
                      },
                    }}
                    onClick={handleBuy}
                    disabled={loading}
                  >
                    {loading ? "Đang thêm..." : "Thêm vào giỏ"}
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FavoriteBorder />}
                    sx={{
                      py: "0.95rem",
                      textTransform: "none",
                      borderRadius: "999px",
                      fontWeight: 700,
                      fontSize: 14,
                      borderColor: "rgba(249,115,22,0.28)",
                      color: "#fb923c",
                      "&:hover": {
                        borderColor: "#fb923c",
                        backgroundColor: isDark ? "rgba(249,115,22,0.08)" : "rgba(249,115,22,0.10)",
                      },
                    }}
                    onClick={handleWishlist}
                  >
                    Lưu vào danh sách yêu thích
                  </Button>
                </div>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ModeComment />}
                  sx={{
                    py: "0.9rem",
                    textTransform: "none",
                    borderRadius: "999px",
                    fontWeight: 700,
                    fontSize: 14,
                    borderStyle: "dashed",
                    borderColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(15,23,42,0.12)",
                    color: isDark ? "white" : "#0f172a",
                    "&:hover": {
                      borderColor: "#fb923c",
                      backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(249,115,22,0.06)",
                    },
                  }}
                  onClick={()=>navigate('/support')}
                >
                  Nhắn tin với cửa hàng
                </Button>

                <div className={isDark ? "rounded-[1.4rem] border border-white/6 bg-black/20 p-5" : "rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5"}>
                  <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-orange-300">
                    Mô tả sản phẩm
                  </h3>
                  <p className={isDark ? "mt-3 text-sm leading-7 text-slate-300" : "mt-3 text-sm leading-7 text-slate-600"}>
                    {product?.description || "Chưa có mô tả cho sản phẩm này."}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className={isDark ? "rounded-[2rem] border border-orange-500/12 bg-[#101010] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] lg:p-8" : "rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:p-8"}
        >
          <Review reviews={product?.reviews || []} product={product || null} />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className={isDark ? "rounded-[2rem] border border-orange-500/12 bg-[#101010] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] lg:p-8" : "rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:p-8"}
        >
          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-300">
              Sản phẩm liên quan
            </p>
          </div>
<SimilarProduct
  products={
    auth.user?.id
      ? recommendationSlice.recommendations?.items || []
      : recommendationSlice.sameProducts?.items || []
  }
/>
        </motion.div>
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
          sx={{ width: "100%", borderRadius: "0.8rem" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PageDetails;





