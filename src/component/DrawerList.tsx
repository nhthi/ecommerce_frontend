import { Divider, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../state/Store";
import { logout } from "../state/AuthSlice";

interface menuItem {
  name: string;
  path: string;
  icon: any;
  activeIcon: any;
}
interface DrawerListProps {
  menu: menuItem[];
  menu2: menuItem[];
  menuAdmin:menuItem[];
  toggleDrawer: () => void;
}
const DrawerList = ({ menu, menu2, menuAdmin,toggleDrawer }: DrawerListProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(store=>store.auth)
  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  return (
    <div className="h-full">
      <div className="flex h-full w-[300px] flex-col space-y-4 border-r border-orange-500/12 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.12),_transparent_26%),linear-gradient(180deg,_#151515_0%,_#0c0c0c_100%)] px-4 py-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
        <div>
          <div className="mb-5 rounded-[1.4rem] border border-orange-500/12 bg-white/[0.03] px-4 py-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300">
              Admin panel
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
              NHTHI FIT
            </h2>
            
          </div>

          <div className="space-y-2">
            {menu.map((item, index) => {
              const active = item.path === location.pathname;
              return (
                <div
                  className="cursor-pointer"
                  key={index}
                  onClick={() => navigate(item.path)}
                >
                  <div
                    className={[
                      "flex items-center gap-2 rounded-2xl border px-4 py-3 transition-all",
                      active
                        ? "border-orange-500/25 bg-[linear-gradient(135deg,#fb923c_0%,#f97316_100%)] text-black shadow-[0_14px_30px_rgba(249,115,22,0.22)]"
                        : "border-white/6 bg-white/[0.02] text-neutral-200 hover:border-orange-500/16 hover:bg-orange-500/8",
                    ].join(" ")}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: active ? "#111111" : "#fdba74" }}>
                      {active ? item.activeIcon : item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: "0.02em",
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {user?.role==='ROLE_ADMIN' && menuAdmin.map((item, index) => {
              const active = item.path === location.pathname;
              return (
                <div
                  className="cursor-pointer"
                  key={index}
                  onClick={() => navigate(item.path)}
                >
                  <div
                    className={[
                      "flex items-center gap-2 rounded-2xl border px-4 py-3 transition-all",
                      active
                        ? "border-orange-500/25 bg-[linear-gradient(135deg,#fb923c_0%,#f97316_100%)] text-black shadow-[0_14px_30px_rgba(249,115,22,0.22)]"
                        : "border-white/6 bg-white/[0.02] text-neutral-200 hover:border-orange-500/16 hover:bg-orange-500/8",
                    ].join(" ")}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: active ? "#111111" : "#fdba74" }}>
                      {active ? item.activeIcon : item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: "0.02em",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 2 }} />
          <div className="space-y-2">
            {menu2.map((item, index) => {
              const active = item.path === location.pathname;
              return (
                <div
                  className="cursor-pointer"
                  key={index}
                  onClick={() => {
                    if (item.path === "/") {
                      handleLogout();
                    } else {
                      navigate(item.path);
                    }
                  }}
                >
                  <div
                    className={[
                      "flex items-center gap-2 rounded-2xl border px-4 py-3 transition-all",
                      active
                        ? "border-orange-500/25 bg-[linear-gradient(135deg,#fb923c_0%,#f97316_100%)] text-black"
                        : "border-white/6 bg-white/[0.02] text-neutral-200 hover:border-orange-500/16 hover:bg-orange-500/8",
                    ].join(" ")}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: active ? "#111111" : "#fdba74" }}>
                      {active ? item.activeIcon : item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: "0.02em",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawerList;
