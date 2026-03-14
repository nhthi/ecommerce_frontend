import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Chip } from "@mui/material";
import {
  Storefront,
  RocketLaunch,
  Sell,
  LocalShipping,
  Autorenew,
  CreditCard,
  Star,
  Whatshot,
} from "@mui/icons-material";
import ElectricCategory from "./ElectricCategory/ElectricCategory";
import CategoryGrid from "./CategoryGrid/CategoryGrid";
import Deal from "./Deal/Deal";
import ShopByCategory from "./ShopByCategory/ShopByCategory";
import Hero from "./Hero/Hero";
import Footer from "./Footer/Footer";
import { useNavigate } from "react-router-dom";
import FlashDealSlider from "./FlashSaleSlider/FlashSaleSlider";
import TopSellersShowcase from "./MarketplaceHighlights/MarketplaceHighlights ";
import PartnerBrandsSection from "./QuickCategories/QuickCategories";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  fetchTop10ProductDiscount,
  fetchTop10Sold,
} from "../../../state/customer/productSlice";

const trendingCollections = [
  {
    title: "Góc công nghệ cho Gen Z",
    description: "Laptop, tai nghe, phụ kiện công nghệ từ các shop uy tín.",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    tag: "Xu hướng",
    to: "/collection/cong-nghe-gen-z",
  },
  {
    title: "Thời trang streetwear nổi bật",
    description: "Áo thun, hoodie, sneaker từ các local brand & top seller.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    tag: "Top seller",
    to: "/collection/streetwear",
  },
  {
    title: "Nhà cửa tối giản & sang trọng",
    description: "Đồ decor, nội thất nhỏ, ánh sáng đẹp từ nhiều nhà bán.",
    image:
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=900&q=80",
    tag: "Được yêu thích",
    to: "/collection/home-minimal",
  },
];

const sellerPromos = [
  {
    icon: <Sell />,
    title: "Đăng bán chỉ với 3 bước",
    desc: "Tạo gian hàng và bắt đầu bán ngay hôm nay!",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: <RocketLaunch />,
    title: "Tăng lượt xem miễn phí",
    desc: "Đưa sản phẩm của bạn đến với hàng ngàn người dùng.",
    color: "from-sky-500 to-indigo-400",
  },
  {
    icon: <Sell />,
    title: "Đăng bán chỉ với 3 bước",
    desc: "Tạo gian hàng và bắt đầu bán ngay hôm nay!",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: <RocketLaunch />,
    title: "Tăng lượt xem miễn phí",
    desc: "Đưa sản phẩm của bạn đến với hàng ngàn người dùng.",
    color: "from-sky-500 to-indigo-400",
  },
];

const highlights = [
  {
    icon: <LocalShipping />,
    title: "Giao hàng nhanh",
    desc: "Nhận hàng trong 24h toàn quốc",
  },
  {
    icon: <Autorenew />,
    title: "Đổi trả dễ dàng",
    desc: "Đổi trả miễn phí trong 7 ngày",
  },
  {
    icon: <CreditCard />,
    title: "Thanh toán an toàn",
    desc: "Bảo mật tuyệt đối",
  },
];
const Home = () => {
  const navigate = useNavigate();
  const primary = "#0097e6";
  const dispatch = useAppDispatch();
  const { product } = useAppSelector((store) => store);

  useEffect(() => {
    dispatch(fetchTop10ProductDiscount());
    dispatch(fetchTop10Sold());
  }, []);
  return (
    <div className="bg-gray-50 text-gray-800 overflow-x-hidden">
      {/* 🌀 MARQUEE TEXT */}
      <div className="bg-[#0097e6] text-white py-3 overflow-hidden">
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap text-center text-lg font-semibold"
        >
          🎉 Siêu ưu đãi cuối tuần! Giảm đến 70% cho hàng ngàn sản phẩm - Mua
          ngay để không bỏ lỡ! 🚀 &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;
          FREESHIP cho đơn hàng từ 500.000đ 💙
        </motion.div>
      </div>

      {/* HERO */}
      <Hero />

      {/* FEATURE CARDS */}
      <section className="py-12 bg-white flex flex-wrap justify-center gap-8 text-center">
        {highlights.map((h, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-[#f5faff] p-6 rounded-2xl shadow-sm w-[260px]"
          >
            <div className="text-[#0097e6] text-4xl mb-3">{h.icon}</div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">{h.title}</h3>
            <p className="text-gray-600">{h.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* CATEGORY + ELECTRIC */}
      <div className="space-y-8 mb-8 mt-8">
        <ElectricCategory />
        <CategoryGrid />
      </div>

      {/* FLASH DEAL SLIDER */}
      <FlashDealSlider flashDeals={product.topDiscount || []} />
      {/* TRENDING */}
      <section className="py-16 bg-white">
        <div className="flex flex-col items-center gap-2 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0097e6] flex items-center gap-2">
            <Whatshot sx={{ color: primary }} />
            Xu hướng nổi bật từ cộng đồng ✨
          </h2>
          <p className="text-gray-500 text-sm md:text-base text-center max-w-2xl">
            Khám phá các bộ sưu tập đang được mua nhiều, đánh giá cao và được
            chọn lọc từ những nhà bán uy tín trên sàn.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 px-6">
          {trendingCollections.map((item, i) => (
            <motion.div
              key={item.to}
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl w-[310px] bg-black/5 cursor-pointer transition-all"
              onClick={() => navigate(item.to)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-[210px] object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="flex items-center gap-2 text-[10px] font-semibold mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-[#0097e6] flex items-center gap-1">
                    <Star sx={{ fontSize: 13 }} />
                    {item.tag}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 flex items-center gap-1">
                    <Storefront sx={{ fontSize: 13 }} />
                    Nhiều nhà bán tham gia
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-1 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-200 mb-2 line-clamp-2">
                  {item.description}
                </p>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: primary,
                    "&:hover": { backgroundColor: "#00a8ff" },
                    borderRadius: "999px",
                    textTransform: "none",
                    fontSize: 12,
                    paddingX: 2.5,
                    paddingY: 0.5,
                    alignSelf: "flex-start",
                  }}
                >
                  Xem bộ sưu tập
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EXISTING COMPONENTS */}
      <Deal products={product.topDiscount || []} />
      <div className="my-10">
        <ShopByCategory />
      </div>

      {/* SELLER PROMO */}
      <section className="py-16 bg-[#0097e6] text-white rounded-t-[3rem]">
        <div className="px-6 lg:px-20 flex flex-col gap-8">
          {/* TITLE + SUBTITLE */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              🎯 Cơ hội cho người bán trên nền tảng của bạn
            </h2>
            <p className="text-sm md:text-base text-[#e6f4ff]">
              Mở gian hàng trong vài phút, tiếp cận hàng ngàn khách truy cập mỗi
              ngày, quản lý đơn hàng và doanh thu trong một dashboard trực quan.
            </p>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center">
            {/* LEFT: PROMO CARDS */}
            <div className="flex flex-wrap gap-5 justify-center lg:justify-start flex-1">
              {sellerPromos.map((promo, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.04, y: -4 }}
                  className={`bg-gradient-to-r ${promo.color} p-5 rounded-2xl shadow-lg text-left w-[260px] md:w-[280px]`}
                >
                  <div className="mb-3 text-3xl">{promo.icon}</div>
                  <h3 className="font-bold text-lg mb-1">{promo.title}</h3>
                  <p className="text-xs md:text-sm text-[#f5faff] mb-3">
                    {promo.desc}
                  </p>
                  <ul className="text-[10px] md:text-xs text-[#e6f4ff] space-y-1">
                    {i === 0 && (
                      <>
                        <li>• Đăng ký online, xét duyệt nhanh.</li>
                        <li>• Tùy chỉnh gian hàng, banner, sản phẩm.</li>
                        <li>• Không cần website riêng.</li>
                      </>
                    )}
                    {i === 1 && (
                      <>
                        <li>• Xuất hiện trong mục đề xuất & tìm kiếm.</li>
                        <li>• Công cụ khuyến mãi, mã giảm giá riêng.</li>
                        <li>• Thống kê lượt xem & doanh thu real-time.</li>
                      </>
                    )}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* RIGHT: STATS + CTA */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 border border-white/15 rounded-3xl p-6 md:p-7 flex flex-col justify-between max-w-md mx-auto lg:mx-0"
            >
              <div className="space-y-3 mb-4">
                <h3 className="text-xl md:text-2xl font-bold">
                  Bắt đầu bán chỉ với vài bước đơn giản
                </h3>
                <ol className="text-sm text-[#e6f4ff] space-y-1.5">
                  <li>1️⃣ Đăng ký tài khoản nhà bán & xác minh thông tin.</li>
                  <li>2️⃣ Tạo gian hàng, đăng sản phẩm với vài thao tác.</li>
                  <li>3️⃣ Nhận đơn, quản lý vận chuyển & thanh toán an toàn.</li>
                </ol>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-[10px] md:text-xs mb-4">
                <div className="bg-white/10 rounded-2xl py-2">
                  <div className="font-bold text-lg md:text-xl">1,2K+</div>
                  <div className="text-[#e6f4ff]">Nhà bán đang hoạt động</div>
                </div>
                <div className="bg-white/10 rounded-2xl py-2">
                  <div className="font-bold text-lg md:text-xl">98%</div>
                  <div className="text-[#e6f4ff]">Đơn thành công & an toàn</div>
                </div>
                <div className="bg-white/10 rounded-2xl py-2">
                  <div className="font-bold text-lg md:text-xl">0đ</div>
                  <div className="text-[#e6f4ff]">Phí mở gian hàng</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <Button
                  variant="contained"
                  fullWidth
                  endIcon={<Storefront />}
                  sx={{
                    backgroundColor: "#ffffff",
                    color: "#0097e6",
                    fontWeight: 700,
                    borderRadius: "999px",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#f5faff" },
                  }}
                  onClick={() => navigate("/become-seller")}
                >
                  Đăng ký trở thành nhà bán ngay
                </Button>
                <Button
                  variant="text"
                  sx={{
                    color: "#e6f4ff",
                    fontSize: 12,
                    textTransform: "none",
                    paddingX: 0,
                  }}
                  onClick={() => navigate("/become-seller?step=guide")}
                >
                  Xem hướng dẫn chi tiết &gt;
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <TopSellersShowcase />

      {/* BRAND PARTNERS */}
      <PartnerBrandsSection />
      <Footer />
    </div>
  );
};

export default Home;
