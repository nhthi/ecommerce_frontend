import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const primary = "#0097e6";

const topSellers = [
  {
    name: "TechHouse Official",
    logo: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=300&q=80",
    rating: 4.9,
    products: "1.2K+ sản phẩm",
    badge: "Official Store",
    categories: ["Điện thoại", "Laptop", "Phụ kiện"],
    link: "/seller/techhouse-official",
  },
  {
    name: "StyleStudio",
    logo: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80",
    rating: 4.8,
    products: "800+ sản phẩm",
    badge: "Top Seller",
    categories: ["Thời trang nam", "Thời trang nữ"],
    link: "/seller/stylestudio",
  },
  {
    name: "HomeLiving Mall",
    logo: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=300&q=80",
    rating: 4.9,
    products: "600+ sản phẩm",
    badge: "Mall",
    categories: ["Nội thất", "Decor", "Gia dụng"],
    link: "/seller/homeliving-mall",
  },
  {
    name: "BabyCare Corner",
    logo: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=300&q=80",
    rating: 4.7,
    products: "350+ sản phẩm",
    badge: "Đáng tin cậy",
    categories: ["Mẹ & Bé", "Chăm sóc bé"],
    link: "/seller/babycare-corner",
  },
];

const TopSellersShowcase: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-14 bg-white">
      {/* HEADER */}
      <div className="px-6 lg:px-20 max-w-6xl mx-auto mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[#0097e6]">
          <StorefrontIcon />
          <p className="uppercase tracking-wide text-xs font-semibold">
            Nhà bán & thương hiệu nổi bật
          </p>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Top Sellers & Official Store 🏆
        </h2>
        <p className="text-gray-500 text-sm md:text-base max-w-2xl">
          Được chọn lọc dựa trên doanh số, đánh giá và mức độ uy tín. Mua sắm an
          tâm từ những gian hàng hàng đầu trên nền tảng.
        </p>
      </div>

      {/* GRID */}
      <div className="px-6 lg:px-20 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {topSellers.map((seller, i) => (
          <motion.div
            key={seller.link}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-[#f5faff] rounded-2xl p-4 shadow-sm hover:shadow-md border border-transparent hover:border-[#0097e6]/20 cursor-pointer flex flex-col gap-2 transition-all"
            onClick={() => navigate("/store/1")}
          >
            {/* Logo */}
            <div className="w-full h-20 rounded-xl overflow-hidden bg-white mb-2">
              <img
                src={seller.logo}
                alt={seller.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name + badge */}
            <div className="flex items-center gap-1 flex-wrap">
              <h3 className="font-semibold text-sm text-gray-900">
                {seller.name}
              </h3>
              {seller.badge && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-[9px] text-[#0097e6] font-semibold">
                  <CheckCircleIcon sx={{ fontSize: 12 }} />
                  {seller.badge}
                </span>
              )}
            </div>

            {/* Rating + products */}
            <div className="flex items-center gap-2 text-[10px] text-gray-600">
              <span className="inline-flex items-center gap-1">
                <StarIcon sx={{ fontSize: 14, color: "#facc15" }} />
                {seller.rating}
              </span>
              <span>· {seller.products}</span>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1 mt-1">
              {seller.categories.map((c) => (
                <span
                  key={c}
                  className="px-2 py-0.5 bg-white/90 rounded-full text-[9px] text-gray-600"
                >
                  {c}
                </span>
              ))}
            </div>

            {/* CTA nhỏ */}
            <div className="mt-2 text-[10px] text-[#0097e6] font-semibold underline underline-offset-2">
              Xem gian hàng →
            </div>
          </motion.div>
        ))}
      </div>

      {/* VIEW ALL */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/sellers")}
          className="text-[#0097e6] font-semibold border border-[#0097e6] rounded-full px-6 py-2 text-sm hover:bg-[#0097e6] hover:text-white transition-all"
        >
          Xem tất cả nhà bán
        </button>
      </div>
    </section>
  );
};

export default TopSellersShowcase;
