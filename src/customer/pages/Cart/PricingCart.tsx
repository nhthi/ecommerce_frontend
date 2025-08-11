import { Divider } from "@mui/material";
import React from "react";

const PricingCart = () => {
  return (
    <div>
      <div className="space-y-3 p-5 border-b">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span>$346</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Discount</span>
          <span>$36</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Shipping</span>
          <span>$36</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Plateform</span>
          <span>Free</span>
        </div>
      </div>

      <div className="flex justify-between items-center font-semibold text-xl p-5 text-primary-color">
        <span className="">Total</span>
        <span>$452</span>
      </div>
    </div>
  );
};

export default PricingCart;
