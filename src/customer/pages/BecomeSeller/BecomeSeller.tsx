import React, { useState } from "react";
import SellerAccountForm from "./SellerAccountForm";
import SellerLoginForm from "./SellerLoginForm";
import { Button, CircularProgress } from "@mui/material";

const BecomeSeller = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [switching, setSwitching] = useState(false);

  const handleShowPage = () => {
    setSwitching(true);
    setTimeout(() => {
      setIsLogin((prev) => !prev);
      setSwitching(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-white flex items-center justify-center px-4">
      <div className="grid w-full max-w-6xl grid-cols-1 md:grid-cols-3 rounded-3xl shadow-xl bg-white overflow-hidden border border-slate-100">
        {/* FORM ĐĂNG NHẬP / ĐĂNG KÝ */}
        <section className="md:col-span-2 p-6 sm:p-8 lg:p-10">
          <div className="mb-6">
            <p className="text-xs font-semibold text-sky-500 uppercase tracking-[0.2em]">
              Seller Center
            </p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
              {isLogin
                ? "Đăng nhập tài khoản người bán"
                : "Đăng ký trở thành người bán"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {isLogin
                ? "Quản lý sản phẩm, đơn hàng và doanh thu của bạn trong một nơi duy nhất."
                : "Tạo gian hàng riêng, đăng bán sản phẩm và tiếp cận hàng nghìn khách hàng."}
            </p>
          </div>

          {/* Loading khi chuyển form */}
          {switching ? (
            <div className="flex justify-center py-16">
              <CircularProgress />
            </div>
          ) : isLogin ? (
            <SellerLoginForm />
          ) : (
            <SellerAccountForm />
          )}

          {/* Chuyển qua lại Đăng nhập / Đăng ký */}
          <div className="mt-8 space-y-2">
            <p className="text-center text-sm text-slate-600">
              {isLogin
                ? "Chưa có tài khoản người bán?"
                : "Đã có tài khoản người bán?"}
            </p>
            <Button
              onClick={handleShowPage}
              fullWidth
              sx={{
                py: "11px",
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#0ea5e9",
                color: "#0ea5e9",
                "&:hover": {
                  borderColor: "#0284c7",
                  backgroundColor: "rgba(14,165,233,0.06)",
                },
              }}
              variant="outlined"
            >
              {isLogin ? "Đăng ký bán hàng ngay" : "Quay lại đăng nhập"}
            </Button>
          </div>
        </section>

        {/* PANEL BÊN PHẢI – HÌNH ẢNH & TEXT GIỚI THIỆU */}
        <section className="hidden md:flex md:col-span-1 bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-600 text-white relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_#fff,_transparent_60%)]" />

          <div className="relative z-10 flex flex-col justify-center items-center w-full px-6 py-10 space-y-8">
            <div className="space-y-3 text-center">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-sky-100">
                Marketplace
              </p>
              <p className="text-2xl lg:text-3xl font-bold leading-snug">
                Bán hàng chuyên nghiệp
                <br />
                trên <span className="text-yellow-300">NHT Shop</span>
              </p>
              <p className="text-sm text-sky-100/90 max-w-xs mx-auto">
                Tăng trưởng doanh số, quản lý đơn hàng dễ dàng và xây dựng
                thương hiệu riêng của bạn trên nền tảng thương mại điện tử hiện
                đại.
              </p>
            </div>

            <div className="w-full max-w-xs rounded-2xl overflow-hidden shadow-lg border border-sky-200/30 bg-white/10 backdrop-blur-md">
              <img
                src="https://dokan.co/app/uploads/2023/05/How-to-Become-an-eCommerce-Seller-7-Tips-from-Experts.png"
                alt="Seller illustration"
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-1">
                <p className="text-sm font-semibold">
                  Mở gian hàng trong vài phút
                </p>
                <p className="text-xs text-sky-100/90">
                  Đăng ký nhanh chóng, giao diện dễ dùng, hỗ trợ người bán 24/7.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="space-y-1">
                <p className="text-lg font-bold text-yellow-300">+10K</p>
                <p className="text-sky-100/90">Người bán đang hoạt động</p>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-yellow-300">24/7</p>
                <p className="text-sky-100/90">Hỗ trợ & đồng hành</p>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-yellow-300">Miễn phí</p>
                <p className="text-sky-100/90">Đăng ký & mở shop</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BecomeSeller;
