import { motion } from "framer-motion";
import { Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useNavigate } from "react-router-dom";

const primary = "#0097e6";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-[360px] md:h-[520px] overflow-hidden rounded-b-[3rem]">
      {/* BACKGROUND */}
      <motion.img
        src="https://static.vecteezy.com/system/resources/previews/029/842/365/large_2x/e-commerce-shopping-cart-with-multiple-products-a-sunlit-abstract-background-e-commerce-concept-ai-generative-free-photo.jpg"
        alt="Online shopping"
        className="w-full h-full object-cover object-center"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 14,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#000000bf] via-[#00000066] to-[#0097e633]" />

      {/* CONTENT */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 gap-4">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-xs md:text-sm text-[#f5faff] px-3 py-1 rounded-full w-fit"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Nền tảng marketplace dành cho cả người mua & nhà bán
        </motion.div>

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-white text-2.5xl md:text-5xl lg:text-[46px] font-extrabold leading-snug drop-shadow-xl max-w-3xl"
        >
          Mua sắm thông minh,
          <span className="text-[#00a8ff]"> bán hàng hiệu quả</span>
          <br className="hidden md:block" />
          trên một nền tảng duy nhất.
        </motion.h1>

        {/* SUBTITLE */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-gray-100/90 max-w-2xl text-sm md:text-base leading-relaxed"
        >
          Khám phá hàng ngàn sản phẩm từ nhiều nhà bán uy tín, công cụ hỗ trợ
          tối đa cho seller, thanh toán an toàn và vận chuyển nhanh chóng.
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.25 }}
          className="flex flex-wrap items-center gap-3 mt-2"
        >
          <Button
            variant="contained"
            size="large"
            endIcon={<ShoppingCartIcon />}
            sx={{
              backgroundColor: primary,
              "&:hover": { backgroundColor: "#00a8ff" },
              fontWeight: 600,
              borderRadius: "999px",
              px: 3.5,
              py: 1,
              boxShadow: "0 10px 26px rgba(0,151,230,0.35)",
              textTransform: "none",
            }}
            onClick={() => navigate("/search")}
          >
            Khám phá sản phẩm
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<StorefrontIcon />}
            sx={{
              borderRadius: "999px",
              px: 3,
              py: 1,
              borderColor: "#ffffffcc",
              color: "#ffffff",
              fontWeight: 500,
              textTransform: "none",
              backdropFilter: "blur(4px)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.12)",
                borderColor: "#ffffff",
              },
            }}
            onClick={() => navigate("/become-seller")}
          >
            Trở thành nhà bán
          </Button>
        </motion.div>

        {/* SMALL TRUST POINTS */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 mt-2 text-[11px] md:text-xs text-gray-100/85"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Bảo vệ người mua & xác minh nhà bán uy tín
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            Công cụ quản lý đơn, doanh thu thời gian thực cho seller
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
            Giao hàng nhanh, đa đối tác vận chuyển
          </div>
        </motion.div>
      </div>

      {/* FLOATING VISUAL (OPTIONAL) */}
      <motion.div
        initial={{ opacity: 0, x: 60, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.6, duration: 0.9 }}
        className="hidden md:flex absolute right-10 bottom-10"
      >
        <motion.div
          className="bg-white/95 rounded-3xl px-4 py-3 shadow-2xl flex flex-col gap-1 min-w-[180px]"
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="text-xs text-gray-500">Số nhà bán hoạt động</div>
          <div className="text-xl font-extrabold text-[#0097e6]">1,248+</div>
          <div className="text-[10px] text-gray-500">
            Đăng ký dễ dàng, không phí mở gian hàng.
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
