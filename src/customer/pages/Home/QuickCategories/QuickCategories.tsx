import React from "react";
import { motion } from "framer-motion";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StorefrontIcon from "@mui/icons-material/Storefront";

const PartnerBrandsSection = () => {
  const logistics = [
    {
      name: "GHN Express",
      logo: "https://blog.abit.vn/wp-content/uploads/2020/05/tra-ma-van-don-giao-hang-nhanh7.jpg",
    },
    {
      name: "GHTK",
      logo: "https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/185093/Originals/ghtk-logo.png",
    },
    {
      name: "VNPost",
      logo: "https://upload.wikimedia.org/wikipedia/vi/2/2f/Vietnam_Post_logo.png",
    },
  ];

  const payments = [
    {
      name: "MoMo",
      logo: "https://homepage.momocdn.net/img/momo-upload-api-230421153213-638176879334000620.png",
    },
    {
      name: "ZaloPay",
      logo: "https://cdn.tgdd.vn/2020/04/GameApp/image-180x180.png",
    },
    {
      name: "Visa",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/960px-Visa_Inc._logo.svg.png",
    },
    {
      name: "MasterCard",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
    },
  ];

  const partners = [
    {
      name: "Samsung",
      logo: "https://images.samsung.com/is/image/samsung/assets/vn/about-us/brand/logo/mo/360_197_1.png?$720_N_PNG$",
    },
    {
      name: "LG",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/LG_logo_%282014%29.svg/1280px-LG_logo_%282014%29.svg.png",
    },
    {
      name: "Anker",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Anker_logo.svg/2560px-Anker_logo.svg.png",
    },
    {
      name: "Xiaomi",
      logo: "https://cdn.tgdd.vn/Files/2021/08/24/1377580/logo7tyxiaomi_2_1280x720-800-resize.jpg",
    },
  ];

  const sectionStyle =
    "flex flex-wrap justify-center items-center gap-10 md:gap-14 px-6 md:px-16";

  const renderBrandRow = (data: any[]) => (
    <div className={sectionStyle}>
      {data.map((b, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex flex-col items-center gap-2"
        >
          <img
            src={b.logo}
            alt={b.name}
            className="h-10 md:h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300"
          />
          <p className="text-[11px] md:text-xs text-gray-500">{b.name}</p>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section className="py-16 bg-gradient-to-r from-[#f0faff] to-[#e1f5fe] text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-[#0097e6] mb-10">
        Đối tác & Thương hiệu đồng hành
      </h2>

      {/* Logistics */}
      <div className="mb-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <LocalShippingIcon sx={{ color: "#0097e6" }} />
          <h3 className="text-lg md:text-xl font-semibold text-gray-700">
            Đối tác vận chuyển
          </h3>
        </div>
        {renderBrandRow(logistics)}
      </div>

      {/* Payments */}
      <div className="mb-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CreditCardIcon sx={{ color: "#0097e6" }} />
          <h3 className="text-lg md:text-xl font-semibold text-gray-700">
            Đối tác thanh toán
          </h3>
        </div>
        {renderBrandRow(payments)}
      </div>

      {/* Brands */}
      <div>
        <div className="flex items-center justify-center gap-2 mb-4">
          <StorefrontIcon sx={{ color: "#0097e6" }} />
          <h3 className="text-lg md:text-xl font-semibold text-gray-700">
            Thương hiệu đồng hành
          </h3>
        </div>
        {renderBrandRow(partners)}
      </div>
    </section>
  );
};

export default PartnerBrandsSection;
