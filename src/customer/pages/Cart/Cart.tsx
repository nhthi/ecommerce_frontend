import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { Close, Favorite, LocalOffer, ShoppingCart } from "@mui/icons-material";
import { Button, IconButton, TextField, Typography } from "@mui/material";
import PricingCart from "./PricingCart";
import { useNavigate } from "react-router-dom";
import { applyCoupon, fetchUserCart } from "../../../state/customer/cartSlice";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import CustomLoading from "../../components/CustomLoading/CustomLoading";

const Cart = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<any>("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((store) => store);

  const handleChangeCouponCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
    setErrorMessage("");
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setErrorMessage("Vui long nhap ma giam gia.");
      return;
    }

    try {
      setLoading(true);
      await dispatch(
        applyCoupon({
          apply: "true",
          code: couponCode,
          orderValue: Number(cart.cart?.totalSellingPrice),
        }),
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
      }),
    );
  };

  useEffect(() => {
    dispatch(fetchUserCart());
  }, [dispatch]);

  const isEmpty = !cart.cart?.cartItems || cart.cart.cartItems.length === 0;

  // ✅ THÊM: kiểm tra hết hàng / không đủ tồn kho
  const hasOutOfStock = cart.cart?.cartItems?.some(
    (item) =>
      Number(item.size?.quantity || 0) === 0 ||
      Number(item.size?.quantity || 0) < item.quantity
  );

  return (
    <div className="min-h-screen bg-[#0b0b0b] px-4 pb-16 pt-8 sm:px-8 lg:px-16 xl:px-24">
      {loading && <CustomLoading message="Dang ap dung ma giam gia..." />}

      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] border border-orange-500/15 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.22),_transparent_32%),linear-gradient(180deg,_#171717_0%,_#0f0f0f_100%)] px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex w-fit items-center rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-300">
                Giỏ hàng
              </span>
              <div className="space-y-2">
                
                <p className="max-w-xl text-sm leading-6 text-neutral-300 sm:text-base">
                  Kiểm tra lại dụng cụ, mã giảm giá và tổng tiền trước khi qua bước thanh toán.
                </p>
              </div>
            </div>

            {!isEmpty && (
              <div className="grid grid-cols-2 gap-3 text-sm text-neutral-300 sm:w-auto">
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                    Số món
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">
                    {cart.cart?.cartItems?.length || 0}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                    Tổng tạm tính
                  </p>
                  <p className="mt-2 text-2xl font-black text-orange-400">
                    {(cart.cart?.totalSellingPrice || 0).toLocaleString()}d
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center justify-center rounded-[2rem] border border-orange-500/12 bg-[#121212] px-6 py-16 text-center shadow-[0_20px_60px_rgba(0,0,0,0.32)] sm:px-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400">
            <ShoppingCart sx={{ fontSize: 38 }} />
          </div>
          <h2 className="mt-6 text-3xl font-black uppercase tracking-tight text-white">
            Giỏ hàng đang trống
          </h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-neutral-400">
            Bạn chưa có sản phẩm nào trong giỏ. Quay lại trang chủ để chọn thêm tạ, găng tay, bộ dây kháng lực hoặc phụ kiện tập luyện.
          </p>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              mt: 4,
              px: 4,
              py: 1.4,
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 800,
              fontSize: "0.98rem",
              color: "#111111",
              background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
              boxShadow: "0 16px 36px rgba(249,115,22,0.35)",
              "&:hover": {
                background: "linear-gradient(135deg, #fdba74 0%, #ea580c 100%)",
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
            <div className="rounded-[1.8rem] border border-orange-500/12 bg-[#121212] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/12 text-orange-400">
                  <LocalOffer sx={{ fontSize: 20 }} />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-black uppercase tracking-tight text-white">
                    Mã giảm giá
                  </p>
                  <p className="text-sm leading-6 text-neutral-400">
                    Nhập coupon nếu bạn đang có ưu đãi cho đơn hàng này.
                  </p>
                </div>
              </div>

              {cart.cart?.coupon ? (
                <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-orange-500/25 bg-orange-500/10 px-4 py-3">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-300">
                      {cart.cart.coupon.code}
                    </p>
                    <p className="mt-1 text-sm text-neutral-300">
                      {cart.cart.coupon.name} - Giam {cart.cart.coupon.discountPercentage}%
                    </p>
                  </div>
                  <IconButton onClick={handleRemoveCoupon} size="small">
                    <Close />
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
                  />
                  <Button onClick={handleApplyCoupon}>Áp dụng</Button>
                </div>
              )}

              {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            </div>

            <div className="overflow-hidden rounded-[1.8rem] border border-orange-500/12 bg-[#121212] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <PricingCart />

              {/* ⚠️ CẢNH BÁO */}
              {hasOutOfStock && (
                <div className="mx-5 my-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  Có sản phẩm trong giỏ đã <b>hết hàng</b> hoặc không đủ số lượng.
                  Vui lòng xóa hoặc cập nhật lại trước khi thanh toán.
                </div>
              )}

              <div className="p-5 pt-0">
                <Button
                  onClick={() => navigate("/checkout")}
                  fullWidth
                  variant="contained"
                  disabled={hasOutOfStock}
                >
                  {hasOutOfStock ? "Không thể thanh toán" : "Sang bước thanh toán"}
                </Button>
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-white/8 bg-[#121212] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-black uppercase tracking-tight text-white">
                    Wishlist
                  </p>
                  <p className="mt-1 text-sm leading-6 text-neutral-400">
                    Xem lại các món bạn đã lưu và đưa vào giỏ khi sẵn sàng.
                  </p>
                </div>
                <IconButton
                  onClick={() => navigate("/wishlist")}
                  size="small"
                  sx={{
                    borderRadius: "999px",
                    color: "#fb923c",
                    backgroundColor: "rgba(249,115,22,0.12)",
                    "&:hover": {
                      backgroundColor: "rgba(249,115,22,0.2)",
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