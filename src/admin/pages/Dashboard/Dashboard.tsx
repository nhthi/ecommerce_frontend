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
      <div className={isDark ? "border-b border-orange-500/12 bg-[linear-gradient(180deg,_rgba(249,115,22,0.08),_transparent)] px-6 py-4" : "border-b border-slate-200 bg-[linear-gradient(180deg,_rgba(249,115,22,0.10),_transparent)] px-6 py-4"}>
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div>
            <p className={isDark ? "text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300" : "text-[11px] font-bold uppercase tracking-[0.24em] text-orange-600"}>
              Trang quan tri
            </p>
            <h1 className={isDark ? "mt-2 text-3xl font-black tracking-tight text-white" : "mt-2 text-3xl font-black tracking-tight text-slate-900"}>
              Dieu hanh he thong NHTHI FIT
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className={isDark ? "hidden rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-neutral-300 lg:block" : "hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm lg:block"}>
              Quan ly san pham, don hang, noi dung va van hanh tren cung mot giao dien.
            </div>
            <Button
              onClick={toggleMode}
              startIcon={isDark ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
              sx={{
                borderRadius: "999px",
                minWidth: 0,
                px: 2.2,
                py: 1,
                border: isDark ? "1px solid rgba(249,115,22,0.20)" : "1px solid rgba(15,23,42,0.12)",
                backgroundColor: isDark ? "rgba(249,115,22,0.06)" : "#ffffff",
                color: isDark ? "#fdba74" : "#0f172a",
                boxShadow: isDark ? "none" : "0 10px 30px rgba(15,23,42,0.08)",
              }}
            >
              {isDark ? "Che do sang" : "Che do toi"}
            </Button>
          </div>
        </div>
      </div>

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
