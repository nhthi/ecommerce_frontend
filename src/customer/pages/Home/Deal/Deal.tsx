import React from "react";
import Slider from "react-slick";
import DealCard from "./DealCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Product } from "../../../../types/ProductType";

const Deal = ({ products }: { products: Product[] }) => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 4000, // tốc độ trượt
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // chạy liên tục
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1.6 },
      },
    ],
  };

  return (
    <section className="py-10 bg-gradient-to-r from-[#e1f5fe] to-[#f0faff]">
      <div className="flex items-center justify-between px-4 md:px-20 mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0097e6]">
            Ưu đãi nổi bật từ nhà bán uy tín ⚡
          </h2>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Săn deal hot từ các shop được đánh giá cao trên hệ thống.
          </p>
        </div>
        <button className="hidden md:inline-flex text-xs px-3 py-1 rounded-full border border-[#0097e6] text-[#0097e6] hover:bg-[#0097e6] hover:text-white transition-all">
          Xem tất cả
        </button>
      </div>

      <div className="px-2 md:px-16">
        <Slider {...settings}>
          {products.map((deal, index) => (
            <div key={index} className="px-1.5">
              <DealCard {...deal} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Deal;
