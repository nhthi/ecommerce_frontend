// src/pages/Home/components/ElectricCategory/ElectricCategoryCard.tsx
import React from "react";
import { motion } from "framer-motion";

interface Props {
  name: string;
  image: string;
}

const ElectricCategoryCard: React.FC<Props> = ({
  name = "Danh mục",
  image = "https://via.placeholder.com/150",
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -6 }}
      className="w-[120px] md:w-[150px] bg-[#f5faff] rounded-2xl shadow-sm hover:shadow-md p-4 flex flex-col items-center cursor-pointer transition-all"
    >
      <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden mb-3">
        <img
          src={image}
          alt={name}
          className="object-contain w-full h-full transition-transform duration-300 hover:scale-110"
        />
      </div>
      <h3 className="text-sm md:text-base font-semibold text-gray-800 text-center">
        {name}
      </h3>
    </motion.div>
  );
};

export default ElectricCategoryCard;
