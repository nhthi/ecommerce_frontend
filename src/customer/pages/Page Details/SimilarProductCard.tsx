import React from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../../types/ProductType";
import { formatCurrencyVND } from "../../../utils/formatCurrencyVND";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const SimilarProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const { isDark } = useSiteThemeMode();

  return (
    <button
      type="button"
      onClick={() =>
        navigate(
          `/product-details/${product.title}/${product.id}`
        )
      }
      className={isDark ? "group overflow-hidden rounded-[1.5rem] border border-orange-500/12 bg-[#161616] text-left transition hover:-translate-y-1 hover:border-orange-400/25" : "group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white text-left shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-orange-300"}
    >
      <div className={isDark ? "relative overflow-hidden bg-black" : "relative overflow-hidden bg-slate-100"}>
        <img
          className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
          alt={product.title}
          src={product.images[0] || ""}
        />
        {product.discountPercent > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-orange-500 px-2 py-1 text-[10px] font-bold text-black">
            -{product.discountPercent}%
          </span>
        )}
      </div>

      <div className="space-y-2 p-4">
        <h1 className={isDark ? "truncate text-xs font-semibold uppercase tracking-[0.14em] text-slate-400" : "truncate text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"}>
          {product.seller?.businessDetails.businessName || "NHTHI Fit"}
        </h1>

        <p className={isDark ? "line-clamp-2 min-h-[42px] text-sm font-semibold text-white" : "line-clamp-2 min-h-[42px] text-sm font-semibold text-slate-900"}>
          {product.title}
        </p>

        <div className="flex items-center gap-2 pt-1">
          <span className="font-black text-orange-400">
            {formatCurrencyVND(product.sellingPrice)}
          </span>

          {product.mrpPrice && (
            <span className={isDark ? "text-xs text-slate-500 line-through" : "text-xs text-slate-400 line-through"}>
              {formatCurrencyVND(product.mrpPrice)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default SimilarProductCard;
