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
import AddProduct from "../admin/pages/Products/AddProduct";
import UpdateProduct from "../admin/pages/Products/UpdateProduct";
import Customers from "../admin/pages/Customers/Customers";
import StaffTable from "../admin/pages/Staff/StaffTable";
import AdminSettings from "../admin/pages/Settings/Setting";
import AdminDashboardPage from "../admin/pages/AdminDashboard/AdminDashboard";
import AdminAccountPage from "../admin/pages/Account/Account";
import OrderTable from "../admin/pages/Order/OrderTable";
import AdminBlogPage from "../admin/pages/Blog/AdminBlogPage";
import AddEditBlogCategoryForm from "../admin/pages/Blog/AddEditBlogCategoryForm";
import EditBlogCategoryPage from "../admin/pages/Blog/EditBlogCategoryPage";
import AddEditBlogTagForm from "../admin/pages/Blog/AddEditBlogTagForm";
import AddEditBlogPostForm from "../admin/pages/Blog/AddEditBlogPostForm";
import { useAppSelector } from "../state/Store";
import EditBlogPostPage from "../admin/pages/Blog/EditBlogPostPage";
import EditBlogTagPage from "../admin/pages/Blog/EditBlogTagPage";
import AdminWorkoutPage from "../admin/pages/Workout/AdminWorkoutPage";
import AddEditWorkoutPlanForm from "../admin/pages/Workout/AddEditWorkoutPlanForm";
import AddEditWorkoutPlanDayForm from "../admin/pages/Workout/AddEditWorkoutPlanDayForm";
import AddEditExerciseForm from "../admin/pages/Workout/AddEditExerciseForm";
import EditWorkoutPlanPage from "../admin/pages/Workout/EditWorkoutPlanPage";
import EditWorkoutPlanDayPage from "../admin/pages/Workout/EditWorkoutPlanDayPage";
import EditExercisePage from "../admin/pages/Workout/EditExercisePage";

const AdminRoutes = () => {
  const { user } = useAppSelector((store) => store.auth);

  return (
    <div>
      <Routes>
        <Route path="/" element={<AdminDashboardPage />} />
        <Route path="/sellers" element={<SellerTable />} />
        <Route path="/coupon" element={<Coupon />} />
        <Route path="/add-coupon" element={<AddNewCouponForm />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/add-category" element={<AddNewCategoryForm />} />
        <Route path="/deals" element={<Deal />} />
        <Route path="/account" element={<AdminAccountPage />} />
        <Route path="/products" element={<AdminProducts />} />
        <Route path="/products/create" element={<AddProduct />} />
        <Route path="/products/edit/:id" element={<UpdateProduct />} />
        <Route path="/orders" element={<OrderTable />} />
        <Route path="/customers" element={<Customers />} />
        {(user?.role === "ROLE_ADMIN" && <Route path="/staff" element={<StaffTable />} />)}
        <Route path="/customer/:id" element={<Dashboard />} />
        <Route path="/reports" element={<Dashboard />} />
       { user?.role === "ROLE_ADMIN"&& <Route path="/settings" element={<AdminSettings />} />}

        <Route path="/blog" element={<AdminBlogPage />} />
        <Route path="/blog/category/create" element={<AddEditBlogCategoryForm />} />
        <Route path="/blog/category/edit/:id" element={<EditBlogCategoryPage />} />
        <Route path="/blog/tag/create" element={<AddEditBlogTagForm />} />
        <Route path="/blog/tag/edit/:id" element={<EditBlogTagPage />} />
        <Route path="/blog/post/create" element={<AddEditBlogPostForm currentUserId={user?.id} />} />
        <Route path="/blog/post/edit/:id" element={<EditBlogPostPage />} />

        <Route path="/workout" element={<AdminWorkoutPage />} />
        <Route path="/workout/plan/create" element={<AddEditWorkoutPlanForm currentUserId={user?.id} />} />
        <Route path="/workout/plan/edit/:id" element={<EditWorkoutPlanPage />} />
        <Route path="/workout/day/create" element={<AddEditWorkoutPlanDayForm />} />
        <Route path="/workout/day/edit/:id" element={<EditWorkoutPlanDayPage />} />
        <Route path="/workout/exercise/create" element={<AddEditExerciseForm />} />
        <Route path="/workout/exercise/edit/:id" element={<EditExercisePage />} />
      </Routes>
    </div>
  );
};

export default AdminRoutes;
