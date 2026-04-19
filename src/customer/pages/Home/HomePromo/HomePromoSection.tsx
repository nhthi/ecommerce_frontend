import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type BannerItem = {
  id: number;
  image: string;
  to: string;
};

const banners: BannerItem[] = [
  {
    id: 1,
    image:
      "https://as2.ftcdn.net/jpg/02/95/92/27/1000_F_295922714_6SF80aLYKo9Fqj2LPc1K280S70mg9fk5.jpg",
    to: "/search?keyword=whey protein",
  },
  {
    id: 2,
    image:"https://file.hstatic.net/1000185761/file/r1-header_31f7b6ef22f04cea844bc880052639d3.jpg",
    to: "/search?keyword=Rule 1",
  },
  {
    id: 3,
    image:
      "https://nutritiondepot.vn/wp-content/uploads/2020/10/Myprotein-Impact-Whey-protein-banner-1400x572px-vn.webp",
    to: "/search?keyword=My protein",
  },
];

const AUTO_PLAY_MS = 4500;

const HomePromoSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeBanner = useMemo(() => banners[activeIndex], [activeIndex]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setActiveIndex(index);

  return (
    <section className="w-full">
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-[2rem]">
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/10 via-transparent to-black/10" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeBanner.id}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative cursor-pointer"
              onClick={() => navigate(activeBanner.to)}
            >
              <motion.img
                src={activeBanner.image}
                alt={`Banner ${activeBanner.id}`}
                className="block h-[180px] w-full object-cover sm:h-[220px] md:h-[280px] lg:h-[360px]"
                animate={{ scale: [1, 1.035, 1] }}
                transition={{
                  duration: AUTO_PLAY_MS / 1000,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-3 py-2 backdrop-blur-md">
            {banners.map((banner, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => goToSlide(index)}
                  className={[
                    "h-2.5 rounded-full transition-all duration-300",
                    isActive ? "w-8 bg-white" : "w-2.5 bg-white/55 hover:bg-white/80",
                  ].join(" ")}
                  aria-label={`Go to banner ${index + 1}`}
                />
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {banners
            .filter((_, index) => index !== activeIndex)
            .slice(0, 2)
            .map((banner, index) => (
              <motion.div
                key={banner.id}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.25 }}
                className="group cursor-pointer overflow-hidden rounded-[1.6rem]"
                onClick={() => navigate(banner.to)}
              >
                <div className="relative overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 z-10 bg-black/5 transition duration-300 group-hover:bg-black/0" />
                  <motion.img
                    src={banner.image}
                    alt={`Banner phụ ${index + 1}`}
                    className="block h-[140px] w-full object-cover sm:h-[170px] md:h-[190px] lg:h-[210px]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.45 }}
                  />
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default HomePromoSection;