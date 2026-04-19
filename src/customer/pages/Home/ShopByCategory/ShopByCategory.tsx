

import React from "react";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";
import ShopByCategoryCard from "./ShopByCategoryCard";

const categories = [
  {
    name: "Tập tại nhà",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    link: "/search?keyword=tap%20tai%20nha",
  },
  {
    name: "Tăng cơ",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
    link: "/search?keyword=tang%20co%20fitness",
  },
  {
    name: "Đốt mỡ",
    image: "https://images.unsplash.com/photo-1596357395104-55f35eb85d5b?auto=format&fit=crop&w=800&q=80",
    link: "/search?keyword=dot%20mo%20fitness",
  },
  {
    name: "Phục hồi",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    link: "/search?keyword=phuc%20hoi%20co%20bap",
  },
  {
    name: "Yoga",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    link: "/search?keyword=yoga%20fitness",
  },
  {
    name: "Cardio",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
    link: "/search?keyword=cardio%20fitness",
  },
  {
    name: "Người mới bắt đầu",
    image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80",
    link: "/search?keyword=nguoi%20moi%20tap%20gym",
  },
  {
    name: "Combo phòng gym mini",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    link: "/search?keyword=combo%20gym%20tai%20nha",
  },
];

const ShopByCategory: React.FC = () => {
  const { isDark } = useSiteThemeMode();

  return (
    <section
      className={`
        relative overflow-hidden transition-all duration-500 ease-in-out
        rounded-[2.5rem] p-6 md:p-10
        ${isDark 
          ? "bg-[#0A0A0A] border border-white/5 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]" 
          : "bg-[#F8FAFC] border border-slate-200/60 shadow-[0_32px_64px_-16px_rgba(15,23,42,0.1)]"}
      `}
    >
      {/* Hiệu ứng ánh sáng nền (Glow) để trông sang hơn */}
      {isDark && (
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-orange-500/10 blur-[100px]" />
      )}

      <div className="relative z-10 mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] text-orange-500 uppercase">
            Discovery
          </span>
          <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Mua theo mục tiêu <span className="text-orange-500">.</span>
          </h2>
        </div>
        <p className={`max-w-md text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Tối ưu hóa hành trình tập luyện của bạn bằng cách chọn đúng dòng sản phẩm chuyên biệt.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat, index) => (
          <ShopByCategoryCard
            key={cat.link || index}
            name={cat.name}
            image={cat.image}
            link={cat.link}
          />
        ))}
      </div>
    </section>
  );
};

export default ShopByCategory;