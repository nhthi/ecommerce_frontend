import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    title: "Tạ và bánh tạ",
    desc: "Combo để tập cơ bản tại nhà, dễ nâng cấp theo mục tiêu.",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
    to: "/search?keyword=ta%20fitness",
  },
  {
    title: "Máy cardio",
    desc: "Máy chạy bộ, xe đạp tập và thiết bị đốt mỡ để tập luyện mỗi ngày.",
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80",
    to: "/search?keyword=may%20cardio",
  },
  {
    title: "Phụ kiện tập",
    desc: "Dây kháng lực, thảm tập, găng tay và các phụ kiện cần thiết.",
    img: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80",
    to: "/search?keyword=phu%20kien%20tap%20gym",
  },
  {
    title: "Ghế và giàn tập",
    desc: "Thiết bị phù hợp cho không gian phòng gym mini tại nhà.",
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
    to: "/search?keyword=ghe%20tap%20gym",
  },
  {
    title: "Yoga & Mobility",
    desc: "Thảm, bóng, dây và phụ kiện hỗ trợ phục hồi sau tập.",
    img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=900&q=80",
    to: "/search?keyword=yoga%20fitness",
  },
  {
    title: "Setup phòng gym mini",
    desc: "Gợi ý combo nhanh cho người muốn mua trọn bộ tiện lợi.",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
    to: "/search?keyword=combo%20gym%20tai%20nha",
  },
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  return (
    <section>
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-400">
          Bộ sưu tập
        </p>
        <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">
          Nhóm sản phẩm được xem nhiều trên trang chủ
        </h2>
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
            className="group relative overflow-hidden rounded-[2rem] border border-orange-500/15 bg-black text-left"
          >
            <img
              src={cat.img}
              alt={cat.title}
              className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="text-2xl font-black text-white">{cat.title}</h3>
              <p className="mt-3 max-w-[90%] text-sm leading-6 text-slate-200">
                {cat.desc}
              </p>
              <span className="mt-5 inline-flex rounded-full border border-orange-400/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
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