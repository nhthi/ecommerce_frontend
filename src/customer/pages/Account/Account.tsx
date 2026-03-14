import { Divider } from "@mui/material";
import React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Orders from "./Orders";
import OrderDetails from "./OrderDetails";
import UserDetails from "./UserDetails";
import Address from "./Address";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { logout } from "../../../state/AuthSlice";
import OrderReviewPageWrapper from "./OrderReviewPageWrapper";

const menu = [
  { name: "Đơn hàng", path: "/account/orders" },
  { name: "Cá nhân", path: "/account" },
  { name: "Thẻ thanh toán", path: "/account/save-card" }, // TODO: thêm component sau
  { name: "Địa chỉ", path: "/account/addresses" },
  { name: "Đăng xuất", path: "/" },
];

const Account = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((store) => store);

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  // xác định active cho menu (để /account/orders/123 vẫn active tab Đơn hàng)
  const isActivePath = (itemPath: string) => {
    if (itemPath === "/") return false; // Đăng xuất không cần active
    if (itemPath === "/account") {
      return location.pathname === "/account";
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <div className="px-4 lg:px-10 xl:px-32 py-10">
        {/* Tiêu đề + info user */}
        <div className="max-w-6xl mx-auto mb-6 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-slate-900">
            Tài khoản của bạn
          </h1>
          <p className="text-sm text-slate-500">
            Xin chào,{" "}
            <span className="font-medium text-slate-800">
              {auth.user?.fullName || "Khách hàng"}
            </span>
            . Quản lý đơn hàng, thông tin cá nhân và địa chỉ giao hàng tại đây.
          </p>
        </div>

        {/* Card chính */}
        <div className="max-w-6xl mx-auto rounded-2xl bg-white/90 shadow-xl border border-slate-100 backdrop-blur-md overflow-hidden">
          {/* Header nhỏ trên card */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <p className="text-sm text-slate-500">Tài khoản</p>
              <p className="text-base font-semibold text-slate-900">
                {auth.user?.fullName || "Người dùng"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs sm:text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full transition"
            >
              Đăng xuất
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Sidebar menu */}
            <section className="col-span-1 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/60">
              <div className="py-4 px-3 lg:px-4 space-y-1">
                {menu.map((item) => {
                  const isLogout = item.path === "/";
                  const active = isActivePath(item.path);

                  return (
                    <div
                      key={item.name}
                      onClick={() => {
                        if (isLogout) {
                          handleLogout();
                        } else {
                          navigate(item.path);
                        }
                      }}
                      className={`group flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-all
                        ${
                          active && !isLogout
                            ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md"
                            : "text-slate-600 hover:bg-slate-100"
                        }
                        ${
                          isLogout
                            ? "mt-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                            : ""
                        }
                      `}
                    >
                      <span>{item.name}</span>
                      {!isLogout && active && (
                        <span className="text-[10px] uppercase tracking-wider opacity-80">
                          Đang xem
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Content bên phải */}
            <section className="right lg:col-span-2 px-4 sm:px-6 py-5">
              {/* Divider nhỏ trên mobile */}
              <div className="lg:hidden mb-3">
                <Divider />
              </div>

              <Routes>
                <Route path="/" element={<UserDetails />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:orderId" element={<OrderDetails />} />
                <Route path="/addresses" element={<Address />} />
                <Route
                  path="/orders/:orderId/review"
                  element={<OrderReviewPageWrapper />}
                />
                {/* Có thể thêm route cho /save-card sau này */}
              </Routes>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
