import {
  AccountBox,
  Analytics,
  AssignmentReturn,
  Badge,
  Category,
  ConfirmationNumber,
  FitnessCenter,
  Group,
  Inventory2,
  Logout,
  PostAdd,
  Settings,
  ShoppingBag,
  Support,
} from "@mui/icons-material";
import React from "react";
import DrawerList from "../../component/DrawerList";

const iconClass = "text-orange-300";
const activeIconClass = "text-white";

const menu = [
  {
    name: "Tổng quan",
    path: "/admin",
    icon: <Analytics className={iconClass} />,
    activeIcon: <Analytics className={activeIconClass} />,
  },
  {
    name: "Mã giảm giá",
    path: "/admin/coupon",
    icon: <ConfirmationNumber className={iconClass} />,
    activeIcon: <ConfirmationNumber className={activeIconClass} />,
  },
  {
    name: "Danh mục",
    path: "/admin/categories",
    icon: <Category className={iconClass} />,
    activeIcon: <Category className={activeIconClass} />,
  },
  {
    name: "Sản phẩm",
    path: "/admin/products",
    icon: <Inventory2 className={iconClass} />,
    activeIcon: <Inventory2 className={activeIconClass} />,
  },
  {
    name: "Đơn hàng",
    path: "/admin/orders",
    icon: <ShoppingBag className={iconClass} />,
    activeIcon: <ShoppingBag className={activeIconClass} />,
  },
  {
    name: "Khách hàng",
    path: "/admin/customers",
    icon: <Group className={iconClass} />,
    activeIcon: <Group className={activeIconClass} />,
  },
  {
    name: "Bài viết",
    path: "/admin/blog",
    icon: <PostAdd className={iconClass} />,
    activeIcon: <PostAdd className={activeIconClass} />,
  },
  {
    name: "Quản lý tập luyện",
    path: "/admin/workout",
    icon: <FitnessCenter className={iconClass} />,
    activeIcon: <FitnessCenter className={activeIconClass} />,
  },
  {
    name: "Hỗ trợ khách hàng",
    path: "/admin/support-page",
    icon: <Support className={iconClass} />,
    activeIcon: <Support className={activeIconClass} />,
  },
      {
    name: "Trả hàng",
    path: "/admin/return-requests",
    icon: <AssignmentReturn className={iconClass} />,
    activeIcon: <AssignmentReturn className={activeIconClass} />,
  },
];

const menuAdmin = [
  {
    name: "Nhân viên",
    path: "/admin/staff",
    icon: <Badge className={iconClass} />,
    activeIcon: <Badge className={activeIconClass} />,
  },

  {
    name: "Cài đặt",
    path: "/admin/settings",
    icon: <Settings className={iconClass} />,
    activeIcon: <Settings className={activeIconClass} />,
  },
];

const menu2 = [
  {
    name: "Tài khoản",
    path: "/admin/account",
    icon: <AccountBox className={iconClass} />,
    activeIcon: <AccountBox className={activeIconClass} />,
  },
  {
    name: "Đăng xuất",
    path: "/",
    icon: <Logout className={iconClass} />,
    activeIcon: <Logout className={activeIconClass} />,
  },
];

const AdminDrawerList = ({ toggleDrawer }: { toggleDrawer: any }) => {
  return (
    <DrawerList
      menu={menu}
      menu2={menu2}
      menuAdmin={menuAdmin}
      toggleDrawer={toggleDrawer}
    />
  );
};

export default AdminDrawerList;