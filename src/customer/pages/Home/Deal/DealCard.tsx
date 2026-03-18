import React from "react";
import { motion } from "framer-motion";
import { IconButton } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Product } from "../../../../types/ProductType";
import { formatCurrencyVND } from "../../../../utils/formatCurrencyVND";
import { useNavigate } from "react-router-dom";

const DealCard: React.FC<Product> = ({
  title,
  images,
  sellingPrice,
  mrpPrice,
  discountPercent,
  seller,
  category,
  id,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="overflow-hidden rounded-[1.6rem] border border-orange-500/15 bg-[#171717] shadow-sm"
    >
      <div
        className="relative cursor-pointer overflow-hidden bg-black"
        onClick={() =>
          navigate(`/product-details/${category?.categoryId}/${title}/${id}`)
        }
      >
        <img
          alt={title}
          src={images[0]}
          className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105"
        />

        <div className="absolute left-3 top-3 rounded-md bg-orange-500 px-2 py-1 text-[10px] font-bold text-black shadow">
          -{discountPercent}%
        </div>

        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold text-orange-300 backdrop-blur-sm">
          <LocalOfferIcon sx={{ fontSize: 12 }} />
          Giá tốt
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-4 pt-3">
        <p className="line-clamp-2 min-h-[42px] text-sm font-semibold text-white">
          {title}
        </p>

        <div className="flex items-baseline gap-2">
          <span className="text-base font-black text-orange-400">
            {formatCurrencyVND(sellingPrice)}
          </span>
          {formatCurrencyVND(mrpPrice) && (
            <span className="text-xs text-slate-500 line-through">
              {formatCurrencyVND(mrpPrice)}
            </span>
          )}
        </div>

        <p className="text-[11px] text-slate-400">
          Thuong hieu: {" "}
          <span className="font-medium text-slate-200">
            {seller?.businessDetails.businessName || "NHTHI Fit"}
          </span>
        </p>

        <IconButton
          onClick={() =>
            navigate(`/product-details/${category?.categoryId}/${title}/${id}`)
          }
          className="!mt-1 !w-full !rounded-full !py-2"
          sx={{
            backgroundColor: "#f97316",
            color: "#050505",
            fontSize: 11,
            fontWeight: 700,
            "&:hover": { backgroundColor: "#fb923c" },
            gap: 1,
          }}
        >
          <ShoppingBagIcon sx={{ fontSize: 16 }} />
          <span className="text-sm font-bold">Xem chi tiết</span>
        </IconButton>
      </div>
    </motion.div>
  );
};

export default DealCard;
