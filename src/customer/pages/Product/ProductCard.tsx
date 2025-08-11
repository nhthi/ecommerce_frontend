import React, { useEffect, useState } from "react";
import "./ProductCard.css";
import { Button } from "@mui/material";
import { Favorite, ModeComment } from "@mui/icons-material";
const images = [
  "https://bizweb.dktcdn.net/100/396/594/products/website-3x4-model-0013s-0001-lbindoort711272.jpg",
  "https://bizweb.dktcdn.net/100/396/594/products/back-2.jpg",
  "https://bizweb.dktcdn.net/100/045/077/products/00722451800-a2-3439cf90-7200-457a-85dd-1dd5a1e1515a.jpg",
  "https://bizweb.dktcdn.net/100/396/594/products/back-2.jpg",
];

const ProductCard = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    let interval: any;
    if (isHovered) {
      interval = setInterval(() => {
        setCurrentImage((prevImage) => (prevImage + 1) % images.length);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
      interval = null;
    }
    return () => clearInterval(interval);
  }, [isHovered]);
  return (
    <>
      <div className="group px-4 relative">
        <div
          className="card shadow-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {images.map((item, index) => (
            <img
              className="card-media object-top"
              alt="product_card"
              src={item}
              style={{
                transform: `translateX(${(index - currentImage) * 100}%)`,
              }}
            />
          ))}
          {isHovered && (
            <div className="indicator flex flex-col items-center space-y-2">
              <div className="flex gap-3">
                <Button variant="contained" color="secondary">
                  <Favorite sx={{ color: "#0097e6" }} />
                </Button>
                <Button variant="contained" color="secondary">
                  <ModeComment sx={{ color: "#0097e6" }} />
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="details pt-3 space-y-1 group-hover-effect rounded-md">
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

export default ProductCard;
