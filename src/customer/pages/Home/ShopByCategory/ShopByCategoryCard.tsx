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

  const handleClick = () => {
    if (link) navigate(link);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg bg-[#f5faff] transition-all"
      onClick={handleClick}
    >
      {/* Ảnh */}
      <div className="h-32 md:h-40 w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* Overlay tên danh mục */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-3 pb-2 pt-6 flex items-end">
        <span className="text-white text-xs md:text-sm font-semibold drop-shadow">
          {name}
        </span>
      </div>
    </motion.div>
  );
};

export default ShopByCategoryCard;
