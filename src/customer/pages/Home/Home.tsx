import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import {
  ArrowOutward,
  LocalShipping,
  Autorenew,
  CreditCard,
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
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";
import CouponSpotlight from "./CouponSpotlight/CouponSpotlight";
import { fetchAllCoupons } from "../../../state/admin/adminCouponSlice";
import HomeBlogSection from "./HomeBlogSection/HomeBlogSection";
import HomeTrainingSection from "./HomeTrainingSection/HomeTrainingSection";
import { fetchAllBlogPosts } from "../../../state/admin/adminBlogPostSlice";
import { fetchAllWorkoutPlans } from "../../../state/admin/adminWorkoutPlanSlice";
import { fetchAllWorkoutPlanDays } from "../../../state/admin/adminWorkoutPlanDaySlice";
import { mapWorkoutPlansToTrainingSchedules } from "../Training/trainingData";

const trustItems = [
  {
    icon: <LocalShipping />,
    title: "Freeship tu 300K",
    desc: "Giao hang toan quoc",
  },
  {
    icon: <Autorenew />,
    title: "Doi tra ro rang",
    desc: "Xu ly nhanh theo chinh sach",
  },
  {
    icon: <CreditCard />,
    title: "Thanh toan linh hoat",
    desc: "COD va chuyen khoan",
  },
];

const quickPicks = [
  {
    tag: "Tai nha",
    title: "Setup phong gym mini",
    desc: "Combo cho nguoi muon bat dau gon gon.",
    to: "/search?keyword=combo%20gym%20tai%20nha",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
  },
  {
    tag: "Ban chay",
    title: "Phu kien tap gym",
    desc: "Gang tay, day khang luc, tham tap.",
    to: "/search?keyword=phu%20kien%20tap%20gym",
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80",
  },
  {
    tag: "Blog",
    title: "Kien thuc cho nguoi moi",
    desc: "Doc nhanh truoc khi mua dung cu.",
    to: "/blog",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
  },
];

const lookbookSets = [
  {
    title: "Set tap gym co ban",
    to: "/search?keyword=set%20tap%20gym",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Cardio tai nha",
    to: "/search?keyword=may%20cardio",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Phuc hoi va mobility",
    to: "/search?keyword=yoga%20fitness",
    image:
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=900&q=80",
  },
];

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { product, coupon, blogPost, adminWorkoutPlan, adminWorkoutPlanDay } = useAppSelector((store) => store);
  const { isDark } = useSiteThemeMode();

  useEffect(() => {
    dispatch(fetchTop10ProductDiscount());
    dispatch(fetchTop10Sold());
    dispatch(fetchAllCoupons());
    dispatch(fetchAllBlogPosts());
    dispatch(fetchAllWorkoutPlans());
    dispatch(fetchAllWorkoutPlanDays());
  }, [dispatch]);

  const featuredPosts = useMemo(
    () =>
      blogPost.posts
        .filter((item) => item.status === "PUBLISHED")
        .slice()
        .sort((a, b) => {
          const first = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const second = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return second - first;
        })
        .slice(0, 3),
    [blogPost.posts],
  );

  const featuredTrainingSchedules = useMemo(
    () =>
      mapWorkoutPlansToTrainingSchedules(
        adminWorkoutPlan.workoutPlans,
        adminWorkoutPlanDay.workoutPlanDays,
      )
        .slice()
        .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
        .slice(0, 3),
    [adminWorkoutPlan.workoutPlans, adminWorkoutPlanDay.workoutPlanDays],
  );

  return (
    <div className={isDark ? "overflow-x-hidden bg-[#080808] text-white" : "overflow-x-hidden bg-[#f6f7fb] text-slate-900"}>
      <div className="border-b border-orange-500/20 bg-gradient-to-r from-orange-500 to-orange-600 text-black">
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap py-3 text-center text-sm font-black uppercase tracking-[0.22em]"
        >
          Freeship don tu 300K / Flash deal cap nhat lien tuc / Blog va lich tap moi moi tuan
        </motion.div>
      </div>

      <Hero />

      <section className={isDark ? "border-b border-orange-500/10 bg-[#0c0c0c] px-5 py-8 lg:px-16" : "border-b border-slate-200 bg-white px-5 py-8 lg:px-16"}>
        <div className="mx-auto grid max-w-[1280px] gap-4 md:grid-cols-3">
          {trustItems.map((item) => (
            <motion.div
              key={item.title}
              variants={sectionReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className={isDark ? "rounded-[1.5rem] border border-orange-500/15 bg-white/[0.03] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)]" : "rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-black">
                {item.icon}
              </div>
              <h3 className={isDark ? "text-base font-black text-white" : "text-base font-black text-slate-900"}>{item.title}</h3>
              <p className={isDark ? "mt-1 text-sm text-slate-300" : "mt-1 text-sm text-slate-600"}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={isDark ? "bg-[#080808] px-5 py-14 lg:px-16" : "bg-[#f6f7fb] px-5 py-14 lg:px-16"}>
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-400">
                Shop nhanh
              </p>
              <h2 className={isDark ? "mt-2 text-3xl font-black text-white md:text-4xl" : "mt-2 text-3xl font-black text-slate-900 md:text-4xl"}>
                Ban dang tim gi?
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
              Xem tat ca
            </Button>
          </div>
          <ElectricCategory />
        </div>
      </section>

      <section className={isDark ? "bg-[#0d0d0d] px-5 py-14 lg:px-16" : "bg-white px-5 py-14 lg:px-16"}>
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-400">
                Chon nhanh
              </p>
              <h2 className={isDark ? "mt-2 text-3xl font-black text-white md:text-4xl" : "mt-2 text-3xl font-black text-slate-900 md:text-4xl"}>
                Goi y mua sam
              </h2>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {quickPicks.map((item) => (
              <motion.button
                key={item.title}
                type="button"
                variants={sectionReveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                onClick={() => navigate(item.to)}
                className={isDark ? "group overflow-hidden rounded-[1.8rem] border border-orange-500/15 bg-[#151515] text-left transition hover:border-orange-400/35" : "group overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white text-left shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition hover:border-orange-300"}
              >
                <img src={item.image} alt={item.title} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <span className="inline-flex rounded-full bg-orange-500 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-black">
                    {item.tag}
                  </span>
                  <h3 className={isDark ? "mt-4 text-2xl font-black text-white" : "mt-4 text-2xl font-black text-slate-900"}>{item.title}</h3>
                  <p className={isDark ? "mt-2 text-sm leading-6 text-slate-300" : "mt-2 text-sm leading-6 text-slate-600"}>{item.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <CouponSpotlight coupons={coupon.coupons} loading={coupon.loading} />
      <HomeBlogSection posts={featuredPosts} />
      <HomeTrainingSection items={featuredTrainingSchedules} />

      <section className={isDark ? "bg-[#080808] px-5 py-14 lg:px-16" : "bg-[#f6f7fb] px-5 py-14 lg:px-16"}>
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-8 max-w-2xl">
            <div className="flex items-center gap-2 text-orange-400">
              <Whatshot sx={{ fontSize: 20 }} />
              <p className="text-xs font-bold uppercase tracking-[0.28em]">
                Outlet sale
              </p>
            </div>
            <h2 className={isDark ? "mt-2 text-3xl font-black text-white md:text-4xl" : "mt-2 text-3xl font-black text-slate-900 md:text-4xl"}>
              Mua nhanh keo het
            </h2>
          </div>
          <FlashDealSlider flashDeals={product.topDiscount || []} />
        </div>
      </section>

      <section className={isDark ? "bg-[#0d0d0d] px-5 py-14 lg:px-16" : "bg-white px-5 py-14 lg:px-16"}>
        <div className="mx-auto max-w-[1280px]">
          <Deal products={product.topDiscount || []} />
        </div>
      </section>

      <section className={isDark ? "bg-[#080808] px-5 py-14 lg:px-16" : "bg-[#f6f7fb] px-5 py-14 lg:px-16"}>
        <div className="mx-auto max-w-[1280px]">
          <CategoryGrid />
        </div>
      </section>

      <section className={isDark ? "bg-[#0d0d0d] px-5 py-14 lg:px-16" : "bg-white px-5 py-14 lg:px-16"}>
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-400">
                Set do cho ban
              </p>
              <h2 className={isDark ? "mt-2 text-3xl font-black text-white md:text-4xl" : "mt-2 text-3xl font-black text-slate-900 md:text-4xl"}>
                Goi y theo muc tieu tap
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {lookbookSets.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => navigate(item.to)}
                className="group relative overflow-hidden rounded-[1.9rem] text-left"
              >
                <img src={item.image} alt={item.title} className="h-[360px] w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-2xl font-black text-white">{item.title}</h3>
                  <span className="mt-4 inline-flex rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                    Xem chi tiet
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={isDark ? "bg-[#080808] px-5 py-14 lg:px-16" : "bg-[#f6f7fb] px-5 py-14 lg:px-16"}>
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
