import React from "react";
import CategoryGrid from "./CategoryGrid/CategoryGrid";
import ElectricCategory from "./ElectricCategory/ElectricCategory";
import Deal from "./Deal/Deal";
import ShopByCategory from "./ShopByCategory/ShopByCategory";
import { Button } from "@mui/material";
import { Storefront } from "@mui/icons-material";

const Home = () => {
  return (
    <div className="space-y-5 lg:space-y-10 ralative">
      <ElectricCategory />

      <CategoryGrid />

      <section className="pt-20">
        <h1 className="text-lg lg:text-4xl font-bold text-primary-color pb-5 lg:pb-10 text-center">
          TODAY'S DEAL
        </h1>
        <Deal />
      </section>

      <section className="pt-20">
        <h1 className="text-lg lg:text-4xl font-bold text-primary-color pb-5 lg:pb-10 text-center">
          SHOP BY CATEGORY
        </h1>
        <ShopByCategory />
      </section>

      <section className="mt-20 lg:px-20 relative h-[200px] lg:h-[450px] object-cover">
        <img
          alt=""
          className="w-full h-full"
          src="https://cdn.pixabay.com/photo/2024/05/04/02/21/lake-8738166_1280.jpg"
        />
        <div className="absolute top-1/2 left-4 lg:left-[15rem] transform -translate-y-1/2 font-semibold lg:text-4xl space-y-3 bg-white/80 rounded-lg p-10 shadow-lg">
          <h1 className="text-gray-800 ">Sell your Product</h1>
          <p className="text-lg md:text-2xl">
            With <span className="logo">NHTHI Shop</span>
          </p>
          <div className="pt-6 flex justify-center">
            <Button startIcon={<Storefront />} variant="contained" size="large">
              Become Seller
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
