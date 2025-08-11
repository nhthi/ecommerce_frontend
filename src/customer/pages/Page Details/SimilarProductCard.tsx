import React from "react";
import "../Product/ProductCard.css";
const images = [
  "https://bizweb.dktcdn.net/100/396/594/products/website-3x4-model-0013s-0001-lbindoort711272.jpg",
  "https://bizweb.dktcdn.net/100/396/594/products/back-2.jpg",
  "https://bizweb.dktcdn.net/100/045/077/products/00722451800-a2-3439cf90-7200-457a-85dd-1dd5a1e1515a.jpg",
  "https://bizweb.dktcdn.net/100/396/594/products/back-2.jpg",
];
const SimilarProductCard = () => {
  return (
    <>
      <div className="group px-4 relative">
        <div className="card shadow-lg">
          <img
            className="card-media object-top"
            alt="product_card"
            src={
              "https://cdn.chiaki.vn/unsafe/0x960/left/top/smart/filters:quality(75)/https://chiaki.vn/upload/product/2022/08/ao-the-thao-3-lo-cho-nam-gymshark-62e9dc11eb855-03082022092313.jpg"
            }
          />
        </div>
        <div className="details pt-3 space-y-1 group-hover-effect rounded-md w-[250px]">
          <div className="name">
            <h1>Niky</h1>
            <p>Blue Shirt</p>
          </div>
          <div className="price flex items-center gap-3">
            <span className="font-sans text-gray-800">$ 400</span>
            <span className="thin-line-through text-gray-400">$ 999</span>
            <span className="text-primary-color font-semibold">60%</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SimilarProductCard;
