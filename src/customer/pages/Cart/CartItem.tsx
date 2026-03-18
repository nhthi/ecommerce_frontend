import { Add, Close, Remove } from "@mui/icons-material";
import { Button, Divider, IconButton } from "@mui/material";
import React from "react";
import { CartItem as CartItemType } from "../../../types/CartType";
import { useAppDispatch } from "../../../state/Store";
import {
  deleteCartItem,
  updateCartItem,
} from "../../../state/customer/cartSlice";

const CartItem = ({ item }: { item: CartItemType }) => {
  const dispatch = useAppDispatch();

  const handleUpdateQuantity = async (quantity: number) => {
    await dispatch(
      updateCartItem({
        cartItemId: item.id,
        cartItem: {
          quantity: item.quantity + quantity,
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
    <div className="group relative overflow-hidden rounded-[1.8rem] border border-orange-500/12 bg-[#121212] shadow-[0_20px_55px_rgba(0,0,0,0.28)] transition-transform duration-300 hover:-translate-y-0.5">
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
            <p className="text-sm text-neutral-400">
              Thương hiệu / shop:{" "}
              <span className="font-semibold text-neutral-200">
                {sellerName}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
            {item?.size?.name && (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-neutral-200">
                Size {item.size.name}
              </span>
            )}
            <span className="rounded-full border border-orange-500/15 bg-orange-500/10 px-3 py-1 text-orange-300">
              Số lượng {item.quantity}
            </span>
            <span className="rounded-full border border-emerald-500/15 bg-emerald-500/10 px-3 py-1 text-emerald-300">
              Đổi trả 7 ngày
            </span>
          </div>
        </div>
      </div>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.07)" }} />

      <div className="relative flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-2 py-1.5">
          <Button
            onClick={() => handleUpdateQuantity(-1)}
            disabled={item.quantity === 1}
            variant="outlined"
            size="small"
            sx={{
              minWidth: 34,
              width: 34,
              height: 34,
              borderRadius: "999px",
              p: 0,
              color: "white",
              borderColor: "rgba(255,255,255,0.12)",
              "&:hover": {
                borderColor: "rgba(249,115,22,0.35)",
                backgroundColor: "rgba(249,115,22,0.08)",
              },
              "&.Mui-disabled": {
                color: "rgba(255,255,255,0.25)",
                borderColor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            <Remove fontSize="small" />
          </Button>
          <span className="min-w-[30px] text-center text-base font-black text-white">
            {item.quantity}
          </span>
          <Button
            onClick={() => handleUpdateQuantity(1)}
            variant="outlined"
            size="small"
            sx={{
              minWidth: 34,
              width: 34,
              height: 34,
              borderRadius: "999px",
              p: 0,
              color: "white",
              borderColor: "rgba(255,255,255,0.12)",
              "&:hover": {
                borderColor: "rgba(249,115,22,0.35)",
                backgroundColor: "rgba(249,115,22,0.08)",
              },
            }}
          >
            <Add fontSize="small" />
          </Button>
        </div>

        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
            Thành tiền
          </p>
          <p className="mt-1 text-2xl font-black text-orange-400">
            {item.sellingPrice.toLocaleString()}đ
          </p>
        </div>
      </div>

      <div className="absolute right-3 top-3">
        <IconButton
          onClick={handleDeleteCartItem}
          size="small"
          sx={{
            borderRadius: "999px",
            color: "rgba(255,255,255,0.6)",
            backgroundColor: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(6px)",
            "&:hover": {
              backgroundColor: "rgba(239,68,68,0.14)",
              color: "#fca5a5",
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