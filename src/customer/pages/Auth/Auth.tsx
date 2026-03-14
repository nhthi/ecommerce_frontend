import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Button } from "@mui/material";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-100 to-blue-200 px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Cột hình ảnh / giới thiệu (ẩn trên mobile) */}
        <div className="hidden md:flex flex-col justify-center gap-4">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <img
              className="w-full h-full object-cover object-center"
              src="https://file.hstatic.net/200000503583/article/high-fashion-la-gi-21_15eb1f9733ae4344977098b5bdcaf03f_2048x2048.jpg"
              alt="Thời trang cao cấp"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-slate-50">
              <h2 className="text-xl font-semibold mb-1">
                Thời trang & phong cách
              </h2>
              <p className="text-sm text-slate-200/80">
                Đăng nhập hoặc đăng ký để bắt đầu mua sắm và quản lý đơn hàng
                của bạn một cách nhanh chóng, an toàn.
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-400 px-1">
            Bảo mật bằng OTP – không cần mật khẩu, chỉ cần email là có thể đăng
            nhập.
          </p>
        </div>

        {/* Cột form */}
        <div className="flex flex-col items-center">
          {/* Toggle Đăng nhập / Đăng ký */}
          <div className="mb-4 flex items-center gap-2 bg-slate-900/60 border border-slate-700 rounded-full p-1 shadow-lg">
            <Button
              className="w-30"
              size="small"
              onClick={() => setIsLogin(true)}
              sx={{
                // flex: 1,
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
                ...(isLogin
                  ? {
                      background:
                        "linear-gradient(135deg, rgb(56,189,248), rgb(37,99,235))",
                      color: "#fff",
                      boxShadow: "0 14px 30px rgba(37,99,235,0.6)",
                    }
                  : {
                      color: "rgb(148,163,184)",
                    }),
              }}
            >
              Đăng nhập
            </Button>
            <Button
              size="small"
              onClick={() => setIsLogin(false)}
              sx={{
                flex: 1,
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
                ...(isLogin
                  ? {
                      color: "rgb(148,163,184)",
                    }
                  : {
                      background:
                        "linear-gradient(135deg, rgb(16,185,129), rgb(59,130,246))",
                      color: "#fff",
                      boxShadow: "0 14px 30px rgba(16,185,129,0.6)",
                    }),
              }}
            >
              Đăng ký
            </Button>
          </div>

          {/* Form: Login / Register */}
          <div className="w-full">
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>

          {/* Text chuyển trang */}
          <div className="flex items-center gap-1 justify-center my-4">
            <p className="text-sm text-slate-300">
              {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
            </p>
            <Button
              size="small"
              onClick={() => setIsLogin(!isLogin)}
              sx={{
                textTransform: "none",
                fontSize: "0.85rem",
              }}
            >
              {isLogin ? "Tạo tài khoản" : "Đăng nhập ngay"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
