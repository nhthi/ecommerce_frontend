import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const categories = [
  {
    title: "Thời trang nam",
    img: "https://cdn.pixabay.com/photo/2024/11/08/05/28/man-9182458_1280.jpg",
  },
  {
    title: "Thời trang nữ",
    img: "https://cdn.pixabay.com/photo/2021/07/27/01/50/ao-dai-6495619_1280.jpg",
  },
  {
    title: "Phụ kiện cao cấp",
    img: "https://cdn.pixabay.com/photo/2018/08/30/12/20/luxuryshoe-3642033_1280.jpg",
  },
  {
    title: "Áo dài Việt",
    img: "https://cdn.pixabay.com/photo/2022/05/22/16/47/lonely-girl-in-ao-dai-7213916_1280.jpg",
  },
  {
    title: "Suit sang trọng",
    img: "https://cdn.pixabay.com/photo/2017/08/27/05/33/suit-2685226_1280.jpg",
  },
  {
    title: "Bộ sưu tập mới",
    img: "https://cdn.pixabay.com/photo/2022/08/31/15/18/scene-7423627_1280.jpg",
  },
];

const CategoryGrid = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out-cubic" });
  }, []);

  return (
    <div className="px-5 lg:px-20 py-16 bg-gradient-to-b from-gray-50 to-[#f3f9ff] relative overflow-hidden">
      {/* Hiệu ứng nền nhẹ */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10 pointer-events-none" />

      <h2
        className="text-4xl font-bold text-center mb-12 text-[#0097e6]"
        data-aos="fade-up"
      >
        🏷️ Bộ sưu tập nổi bật
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500"
            data-aos="zoom-in-up"
          >
            {/* Hình ảnh */}
            <img
              src={cat.img}
              alt={cat.title}
              className="object-cover w-full h-[260px] md:h-[300px] transform group-hover:scale-110 transition-transform duration-700 ease-out"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-all duration-500"></div>

            {/* Chữ */}
            <div className="absolute bottom-6 left-6 text-white transition-all duration-500 transform group-hover:translate-y-[-10px]">
              <h3 className="text-xl font-bold mb-1 drop-shadow-lg">
                {cat.title}
              </h3>
              <p className="text-sm opacity-90">Khám phá ngay →</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-600 mt-12 italic" data-aos="fade-up">
        “Thời trang là cách bạn thể hiện bản thân — hãy bắt đầu hành trình phong
        cách hôm nay 👗👔”
      </p>
    </div>
  );
};

export default CategoryGrid;
