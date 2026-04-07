import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

interface ShopByCategoryCardProps {
  name: string;
  image: string;
  link?: string;
}

const ShopByCategoryCard: React.FC<ShopByCategoryCardProps> = ({
  name,
  image,
  link,
}) => {
  const navigate = useNavigate();
  const { isDark } = useSiteThemeMode();

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={isDark ? "group relative overflow-hidden rounded-[1.5rem] border border-orange-500/15 bg-[#161616] text-left transition-all" : "group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white text-left shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-all"}
      onClick={() => link && navigate(link)}
    >
      <div className="h-40 w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/52 to-transparent px-4 pb-4 pt-12">
        <span className="text-sm font-bold text-white drop-shadow">
          {name}
        </span>

        <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-orange-300 opacity-0 transition group-hover:opacity-100">
          Xem ngay
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] border border-transparent transition group-hover:border-orange-400/40" />
    </motion.button>
  );
};

export default ShopByCategoryCard;
