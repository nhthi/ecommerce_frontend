import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../seller/pages/SellerDashboard/Dashboard";
import Products from "../seller/pages/Products/Products";
import Orders from "../seller/pages/Orders/Orders";
import Account from "../seller/pages/Account/Account";
import Payment from "../seller/pages/Payment/Payment";
import AddProduct from "../seller/pages/Products/AddProduct";
import Transaction from "../seller/pages/Payment/Transaction";
import UpdateProduct from "../seller/pages/Products/UpdateProduct";

const SellerRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit-product/:id" element={<UpdateProduct />} />

        <Route path="/orders" element={<Orders />} />
        <Route path="/inventory" element={<Orders />} />
        <Route path="/account" element={<Account />} />
        <Route path="/payment" element={<Payment />} />
        {/* <Route path="/transaction" element={<Transaction />} /> */}
      </Routes>
    </div>
  );
};

export default SellerRoutes;
