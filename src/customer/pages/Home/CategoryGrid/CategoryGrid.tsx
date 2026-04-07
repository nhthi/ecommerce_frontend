import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

const categories = [
  {
    title: "Ta va banh ta",
    desc: "Bo sung nhanh cac mon tap co ban va de nang cap dan.",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
    to: "/search?keyword=ta%20fitness",
  },
  {
    title: "May cardio",
    desc: "May chay bo, xe dap tap va thiet bi dot mo tai nha.",
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80",
    to: "/search?keyword=may%20cardio",
  },
  {
    title: "Phu kien tap",
    desc: "Gang tay, day khang luc, tham tap va phu kien ho tro.",
    img: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80",
    to: "/search?keyword=phu%20kien%20tap%20gym",
  },
  {
    title: "Ghe va gian tap",
    desc: "Chon nhanh setup co ban cho phong gym mini tai nha.",
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
    to: "/search?keyword=ghe%20tap%20gym",
  },
  {
    title: "Yoga va mobility",
    desc: "Tham, bong va phu kien phuc hoi cho ngay tap nhe.",
    img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=900&q=80",
    to: "/search?keyword=yoga%20fitness",
  },
  {
    title: "Combo tai nha",
    desc: "Goi y mua nhanh cho nguoi moi, gon va de chon hon.",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
    to: "/search?keyword=combo%20gym%20tai%20nha",
  },
];

const CategoryGrid = () => {
  const navigate = useNavigate();
  const { isDark } = useSiteThemeMode();

  return (
    <section>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-400">
            Chon theo nhom
          </p>
          <h2 className={isDark ? "mt-2 text-3xl font-black text-white md:text-4xl" : "mt-2 text-3xl font-black text-slate-900 md:text-4xl"}>
            Mua nhanh theo tung loai dung cu
          </h2>
        </div>
        <p className={isDark ? "max-w-xl text-sm text-slate-400" : "max-w-xl text-sm text-slate-600"}>
          Tap trung vao nhung nhom duoc xem nhieu, khong dan trai qua nhieu text.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((cat, index) => (
          <motion.button
            key={cat.title}
            type="button"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            onClick={() => navigate(cat.to)}
            className={isDark ? "group relative overflow-hidden rounded-[2rem] border border-orange-500/15 bg-black text-left" : "group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white text-left shadow-[0_22px_60px_rgba(15,23,42,0.08)]"}
          >
            <img
              src={cat.img}
              alt={cat.title}
              className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="text-2xl font-black text-white">{cat.title}</h3>
              <p className="mt-3 max-w-[90%] text-sm leading-6 text-slate-200">
                {cat.desc}
              </p>
              <span className="mt-5 inline-flex rounded-full border border-white/18 bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                Xem nhom nay
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
