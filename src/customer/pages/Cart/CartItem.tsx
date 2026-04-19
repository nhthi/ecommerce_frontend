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

  const stock = Number(item.size?.quantity || 0);
  const isOutOfStock = stock === 0;

  const handleUpdateQuantity = async (change: number) => {
    if (isOutOfStock) {
      alert("Sản phẩm đã hết hàng!");
      return;
    }

    const newQuantity = item.quantity + change;

    if (newQuantity < 1) return;

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
      className={`group relative overflow-hidden rounded-[1.6rem] border shadow-sm transition-all duration-200 ${
        isDark
          ? "border-white/10 bg-black text-white"
          : "border-black/10 bg-white text-black"
      } ${isOutOfStock ? "opacity-60" : ""}`}
    >
      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
        <div
          className={`shrink-0 overflow-hidden rounded-[1.2rem] border ${
            isDark ? "border-white/10 bg-[#111]" : "border-black/10 bg-[#f5f5f5]"
          }`}
        >
          <img
            alt={item.product.title}
            src={item.product.images[0]}
            className="h-28 w-24 object-cover sm:h-32 sm:w-28"
          />
        </div>

        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <h2
              className={`max-w-2xl text-lg font-bold leading-6 sm:text-[1.2rem] sm:leading-7 ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {item.product.title}
            </h2>

            <p
              className={`text-sm ${
                isDark ? "text-white/60" : "text-black/60"
              }`}
            >
              Thương hiệu / shop:
              <span
                className={`font-semibold ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                {" " + sellerName}
              </span>
            </p>
          </div>

          <div
            className={`flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] ${
              isDark ? "text-white/70" : "text-black/60"
            }`}
          >
            {item?.size?.name && (
              <span
                className={`rounded-full border px-3 py-1 ${
                  isDark
                    ? "border-white/15 bg-white/[0.03] text-white"
                    : "border-black/10 bg-black/[0.04] text-black"
                }`}
              >
                Size {item.size.name}
              </span>
            )}

            <span
              className={`rounded-full border px-3 py-1 ${
                isDark
                  ? "border-white/15 bg-white/[0.03] text-white"
                  : "border-black/10 bg-black/[0.04] text-black"
              }`}
            >
              Số lượng {item.quantity}
            </span>

            {item.size &&
              (isOutOfStock ? (
                <span
                  className={`rounded-full border px-3 py-1 ${
                    isDark
                      ? "border-white/20 bg-white/[0.04] text-white"
                      : "border-black/15 bg-black/[0.04] text-black"
                  }`}
                >
                  Hết hàng
                </span>
              ) : (
                <span
                  className={`rounded-full border px-3 py-1 ${
                    isDark
                      ? "border-white/20 bg-white/[0.04] text-white"
                      : "border-black/15 bg-black/[0.04] text-black"
                  }`}
                >
                  Còn lại {stock}
                </span>
              ))}

            <span
              className={`rounded-full border px-3 py-1 ${
                isDark
                  ? "border-white/15 bg-white/[0.03] text-white"
                  : "border-black/10 bg-black/[0.04] text-black"
              }`}
            >
              Đổi trả 7 ngày
            </span>
          </div>
        </div>
      </div>

      <Divider
        sx={{
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        }}
      />

      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
        <div
          className={`flex items-center gap-2 rounded-full border px-2 py-1.5 ${
            isDark
              ? "border-white/10 bg-black"
              : "border-black/10 bg-white"
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
              borderColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)",
              color: isDark ? "#fff" : "#000",
              backgroundColor: "transparent",
              "&:hover": {
                borderColor: isDark
                  ? "rgba(255,255,255,0.35)"
                  : "rgba(0,0,0,0.35)",
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.04)",
              },
              "&.Mui-disabled": {
                borderColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.08)",
                color: isDark
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(0,0,0,0.3)",
              },
            }}
          >
            <Remove fontSize="small" />
          </Button>

          <span
            className={`min-w-[30px] text-center text-base font-bold ${
              isDark ? "text-white" : "text-black"
            }`}
          >
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
              borderColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)",
              color: isDark ? "#fff" : "#000",
              backgroundColor: "transparent",
              "&:hover": {
                borderColor: isDark
                  ? "rgba(255,255,255,0.35)"
                  : "rgba(0,0,0,0.35)",
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.04)",
              },
              "&.Mui-disabled": {
                borderColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.08)",
                color: isDark
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(0,0,0,0.3)",
              },
            }}
          >
            <Add fontSize="small" />
          </Button>
        </div>

        <div className="text-right">
          <p
            className={`text-[11px] uppercase tracking-[0.16em] ${
              isDark ? "text-white/45" : "text-black/45"
            }`}
          >
            Thành tiền
          </p>

          <p
            className={`mt-1 text-2xl font-bold ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {item.sellingPrice.toLocaleString()}đ
          </p>

          {!!item.mrpPrice && item.mrpPrice > item.sellingPrice && (
            <>
              <p
                className={`mt-1 text-sm font-medium line-through ${
                  isDark ? "text-white/40" : "text-black/40"
                }`}
              >
                {item.mrpPrice.toLocaleString()}đ
              </p>
              <p
                className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                  isDark
                    ? "border-white/15 bg-white/[0.03] text-white"
                    : "border-black/10 bg-black/[0.04] text-black"
                }`}
              >
                Giảm {(item.mrpPrice - item.sellingPrice).toLocaleString()}đ
              </p>
            </>
          )}
        </div>
      </div>

      <div className="absolute right-3 top-3">
        <IconButton
          onClick={handleDeleteCartItem}
          size="small"
          sx={{
            color: isDark ? "#fff" : "#000",
            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(0,0,0,0.08)",
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
    </div>
  );
};

export default CartItem;