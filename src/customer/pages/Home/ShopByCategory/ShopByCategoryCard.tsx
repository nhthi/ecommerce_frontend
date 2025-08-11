import React from "react";
import "./ShopByCategory.css";
const ShopByCategoryCard = () => {
  return (
    <div className="flex gap-3 flex-col justify-center items-center cursor-pointer group">
      <div className="custome-border w-[150px]  h-[150px] lg:w-[249px] lg:h-[249px] rounded-full bg-primary-color">
        <img
          alt=""
          src="https://www.simpli-home.com/cdn/shop/products/3AXCDNT-003_7a321a47-7272-44d2-a054-371548190a38.jpg?v=1569275674"
          className="rounded-full  group-hover:scale-95 transition-transform transform-duration-700
          object-cover object-top h-full w-full tranform-duration-700"
        />
      </div>
      <h1>Kitchen & Table</h1>
    </div>
  );
};

export default ShopByCategoryCard;
