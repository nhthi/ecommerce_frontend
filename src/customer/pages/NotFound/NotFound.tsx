import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, HomeOutlined } from "@mui/icons-material";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

export default function NotFound() {
  const { isDark } = useSiteThemeMode();

  return (
    <div
      className={
        isDark
          ? "min-h-screen bg-[#0b0b0b] px-4 py-10"
          : "min-h-screen bg-[#f6f7fb] px-4 py-10"
      }
    >
      <div className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center">
        <div
          className={
            isDark
              ? "w-full rounded-[2rem] border border-orange-500/15 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.14),_transparent_30%),linear-gradient(180deg,_#171717_0%,_#101010_100%)] px-6 py-12 shadow-[0_28px_80px_rgba(0,0,0,0.45)] sm:px-10 sm:py-14"
              : "w-full rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.10),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] px-6 py-12 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:px-10 sm:py-14"
          }
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-400">
              Lỗi 404
            </p>

            <h1
              className={
                isDark
                  ? "mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl"
                  : "mt-4 text-3xl font-black uppercase tracking-tight text-slate-900 sm:text-4xl"
              }
            >
              Trang không tồn tại
            </h1>

            <p
              className={
                isDark
                  ? "mx-auto mt-4 max-w-xl text-sm leading-7 text-neutral-400 sm:text-base"
                  : "mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base"
              }
            >
              Đường dẫn bạn vừa mở không còn hoạt động hoặc đã được thay đổi.
              Hãy quay lại trang chủ hoặc trở về trang trước để tiếp tục.
            </p>

            <div
              className={
                isDark
                  ? "mx-auto mt-8 max-w-md rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-4"
                  : "mx-auto mt-8 max-w-md rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4"
              }
            >
              <p
                className={
                  isDark
                    ? "text-[11px] uppercase tracking-[0.2em] text-neutral-500"
                    : "text-[11px] uppercase tracking-[0.2em] text-slate-500"
                }
              >
                Gợi ý
              </p>
              <p
                className={
                  isDark
                    ? "mt-2 text-base leading-7 text-neutral-300"
                    : "mt-2 text-base leading-7 text-slate-600"
                }
              >
                Nếu bạn đang tìm sản phẩm, hãy quay lại trang chủ để xem danh mục,
                blog và các bộ sưu tập fitness mới nhất.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#fb923c_0%,#f97316_100%)] px-6 py-3 text-sm font-extrabold text-[#111111] shadow-[0_16px_35px_rgba(249,115,22,0.35)] transition hover:translate-y-[-1px]"
              >
                <HomeOutlined sx={{ fontSize: 18 }} />
                Về trang chủ
              </Link>

              <button
                onClick={() => window.history.back()}
                className={
                  isDark
                    ? "inline-flex items-center justify-center gap-2 rounded-full border border-orange-500/30 px-6 py-3 text-sm font-bold text-orange-200 transition hover:bg-orange-500/10"
                    : "inline-flex items-center justify-center gap-2 rounded-full border border-orange-300 px-6 py-3 text-sm font-bold text-orange-700 transition hover:bg-orange-50"
                }
              >
                <ArrowLeft sx={{ fontSize: 18 }} />
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}