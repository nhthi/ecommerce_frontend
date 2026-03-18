import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03, y: -6 }}
      whileTap={{ scale: 0.97 }}
      className="group relative overflow-hidden rounded-[1.4rem] border border-orange-500/15 bg-[#161616] text-left transition-all"
      onClick={() => link && navigate(link)}
    >
      {/* Image */}
      <div className="h-36 w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/50 to-transparent px-4 pb-3 pt-10">
        <span className="text-sm font-bold text-white drop-shadow">
          {name}
        </span>

        {/* CTA nhỏ */}
        <div className="mt-1 text-[11px] text-orange-400 opacity-0 transition group-hover:opacity-100">
          Xem ngay →
        </div>
      </div>

      {/* Hover border glow */}
      <div className="pointer-events-none absolute inset-0 rounded-[1.4rem] border border-transparent transition group-hover:border-orange-400/40" />
    </motion.button>
  );
};

export default ShopByCategoryCard;