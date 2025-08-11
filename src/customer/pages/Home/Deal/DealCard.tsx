import React from "react";

const DealCard = () => {
  return (
    <div className="w-[13rem] cursor-pointer">
      <img
        alt="Deal Card"
        src="https://cdn.pixabay.com/photo/2015/06/25/17/21/smart-watch-821557_1280.jpg"
        className="border-x-[7px] border-t-[7px] border-pink-600 w-full h-[12rem]
        object-top"
      />
      <div className="border-4 border-black bg-black text-white p-2 text-center">
        <p className="text-lg font-semibold">Smart Watch</p>
        <p className="text-2xl font-bold">20% OFF</p>
        <p className="text-balance text-lg">Shop now</p>
      </div>
    </div>
  );
};

export default DealCard;
