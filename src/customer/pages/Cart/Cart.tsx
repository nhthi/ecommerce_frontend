import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { Favorite, LocalOffer, ShoppingCart } from "@mui/icons-material";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 pt-10 px-4 sm:px-8 lg:px-24 xl:px-48">
      {loading && <CustomLoading message="Đang áp dụng mã giảm giá..." />}

      {/* Tiêu đề */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Giỏ hàng của bạn
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Xem lại sản phẩm, áp dụng mã giảm giá và tiến hành thanh toán.
        </p>
      </div>

      {/* Giỏ hàng trống */}
      {isEmpty ? (
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center h-[70vh] text-center">
          <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center">
            <ShoppingCart sx={{ fontSize: 40, color: "#9ca3af" }} />
          </div>
          <h2 className="text-2xl font-semibold mt-4 text-slate-900">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="text-slate-500 mt-2 max-w-md">
            Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ. Hãy khám phá bộ sưu
            tập và chọn món bạn yêu thích nhé!
          </p>
          <Button
            variant="contained"
            sx={{
              mt: 3,
              px: 4,
              py: 1.5,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
              background:
                "linear-gradient(135deg, rgb(56,189,248), rgb(37,99,235))",
              boxShadow: "0 18px 35px rgba(37,99,235,0.45)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, rgb(59,130,246), rgb(30,64,175))",
                boxShadow: "0 20px 40px rgba(30,64,175,0.55)",
              },
            }}
            onClick={() => navigate("/")}
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Danh sách sản phẩm */}
          <div className="lg:col-span-2 space-y-4">
            {cart.cart?.cartItems?.map((item) => (
              <CartItem item={item} key={item.id} />
            ))}
          </div>

          {/* Cột bên phải: mã giảm giá + tổng tiền + wishlist */}
          <div className="col-span-1 space-y-4">
            {/* Mã giảm giá */}
            <div className="border border-slate-200 rounded-2xl bg-white/90 shadow-sm px-5 py-4 space-y-4">
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <LocalOffer color="primary" sx={{ fontSize: "18px" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Mã giảm giá
                  </p>
                  <p className="text-xs text-slate-500">
                    Nhập mã khuyến mãi nếu bạn có.
                  </p>
                </div>
              </div>

              {cart.cart?.coupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 rounded-xl px-4 py-2 shadow-sm">
                  <div>
                    <span className="font-semibold text-emerald-700">
                      {cart.cart.coupon.code}
                    </span>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      {cart.cart.coupon.name} – Giảm{" "}
                      {cart.cart.coupon.discountPercentage}%
                    </p>
                  </div>
                  <Button
                    onClick={handleRemoveCoupon}
                    size="small"
                    sx={{
                      textTransform: "none",
                      fontSize: "0.75rem",
                      color: "#b91c1c",
                      borderRadius: 999,
                      "&:hover": {
                        backgroundColor: "#fee2e2",
                      },
                    }}
                  >
                    Xóa mã
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <TextField
                    placeholder="Nhập mã giảm giá"
                    size="small"
                    variant="outlined"
                    value={couponCode}
                    onChange={handleChangeCouponCode}
                    fullWidth
                  />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleApplyCoupon}
                    sx={{
                      textTransform: "none",
                      borderRadius: 999,
                      fontSize: "0.8rem",
                      px: 2.5,
                      py: 0.8,
                    }}
                  >
                    Áp dụng
                  </Button>
                </div>
              )}

              {errorMessage && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ mt: 0.5, fontSize: "0.8rem" }}
                >
                  {errorMessage}
                </Typography>
              )}
            </div>

            {/* Tổng tiền */}
            <div className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm overflow-hidden">
              <PricingCart />
              <div className="p-5">
                <Button
                  onClick={() => navigate("/checkout")}
                  fullWidth
                  variant="contained"
                  sx={{
                    py: "11px",
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 600,
                    background:
                      "linear-gradient(135deg, rgb(16,185,129), rgb(59,130,246))",
                    boxShadow: "0 18px 35px rgba(16,185,129,0.45)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, rgb(5,150,105), rgb(37,99,235))",
                      boxShadow: "0 20px 40px rgba(5,150,105,0.55)",
                    },
                  }}
                >
                  Thanh toán ngay
                </Button>
              </div>
            </div>

            {/* Wishlist */}
            <div className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
              <div className="flex justify-between items-center px-5 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Thêm từ danh sách yêu thích
                  </p>
                  <p className="text-xs text-slate-500">
                    Xem lại các sản phẩm bạn đã thả tim để thêm vào giỏ.
                  </p>
                </div>
                <IconButton
                  color="primary"
                  size="small"
                  sx={{
                    borderRadius: 999,
                    backgroundColor: "rgba(59,130,246,0.06)",
                    "&:hover": {
                      backgroundColor: "rgba(59,130,246,0.12)",
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
