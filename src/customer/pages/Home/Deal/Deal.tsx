import React from "react";
import Slider from "react-slick";
import DealCard from "./DealCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Product } from "../../../../types/ProductType";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

const Deal = ({ products }: { products: Product[] }) => {
  const { isDark } = useSiteThemeMode();

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 4000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1.4 } },
    ],
  };

  return (
    <section className={isDark ? "rounded-[2rem] border border-orange-500/15 bg-[#101010] px-4 py-8 md:px-6" : "rounded-[2rem] border border-slate-200 bg-white px-4 py-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:px-6"}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className={isDark ? "text-2xl font-black text-white" : "text-2xl font-black text-slate-900"}>
            Sản phẩm đang có giá tốt
          </h2>
          <p className={isDark ? "mt-1 text-sm text-slate-300" : "mt-1 text-sm text-slate-600"}>
            Sản phẩm giá tốt, phù hợp cho người mới bắt đầu.
          </p>
        </div>
        <span className="hidden rounded-full border border-orange-500/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-orange-400 md:inline-flex">
          Cập nhật liên tục
        </span>
      </div>

      <div className="px-1 md:px-0">
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
