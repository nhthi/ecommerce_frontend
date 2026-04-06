import {
  AccountBalanceWallet,
  AccountBox,
  Add,
  Dashboard,
  Inventory,
  Logout,
  Receipt,
  ShoppingBag,
} from "@mui/icons-material";
import React from "react";
import DrawerList from "../../../component/DrawerList";
const menu = [
  {
    name: "Tổng quan",
    path: "/seller",
    icon: <Dashboard className="text-primary-color" />,
    activeIcon: <Dashboard className="text-white" />,
  },
  {
    name: "Đơn hàng",
    path: "/seller/orders",
    icon: <ShoppingBag className="text-primary-color" />,
    activeIcon: <ShoppingBag className="text-white" />,
  },
  {
    name: "Sản phẩm",
    path: "/seller/products",
    icon: <Inventory className="text-primary-color" />,
    activeIcon: <Inventory className="text-white" />,
  },
  {
    name: "Thêm sản phẩm",
    path: "/seller/add-product",
    icon: <Add className="text-primary-color" />,
    activeIcon: <Add className="text-white" />,
  },
  {
    name: "Thanh toán",
    path: "/seller/payment",
    icon: <AccountBalanceWallet className="text-primary-color" />,
    activeIcon: <AccountBalanceWallet className="text-white" />,
  },
  // {
  //   name: "Transaction",
  //   path: "/seller/transaction",
  //   icon: <Receipt className="text-primary-color" />,
  //   activeIcon: <Receipt className="text-white" />,
  // },
];

const menu2 = [
  {
    name: "Tài khoản",
    path: "/seller/account",
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

const SellerDrawerList = ({ toggleDrawer }: { toggleDrawer: any }) => {
  return <DrawerList menu={menu} menu2={menu2} menuAdmin={menu} toggleDrawer={toggleDrawer} />;
};

export default SellerDrawerList;
