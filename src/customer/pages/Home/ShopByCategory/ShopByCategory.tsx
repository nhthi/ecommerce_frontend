import React from "react";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";
import ShopByCategoryCard from "./ShopByCategoryCard";

const categories = [
  {
    name: "Tap tai nha",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    link: "/search?keyword=tap%20tai%20nha",
  },
  {
    name: "Tang co",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
    link: "/search?keyword=tang%20co%20fitness",
  },
  {
    name: "Dot mo",
    image: "https://images.unsplash.com/photo-1596357395104-55f35eb85d5b?auto=format&fit=crop&w=800&q=80",
    link: "/search?keyword=dot%20mo%20fitness",
  },
  {
    name: "Phuc hoi",
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
    name: "Nguoi moi bat dau",
    image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80",
    link: "/search?keyword=nguoi%20moi%20tap%20gym",
  },
  {
    name: "Combo phong gym mini",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    link: "/search?keyword=combo%20gym%20tai%20nha",
  },
];

const ShopByCategory: React.FC = () => {
  const { isDark } = useSiteThemeMode();

  return (
    <section className={isDark ? "rounded-[2rem] border border-orange-500/15 bg-[#101010] px-4 py-8 md:px-6" : "rounded-[2rem] border border-slate-200 bg-white px-4 py-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:px-6"}>
      <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className={isDark ? "text-3xl font-black text-white" : "text-3xl font-black text-slate-900"}>
            Mua theo muc tieu tap luyen
          </h2>
        </div>
        <p className={isDark ? "max-w-xl text-sm text-slate-400" : "max-w-xl text-sm text-slate-600"}>
          Chon mot huong tap cu the de xem san pham sat nhu cau hon.
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
