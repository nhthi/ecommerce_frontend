import React from "react";
import { Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { ArrowOutward, AutoAwesome, Bolt, LocalFireDepartment } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";
import { RecommendedProductDto } from "../../../state/customer/recommendationSlice";

interface Props {
  items: RecommendedProductDto[];
  loading: boolean;
  error?: string | null;
}

const sourceLabelMap: Record<string, string> = {
  GUEST_POPULAR: "Phổ biến",
  USER_CF: "Dành riêng cho bạn",
  CONTENT_PURCHASE: "Liên quan đến mua sắm",
  CONTENT_CART: "Liên quan đến giỏ hàng",
  FALLBACK: "Gợi ý",
};

const sourceIconMap: Record<string, React.ReactNode> = {
  GUEST_POPULAR: <LocalFireDepartment sx={{ fontSize: 18 }} />,
  USER_CF: <AutoAwesome sx={{ fontSize: 18 }} />,
  CONTENT_PURCHASE: <Bolt sx={{ fontSize: 18 }} />,
  CONTENT_CART: <Bolt sx={{ fontSize: 18 }} />,
  FALLBACK: <AutoAwesome sx={{ fontSize: 18 }} />,
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);

const buildProductPath = (item: RecommendedProductDto) =>
  `/product-details/${item.title.replaceAll("/", "_")}/${item.productId}`;

const HomeRecommendationSection = ({ items, loading, error }: Props) => {
  const navigate = useNavigate();
  const { isDark } = useSiteThemeMode();

  const featured = items[0];
  const secondary = items.slice(1, 5);

  const pageClass = isDark ? "bg-[#080808]" : "bg-[#f6f7fb]";
  const heroCardClass = isDark
    ? "border border-white/10 bg-[linear-gradient(145deg,rgba(249,115,22,0.16),rgba(255,255,255,0.04))] text-white"
    : "border border-slate-200 bg-[linear-gradient(145deg,rgba(249,115,22,0.12),rgba(255,255,255,0.96))] text-slate-900";
  const subCardClass = isDark
    ? "border border-white/10 bg-white/[0.03] text-white"
    : "border border-slate-200 bg-white text-slate-900";
  const mutedClass = isDark ? "text-slate-300" : "text-slate-600";

  return (
    <section className={`${pageClass} px-5 py-14 lg:px-16`}>
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-400">Đề xuất cho bạn</p>
            <h2 className={isDark ? "mt-2 text-3xl font-black text-white md:text-[2.2rem]" : "mt-2 text-3xl font-black text-slate-900 md:text-[2.2rem]"}>
              Gợi ý mua nhanh, nhìn là muốn bấm xem ngay
            </h2>
          </div>
          
        </div>

        {loading ? (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 0 }} className={subCardClass}>
            <Stack alignItems="center" spacing={1.2}>
              <CircularProgress size={26} />
              <Typography>Đang tải...</Typography>
            </Stack>
          </Paper>
        ) : error ? (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 0 }} className={subCardClass}>
            <Typography color="error">{error}</Typography>
          </Paper>
        ) : !featured ? null : (
          <div className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr]">
            <motion.button
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.24 }}
              onClick={() => navigate(buildProductPath(featured))}
              className={`group relative overflow-hidden p-0 text-left ${heroCardClass}`}
            >
              <div className="grid min-h-[420px] md:grid-cols-[1.05fr_0.95fr]">
                <div className="flex flex-col justify-between p-6 md:p-8">
                  <div>
                    <div className="mb-4 inline-flex items-center gap-2 border border-orange-500/25 bg-orange-500/12 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-orange-300">
                      {sourceIconMap[featured.source] || <AutoAwesome sx={{ fontSize: 18 }} />}
                      <span>{sourceLabelMap[featured.source] || "Gợi ý"}</span>
                    </div>
                    <h3 className="max-w-[15ch] text-3xl font-black leading-tight md:text-[2.35rem]">{featured.title}</h3>
                <p className={`mt-4 max-w-[48ch] text-sm leading-7 ${mutedClass}`}>
  Sản phẩm này được hiển thị nổi bật để bạn dễ dàng nhận thấy, với mức giá rõ ràng và lý do gợi ý phù hợp.
</p>
                  </div>

                  <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <div className="text-2xl font-black text-orange-400 md:text-3xl">{formatPrice(featured.sellingPrice)}</div>
                      <div className={`mt-1 text-sm line-through ${mutedClass}`}>{formatPrice(featured.mrpPrice)}</div>
                    </div>
                    <div className="inline-flex items-center gap-2 border border-orange-500/25 bg-black/30 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-white transition-transform duration-200 group-hover:translate-x-1">
                      Xem chi tiết
                      <ArrowOutward sx={{ fontSize: 18 }} />
                    </div>
                  </div>
                </div>

                <div className="relative min-h-[260px] overflow-hidden">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.28))]" />
                </div>
              </div>
            </motion.button>

            <div className="grid gap-4 sm:grid-cols-2">
              {secondary.map((item, index) => (
                <motion.button
                  key={item.productId}
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  onClick={() => navigate(buildProductPath(item))}
                  className={`group overflow-hidden p-0 text-left ${subCardClass}`}
                >
                  <div className="flex h-full flex-col">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-orange-400">
                        {sourceIconMap[item.source] || <AutoAwesome sx={{ fontSize: 16 }} />}
                        <span>{sourceLabelMap[item.source] || "Goi y"}</span>
                      </div>
                      <h3 className="min-h-[3.4rem] text-base font-black leading-7">{item.title}</h3>
                      <div className="mt-auto pt-4">
                        <div className="text-lg font-black text-orange-400">{formatPrice(item.sellingPrice)}</div>
                        <div className={`mt-1 text-sm line-through ${mutedClass}`}>{formatPrice(item.mrpPrice)}</div>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeRecommendationSection;

