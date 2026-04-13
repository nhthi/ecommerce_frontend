import React, { useEffect } from "react";
import { Button } from "@mui/material";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import AdminDrawerList from "../../components/AdminDrawerList";
import AdminRoutes from "../../../Routes/AdminRoutes";
import { useAppDispatch } from "../../../state/Store";
import { fetchHomeCategories } from "../../../state/admin/adminSlice";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const AdminDashboard: React.FC = () => {
  const toggleDrawer = () => {};
  const dispatch = useAppDispatch();
  const { isDark, toggleMode } = useSiteThemeMode();

  useEffect(() => {
    dispatch(fetchHomeCategories());
  }, [dispatch]);

  return (
    <div className={isDark ? "admin-shell min-h-screen bg-[#090909] text-white" : "admin-shell min-h-screen bg-[#f5f7fb] text-slate-900"}>
      

      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 lg:px-6">
        <section className="hidden lg:block lg:sticky lg:top-6">
          <AdminDrawerList toggleDrawer={toggleDrawer} />
        </section>

        <section className={isDark ? "min-w-0 flex-1 overflow-y-auto rounded-[2rem] border border-white/8 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.08),_transparent_30%),linear-gradient(180deg,_#141414_0%,_#0d0d0d_100%)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] lg:p-6" : "min-w-0 flex-1 overflow-y-auto rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.10),_transparent_24%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:p-6"}>
          <AdminRoutes />
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
