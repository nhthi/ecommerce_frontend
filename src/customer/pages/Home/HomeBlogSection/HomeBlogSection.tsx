import React from "react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import { ArrowOutward, CalendarMonth, VisibilityOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { BlogPost } from "../../../../types/BlogType";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

const formatDate = (value?: string | null) => {
  if (!value) return "Chua cap nhat";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const stripHtml = (html?: string) => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
};

const normalizeBlogSlug = (slug?: string | null) => (slug || "").replace(/^#+/, "");

const HomeBlogSection = ({ posts }: { posts: BlogPost[] }) => {
  const navigate = useNavigate();
  const { isDark } = useSiteThemeMode();

  if (posts.length === 0) return null;

  return (
    <section className={isDark ? "bg-[#080808] px-5 py-14 lg:px-16" : "bg-[#f6f7fb] px-5 py-14 lg:px-16"}>
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-400">
              Blog noi bat
            </p>
            <h2 className={isDark ? "mt-2 text-3xl font-black text-white md:text-4xl" : "mt-2 text-3xl font-black text-slate-900 md:text-4xl"}>
              Bai viet moi va de doc nhanh
            </h2>
          </div>
          <Button
            endIcon={<ArrowOutward />}
            onClick={() => navigate("/blog")}
            sx={{ color: "#fb923c", fontWeight: 700, textTransform: "none", alignSelf: "flex-start" }}
          >
            Xem blog
          </Button>
        </div>

        <div className="space-y-4">
          {posts.map((post, index) => {
            const excerpt =
              post.shortDescription?.trim() ||
              stripHtml(post.content).slice(0, 140) ||
              "Bai viet dang duoc cap nhat noi dung.";

            return (
              <motion.button
                key={post.id}
                type="button"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                onClick={() => navigate(`/blog/${normalizeBlogSlug(post.slug)}`)}
                className={isDark ? "group flex w-full flex-col overflow-hidden rounded-[1.6rem] border border-white/8 bg-[#101010] text-left transition hover:border-orange-400/30 md:flex-row" : "group flex w-full flex-col overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white text-left shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition hover:border-orange-300 md:flex-row"}
              >
                <div className="h-44 w-full shrink-0 overflow-hidden md:h-auto md:w-[240px]">
                  <img
                    src={post.thumbnailUrl || post.category?.imageUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80"}
                    alt={post.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-orange-400">
                      <span>{post.category?.name || "Blog fitness"}</span>
                      <span className={isDark ? "text-slate-500" : "text-slate-400"}>/</span>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <h3 className={isDark ? "text-2xl font-black text-white" : "text-2xl font-black text-slate-900"}>
                      {post.title}
                    </h3>
                    <p className={isDark ? "mt-3 max-w-3xl text-sm leading-7 text-slate-300" : "mt-3 max-w-3xl text-sm leading-7 text-slate-600"}>
                      {excerpt}
                    </p>
                  </div>

                  <div className={isDark ? "mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400" : "mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500"}>
                    <span className="inline-flex items-center gap-2">
                      <CalendarMonth sx={{ fontSize: 17, color: "#fb923c" }} />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <VisibilityOutlined sx={{ fontSize: 17, color: "#fb923c" }} />
                      {post.viewCount || 0} luot xem
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeBlogSection;
