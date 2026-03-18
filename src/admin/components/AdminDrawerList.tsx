import {
  AccountBox,
  Analytics,
  Category,
  ConfirmationNumber,
  Group,
  Inventory2,
  Logout,
  Settings,
  ShoppingBag,
  SupportAgent,
} from "@mui/icons-material";
import React from "react";
import DrawerList from "../../component/DrawerList";

const iconClass = "text-orange-300";
const activeIconClass = "text-black";

const menu = [
  {
    name: "Tong quan",
    path: "/admin",
    icon: <Analytics className={iconClass} />,
    activeIcon: <Analytics className={activeIconClass} />,
  },
  {
    name: "Ma giam gia",
    path: "/admin/coupon",
    icon: <ConfirmationNumber className={iconClass} />,
    activeIcon: <ConfirmationNumber className={activeIconClass} />,
  },
  {
    name: "Danh muc",
    path: "/admin/categories",
    icon: <Category className={iconClass} />,
    activeIcon: <Category className={activeIconClass} />,
  },
  {
    name: "San pham",
    path: "/admin/products",
    icon: <Inventory2 className={iconClass} />,
    activeIcon: <Inventory2 className={activeIconClass} />,
  },
  {
    name: "Don hang",
    path: "/admin/orders",
    icon: <ShoppingBag className={iconClass} />,
    activeIcon: <ShoppingBag className={activeIconClass} />,
  },
  {
    name: "Khach hang",
    path: "/admin/customers",
    icon: <Group className={iconClass} />,
    activeIcon: <Group className={activeIconClass} />,
  },
  {
    name: "Nguoi ban",
    path: "/admin/sellers",
    icon: <SupportAgent className={iconClass} />,
    activeIcon: <SupportAgent className={activeIconClass} />,
  },
  {
    name: "Cai dat",
    path: "/admin/settings",
    icon: <Settings className={iconClass} />,
    activeIcon: <Settings className={activeIconClass} />,
  },
];

const menu2 = [
  {
    name: "Tai khoan",
    path: "/admin/account",
    icon: <AccountBox className={iconClass} />,
    activeIcon: <AccountBox className={activeIconClass} />,
  },
  {
    name: "Dang xuat",
    path: "/",
    icon: <Logout className={iconClass} />,
    activeIcon: <Logout className={activeIconClass} />,
  },
];

const AdminDrawerList = ({ toggleDrawer }: { toggleDrawer: any }) => {
  return <DrawerList menu={menu} menu2={menu2} toggleDrawer={toggleDrawer} />;
};

export default AdminDrawerList;
