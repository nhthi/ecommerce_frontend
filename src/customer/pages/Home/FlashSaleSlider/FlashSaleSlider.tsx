import { motion } from "framer-motion";
import { Chip, Button } from "@mui/material";
import { Bolt, LocalOffer } from "@mui/icons-material";
import { Product } from "../../../../types/ProductType";
import { formatCurrencyVND } from "../../../../utils/formatCurrencyVND";
import { useNavigate } from "react-router-dom";

const primary = "#0097e6";

export default function FlashDealSlider({
  flashDeals,
}: {
  flashDeals: Product[];
}) {
  const items = [...flashDeals, ...flashDeals]; // nhân đôi để chạy vòng
  const navigate = useNavigate();
  return (
    <section className="py-16 bg-gradient-to-r from-[#e1f5fe] to-[#f0faff]">
      {/* HEADER */}
      <div className="text-center mb-10">
        <Chip
          icon={<Bolt />}
          label="FLASH SALE"
          sx={{
            fontSize: "1rem",
            backgroundColor: primary,
            color: "white",
            fontWeight: 600,
            px: 1,
          }}
        />
        <h2 className="text-3xl font-bold mt-4" style={{ color: primary }}>
          Khuyến mãi nổi bật 🔥
        </h2>
      </div>

      {/* SLIDER XUYÊN MÀN HÌNH */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-6 px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 20, // tốc độ
            repeat: Infinity, // chạy mãi
            ease: "linear",
          }}
        >
          {items.map((deal, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl p-4 w-[260px] flex-shrink-0 cursor-pointer transition-transform hover:-translate-y-1"
              onClick={() =>
                navigate(
                  `/product-details/${deal.category?.categoryId}/${deal.title}/${deal.id}`
                )
              }
            >
              <div className="relative">
                <img
                  src={deal.images[0]}
                  alt={deal.title}
                  className="rounded-xl h-[180px] w-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#0097e6] text-white text-xs px-2 py-1 rounded-md shadow">
                  {deal.discountPercent}%
                </span>
              </div>
              <h3 className="font-semibold mt-3 line-clamp-2">{deal.title}</h3>
              <p className="text-[#0097e6] font-bold mt-1">
                {formatCurrencyVND(deal.sellingPrice)}
              </p>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  mt: 1,
                  borderColor: primary,
                  color: primary,
                  "&:hover": { backgroundColor: `${primary}15` },
                }}
                fullWidth
                startIcon={<LocalOffer />}
              >
                Mua ngay
              </Button>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
