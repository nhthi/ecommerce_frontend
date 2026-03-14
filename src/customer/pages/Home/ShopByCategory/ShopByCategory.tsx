import React from "react";
import ShopByCategoryCard from "./ShopByCategoryCard";

const categories = [
  {
    name: "Điện thoại & Tablet",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    link: "/category/dien-thoai-tablet",
  },
  {
    name: "Laptop & PC",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    link: "/category/laptop-pc",
  },
  {
    name: "Thời trang nữ",
    image:
      "https://pos.nvncdn.com/650b61-144700/art/artCT/20240529_nFx1vLTb.webp",
    link: "/category/thoi-trang-nam",
  },
  {
    name: "Thời trang nam",
    image:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=80",
    link: "/category/thoi-trang-nu",
  },
  {
    name: "Nhà cửa & Đời sống",
    image:
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=800&q=80",
    link: "/category/nha-cua-doi-song",
  },
  {
    name: "Mẹ & Bé",
    image:
      "https://carewithlove.com.vn/wp-content/uploads/2015/08/dodanhbe.jpg",
    link: "/category/me-be",
  },
  {
    name: "Làm đẹp & Sức khỏe",
    image:
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80",
    link: "/category/lam-dep-suc-khoe",
  },
  {
    name: "Thiết bị gia dụng",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    link: "/category/thiet-bi-gia-dung",
  },
];

const ShopByCategory: React.FC = () => {
  return (
    <section className="py-14 bg-white">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 px-6 lg:px-20 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0097e6]">
            Mua sắm theo danh mục 🔍
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-1">
            Chọn nhanh ngành hàng bạn quan tâm từ các nhà bán đa dạng.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 px-6 lg:px-20">
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
