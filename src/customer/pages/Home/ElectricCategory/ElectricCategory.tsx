import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

const categories = [
  {
    name: "Thời trang",
    image: "https://img.vuahanghieu.com/unsafe/0x0/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/news/content/2025/08/cach-phoi-do-tap-gym-cho-nu-1-jpg-1754546951-07082025130911.jpg",
  },
  {
    name: "Dụng cụ",
    image: "https://bizweb.dktcdn.net/thumb/large/100/180/757/products/khung-ganh-ta-k10-3.jpg?v=1646641685673",
  },
  {
    name: "Phụ kiện tập",
    image: "https://titansport.com.vn/wp-content/uploads/2023/11/phu-kien-tap-gym-1.jpg",
  },
  {
    name: "Dinh dưỡng",
    image: "https://product.hstatic.net/1000185761/product/rocky_road__f29ee130c58e4ff8ad39eeff97eafa9e.png",
  },
  {
    name: "Thiết bị hỗ trợ",
    image: "https://lh5.googleusercontent.com/iArg5i6c4qW31An-XXy5DbieK-iLyWZU_ZS-G1AxHEzJNhly6yEGmm3SS22L4tWq77um2wvVUFzcsvjZ9nNeQKzvp7yd5wSPiVmXms39j0yH5PfZxbX2Eyf3ngmYlK7tm0pey82opSodYrLbnko6jg0",
  },
  {
    name: "Phong cách",
    image: "https://beast.com.vn/wp-content/uploads/2024/07/thiet-ke-phong-gym-10.webp",
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
