import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Button } from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[#050505] px-4 py-8 text-white lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1280px] items-stretch overflow-hidden rounded-[2rem] border border-orange-500/15 bg-[#0d0d0d] shadow-[0_30px_120px_rgba(0,0,0,0.45)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-full overflow-hidden lg:block">
          <img
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80"
            alt="Fitness training"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.55)_45%,rgba(249,115,22,0.28)_100%)]" />
          <div className="absolute inset-0 flex flex-col justify-between p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-black shadow-lg shadow-orange-500/20">
                <FitnessCenterIcon />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-300">
                  Fitness Store
                </p>
                <h1 className="text-2xl font-black tracking-[0.18em] text-white">
                  NHTHI FIT
                </h1>
              </div>
            </div>

            <div className="max-w-[520px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-300">
                Access your account
              </p>
              <h2 className="mt-4 max-w-[460px] text-5xl font-black leading-[0.98] text-slate-100">
                Đăng nhập để mua nhanh và theo dõi lịch sử đơn hàng.
              </h2>
              <p className="mt-6 max-w-[440px] text-base leading-7 text-slate-100">
                Tài khoản giúp bạn lưu sản phẩm yêu thích, nhận OTP đăng nhập nhanh và tiếp tục xem các gợi ý tập luyện phù hợp.
              </p>

              <div className="mt-8 grid max-w-[460px] grid-cols-2 gap-3">
                <div className="rounded-[1.4rem] border border-white/10 bg-black/25 px-4 py-4 backdrop-blur-sm">
  <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
    Đăng nhập linh hoạt
  </p>
  <p className="mt-2 text-sm leading-6 text-slate-200">
    Đăng nhập bằng mật khẩu hoặc nhận mã OTP qua email để xác thực nhanh.
  </p>
</div>

<div className="rounded-[1.4rem] border border-white/10 bg-black/25 px-4 py-4 backdrop-blur-sm">
  <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
    Đồng bộ tiện lợi
  </p>
  <p className="mt-2 text-sm leading-6 text-slate-200">
    Lưu đơn hàng, danh sách yêu thích và lịch sử xem sản phẩm trên mọi thiết bị.
  </p>
</div>
              </div>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-400/20 bg-black/25 px-4 py-2 text-sm font-semibold text-orange-200 backdrop-blur-sm">
              Bắt đầu trong vài giây
              <ArrowOutwardIcon sx={{ fontSize: 16 }} />
            </div>
          </div>
        </div>

        <div className="flex min-h-full flex-col justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-[480px]">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-black">
                  <FitnessCenterIcon />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-300">
                    Fitness Store
                  </p>
                  <h1 className="text-xl font-black tracking-[0.16em] text-white">
                    NHTHI FIT
                  </h1>
                </div>
              </div>
            </div>

            <div className="mb-6 inline-flex rounded-full border border-orange-500/15 bg-[#141414] p-1">
              <Button
                size="small"
                onClick={() => setIsLogin(true)}
                sx={{
                  minWidth: 140,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontWeight: 700,
                  px: 2.5,
                  py: 1,
                  ...(isLogin
                    ? {
                        background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                        color: "#fff",
                      }
                    : {
                        color: "#cbd5e1",
                      }),
                }}
              >
                Đăng nhập
              </Button>
              <Button
                size="small"
                onClick={() => setIsLogin(false)}
                sx={{
                  minWidth: 140,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontWeight: 700,
                  px: 2.5,
                  py: 1,
                  ...(isLogin
                    ? {
                        color: "#cbd5e1",
                      }
                    : {
                        background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                        color: "#fff",
                      }),
                }}
              >
                Đăng ký
              </Button>
            </div>

            {isLogin ? <LoginForm /> : <RegisterForm />}

            <div className="mt-6 flex items-center gap-1 justify-center">
              <p className="text-sm text-slate-400">
                {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
              </p>
              <Button
                size="small"
                onClick={() => setIsLogin(!isLogin)}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#fb923c",
                }}
              >
                {isLogin ? "Tạo tài khoản" : "Đăng nhập ngay"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;