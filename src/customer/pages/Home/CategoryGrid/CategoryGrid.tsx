import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

const categories = [
  {
    title: "Tạ và bánh tạ",
    desc: "Bổ sung nhanh các bài tập cơ bản và dễ nâng cấp dần.",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
    to: "/search?keyword=ta%20fitness",
  },
  {
    title: "Máy cardio",
    desc: "Máy chạy bộ, xe đạp tập và thiết bị đốt mỡ tại nhà.",
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80",
    to: "/search?keyword=may%20cardio",
  },
  {
    title: "Phụ kiện tập",
    desc: "Găng tay, dây kháng lực, thảm tập và phụ kiện hỗ trợ.",
    img: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80",
    to: "/search?keyword=phu%20kien%20tap%20gym",
  },
  {
    title: "Ghế và giàn tập",
    desc: "Chọn nhanh setup cơ bản cho phòng gym mini tại nhà.",
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
    to: "/search?keyword=ghe%20tap%20gym",
  },
  {
    title: "Yoga & mobility",
    desc: "Thảm, bóng và phụ kiện phục hồi cho ngày tập nhẹ.",
    img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=900&q=80",
    to: "/search?keyword=yoga%20fitness",
  },
  {
    title: "Combo tại nhà",
    desc: "Gợi ý mua nhanh cho người mới, gọn gàng và dễ chọn hơn.",
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
            Chọn theo nhóm
          </p>
          <h2
            className={
              isDark
                ? "mt-2 text-3xl font-black text-white md:text-4xl"
                : "mt-2 text-3xl font-black text-slate-900 md:text-4xl"
            }
          >
            Mua nhanh theo từng loại dụng cụ
          </h2>
        </div>
        <p
          className={
            isDark
              ? "max-w-xl text-sm text-slate-400"
              : "max-w-xl text-sm text-slate-600"
          }
        >
          Tập trung vào các nhóm phổ biến, giúp bạn dễ chọn mà không bị rối.
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
            className={
              isDark
                ? "group relative overflow-hidden rounded-[2rem] border border-orange-500/15 bg-black text-left"
                : "group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white text-left shadow-[0_22px_60px_rgba(15,23,42,0.08)]"
            }
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
                Xem nhóm này
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;