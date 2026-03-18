import React from "react";
import { motion } from "framer-motion";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const supportBlocks = [
  {
    icon: <LocalShippingIcon sx={{ color: "#fb923c" }} />,
    title: "Vận chuyển",
    items: [
      "Giao hàng toàn quốc",
      "Có theo dõi đơn hàng",
      "Đóng gói gọn gàng",
    ],
  },
  {
    icon: <CreditCardIcon sx={{ color: "#fb923c" }} />,
    title: "Thanh toán",
    items: [
      "Chuyển khoản",
      "Thanh toán khi nhận hàng (COD)",
      "Xác nhận đơn nhanh",
    ],
  },
  {
    icon: <VerifiedUserIcon sx={{ color: "#fb923c" }} />,
    title: "Hỗ trợ mua hàng",
    items: [
      "Câu hỏi thường gặp (FAQ)",
      "Quy định đổi hàng",
      "Tư vấn trước khi mua",
    ],
  },
];

const PartnerBrandsSection = () => {
  return (
    <section className="bg-[#0d0d0d] px-5 py-14 lg:px-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-400">
            Hỗ trợ mua hàng
          </p>
          <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">
            Thông tin cần thiết được trình bày rõ ràng
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {supportBlocks.map((block, index) => (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="rounded-[1.8rem] border border-orange-500/15 bg-white/[0.03] p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                {block.icon}
              </div>

              <h3 className="text-xl font-black text-white">
                {block.title}
              </h3>

              <div className="mt-4 space-y-2">
                {block.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-slate-200"
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