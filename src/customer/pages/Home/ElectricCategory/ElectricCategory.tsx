import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

const categories = [
  {
    name: "Máy cardio",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Tạ tự do",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Phụ kiện tập",
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Yoga",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Ghế tập",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Combo tại nhà",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
  },
];

const ElectricCategory = () => {
  const navigate = useNavigate();
  const { isDark } = useSiteThemeMode();

  return (
    <section>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {categories.map((cat, index) => (
          <motion.button
            key={cat.name}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            onClick={() => navigate(`/search?keyword=${encodeURIComponent(cat.name)}`)}
            className={isDark ? "group overflow-hidden rounded-[1.6rem] border border-orange-500/15 bg-white/[0.03] text-left" : "group overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white text-left shadow-[0_18px_40px_rgba(15,23,42,0.08)]"}
          >
            <div className="overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="h-[180px] w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className={isDark ? "text-base font-bold text-white" : "text-base font-bold text-slate-900"}>{cat.name}</h3>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-orange-400">
                Xem sản phẩm
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default ElectricCategory;
