import {
  AccountBalanceWallet,
  AccountBox,
  Add,
  AddBusiness,
  BarChart,
  Category,
  Dashboard,
  ElectricBolt,
  Home,
  IntegrationInstructions,
  Inventory,
  Inventory2,
  LocalOffer,
  Logout,
  People,
  PeopleAlt,
  Receipt,
  Settings,
  ShoppingBag,
  ShoppingCart,
  SupervisorAccount,
} from "@mui/icons-material";
import React from "react";
import DrawerList from "../../component/DrawerList";
const menu = [
  // Dashboard
  {
    name: "Tổng quan",
    path: "/admin",
    icon: <Dashboard className="text-primary-color" />,
    activeIcon: <Dashboard className="text-white" />,
  },

  // Coupon
  {
    name: "Mã giảm giá",
    path: "/admin/coupon",
    icon: <IntegrationInstructions className="text-primary-color" />,
    activeIcon: <IntegrationInstructions className="text-white" />,
  },
  {
    name: "Danh mục",
    path: "/admin/categories",
    icon: <IntegrationInstructions className="text-primary-color" />,
    activeIcon: <IntegrationInstructions className="text-white" />,
  },

  // {
  //   name: "Deals",
  //   path: "/admin/deals",
  //   icon: <Receipt className="text-primary-color" />,
  //   activeIcon: <Receipt className="text-white" />,
  // },

  // Products
  {
    name: "Sản phẩm",
    path: "/admin/products",
    icon: <Inventory2 className="text-primary-color" />,
    activeIcon: <Inventory2 className="text-white" />,
  },

  // Orders
  {
    name: "Đơn hàng",
    path: "/admin/orders",
    icon: <ShoppingCart className="text-primary-color" />,
    activeIcon: <ShoppingCart className="text-white" />,
  },

  // Customers
  {
    name: "Khách hàng",
    path: "/admin/customers",
    icon: <People className="text-primary-color" />,
    activeIcon: <People className="text-white" />,
  },
  {
    name: "Người bán",
    path: "/admin/sellers",
    icon: <PeopleAlt className="text-primary-color" />,
    activeIcon: <PeopleAlt className="text-white" />,
  },

  // Reports
  {
    name: "Báo cáo",
    path: "/admin/reports",
    icon: <BarChart className="text-primary-color" />,
    activeIcon: <BarChart className="text-white" />,
  },

  // Settings
  {
    name: "Cài đặt",
    path: "/admin/settings",
    icon: <Settings className="text-primary-color" />,
    activeIcon: <Settings className="text-white" />,
  },
];

const menu2 = [
  {
    name: "Tài khoản",
    path: "/admin/account",
    icon: <AccountBox className="text-primary-color" />,
    activeIcon: <AccountBox className="text-white" />,
  },
  {
    name: "Đăng xuất",
    path: "/",
    icon: <Logout className="text-primary-color" />,
    activeIcon: <Logout className="text-white" />,
  },
];

const AdminDrawerList = ({ toggleDrawer }: { toggleDrawer: any }) => {
  return <DrawerList menu={menu} menu2={menu2} toggleDrawer={toggleDrawer} />;
};

export default AdminDrawerList;
