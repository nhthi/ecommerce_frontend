import React from "react";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

interface Props {
  name: string;
  image: string;
  link: string;
}

const ShopByCategoryCard: React.FC<Props> = ({ name, image, link }) => {
  const { isDark } = useSiteThemeMode();

  return (
    <a
      href={link}
      className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-slate-200"
    >
      {/* Image với hiệu ứng Zoom chậm */}
      <img
        src={image}
        alt={name}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Overlay Gradient: Tạo chiều sâu cho text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
        <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Khám phá ngay
        </p>
        <h3 className="text-lg font-bold text-white md:text-xl">
          {name}
        </h3>
        
        {/* Thanh bar trang trí nhỏ dưới chân */}
        <div className="mt-3 h-[2px] w-0 bg-orange-500 transition-all duration-300 group-hover:w-12" />
      </div>
    </a>
  );
};

export default ShopByCategoryCard;