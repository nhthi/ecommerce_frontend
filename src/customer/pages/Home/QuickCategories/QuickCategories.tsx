import React from "react";
import { motion } from "framer-motion";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { useSiteThemeMode } from "../../../../Theme/SiteThemeProvider";

const supportBlocks = [
  {
    icon: <LocalShippingIcon sx={{ color: "#fb923c" }} />,
    title: "Vận chuyển",
    items: ["Giao hàng toàn quốc", "Theo dõi đơn hàng", "Đóng gói gọn gàng"],
  },
  {
    icon: <CreditCardIcon sx={{ color: "#fb923c" }} />,
    title: "Thanh toán",
    items: ["Chuyển khoản", "Thanh toán khi nhận hàng", "Xác nhận đơn nhanh"],
  },
  {
    icon: <VerifiedUserIcon sx={{ color: "#fb923c" }} />,
    title: "Hỗ trợ",
    items: ["Câu hỏi thường gặp (FAQ)", "Quy định đổi trả", "Tư vấn trước khi mua"],
  },
];

const PartnerBrandsSection = () => {
  const { isDark } = useSiteThemeMode();

  return (
    <section
      className={
        isDark
          ? "bg-[#0d0d0d] px-5 py-14 lg:px-16"
          : "bg-white px-5 py-14 lg:px-16"
      }
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-400">
              Hỗ trợ mua hàng
            </p>
            <h2
              className={
                isDark
                  ? "mt-2 text-3xl font-black text-white md:text-4xl"
                  : "mt-2 text-3xl font-black text-slate-900 md:text-4xl"
              }
            >
              Thông tin cần thiết
            </h2>
          </div>
          <p
            className={
              isDark
                ? "max-w-xl text-sm text-slate-400"
                : "max-w-xl text-sm text-slate-600"
            }
          >
            Giải đáp nhanh các thắc mắc trước khi mua, giúp trải nghiệm mua sắm gọn gàng và dễ hiểu hơn.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {supportBlocks.map((block, index) => (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className={
                isDark
                  ? "rounded-[1.8rem] border border-orange-500/15 bg-white/[0.03] p-6"
                  : "rounded-[1.8rem] border border-slate-200 bg-[#fffaf6] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
              }
            >
              <div
                className={
                  isDark
                    ? "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5"
                    : "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50"
                }
              >
                {block.icon}
              </div>

              <h3
                className={
                  isDark
                    ? "text-xl font-black text-white"
                    : "text-xl font-black text-slate-900"
                }
              >
                {block.title}
              </h3>

              <div className="mt-4 space-y-2">
                {block.items.map((item) => (
                  <div
                    key={item}
                    className={
                      isDark
                        ? "rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-slate-200"
                        : "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                    }
                  >
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerBrandsSection;