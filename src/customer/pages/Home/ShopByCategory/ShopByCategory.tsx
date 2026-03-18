import React from "react";
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
  return (
    <section className="rounded-[2rem] border border-orange-500/15 bg-[#101010] px-4 py-8 md:px-6">
      <div className="mb-7">
        <h2 className="text-3xl font-black text-white">
          Mua theo mục tiêu tập luyện
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Chọn nhanh danh mục phù hợp để tìm dụng cụ sát nhu cầu hơn, không bị lan man.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4">
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