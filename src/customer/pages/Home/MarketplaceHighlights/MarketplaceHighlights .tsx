import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import StarIcon from "@mui/icons-material/Star";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

const brands = [
  {
    name: "Gym Max Pro",
    logo: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
    products: "Tạ, ghế tập, phụ kiện",
    badge: "Nổi bật",
    link: "/search?keyword=gym%20equipment",
  },
  {
    name: "Cardio Station",
    logo: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    products: "Máy chạy bộ, xe đạp tập",
    badge: "Cardio",
    link: "/search?keyword=may%20cardio",
  },
  {
    name: "Flex Gear",
    logo: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    products: "Dây kháng lực, găng tay",
    badge: "Phụ kiện",
    link: "/search?keyword=phu%20kien%20tap%20gym",
  },
  {
    name: "Core Studio",
    logo: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    products: "Yoga, mobility, phục hồi",
    badge: "Phục hồi",
    link: "/search?keyword=yoga%20fitness",
  },
];

const TopSellersShowcase: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useSiteThemeMode();

  return (
    <section className={isDark ? "bg-[#080808] px-5 py-14 lg:px-16" : "bg-[#f6f7fb] px-5 py-14 lg:px-16"}>
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-400">
              Thương hiệu nổi bật
            </p>
            <h2
              className={
                isDark
                  ? "mt-2 text-3xl font-black text-white md:text-4xl"
                  : "mt-2 text-3xl font-black text-slate-900 md:text-4xl"
              }
            >
              Các dòng sản phẩm đang được quan tâm
            </h2>
          </div>
          <p
            className={
              isDark
                ? "max-w-xl text-sm text-slate-400"
                : "max-w-xl text-sm text-slate-600"
            }
          >
            Tập trung vào một vài lựa chọn nổi bật, giúp bạn dễ dàng định hướng mua sắm.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {brands.map((brand, i) => (
            <motion.button
              key={brand.name}
              type="button"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className={
                isDark
                  ? "overflow-hidden rounded-[1.75rem] border border-orange-500/15 bg-white/[0.03] text-left transition hover:border-orange-400/35"
                  : "overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white text-left shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition hover:border-orange-300"
              }
              onClick={() => navigate(brand.link)}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-44 w-full object-cover"
              />
              <div className="p-5">
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-100">
                  <WorkspacePremiumIcon sx={{ fontSize: 14 }} />
                  {brand.badge}
                </span>

                <h3
                  className={
                    isDark
                      ? "mt-4 text-xl font-black text-white"
                      : "mt-4 text-xl font-black text-slate-900"
                  }
                >
                  {brand.name}
                </h3>

                <div
                  className={
                    isDark
                      ? "mt-3 flex items-center gap-2 text-sm text-slate-300"
                      : "mt-3 flex items-center gap-2 text-sm text-slate-600"
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    <StarIcon sx={{ fontSize: 16, color: "#fb923c" }} />
                    {brand.rating}
                  </span>
                  <span>{brand.products}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSellersShowcase;