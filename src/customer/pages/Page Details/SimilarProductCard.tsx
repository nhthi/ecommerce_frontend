import React from "react";
import "../Product/ProductCard.css";
import { Product } from "../../../types/ProductType";

const formatVND = (value: number) =>
  value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const SimilarProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group px-2 relative cursor-pointer transition-all hover:-translate-y-1">
      <div className="card shadow-md rounded-xl overflow-hidden bg-white border border-slate-100">
        <img
          className="card-media object-cover w-full h-56 transition-all duration-300 group-hover:scale-105"
          alt="product_card"
          src={product.images[0] || ""}
        />
      </div>

      <div className="pt-3 space-y-2 w-[230px]">
        {/* Shop Name */}
        <h1 className="text-xs text-slate-500 font-medium truncate">
          {product.seller?.businessDetails.businessName}
        </h1>

        {/* Product Title */}
        <p className="font-semibold text-slate-900 text-sm truncate">
          {product.title}
        </p>

        {/* Price Section */}
        <div className="flex items-center gap-2 pt-1">
          <span className="font-bold text-primary-color">
            {formatVND(product.sellingPrice)}
          </span>

          {product.mrpPrice && (
            <span className="line-through text-xs text-slate-400">
              {formatVND(product.mrpPrice)}
            </span>
          )}

          {product.discountPercent > 0 && (
            <span className="text-red-500 text-xs font-semibold bg-red-50 px-1.5 py-0.5 rounded-md">
              -{product.discountPercent}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimilarProductCard;
