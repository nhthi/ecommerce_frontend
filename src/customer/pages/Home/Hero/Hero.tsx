import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

const HERO_IMAGES = [
  "https://i.ytimg.com/vi/BZdDH3FFQ_I/maxresdefault.jpg",
  "https://png.pngtree.com/thumb_back/fh260/background/20230614/pngtree-man-s-back-showing-what-his-muscles-look-like-image_2876133.jpg",
  "https://static.vecteezy.com/system/resources/thumbnails/026/781/389/small/gym-interior-background-of-dumbbells-on-rack-in-fitness-and-workout-room-photo.jpg"
];

const slides = [
  {
    eyebrow: "Thiết bị fitness",
    title: "Dụng cụ gym cho người tập tại nhà",
    highlight: "Đẹp, gọn, dễ chọn",
    description:
      "Máy cardio, tạ, ghế tập và phụ kiện được sắp xếp theo nhu cầu thực tế, giúp bạn tìm nhanh và dễ dàng hơn.",
    primaryLabel: "Xem sản phẩm",
    primaryPath: "/products/all",
    secondaryLabel: "Xem blog tập luyện",
    secondaryPath: "/blog",
    metricLabel: "Danh mục nổi bật",
    metricValue: "320+",
    metricItems: ["Máy cardio", "Tạ và bánh tạ", "Phụ kiện tập luyện"],
  },
  {
    eyebrow: "Blog & khóa học",
    title: "Học cách tập đúng trước khi mua thêm",
    highlight: "Dễ hiểu, dễ áp dụng",
    description:
      "Nội dung tập trung vào kỹ thuật, lịch tập và cách chọn dụng cụ phù hợp với từng mục tiêu.",
    primaryLabel: "Xem khóa học",
    primaryPath: "/training",
    secondaryLabel: "Đọc tin tức",
    secondaryPath: "/blog",
    metricLabel: "Nội dung hữu ích",
    metricValue: "80+",
    metricItems: ["Hướng dẫn kỹ thuật", "Lịch tập cơ bản", "Mẹo chọn dụng cụ"],
  },
  {
    eyebrow: "Gợi ý setup",
    title: "Chọn nhanh combo dụng cụ theo mục tiêu tập",
    highlight: "Không cần tìm từng món",
    description:
      "Nếu bạn chưa biết nên mua gì trước, các gợi ý sẵn có sẽ giúp bắt đầu nhanh gọn và tiết kiệm hơn.",
    primaryLabel: "Nhận tư vấn",
    primaryPath: "/message",
    secondaryLabel: "Xem phụ kiện",
    secondaryPath: "/search?keyword=phu%20kien%20tap%20gym",
    metricLabel: "Combo gợi ý",
    metricValue: "24",
    metricItems: ["Giảm mỡ tại nhà", "Tăng cơ cơ bản", "Setup phòng gym mini"],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay },
  }),
};

const Hero = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const { isDark } = useSiteThemeMode();

  const currentSlide = useMemo(() => slides[activeSlide], [activeSlide]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className={isDark ? "relative overflow-hidden rounded-b-[2.25rem] bg-black md:rounded-b-[3rem]" : "relative overflow-hidden rounded-b-[2.25rem] bg-white md:rounded-b-[3rem]"}>
      <motion.img
        key={activeSlide}
        src={HERO_IMAGES[activeSlide % HERO_IMAGES.length]}
        alt="Banner tập luyện fitness"
        className="h-[520px] w-full object-cover object-center md:h-[740px]"
        initial={{ scale: 1.08, opacity: 0.82 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      <div className={isDark ? "absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.78)_42%,rgba(0,0,0,0.45)_100%)]" : "absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.82)_38%,rgba(255,255,255,0.48)_100%)]"} />
      <div className={isDark ? "absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_28%)]" : "absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.14),transparent_28%)]"} />

      <div className="absolute inset-0 mx-auto flex max-w-[1380px] flex-col justify-center px-6 py-10 md:px-10 lg:px-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_320px]"
          >
            <div className="max-w-[720px]">
              <motion.div
                custom={0.04}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className={isDark ? "mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-200 backdrop-blur-sm" : "mb-6 inline-flex items-center gap-2 rounded-full border border-orange-300/40 bg-white/75 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-700 backdrop-blur-sm"}
              >
                <span className="h-2 w-2 rounded-full bg-orange-400" />
                {currentSlide.eyebrow}
              </motion.div>

              <motion.h1
                custom={0.1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className={isDark ? "max-w-[680px] text-[34px] font-black leading-[1.02] text-white sm:text-[44px] lg:text-[60px]" : "max-w-[680px] text-[34px] font-black leading-[1.02] text-slate-900 sm:text-[44px] lg:text-[60px]"}
              >
                {currentSlide.title}
                <span className="mt-2 block text-orange-500">
                  {currentSlide.highlight}
                </span>
              </motion.h1>

              <motion.p
                custom={0.18}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className={isDark ? "mt-6 max-w-[600px] text-[15px] leading-7 text-slate-200 sm:text-base" : "mt-6 max-w-[600px] text-[15px] leading-7 text-slate-700 sm:text-base"}
              >
                {currentSlide.description}
              </motion.p>

              <motion.div
                custom={0.26}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mt-9 flex flex-wrap items-center gap-3"
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ShoppingCartIcon />}
                  sx={{
                    background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                    color: "#050505",
                    fontWeight: 800,
                    borderRadius: "999px",
                    minWidth: 190,
                    px: 3.5,
                    py: 1.2,
                    boxShadow: "0 14px 34px rgba(249,115,22,0.24)",
                    textTransform: "none",
                    "&:hover": {
                      background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                    },
                  }}
                  onClick={() => navigate(currentSlide.primaryPath)}
                >
                  {currentSlide.primaryLabel}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  endIcon={<MenuBookIcon />}
                  sx={{
                    borderRadius: "999px",
                    px: 3,
                    py: 1.2,
                    borderColor: isDark ? "rgba(255,255,255,0.34)" : "rgba(15,23,42,0.16)",
                    color: isDark ? "#fff" : "#0f172a",
                    backgroundColor: isDark ? "transparent" : "rgba(255,255,255,0.72)",
                    fontWeight: 700,
                    textTransform: "none",
                    backdropFilter: "blur(6px)",
                    "&:hover": {
                      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.92)",
                      borderColor: isDark ? "#fff" : "#0f172a",
                    },
                  }}
                  onClick={() => navigate(currentSlide.secondaryPath)}
                >
                  {currentSlide.secondaryLabel}
                </Button>
              </motion.div>

              <motion.div
                custom={0.34}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mt-10 grid max-w-[620px] grid-cols-1 gap-3 sm:grid-cols-3"
              >
                <div className={isDark ? "rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-100 backdrop-blur-sm" : "rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 backdrop-blur-sm"}>
                  Chọn nhanh theo nhu cầu
                </div>
                <div className={isDark ? "rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-100 backdrop-blur-sm" : "rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 backdrop-blur-sm"}>
                  Giao hàng toàn quốc
                </div>
                <div className={isDark ? "rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-100 backdrop-blur-sm" : "rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 backdrop-blur-sm"}>
                  Có blog & khóa học
                </div>
              </motion.div>
            </div>

            <motion.div
              custom={0.16}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="hidden lg:flex lg:justify-end"
            >
              <div className={isDark ? "w-full max-w-[320px] rounded-[1.75rem] border border-orange-400/15 bg-[#101010]/78 p-5 text-white shadow-2xl backdrop-blur-md" : "w-full max-w-[320px] rounded-[1.75rem] border border-slate-200 bg-white/88 p-5 text-slate-900 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-md"}>
                <div className={isDark ? "flex items-start justify-between gap-4 border-b border-white/10 pb-4" : "flex items-start justify-between gap-4 border-b border-slate-200 pb-4"}>
                  <div>
                    <p className={isDark ? "text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-300" : "text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-600"}>
                      {currentSlide.metricLabel}
                    </p>
                    <h3 className={isDark ? "mt-2 text-4xl font-black text-white" : "mt-2 text-4xl font-black text-slate-900"}>
                      {currentSlide.metricValue}
                    </h3>
                  </div>
                  <div className="rounded-full bg-orange-500 p-3 text-black">
                    <ArrowForwardIcon />
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  {currentSlide.metricItems.map((item) => (
                    <div
                      key={item}
                      className={isDark ? "rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-100" : "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center gap-3 lg:mt-10">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Chuyển đến slide ${index + 1}`}
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                activeSlide === index ? "w-12 bg-orange-500" : isDark ? "w-2.5 bg-white/35" : "w-2.5 bg-slate-400/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;