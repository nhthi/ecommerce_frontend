import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { Close, Favorite, LocalOffer, ShoppingCart } from "@mui/icons-material";
import { Button, IconButton, TextField, Typography } from "@mui/material";
import PricingCart from "./PricingCart";
import { useNavigate } from "react-router-dom";
import { applyCoupon, fetchUserCart } from "../../../state/customer/cartSlice";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import CustomLoading from "../../components/CustomLoading/CustomLoading";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const Cart = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<any>("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((store) => store);
  const { isDark } = useSiteThemeMode();

  const handleChangeCouponCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
    setErrorMessage("");
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setErrorMessage("Vui lòng nhập mã giảm giá.");
      return;
    }

    try {
      setLoading(true);
      await dispatch(
        applyCoupon({
          apply: "true",
          code: couponCode,
          orderValue: Number(cart.cart?.totalSellingPrice),
        })
      ).unwrap();
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    await dispatch(
      applyCoupon({
        apply: "false",
        code: cart.cart?.coupon ? cart.cart?.coupon.code : "code",
        orderValue: Number(cart.cart?.totalSellingPrice),
      })
    );
  };

  useEffect(() => {
    dispatch(fetchUserCart());
  }, [dispatch]);

  const isEmpty = !cart.cart?.cartItems || cart.cart.cartItems.length === 0;

  const hasOutOfStock = cart.cart?.cartItems?.some(
    (item) =>
      Number(item.size?.quantity || 0) === 0 ||
      Number(item.size?.quantity || 0) < item.quantity
  );

  return (
    <div
      className={`min-h-screen px-4 pb-16 pt-8 sm:px-8 lg:px-16 xl:px-24 ${
        isDark ? "bg-[#0f0f0f]" : "bg-[#f6f6f6]"
      }`}
    >
      {loading && <CustomLoading message="Đang áp dụng mã giảm giá..." />}

      <div className="mx-auto max-w-7xl">
        <div
          className={`overflow-hidden rounded-[2rem] border px-6 py-8 shadow-sm sm:px-8 lg:px-10 ${
            isDark
              ? "border-white/10 bg-[#111111]"
              : "border-black/10 bg-white"
          }`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <span
                className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] ${
                  isDark
                    ? "border-white/12 bg-white/[0.05] text-white"
                    : "border-black/10 bg-black/[0.04] text-black"
                }`}
              >
                Giỏ hàng
              </span>

              <div className="space-y-2">
                <p
                  className={`max-w-xl text-sm leading-6 sm:text-base ${
                    isDark ? "text-white/70" : "text-black/65"
                  }`}
                >
                  Kiểm tra lại sản phẩm, mã giảm giá và tổng tiền trước khi qua bước thanh toán.
                </p>
              </div>
            </div>

            {!isEmpty && (
              <div
                className={`grid grid-cols-2 gap-3 text-sm sm:w-auto ${
                  isDark ? "text-white/70" : "text-black/70"
                }`}
              >
                <div
                  className={`rounded-2xl border px-4 py-3 ${
                    isDark
                      ? "border-white/10 bg-white/[0.04]"
                      : "border-black/10 bg-black/[0.03]"
                  }`}
                >
                  <p
                    className={`text-[11px] uppercase tracking-[0.22em] ${
                      isDark ? "text-white/45" : "text-black/45"
                    }`}
                  >
                    Số món
                  </p>
                  <p className={`mt-2 text-2xl font-black ${isDark ? "text-white" : "text-black"}`}>
                    {cart.cart?.cartItems?.length || 0}
                  </p>
                </div>

                <div
                  className={`rounded-2xl border px-4 py-3 ${
                    isDark
                      ? "border-white/10 bg-white/[0.04]"
                      : "border-black/10 bg-black/[0.03]"
                  }`}
                >
                  <p
                    className={`text-[11px] uppercase tracking-[0.22em] ${
                      isDark ? "text-white/45" : "text-black/45"
                    }`}
                  >
                    Tổng tạm tính
                  </p>
                  <p className={`mt-2 text-2xl font-black ${isDark ? "text-white" : "text-black"}`}>
                    {(cart.cart?.totalSellingPrice || 0).toLocaleString()}đ
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div
          className={`mx-auto mt-8 flex max-w-4xl flex-col items-center justify-center rounded-[2rem] border px-6 py-16 text-center shadow-sm sm:px-10 ${
            isDark
              ? "border-white/10 bg-[#111111]"
              : "border-black/10 bg-white"
          }`}
        >
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full border ${
              isDark
                ? "border-white/12 bg-white/[0.05] text-white"
                : "border-black/10 bg-black/[0.04] text-black"
            }`}
          >
            <ShoppingCart sx={{ fontSize: 38 }} />
          </div>

          <h2 className={`mt-6 text-3xl font-black uppercase tracking-tight ${isDark ? "text-white" : "text-black"}`}>
            Giỏ hàng đang trống
          </h2>

          <p
            className={`mt-3 max-w-xl text-base leading-7 ${
              isDark ? "text-white/65" : "text-black/60"
            }`}
          >
            Bạn chưa có sản phẩm nào trong giỏ. Quay lại trang chủ để chọn thêm tạ,
            găng tay, bộ dây kháng lực hoặc phụ kiện tập luyện.
          </p>

          <Button
            variant="outlined"
            onClick={() => navigate("/")}
            sx={{
              mt: 4,
              px: 4,
              py: 1.4,
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 800,
              fontSize: "0.98rem",
              color: isDark ? "#ffffff" : "#000000",
              borderColor: isDark
                ? "rgba(255,255,255,0.16)"
                : "rgba(0,0,0,0.14)",
              backgroundColor: "transparent",
              boxShadow: "none",
              "&:hover": {
                borderColor: isDark
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(0,0,0,0.3)",
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.04)",
                boxShadow: "none",
              },
            }}
          >
            Quay lại mua hàng
          </Button>
        </div>
      ) : (
        <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
          <div className="space-y-4 lg:col-span-2">
            {cart.cart?.cartItems?.map((item) => (
              <CartItem item={item} key={item.id} />
            ))}
          </div>

          <div className="space-y-4 lg:sticky lg:top-24">
            <div
              className={`rounded-[1.8rem] border p-5 shadow-sm ${
                isDark
                  ? "border-white/10 bg-[#111111]"
                  : "border-black/10 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    isDark
                      ? "bg-white/[0.05] text-white"
                      : "bg-black/[0.04] text-black"
                  }`}
                >
                  <LocalOffer sx={{ fontSize: 20 }} />
                </div>

                <div className="space-y-1">
                  <p className={`text-lg font-black uppercase tracking-tight ${isDark ? "text-white" : "text-black"}`}>
                    Mã giảm giá
                  </p>
                  <p
                    className={`text-sm leading-6 ${
                      isDark ? "text-white/65" : "text-black/60"
                    }`}
                  >
                    Nhập coupon nếu bạn đang có ưu đãi cho đơn hàng này.
                  </p>
                </div>
              </div>

              {cart.cart?.coupon ? (
                <div
                  className={`mt-4 flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 ${
                    isDark
                      ? "border-white/12 bg-white/[0.05]"
                      : "border-black/10 bg-black/[0.04]"
                  }`}
                >
                  <div>
                    <p
                      className={`text-sm font-black uppercase tracking-[0.18em] ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      {cart.cart.coupon.code}
                    </p>
                    <p
                      className={`mt-1 text-sm ${
                        isDark ? "text-white/70" : "text-black/65"
                      }`}
                    >
                      {cart.cart.coupon.name} - Giảm{" "}
                      {cart.cart.coupon.discountPercentage}%
                    </p>
                  </div>

                  <IconButton
                    onClick={handleRemoveCoupon}
                    size="small"
                    sx={{
                      color: isDark ? "#fff" : "#000",
                      border: isDark
                        ? "1px solid rgba(255,255,255,0.10)"
                        : "1px solid rgba(0,0,0,0.10)",
                      backgroundColor: "transparent",
                      "&:hover": {
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <TextField
                    placeholder="Nhập mã giảm giá"
                    size="small"
                    value={couponCode}
                    onChange={handleChangeCouponCode}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        color: isDark ? "#fff" : "#000",
                        backgroundColor: isDark ? "#151515" : "#fff",
                        "& fieldset": {
                          borderColor: isDark
                            ? "rgba(255,255,255,0.12)"
                            : "rgba(0,0,0,0.12)",
                        },
                        "&:hover fieldset": {
                          borderColor: isDark
                            ? "rgba(255,255,255,0.22)"
                            : "rgba(0,0,0,0.22)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: isDark
                            ? "rgba(255,255,255,0.28)"
                            : "rgba(0,0,0,0.28)",
                        },
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: isDark
                          ? "rgba(255,255,255,0.45)"
                          : "rgba(0,0,0,0.45)",
                        opacity: 1,
                      },
                    }}
                  />

                  <Button
                    onClick={handleApplyCoupon}
                    variant="outlined"
                    sx={{
                      minWidth: 120,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 700,
                      color: isDark ? "#fff" : "#000",
                      borderColor: isDark
                        ? "rgba(255,255,255,0.14)"
                        : "rgba(0,0,0,0.14)",
                      backgroundColor: "transparent",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: isDark
                          ? "rgba(255,255,255,0.28)"
                          : "rgba(0,0,0,0.28)",
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.04)",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Áp dụng
                  </Button>
                </div>
              )}

              {errorMessage && (
                <Typography
                  sx={{
                    mt: 2,
                    color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                    fontSize: "0.92rem",
                  }}
                >
                  {errorMessage}
                </Typography>
              )}
            </div>

            <div
              className={`overflow-hidden rounded-[1.8rem] border shadow-sm ${
                isDark
                  ? "border-white/10 bg-[#111111]"
                  : "border-black/10 bg-white"
              }`}
            >
              <PricingCart />

              {hasOutOfStock && (
                <div
                  className={`mx-5 my-3 rounded-xl border px-4 py-3 text-sm ${
                    isDark
                      ? "border-white/14 bg-white/[0.05] text-white/80"
                      : "border-black/10 bg-black/[0.04] text-black/75"
                  }`}
                >
                  Có sản phẩm trong giỏ đã <b>hết hàng</b> hoặc không đủ số lượng.
                  Vui lòng xóa hoặc cập nhật lại trước khi thanh toán.
                </div>
              )}

              <div className="p-5 pt-0">
                <Button
                  onClick={() => navigate("/checkout")}
                  fullWidth
                  variant="outlined"
                  disabled={hasOutOfStock}
                  sx={{
                    borderRadius: "14px",
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: 800,
                    borderColor: isDark
                      ? "rgba(255,255,255,0.16)"
                      : "rgba(0,0,0,0.14)",
                    boxShadow: "none",
                    background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                      color: "#fff",
                      "&:hover": {
                        background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                        boxShadow: "none",
                      },
                    "&.Mui-disabled": {
                      color: isDark
                        ? "rgba(255,255,255,0.35)"
                        : "rgba(0,0,0,0.35)",
                      borderColor: isDark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  {hasOutOfStock ? "Không thể thanh toán" : "Sang bước thanh toán"}
                </Button>
              </div>
            </div>

            <div
              className={`rounded-[1.8rem] border p-5 shadow-sm ${
                isDark
                  ? "border-white/10 bg-[#111111]"
                  : "border-black/10 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`text-lg font-black uppercase tracking-tight ${isDark ? "text-white" : "text-black"}`}>
                    Wishlist
                  </p>
                  <p
                    className={`mt-1 text-sm leading-6 ${
                      isDark ? "text-white/65" : "text-black/60"
                    }`}
                  >
                    Xem lại các món bạn đã lưu và đưa vào giỏ khi sẵn sàng.
                  </p>
                </div>

                <IconButton
                  onClick={() => navigate("/wishlist")}
                  size="small"
                  sx={{
                    borderRadius: "999px",
                    color: isDark ? "#fff" : "#000",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.10)"
                      : "1px solid rgba(0,0,0,0.10)",
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.04)",
                    "&:hover": {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Favorite fontSize="small" />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;