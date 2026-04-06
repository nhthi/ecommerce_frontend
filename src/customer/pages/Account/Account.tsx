import React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Orders from "./Orders";
import OrderDetails from "./OrderDetails";
import UserDetails from "./UserDetails";
import Address from "./Address";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { logout } from "../../../state/AuthSlice";
import OrderReviewPageWrapper from "./OrderReviewPageWrapper";
import MyReview from "./MyReview";

const menu = [
  { name: "Don hang", path: "/account/orders" },
  { name: "Ca nhan", path: "/account" },
  { name: "The thanh toan", path: "/account/save-card", disabled: true },
  { name: "Dia chi", path: "/account/addresses" },
  { name: "Danh gia cua toi", path: "/account/my-reviews" },
  { name: "Dang xuat", path: "/" },
];

const Account = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((store) => store);

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  const isActivePath = (itemPath: string) => {
    if (itemPath === "/") return false;
    if (itemPath === "/account") return location.pathname === "/account";
    return location.pathname.startsWith(itemPath);
  };

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-8 text-white lg:px-12">
      <div className="mx-auto max-w-[1320px] space-y-6">
        <div className="rounded-[2rem] border border-orange-500/12 bg-[#101010] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.35)] lg:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-300">Tai khoan cua toi</p>
          <h1 className="mt-3 text-4xl font-black text-white lg:text-5xl">Tai khoan cua ban.</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 lg:text-lg">
            Quan ly thong tin ca nhan, theo doi don hang, dia chi giao hang va cac thao tac sau mua trong cung mot khu vuc de doc.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="rounded-[2rem] border border-orange-500/12 bg-[#101010] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] lg:p-5">
            <div className="rounded-[1.5rem] border border-white/6 bg-black/20 p-4">
              <p className="text-sm font-semibold text-slate-400">Tai khoan</p>
              <h2 className="mt-2 text-2xl font-black text-white">
                {auth.user?.fullName || "Khach hang"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {auth.user?.email || "Email chua cap nhat"}
              </p>
            </div>

            <div className="mt-4 space-y-2">
              {menu.map((item) => {
                const isLogout = item.path === "/";
                const active = isActivePath(item.path);

                return (
                  <button
                    key={item.name}
                    type="button"
                    disabled={item.disabled}
                    onClick={() => {
                      if (item.disabled) return;
                      if (isLogout) handleLogout();
                      else navigate(item.path);
                    }}
                    className={`flex w-full items-center justify-between rounded-[1.2rem] px-4 py-4 text-left text-base font-semibold transition ${
                      active && !isLogout
                        ? "bg-orange-500 text-black"
                        : isLogout
                        ? "text-red-300 hover:bg-red-500/10"
                        : item.disabled
                        ? "cursor-not-allowed text-slate-600"
                        : "bg-white/[0.03] text-slate-200 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span>{item.name}</span>
                    {active && !isLogout ? (
                      <span className="text-xs font-bold uppercase tracking-[0.16em]">
                        Dang xem
                      </span>
                    ) : item.disabled ? (
                      <span className="text-xs uppercase tracking-[0.16em] text-slate-600">
                        Sap co
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="rounded-[2rem] border border-orange-500/12 bg-[#101010] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] lg:p-8">
            <Routes>
              <Route path="/" element={<UserDetails />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:orderId" element={<OrderDetails />} />
              <Route path="/addresses" element={<Address />} />
              <Route path="/my-reviews" element={<MyReview />} />
              <Route path="/orders/:orderId/review" element={<OrderReviewPageWrapper />} />
            </Routes>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Account;
