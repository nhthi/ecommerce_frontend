import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import {
  LocalShipping,
  Autorenew,
  CreditCard,
  ArrowOutward,
  Whatshot,
} from "@mui/icons-material";
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
import ElectricCategory from "./ElectricCategory/ElectricCategory";

const highlights = [
  {
    icon: <LocalShipping />,
    title: "Giao hàng toàn quốc",
    desc: "Nhận hàng nhanh chóng, đóng gói gọn gàng và theo dõi đơn minh bạch.",
  },
  {
    icon: <Autorenew />,
    title: "Đổi trả rõ ràng",
    desc: "Hỗ trợ đổi hàng theo chính sách, phù hợp với thiết bị tập luyện.",
  },
  {
    icon: <CreditCard />,
    title: "Thanh toán linh hoạt",
    desc: "Nhiều phương thức thanh toán, xác nhận đơn nhanh chóng.",
  },
];

const editPicks = [
  {
    title: "Setup phòng gym mini",
    desc: "Danh sách dụng cụ cơ bản để tập tại nhà mà không cần mua quá nhiều.",
    tag: "Gợi ý nhanh",
    to: "/search?keyword=combo%20gym%20tai%20nha",
  },
  {
    title: "Phụ kiện tập bán chạy",
    desc: "Dây kháng lực, găng tay, thảm tập và các món dễ kết hợp hằng ngày.",
    tag: "Bán chạy",
    to: "/search?keyword=phu%20kien%20tap%20gym",
  },
  {
    title: "Blog cho người mới",
    desc: "Xem nhanh các hướng dẫn để chọn đúng dụng cụ trước khi mua.",
    tag: "Blog",
    to: "/search?keyword=tap%20luyen%20fitness",
  },
];

const sectionReveal = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { product } = useAppSelector((store) => store);

  useEffect(() => {
    dispatch(fetchTop10ProductDiscount());
    dispatch(fetchTop10Sold());
  }, [dispatch]);

  return (
    <div className="overflow-x-hidden bg-[#080808] text-white">
      {/* Banner chạy */}
      <div className="border-b border-orange-500/20 bg-gradient-to-r from-orange-500 to-orange-600 text-black">
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap py-3 text-center text-sm font-black uppercase tracking-[0.22em]"
        >
          Freeship đơn từ 300K • Combo gym tại nhà • Blog & khóa học cập nhật hàng tuần
        </motion.div>
      </div>

      <Hero />

      {/* Highlights */}
      <section className="border-b border-orange-500/10 bg-[#0c0c0c] px-5 py-10 lg:px-16">
        <div className="mx-auto grid max-w-[1280px] gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <motion.div
              key={item.title}
              variants={sectionReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-[1.75rem] border border-orange-500/15 bg-white/[0.03] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-black">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Category nhanh */}
      <section className="bg-[#080808] px-5 py-14 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-400">
                Chọn nhanh
              </p>
              <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">
                Các nhóm dụng cụ để bắt đầu tập luyện
              </h2>
            </div>
            <Button
              endIcon={<ArrowOutward />}
              onClick={() => navigate("/products/all")}
              sx={{
                color: "#fb923c",
                fontWeight: 700,
                textTransform: "none",
                alignSelf: "flex-start",
              }}
            >
              Xem tất cả sản phẩm
            </Button>
          </div>
          <ElectricCategory />
        </div>
      </section>

      {/* Editor picks */}
      <section className="bg-[#0d0d0d] px-5 py-14 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-400">
              Gợi ý từ hệ thống
            </p>
            <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">
              Lựa chọn nhanh giúp bạn mua sắm hiệu quả hơn
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {editPicks.map((item) => (
              <motion.button
                key={item.title}
                type="button"
                variants={sectionReveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                onClick={() => navigate(item.to)}
                className="rounded-[1.8rem] border border-orange-500/15 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 text-left transition hover:border-orange-400/40 hover:bg-white/[0.07]"
              >
                <span className="inline-flex rounded-full bg-orange-500 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-black">
                  {item.tag}
                </span>
                <h3 className="mt-5 text-2xl font-black text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.desc}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-orange-400">
                  Xem ngay <ArrowOutward sx={{ fontSize: 16 }} />
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Flash deal */}
      <section className="bg-[#080808] px-5 py-14 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-8 max-w-2xl">
            <div className="flex items-center gap-2 text-orange-400">
              <Whatshot sx={{ fontSize: 20 }} />
              <p className="text-xs font-bold uppercase tracking-[0.28em">
                Deal nổi bật
              </p>
            </div>
            <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">
              Ưu đãi tốt cho các sản phẩm đang được quan tâm
            </h2>
          </div>
          <FlashDealSlider flashDeals={product.topDiscount || []} />
        </div>
      </section>

      <section className="bg-[#0d0d0d] px-5 py-14 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <CategoryGrid />
        </div>
      </section>

      <section className="bg-[#080808] px-5 py-14 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <Deal products={product.topDiscount || []} />
        </div>
      </section>

      <section className="bg-[#0d0d0d] px-5 py-14 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <ShopByCategory />
        </div>
      </section>

      <TopSellersShowcase />
      <PartnerBrandsSection />
      <Footer />
    </div>
  );
};

export default Home;