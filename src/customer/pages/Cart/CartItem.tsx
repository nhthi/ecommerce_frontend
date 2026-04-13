import { Add, Close, Remove } from "@mui/icons-material";
import { Button, Divider, IconButton } from "@mui/material";
import React from "react";
import { CartItem as CartItemType } from "../../../types/CartType";
import { useAppDispatch } from "../../../state/Store";
import {
  deleteCartItem,
  updateCartItem,
} from "../../../state/customer/cartSlice";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const CartItem = ({ item }: { item: CartItemType }) => {
  const dispatch = useAppDispatch();
  const { isDark } = useSiteThemeMode();

  // 🔥 xử lý tồn kho
  const stock = Number(item.size?.quantity || 0);
  const isOutOfStock = stock === 0;

  const handleUpdateQuantity = async (change: number) => {
    // ❌ hết hàng
    if (isOutOfStock) {
      alert("Sản phẩm đã hết hàng!");
      return;
    }

    const newQuantity = item.quantity + change;

    // ❌ nhỏ hơn 1
    if (newQuantity < 1) return;

    // ❌ vượt tồn kho
    if (newQuantity > stock) {
      alert("Số lượng vượt quá tồn kho!");
      return;
    }

    await dispatch(
      updateCartItem({
        cartItemId: item.id,
        cartItem: {
          quantity: newQuantity,
        },
      }),
    );
  };

  const handleDeleteCartItem = async () => {
    await dispatch(deleteCartItem(item.id));
  };

  const sellerName =
    item.product.seller?.businessDetails?.businessName || "Nhà bán hàng";

  return (
    <div
      className={`group relative overflow-hidden rounded-[1.8rem] border border-orange-500/12 bg-[#121212] shadow-[0_20px_55px_rgba(0,0,0,0.28)] transition-transform duration-300 hover:-translate-y-0.5 ${
        isOutOfStock ? "opacity-60" : ""
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.12),_transparent_30%)] opacity-80" />

      <div className="relative flex gap-4 p-4 sm:gap-5 sm:p-5">
        <div className="shrink-0 overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#1a1a1a]">
          <img
            alt={item.product.title}
            src={item.product.images[0]}
            className="h-28 w-24 object-cover transition-transform duration-500 group-hover:scale-[1.04] sm:h-32 sm:w-28"
          />
        </div>

        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <h2 className="max-w-2xl text-lg font-black leading-6 text-white sm:text-[1.35rem] sm:leading-7">
              {item.product.title}
            </h2>

            <p
              className={`text-sm ${
                isDark ? "text-neutral-400" : "text-slate-500"
              }`}
            >
              Thương hiệu / shop:
              <span
                className={`font-semibold ${
                  isDark ? "text-neutral-200" : "text-slate-800"
                }`}
              >
                {" " + sellerName}
              </span>
            </p>
          </div>

          <div
            className={`flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] ${
              isDark ? "text-neutral-400" : "text-slate-500"
            }`}
          >
            {/* Size */}
            {item?.size?.name && (
              <span
                className={`rounded-full px-3 py-1 ${
                  isDark
                    ? "border border-white/10 bg-white/[0.04] text-neutral-200"
                    : "border border-slate-200 bg-slate-100 text-slate-700"
                }`}
              >
                Size {item.size.name}
              </span>
            )}

            {/* Quantity */}
            <span
              className={`rounded-full px-3 py-1 ${
                isDark
                  ? "border border-orange-500/15 bg-orange-500/10 text-orange-300"
                  : "border border-orange-200 bg-orange-50 text-orange-700"
              }`}
            >
              Số lượng {item.quantity}
            </span>

            {/* 🔥 Stock / Out of stock */}
            {item.size && (
              isOutOfStock ? (
                <span className="rounded-full px-3 py-1 text-xs text-red-500 border border-red-500/30 bg-red-500/10 font-bold">
                  Hết hàng
                </span>
              ) : (
                <span className="rounded-full px-3 py-1 text-xs text-red-400 border border-red-400/20 bg-red-400/10">
                  Còn lại {stock}
                </span>
              )
            )}

            {/* Policy */}
            <span
              className={`rounded-full px-3 py-1 ${
                isDark
                  ? "border border-emerald-500/15 bg-emerald-500/10 text-emerald-300"
                  : "border border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              Đổi trả 7 ngày
            </span>
          </div>
        </div>
      </div>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.07)" }} />

      {/* Bottom */}
      <div className="relative flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
        {/* Quantity control */}
        <div
          className={`flex items-center gap-2 rounded-full px-2 py-1.5 ${
            isDark
              ? "border border-white/10 bg-black/20"
              : "border border-black/10 bg-white"
          }`}
        >
          <Button
            onClick={() => handleUpdateQuantity(-1)}
            disabled={item.quantity === 1 || isOutOfStock}
            variant="outlined"
            size="small"
            sx={{
              minWidth: 34,
              width: 34,
              height: 34,
              borderRadius: "999px",
              p: 0,
            }}
          >
            <Remove fontSize="small" />
          </Button>

          <span className="min-w-[30px] text-center text-base font-black text-white">
            {item.quantity}
          </span>

          <Button
            onClick={() => handleUpdateQuantity(1)}
            disabled={isOutOfStock || item.quantity >= stock}
            variant="outlined"
            size="small"
            sx={{
              minWidth: 34,
              width: 34,
              height: 34,
              borderRadius: "999px",
              p: 0,
            }}
          >
            <Add fontSize="small" />
          </Button>
        </div>

        {/* Price */}
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
            Thành tiền
          </p>

          <p className="mt-1 text-2xl font-black text-orange-400">
            {item.sellingPrice.toLocaleString()}đ
          </p>

          {!!item.mrpPrice && item.mrpPrice > item.sellingPrice && (
            <>
              <p className="mt-1 text-sm font-semibold text-neutral-500 line-through">
                {item.mrpPrice.toLocaleString()}đ
              </p>
              <p className="mt-2 inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-200">
                Giảm{" "}
                {(item.mrpPrice - item.sellingPrice).toLocaleString()}đ
              </p>
            </>
          )}
        </div>
      </div>

      {/* Delete */}
      <div className="absolute right-3 top-3">
        <IconButton onClick={handleDeleteCartItem} size="small">
          <Close fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
};

export default CartItem;