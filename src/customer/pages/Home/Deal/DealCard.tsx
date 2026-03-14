import React from "react";
import { motion } from "framer-motion";
import { IconButton } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Product } from "../../../../types/ProductType";
import { formatCurrencyVND } from "../../../../utils/formatCurrencyVND";
import { useNavigate } from "react-router-dom";

const primary = "#0097e6";

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
      whileHover={{ scale: 1.04, y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden cursor-pointer border border-gray-100 flex flex-col"
    >
      {/* Ảnh sản phẩm */}
      <div
        className="relative overflow-hidden bg-[#f5faff]"
        onClick={() =>
          navigate(`/product-details/${category?.categoryId}/${title}/${id}`)
        }
      >
        <img
          alt={title}
          src={images[0]}
          className="w-full aspect-[5/5] object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Nhãn giảm giá */}
        <div className="absolute top-2 left-2 bg-[#ff4757] text-white text-[10px] font-semibold px-2 py-1 rounded-md shadow">
          {-discountPercent}%
        </div>

        {/* Tag */}

        <div className="absolute bottom-2 left-2 bg-white/90 text-[9px] px-2 py-0.5 rounded-full text-[#ff4757] font-semibold flex items-center gap-1">
          <LocalOfferIcon sx={{ fontSize: 12 }} />
          {"Bán chạy"}
        </div>
      </div>

      {/* Nội dung */}
      <div className="px-3 pt-2 pb-3 flex flex-col gap-1">
        <p className="text-[13px] font-semibold text-gray-800 line-clamp-2">
          {title}
        </p>

        <div className="flex items-baseline gap-2">
          <span className="text-[14px] font-bold text-[#ff4757]">
            {formatCurrencyVND(sellingPrice)}
          </span>
          {formatCurrencyVND(mrpPrice) && (
            <span className="text-[10px] text-gray-400 line-through">
              {formatCurrencyVND(mrpPrice)}
            </span>
          )}
        </div>

        <p className="text-[10px] text-gray-500">
          Nhà bán:{" "}
          <span className="font-medium text-gray-700">
            {seller?.businessDetails.businessName}
          </span>
        </p>

        <IconButton
          className="!mt-1 !w-full !py-1.5 !rounded-full"
          sx={{
            backgroundColor: primary,
            color: "white",
            fontSize: 11,
            "&:hover": { backgroundColor: "#00a8ff" },
            gap: 1,
          }}
        >
          <ShoppingBagIcon sx={{ fontSize: 16 }} />
          <span className="text-sm">Mua ngay</span>
        </IconButton>
      </div>
    </motion.div>
  );
};

export default DealCard;
