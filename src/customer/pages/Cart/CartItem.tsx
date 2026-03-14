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
      })
    );
  };

  const handleDeleteCartItem = async () => {
    await dispatch(deleteCartItem(item.id));
  };

  const sellerName =
    item.product.seller?.businessDetails?.businessName || "Nhà bán hàng";

  return (
    <div className="relative rounded-2xl bg-white/95 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-5 flex gap-4">
        <div className="shrink-0">
          <img
            alt={item.product.title}
            src={item.product.images[0]}
            className="w-24 h-28 object-cover rounded-xl border border-slate-100"
          />
        </div>

        <div className="flex-1 space-y-2">
          <h2 className="font-semibold text-base sm:text-lg text-slate-900 line-clamp-2">
            {item.product.title}
          </h2>

          <p className="text-xs text-slate-500">
            Bán bởi{" "}
            <span className="font-medium text-slate-700">{sellerName}</span>
          </p>

          <p className="text-xs text-emerald-600 font-medium">
            Đổi trả trong 7 ngày nếu sản phẩm lỗi.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            {item?.size?.name && (
              <div className="flex items-center gap-1">
                <span className="uppercase text-[11px] tracking-wide text-slate-500">
                  Size
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-semibold">
                  {item.size.name}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="uppercase text-[11px] tracking-wide text-slate-500">
                SL
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-semibold">
                {item.quantity}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <div className="flex justify-between items-center px-4 sm:px-5 py-2.5">
        {/* Điều chỉnh số lượng */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleUpdateQuantity(-1)}
            disabled={item.quantity === 1}
            variant="outlined"
            size="small"
            sx={{
              minWidth: 32,
              borderRadius: "999px",
              p: 0,
            }}
          >
            <Remove fontSize="small" />
          </Button>
          <span className="min-w-[24px] text-center text-sm font-medium text-slate-800">
            {item.quantity}
          </span>
          <Button
            onClick={() => handleUpdateQuantity(1)}
            variant="outlined"
            size="small"
            sx={{
              minWidth: 32,
              borderRadius: "999px",
              p: 0,
            }}
          >
            <Add fontSize="small" />
          </Button>
        </div>

        {/* Giá */}
        <div className="text-right">
          <p className="text-base font-semibold text-sky-600">
            {item.sellingPrice.toLocaleString()}₫
          </p>
        </div>
      </div>

      {/* nút xóa */}
      <div className="absolute top-1 right-1">
        <IconButton
          color="primary"
          onClick={handleDeleteCartItem}
          size="small"
          sx={{
            backgroundColor: "rgba(15,23,42,0.02)",
            "&:hover": {
              backgroundColor: "rgba(239,68,68,0.08)",
              color: "#ef4444",
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
