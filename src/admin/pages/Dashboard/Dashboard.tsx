import React, { useEffect } from "react";
import AdminDrawerList from "../../components/AdminDrawerList";
import AdminRoutes from "../../../Routes/AdminRoutes";
import { useAppDispatch } from "../../../state/Store";
import { fetchHomeCategories } from "../../../state/admin/adminSlice";

const AdminDashboard: React.FC = () => {
  // Hàm toggle đóng/mở menu bên trái (drawer) – hiện tạm thời chưa dùng
  const toggleDrawer = () => {};

  const dispatch = useAppDispatch();

  useEffect(() => {
    // Khi vào trang Admin, gọi API lấy danh mục hiển thị ở trang chủ
    dispatch(fetchHomeCategories());
  }, [dispatch]);

  return (
    <div>
      {/* Giao diện chính của trang Admin */}
      <div className="lg:flex lg:h-[90vh]">
        {/* Khu vực menu bên trái (drawer) – chỉ hiện trên màn hình lớn */}
        <section className="hidden lg:block h-full">
          <AdminDrawerList toggleDrawer={toggleDrawer} />
        </section>

        {/* Khu vực nội dung chính bên phải */}
        <section className="p-10 w-full lg:w-[80%] overflow-y-auto">
          <AdminRoutes />
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
