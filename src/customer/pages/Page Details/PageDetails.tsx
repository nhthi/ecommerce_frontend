import {
  Add,
  AddShoppingCart,
  FavoriteBorder,
  LocalShipping,
  Remove,
  Shield,
  Star,
  Wallet,
  WorkspacePremium,
} from "@mui/icons-material";
import { Button, Divider } from "@mui/material";
import React, { useState } from "react";
import SimilarProduct from "./SimilarProduct";
import ReviewCard from "../Home/Review/ReviewCard";
import Review from "../Home/Review/Review";

const PageDetails = () => {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="px-5 lg:px-20 pt-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-[15%] flex flex-wrap lg:flex-col gap-3">
            {[1, 1, 1, 1, 1].map((item) => (
              <img
                alt=""
                src="https://cdn.chiaki.vn/unsafe/0x960/left/top/smart/filters:quality(75)/https://chiaki.vn/upload/product/2022/08/ao-the-thao-3-lo-cho-nam-gymshark-62e9dc11eb855-03082022092313.jpg"
                className="lg:w-full rounded-md w-[50px] cursor-pointer"
              />
            ))}
          </div>
          <div className="w-full lg:w-[85%]">
            <img
              alt=""
              src="https://cdn.chiaki.vn/unsafe/0x960/left/top/smart/filters:quality(75)/https://chiaki.vn/upload/product/2022/08/ao-the-thao-3-lo-cho-nam-gymshark-62e9dc11eb855-03082022092313.jpg"
              className="w-full rounded-md"
            />
          </div>
        </section>

        <section>
          <h1 className="font-bold text-lg text-primary-color">
            Raam Clothing
          </h1>
          <p className="text-gray-500 font-semibold">Men black shirt</p>
          <div className="flex justify-between items-center py-2 border w-[180px] px-3 mt-5">
            <div className="flex gap-1 items-center">
              <span>4</span>
              <Star sx={{ color: "#0097e6", fontSize: "17px" }} />
            </div>
            <Divider orientation="vertical" flexItem />
            <span>234 Ratings</span>
          </div>
          <div>
            <div className="price flex items-center gap-3 mt-5 text-2xl">
              <span className="font-sans text-gray-800">$ 400</span>
              <span className="thin-line-through text-gray-400">$ 999</span>
              <span className="text-primary-color font-semibold">60%</span>
            </div>
            <p className="text-sm">
              Inclusice of all taxes. Free Shipping above $150.
            </p>
          </div>
          <div className="mt-7 space-y-3">
            <div className="flex items-center gap-4">
              <Shield sx={{ color: "#0097e6" }} />
              <p>Authentic & Quality Assured</p>
            </div>
            <div className="flex items-center gap-4">
              <WorkspacePremium sx={{ color: "#0097e6" }} />
              <p>100% money back guarantee</p>
            </div>
            <div className="flex items-center gap-4">
              <LocalShipping sx={{ color: "#0097e6" }} />
              <p>Free Shipping & Returns</p>
            </div>

            <div className="flex items-center gap-4">
              <Wallet sx={{ color: "#0097e6" }} />
              <p>Pay on delivery might be available</p>
            </div>
          </div>

          <div className="mt-7 space-y-2">
            <h1>QUANTITY</h1>
            <div className="flex items-center gap-2 w-[140px] justify-between">
              <Button
                onClick={() => setQuantity(quantity - 1)}
                disabled={quantity === 1}
              >
                <Remove />
              </Button>
              <span>{quantity}</span>
              <Button onClick={() => setQuantity(quantity + 1)}>
                <Add />
              </Button>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-5">
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddShoppingCart />}
              sx={{ py: "1rem" }}
            >
              Add to Bag
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<FavoriteBorder />}
              sx={{ py: "1rem" }}
            >
              Whishlist
            </Button>
          </div>

          <div className="mt-5">
            <p>
              The saree comes with an ustitched blouse piece The blouse worn by
              the model might be for modelling purpose only. Check the image of
              the blouse piece to understand how the actual blouse piece looks
              like.
            </p>
          </div>
        </section>
      </div>
      <div className="mt-12">
        <Review />
        <Divider />
      </div>
      <div className="mt-20">
        <h1 className="text-lg font-bold px-5">Similar Product</h1>
        <div className="pt-5">
          <SimilarProduct />
        </div>
      </div>
    </div>
  );
};

export default PageDetails;
