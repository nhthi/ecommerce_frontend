import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Search } from "@mui/icons-material";

export default function NotFound() {
  const particles = Array.from({ length: 18 });

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#74b9ff] via-[#a29bfe] to-[#6c5ce7] text-white">
      {/* Glow blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-20 h-60 w-60 rounded-full bg-white/15 blur-2xl"
        animate={{ y: [0, 15, 0], x: [0, 8, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#a29bfe]/25 blur-2xl"
        animate={{ y: [0, -15, 0], x: [0, -10, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
      />

      {/* Subtle star field */}
      <div aria-hidden className="absolute inset-0">
        {particles.map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-[3px] w-[3px] rounded-full bg-white/60"
            style={{
              top: `${(i * 97) % 100}%`,
              left: `${(i * 53) % 100}%`,
            }}
            animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.4, 1] }}
            transition={{
              repeat: Infinity,
              duration: 4 + (i % 6),
              delay: i * 0.15,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <main className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-white" />
            Oops! Trang bạn tìm kiếm không tồn tại 💫
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-7xl font-black tracking-tight md:text-8xl"
        >
          <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent drop-shadow-md">
            404
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 max-w-xl text-balance text-white/90"
        >
          Trang bạn đang tìm không tồn tại hoặc đã được di chuyển. Hãy thử tìm
          kiếm hoặc quay lại trang chủ nhé.
        </motion.p>

        {/* Search */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          action="/search"
          method="get"
          className="mt-8 flex w-full items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-md md:p-3"
        >
          <Search className="mx-2 size-5 shrink-0 opacity-80" />
          <input
            type="text"
            name="q"
            placeholder="Tìm nội dung..."
            className="flex-1 bg-transparent outline-none placeholder:text-white/60"
            aria-label="Search"
          />
          <button
            type="submit"
            className="rounded-xl px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20 transition hover:bg-white/20"
          >
            Tìm kiếm
          </button>
        </motion.form>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#6c5ce7] shadow-lg shadow-indigo-500/20 transition hover:scale-[1.03]"
          >
            <Home className="size-4" /> Về trang chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            <ArrowLeft className="size-4" /> Quay lại
          </button>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-10 h-px w-40 origin-left bg-gradient-to-r from-white/70 to-transparent"
        />

        {/* Tips */}
        <motion.ul
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 grid w-full grid-cols-1 gap-3 text-left text-sm text-white/80 sm:grid-cols-3"
        >
          {[
            "Kiểm tra lại đường dẫn URL",
            "Dùng thanh tìm kiếm ở trên",
            "Liên hệ hỗ trợ nếu cần",
          ].map((t, i) => (
            <li
              key={i}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm hover:bg-white/15 transition"
            >
              • {t}
            </li>
          ))}
        </motion.ul>
      </main>

      {/* Footer watermark */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <span className="select-none text-xs text-white/50">
          — Lost in space with{" "}
          <span className="text-white font-semibold">Beki</span> —
        </span>
      </div>
    </div>
  );
}
