import React, { useState } from "react";
import CartItem from "./CartItem";
import { Close, Favorite, LocalOffer } from "@mui/icons-material";
import { Button, IconButton, TextField } from "@mui/material";
import PricingCart from "./PricingCart";

const Cart = () => {
  const [couponCode, setCouponCode] = useState("");
  const handleChangeCouponCode = (e: any) => {
    setCouponCode(e.target.value);
  };
  return (
    <div className="pt-10 px-5 sm:px-10 md:px-60 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="cartItemSection lg:col-span-2 space-y-3">
          {[1, 1, 1, 1, 1, 1, 1, 1].map((item) => (
            <CartItem />
          ))}
        </div>
        <div className="col-span-1 text-sm space-y-3 ">
          <div className="border rounded-md px-5 py-3 space-y-5">
            <div className="flex gap-3 items-center">
              <div className="flex gap-3 text-sm items-center">
                <LocalOffer color="primary" sx={{ fontSize: "17px" }} />
              </div>
              <span>Apply Coupons</span>
            </div>
            {true ? (
              <div className="flex items-center justify-between gap-2">
                <TextField
                  id="outlined-basic"
                  placeholder="coupon code"
                  size="small"
                  variant="outlined"
                  onChange={handleChangeCouponCode}
                />
                <Button size="small">Apply</Button>
              </div>
            ) : (
              <div className="flex">
                <div className="p-1 pl-5 pr-3 border rounded-md flex gap-2 items-center">
                  <span className="">THINH Applied</span>
                  <IconButton size="small">
                    <Close className="text-red-600" />
                  </IconButton>
                </div>
              </div>
            )}
          </div>
          <div className="rounded-md  space-y-5 border">
            <PricingCart />
            <div className="p-5">
              <Button fullWidth variant="contained" sx={{ py: "11px" }}>
                Buy now
              </Button>
            </div>
          </div>
          <div className="rounded-md  space-y-5 border">
            <div className="flex justify-between items-center px-5 py-3">
              <span>Add From WhishList</span>
              <IconButton color="primary" size="small">
                <Favorite />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
