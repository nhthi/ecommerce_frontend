import React from "react";
import { Product } from "../../../types/ProductType";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Close, ShoppingCartOutlined } from "@mui/icons-material";
import { addProductToWishlist } from "../../../state/customer/wishlistSlice";
import { useAppDispatch } from "../../../state/Store";
import { useNavigate } from "react-router-dom";
import { formatCurrencyVND } from "../../../utils/formatCurrencyVND";

interface Props {
  item: Product;
}

const WishlistProductCard: React.FC<Props> = ({ item }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleRemoveFromWishlist = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    if (item.id) {
      await dispatch(addProductToWishlist(Number(item.id)));
    }
  };

  const handleOpenProduct = () => {
    navigate(
      `/product-details/${item.title}/${item.id}`
    );
  };

  return (
    <div
      onClick={handleOpenProduct}
      className="group relative overflow-hidden rounded-[1.6rem] border border-orange-500/12 bg-[#141414] shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-orange-400/28 cursor-pointer"
    >
      <div className="absolute right-3 top-3 z-10">
        <Tooltip title="Bo khoi wishlist" arrow>
          <IconButton
            size="small"
            onClick={handleRemoveFromWishlist}
            sx={{
              backgroundColor: "rgba(0,0,0,0.62)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.08)",
              "&:hover": { backgroundColor: "rgba(249,115,22,0.9)", color: "#050505" },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

      <div className="relative aspect-[4/4.6] overflow-hidden bg-black">
        <img
          src={item.images[0]}
          alt={item.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        {item.discountPercent ? (
          <div className="absolute left-3 top-3 rounded-md bg-orange-500 px-2 py-1 text-[10px] font-bold text-black shadow">
            -{item.discountPercent}%
          </div>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        <p className="line-clamp-2 min-h-[44px] text-sm font-semibold leading-6 text-white">
          {item.title}
        </p>

        <div className="flex items-end gap-2">
          <span className="text-lg font-black text-orange-400">
            {formatCurrencyVND(item.sellingPrice || 0)}
          </span>
          {item.mrpPrice ? (
            <span className="pb-0.5 text-xs text-slate-500 line-through">
              {formatCurrencyVND(item.mrpPrice)}
            </span>
          ) : null}
        </div>

        <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
          {item.category?.name || "Fitness"}
        </p>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenProduct();
          }}
          variant="contained"
          fullWidth
          startIcon={<ShoppingCartOutlined />}
          sx={{
            borderRadius: "999px",
            textTransform: "none",
            fontWeight: 800,
            py: 1.1,
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            color: "#050505",
            boxShadow: "none",
            "&:hover": {
              background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
              boxShadow: "none",
            },
          }}
        >
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
};

export default WishlistProductCard;
