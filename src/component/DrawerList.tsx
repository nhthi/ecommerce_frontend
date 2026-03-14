import { Divider, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../state/Store";
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
  toggleDrawer: () => void;
}
const DrawerList = ({ menu, menu2, toggleDrawer }: DrawerListProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout(navigate));
  };
  return (
    <div className="h-full">
      <div className="flex flex-col justify-between h-full w-[300px] border-r py-5">
        <div className="space-y-2">
          {menu.map((item, index) => (
            <div
              className="pr-9 cursor-pointer"
              key={index}
              onClick={() => navigate(item?.path)}
            >
              <p
                className={`${
                  item.path === location.pathname
                    ? "bg-primary-color text-white"
                    : ""
                } flex items-center px-5 py-3 rounded-r-full`}
              >
                <ListItemIcon>
                  {item.path === location.pathname
                    ? item?.activeIcon
                    : item?.icon}
                </ListItemIcon>
                <ListItemText primary={item?.name} />
              </p>
            </div>
          ))}
        </div>
        <Divider />
        <div className="space-y-2">
          {menu2.map((item, index) => (
            <div
              className="pr-9 cursor-pointer"
              key={index}
              onClick={() => {
                if (item.path === "/") {
                  handleLogout();
                } else {
                  navigate(item?.path);
                }
              }}
            >
              <p
                className={`${
                  item.path === location.pathname
                    ? "bg-primary-color text-white"
                    : ""
                } flex items-center px-5 py-3 rounded-r-full`}
              >
                <ListItemIcon>
                  {item.path === location.pathname
                    ? item?.activeIcon
                    : item?.icon}
                </ListItemIcon>
                <ListItemText primary={item?.name} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrawerList;
