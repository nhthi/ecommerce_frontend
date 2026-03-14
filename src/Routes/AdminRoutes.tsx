import React from "react";
import { Route, Routes } from "react-router-dom";
import SellerTable from "../admin/pages/Sellers/SellerTable";
import Coupon from "../admin/pages/Coupon/Coupon";
import AddNewCouponForm from "../admin/pages/Coupon/AddNewCouponForm";
import Deal from "../admin/pages/HomePage/Deal";
import Dashboard from "../seller/pages/SellerDashboard/Dashboard";
import Category from "../admin/pages/Category/CategoryTable";
import AddNewCategoryForm from "../admin/pages/Category/AddNewCategory";
import AdminProducts from "../admin/pages/Products/AdminProducts";
import Customers from "../admin/pages/Customers/Customers";
import AdminSettings from "../admin/pages/Settings/Setting";
import AdminDashboardPage from "../admin/pages/AdminDashboard/AdminDashboard";
import AdminAccountPage from "../admin/pages/Account/Account";
import OrderTable from "../admin/pages/Order/OrderTable";
// import AdminProducts from "../admin/pages/Products/AdminProducts";

const AdminRoutes = () => {
  return (
    <div>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<AdminDashboardPage />} />
        {/* Seller */}
        <Route path="/sellers" element={<SellerTable />} />
        {/* Coupon */}
        <Route path="/coupon" element={<Coupon />} />
        <Route path="/add-coupon" element={<AddNewCouponForm />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/add-category" element={<AddNewCategoryForm />} />
        {/* Deals */}
        <Route path="/deals" element={<Deal />} />
        <Route path="/account" element={<AdminAccountPage />} />
        {/* Product Management */}
        <Route path="/products" element={<AdminProducts />} />
        {/* Order Management */}
        <Route path="/orders" element={<OrderTable />} />
        {/* <Route path="/order/:id" element={<OrderDetail />} /> */}
        {/* Customer Management */}
        <Route path="/customers" element={<Customers />} />
        <Route path="/customer/:id" element={<Dashboard />} />
        {/* Supplier Management */}
        <Route path="/sellers" element={<SellerTable />} />
        {/* Reports */}
        <Route path="/reports" element={<Dashboard />} />
        {/* Settings */}
        <Route path="/settings" element={<AdminSettings />} />
      </Routes>
    </div>
  );
};

export default AdminRoutes;
