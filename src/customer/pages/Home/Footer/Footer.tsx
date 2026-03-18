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
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const Footer = () => {
  const company = {
    name: "NHTHI Fit",
    address: "TP. Hồ Chí Minh, Việt Nam",
    supportEmail: "support@nhthifit.vn",
    salesEmail: "hello@nhthifit.vn",
    phone: "1900 6868",
    hours: "Thứ 2 - Thứ 7: 08:30 - 20:30",
  };

  const quickLinks = [
    { label: "Câu hỏi thường gặp", href: "/search?keyword=faq" },
    { label: "Quy định đổi hàng", href: "/search?keyword=quy%20dinh%20doi%20hang" },
    { label: "Chính sách thanh toán", href: "/search?keyword=chinh%20sach%20thanh%20toan" },
    { label: "Blog tập luyện", href: "/search?keyword=tap%20luyen%20fitness" },
  ];

  return (
    <Box className="mt-0 bg-[#050505] text-white">
      <Divider sx={{ borderColor: "rgba(249,115,22,0.14)" }} />

      <Box className="mx-auto grid max-w-[1280px] gap-10 px-6 py-12 md:grid-cols-3 lg:px-16">
        <Box className="flex flex-col gap-4">
          <Typography className="flex items-center gap-3 text-2xl font-black text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-black">
              <FitnessCenterIcon />
            </span>
            {company.name}
          </Typography>
          <Typography className="max-w-sm text-sm leading-7 text-slate-300">
            Bán dụng cụ fitness, chia sẻ blog tập luyện và gợi ý setup phòng gym tại nhà theo nhu cầu thực tế.
          </Typography>
          <Typography className="text-sm text-slate-400">
            {company.address}
          </Typography>
        </Box>

        <Box className="flex flex-col gap-3">
          <Typography className="text-lg font-black text-white">
            Hỗ trợ
          </Typography>
          {quickLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              underline="hover"
              color="inherit"
              className="text-sm text-slate-300 hover:text-orange-400"
            >
              {item.label}
            </Link>
          ))}
        </Box>

        <Box className="flex flex-col gap-3">
          <Typography className="flex items-center gap-2 text-lg font-black text-white">
            <VerifiedUserIcon sx={{ color: "#fb923c" }} />
            Liên hệ
          </Typography>
          <Typography className="flex items-center gap-2 text-sm text-slate-300">
            <EmailIcon sx={{ fontSize: 18, color: "#fb923c" }} />
            {company.supportEmail}
          </Typography>
          <Typography className="flex items-center gap-2 text-sm text-slate-300">
            <LocalPhoneIcon sx={{ fontSize: 18, color: "#fb923c" }} />
            {company.phone}
          </Typography>
          <Typography className="text-sm text-slate-400">
            {company.hours}
          </Typography>
        </Box>
      </Box>

      <Box className="border-t border-orange-500/10 px-6 py-5 lg:px-16">
        <Box className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 md:flex-row">
          <Box className="flex items-center gap-3">
            <Tooltip title="Facebook">
              <IconButton sx={{ color: "#fb923c", border: "1px solid rgba(249,115,22,0.2)" }}>
                <FacebookIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Instagram">
              <IconButton sx={{ color: "#fb923c", border: "1px solid rgba(249,115,22,0.2)" }}>
                <InstagramIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Email">
              <IconButton sx={{ color: "#fb923c", border: "1px solid rgba(249,115,22,0.2)" }}>
                <EmailIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography className="text-sm text-slate-500">
            © {new Date().getFullYear()} {company.name}. Bảo lưu mọi quyền.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;