import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mui/material";
import {
  ArrowOutward,
  FitnessCenter,
  PlayArrow,
  Schedule,
  TrendingUp,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { TrainingSchedule } from "../../Training/trainingData";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

const getEmbedUrl = (url?: string) => {
  if (!url) return null;

  try {
    const directYoutube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/i);
    if (directYoutube?.[1]) {
      return `https://www.youtube.com/embed/${directYoutube[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${directYoutube[1]}&modestbranding=1&rel=0`;
    }

    const embedYoutube = url.match(/youtube\.com\/embed\/([^&?/]+)/i);
    if (embedYoutube?.[1]) {
      return `https://www.youtube.com/embed/${embedYoutube[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${embedYoutube[1]}&modestbranding=1&rel=0`;
    }

    return null;
  } catch (error) {
    return null;
  }
};

const HomeTrainingSection = ({ items }: { items: TrainingSchedule[] }) => {
  const navigate = useNavigate();
  const { isDark } = useSiteThemeMode();
  const [activeIndex, setActiveIndex] = useState(0);

  const safeIndex = Math.min(activeIndex, Math.max(items.length - 1, 0));
  const activeItem = items[safeIndex];

  const activeVideoUrl = useMemo(() => {
    return activeItem?.trainingDays?.[0]?.exercises?.find((exercise) => exercise.videoUrl)?.videoUrl;
  }, [activeItem]);

  const embedUrl = useMemo(() => getEmbedUrl(activeVideoUrl), [activeVideoUrl]);

  if (items.length === 0 || !activeItem) return null;

  return (
    <section className={isDark ? "bg-[#101010] px-5 py-16 lg:px-16" : "bg-[linear-gradient(180deg,#fffdf8_0%,#f8f3eb_100%)] px-5 py-16 lg:px-16"}>
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-400">
              Lich tap noi bat
            </p>
            <h2 className={isDark ? "mt-2 text-3xl font-black text-white md:text-4xl" : "mt-2 text-3xl font-black text-slate-900 md:text-4xl"}>
              Chon lich tap qua phan xem nhanh
            </h2>
          </div>
          <Button
            endIcon={<ArrowOutward />}
            onClick={() => navigate("/training")}
            sx={{ color: "#fb923c", fontWeight: 700, textTransform: "none", alignSelf: "flex-start" }}
          >
            Xem tat ca lich tap
          </Button>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
          <div className={isDark ? "overflow-hidden rounded-[2rem] border border-white/8 bg-black" : "overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.10)]"}>
            <div className="relative aspect-[16/9] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0.55, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.4 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                >
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={activeItem.title}
                      className="h-full w-full"
                      allow="autoplay; encrypted-media; picture-in-picture"
                    />
                  ) : (
                    <img
                      src={activeItem.cover}
                      alt={activeItem.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute left-6 top-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-orange-500 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-100">
                  {activeItem.goal}
                </span>
                <span className="rounded-full border border-white/18 bg-black/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-100 backdrop-blur-sm">
                  {activeItem.level}
                </span>
                {embedUrl ? (
                  <span className="rounded-full border border-white/18 bg-black/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-100 backdrop-blur-sm">
                    Video preview
                  </span>
                ) : null}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                <h3 className="max-w-2xl text-3xl font-black text-slate-100 md:text-4xl">
                  {activeItem.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-100 md:text-[15px]">
                  {activeItem.summary}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-100">
                  <span className="inline-flex items-center gap-2">
                    <Schedule sx={{ fontSize: 18, color: "#fb923c" }} />
                    {activeItem.durationWeeks} tuan
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <FitnessCenter sx={{ fontSize: 18, color: "#fb923c" }} />
                    {activeItem.sessionsPerWeek} buoi moi tuan
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <TrendingUp sx={{ fontSize: 18, color: "#fb923c" }} />
                    {activeItem.sessionLength}
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={() => navigate(`/training/${activeItem.slug}`)}
                    sx={{
                      borderRadius: "999px",
                      px: 3,
                      py: 1.1,
                      textTransform: "none",
                      fontWeight: 800,
                      background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                      color: "#050505",
                    }}
                  >
                    Xem chi tiet lich tap
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => {
              const isActive = index === safeIndex;
              const previewExercise = item.trainingDays?.[0]?.exercises?.[0];

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  whileHover={{ x: 4 }}
                  onClick={() => setActiveIndex(index)}
                  className={isActive
                    ? isDark
                      ? "w-full rounded-[1.6rem] border border-orange-400/40 bg-orange-500/10 p-4 text-left"
                      : "w-full rounded-[1.6rem] border border-orange-300 bg-orange-50 p-4 text-left shadow-[0_18px_40px_rgba(249,115,22,0.12)]"
                    : isDark
                      ? "w-full rounded-[1.6rem] border border-white/8 bg-[#151515] p-4 text-left transition hover:border-orange-400/20"
                      : "w-full rounded-[1.6rem] border border-slate-200 bg-white/92 p-4 text-left shadow-[0_14px_34px_rgba(15,23,42,0.06)] transition hover:border-orange-200"
                  }
                >
                  <div className="flex items-start gap-3">
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl">
                      <img
                        src={previewExercise?.imageUrl || item.cover}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                      <div className={isDark ? "absolute inset-0 bg-black/20" : "absolute inset-0 bg-slate-900/12"} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={isDark ? "flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm" : "flex h-8 w-8 items-center justify-center rounded-full bg-white/88 text-slate-900 shadow-sm backdrop-blur-sm"}>
                          <PlayArrow sx={{ fontSize: 18 }} />
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-400">
                        <span>{item.goal}</span>
                        <span className={isDark ? "text-slate-500" : "text-slate-400"}>/</span>
                        <span>{item.level}</span>
                      </div>
                      <h3 className={isDark ? "line-clamp-2 text-lg font-black text-white" : "line-clamp-2 text-lg font-black text-slate-900"}>
                        {item.title}
                      </h3>
                      <p className={isDark ? "mt-2 line-clamp-2 text-sm text-slate-400" : "mt-2 line-clamp-2 text-sm text-slate-600"}>
                        {previewExercise?.name || item.summary}
                      </p>
                      <div className={isDark ? "mt-3 flex flex-wrap gap-3 text-xs text-slate-400" : "mt-3 flex flex-wrap gap-3 text-xs text-slate-500"}>
                        <span>{item.sessionsPerWeek} buoi / tuan</span>
                        <span>{item.sessionLength}</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeTrainingSection;
