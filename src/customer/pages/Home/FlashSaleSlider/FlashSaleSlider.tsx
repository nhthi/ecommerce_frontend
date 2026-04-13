import { motion } from "framer-motion";
import { Chip, Button } from "@mui/material";
import { Bolt, LocalOffer } from "@mui/icons-material";
import { Product } from "../../../../types/ProductType";
import { formatCurrencyVND } from "../../../../utils/formatCurrencyVND";
import { useNavigate } from "react-router-dom";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

export default function FlashDealSlider({
  flashDeals,
}: {
  flashDeals: Product[];
}) {
  const items = [...flashDeals, ...flashDeals];
  const navigate = useNavigate();
  const { isDark } = useSiteThemeMode();

  return (
    <section className={isDark ? "rounded-[2rem] border border-orange-500/15 bg-[#101010] px-4 py-10 md:px-6" : "rounded-[2rem] border border-slate-200 bg-white px-4 py-10 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:px-6"}>
      <div className="mb-8 text-center">
        <Chip
          icon={<Bolt />}
          label="FLASH DEAL"
          sx={{
            fontSize: "0.9rem",
            backgroundColor: "#f97316",
            color: "#050505",
            fontWeight: 800,
            px: 1,
          }}
        />
        <h2 className={isDark ? "mt-4 text-3xl font-black text-white" : "mt-4 text-3xl font-black text-slate-900"}>
          Sản phẩm đang giảm giá nhanh
        </h2>
      </div>

      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-5 px-1"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {items.map((deal, i) => (
            <button
              key={i}
              type="button"
              className={isDark ? "w-[260px] flex-shrink-0 rounded-[1.6rem] border border-orange-500/15 bg-[#171717] p-4 text-left transition hover:-translate-y-1" : "w-[260px] flex-shrink-0 rounded-[1.6rem] border border-slate-200 bg-white p-4 text-left shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-orange-300"}
              onClick={() =>
                navigate(
                  `/product-details/${deal.title}/${deal.id}`
                )
              }
            >
              <div className="relative">
                <img
                  src={deal.images[0]}
                  alt={deal.title}
                  className="h-[180px] w-full rounded-[1.2rem] object-cover"
                />
                <span className="absolute left-3 top-3 rounded-md bg-orange-500 px-2 py-1 text-xs font-bold text-black shadow">
                  {deal.discountPercent}%
                </span>
              </div>
              <h3 className={isDark ? "mt-3 line-clamp-2 font-semibold text-white" : "mt-3 line-clamp-2 font-semibold text-slate-900"}>{deal.title}</h3>
              <p className="mt-1 font-black text-orange-400">
                {formatCurrencyVND(deal.sellingPrice)}
              </p>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  mt: 1.5,
                  borderColor: "#f97316",
                  color: isDark ? "#fb923c" : "#ea580c",
                  borderRadius: "999px",
                  fontWeight: 700,
                  backgroundColor: isDark ? "transparent" : "rgba(255,255,255,0.82)",
                  "&:hover": { backgroundColor: "rgba(249,115,22,0.08)", borderColor: "#fb923c" },
                }}
                fullWidth
                startIcon={<LocalOffer />}
              >
                Xem deal
              </Button>
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
