import React, { useEffect } from "react";
import AdminDrawerList from "../../components/AdminDrawerList";
import AdminRoutes from "../../../Routes/AdminRoutes";
import { useAppDispatch } from "../../../state/Store";
import { fetchHomeCategories } from "../../../state/admin/adminSlice";

const AdminDashboard: React.FC = () => {
  const toggleDrawer = () => {};
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchHomeCategories());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <div className="border-b border-orange-500/12 bg-[linear-gradient(180deg,_rgba(249,115,22,0.08),_transparent)] px-6 py-4">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300">
              Trang quản trị
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
              Điều hành hệ thống NHTHI FIT
            </h1>
          </div>

          <div className="hidden rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-neutral-300 lg:block">
            Quản lý người bán, sản phẩm, đơn hàng và doanh thu trên cùng một giao diện.
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 lg:px-6">
        <section className="hidden lg:block lg:sticky lg:top-6 ">
          <AdminDrawerList toggleDrawer={toggleDrawer} />
        </section>

        <section className="min-w-0 flex-1 overflow-y-auto rounded-[2rem] border border-white/8 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.08),_transparent_30%),linear-gradient(180deg,_#141414_0%,_#0d0d0d_100%)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] lg:p-6">
          <AdminRoutes />
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;