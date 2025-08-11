import React from "react";
import DealCard from "./DealCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";

const Deal = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 2000, // Tốc độ di chuyển giữa các slide
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // Không delay giữa các lần autoplay
    cssEase: "linear", // 👈 Chạy đều, mượt (rất quan trọng)
  };
  return (
    <div className="py-5 lg:px-20 ">
      <Slider {...settings}>
        {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, index) => (
          <div key={index} className="">
            <DealCard />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Deal;
