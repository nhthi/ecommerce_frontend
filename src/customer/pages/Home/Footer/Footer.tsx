import React from "react";
import {
  Box,
  Divider,
  Link,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import FacebookIcon from "@mui/icons-material/Facebook";
import Groups3Icon from "@mui/icons-material/Groups3";
import BusinessIcon from "@mui/icons-material/Business";

const Footer = () => {
  // Thông tin giả dùng để hiển thị — bạn có thể sửa bất kỳ dòng nào
  const company = {
    name: "Beki Marketplace",
    address: "Số 123 Lý Tự Trọng, Phường Hòa Khánh, TP. Đà Nẵng",
    taxId: "MST: 010-9876-543",
    supportEmail: "support@beki-marketplace.vn",
    salesEmail: "sales@beki-marketplace.vn",
    phone: "028 3941 2200",
    hotline: "1900 1234",
    hours: "T2–T7: 08:00 - 20:00 (CN: 09:00 - 17:00)",
  };

  const partners = [
    {
      name: "FinTrust",
      logo: "https://cellphones.com.vn/sforum/wp-content/uploads/2021/10/okiu.jpg",
    },
    {
      name: "Giao hàng nhanh",
      logo: "https://play-lh.googleusercontent.com/R6Kzs8sI4-yEqn-o1TVl70l7Adv3M3OHdvT5ZI1knjAfih7zM50XU3UZX0UJy1G2DnM",
    },
    {
      name: "Giao hàng tiết kiệm",
      logo: "https://blog.abit.vn/wp-content/uploads/2020/05/giao-hang-tiet-kiem16-1.png",
    },
    {
      name: "BrandHub",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzHMVvHBYAuko_X6HDacSxi_BItDFU4H5G2A&s",
    },
    {
      name: "Momo",
      logo: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
    },

    {
      name: "VN Pay",
      logo: "https://yt3.googleusercontent.com/JM1m2wng0JQUgSg9ZSEvz7G4Rwo7pYb4QBYip4PAhvGRyf1D_YTbL2DdDjOy0qOXssJPdz2r7Q=s900-c-k-c0x00ffffff-no-rj",
    },
  ];

  return (
    <Box className="bg-gray-50 text-gray-800 mt-12">
      <Divider sx={{ mb: 4 }} />

      <Box className="flex flex-wrap justify-around px-8 md:px-16 lg:px-24 py-10 gap-10">
        {/* Column 1: Company & Address */}
        <Box className="flex flex-col gap-y-3 max-w-sm" data-aos="fade-up">
          <Typography className="flex items-center gap-2 text-xl font-semibold pl-2">
            <BusinessIcon color="primary" />
            <span>{company.name}</span>
          </Typography>

          <Typography variant="body2" color="textSecondary">
            <strong>Địa chỉ:</strong> {company.address}
          </Typography>

          <Typography variant="body2" color="textSecondary">
            <strong>{company.taxId}</strong>
          </Typography>

          <Box className="mt-3">
            <Typography variant="subtitle2" className="font-semibold mb-1">
              Giờ hỗ trợ khách hàng
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {company.hours}
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mt-1">
              <strong>Hotline:</strong> {company.hotline} — <strong>VP:</strong>{" "}
              {company.phone}
            </Typography>
          </Box>
        </Box>

        {/* Column 2: Quick links & policies */}
        <Box
          className="flex flex-col gap-y-3"
          data-aos="fade-up"
          data-aos-delay="120"
        >
          <Typography className="text-xl font-semibold border-l-[4px] border-primary pl-2">
            Hỗ trợ & Chính sách
          </Typography>

          <Box className="flex flex-col gap-y-2">
            <Link href="/help-center" underline="hover">
              Trung tâm trợ giúp
            </Link>
            <Link href="/shipping-policy" underline="hover">
              Chính sách vận chuyển
            </Link>
            <Link href="/return-policy" underline="hover">
              Chính sách đổi trả
            </Link>
            <Link href="/seller-policy" underline="hover">
              Hướng dẫn người bán
            </Link>
            <Link href="/privacy" underline="hover">
              Chính sách bảo mật
            </Link>
            <Link href="/terms" underline="hover">
              Điều khoản & Điều kiện
            </Link>
          </Box>
        </Box>

        {/* Column 3: Contact & Team */}
        <Box
          className="flex flex-col gap-y-3"
          data-aos="fade-up"
          data-aos-delay="240"
        >
          <Typography className="text-xl font-semibold border-l-[4px] border-primary pl-2">
            Liên hệ nhanh
          </Typography>

          <Typography className="flex items-center gap-x-2">
            <EmailIcon color="primary" />
            <Link href={`mailto:${company.supportEmail}`} underline="hover">
              {company.supportEmail}
            </Link>
          </Typography>

          <Typography className="flex items-center gap-x-2">
            <LocalPhoneIcon color="primary" />
            <span>{company.hotline}</span>
          </Typography>

          <Typography className="text-xl font-semibold border-l-[4px] border-primary pl-2 mt-3">
            Nhóm phát triển
          </Typography>
          <Typography className="flex items-center gap-x-2">
            <Groups3Icon color="primary" />
            <Link href="/dev-profile" underline="hover">
              Xem đội ngũ
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Partners */}
      <Box className="px-6 md:px-16 lg:px-24 py-6">
        <Typography className="text-center text-sm text-gray-600 mb-4">
          Đối tác vận chuyển & thanh toán
        </Typography>
        <Box className="flex items-center justify-center gap-6 flex-wrap">
          {partners.map((p, i) => (
            <Box key={i} className="p-2 rounded-md bg-white/70 shadow-sm">
              <img src={p.logo} alt={p.name} style={{ height: 36 }} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Social Icons */}
      <Box className="bg-primary py-4">
        <Box className="flex items-center justify-center gap-x-6">
          <Tooltip title="Facebook">
            <IconButton
              href="https://facebook.com/beki.marketplace"
              target="_blank"
              sx={{
                backgroundColor: "white",
                color: "primary.main",
                "&:hover": { backgroundColor: "primary.main", color: "white" },
              }}
            >
              <FacebookIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Instagram">
            <IconButton
              href="https://instagram.com/beki.marketplace"
              target="_blank"
              sx={{
                backgroundColor: "white",
                color: "primary.main",
                "&:hover": { backgroundColor: "primary.main", color: "white" },
              }}
            >
              <InstagramIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Email">
            <IconButton
              href={`mailto:${company.salesEmail}`}
              target="_blank"
              sx={{
                backgroundColor: "white",
                color: "primary.main",
                "&:hover": { backgroundColor: "primary.main", color: "white" },
              }}
            >
              <EmailIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Copyright */}
      <Box className="bg-primary text-white text-center py-3 text-sm tracking-wide">
        © {new Date().getFullYear()} {company.name}. All rights reserved. — ĐKKD
        giả (ví dụ) &middot; {company.taxId}
      </Box>
    </Box>
  );
};

export default Footer;
