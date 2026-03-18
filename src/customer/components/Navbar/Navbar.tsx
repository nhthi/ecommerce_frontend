import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AddShoppingCart,
  FavoriteBorder,
  Search,
  Close,
  FitnessCenter,
  KeyboardArrowDown,
  PersonOutline,
  LocalShipping,
  ChatBubbleOutline,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchUserProfile } from "../../../state/AuthSlice";
import SearchBar from "./SearchBar";
import { fetchUserCart } from "../../../state/customer/cartSlice";

type NavChild = {
  label: string;
  path: string;
};

type NavItem = {
  label: string;
  path?: string;
  children?: NavChild[];
};

const iconButtonSx = {
  width: 40,
  height: 40,
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.06)",
  backgroundColor: "rgba(255,255,255,0.02)",
  "&:hover": {
    backgroundColor: "rgba(249,115,22,0.1)",
    borderColor: "rgba(249,115,22,0.28)",
  },
};

const Navbar = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const { auth, cart } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();

  const navItems = useMemo<NavItem[]>(
    () => [
      { label: "Trang chủ", path: "/" },
      { label: "Sản phẩm", path: "/products/all" },
      {
        label: "Dụng cụ",
        children: [
          { label: "Tạ và bánh tạ", path: "/search?keyword=ta%20fitness" },
          { label: "Máy cardio", path: "/search?keyword=may%20cardio" },
          { label: "Phụ kiện tập", path: "/search?keyword=phu%20kien%20tap%20gym" },
        ],
      },
      {
        label: "Blog",
        children: [
          { label: "Tin tức", path: "/search?keyword=tin%20tuc%20fitness" },
          { label: "Tập luyện", path: "/search?keyword=tap%20luyen%20fitness" },
        ],
      },
      { label: "Khóa học", path: "/search?keyword=khoa%20hoc%20fitness" },
      {
        label: "Hỗ trợ",
        children: [
          { label: "FAQ", path: "/search?keyword=faq" },
          { label: "Vận chuyển", path: "/search?keyword=van%20chuyen" },
          { label: "Quy định đổi hàng", path: "/search?keyword=quy%20dinh%20doi%20hang" },
          { label: "Chính sách thanh toán", path: "/search?keyword=chinh%20sach%20thanh%20toan" },
        ],
      },
    ],
    [],
  );

  const handleClickAvatar = () => {
    if (auth.user?.role === "ROLE_ADMIN") {
      navigate("/admin");
      return;
    }

    navigate("/account");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setExpandedMobileMenu(null);
  };

  const toggleMobileSection = (label: string) => {
    setExpandedMobileMenu((prev) => (prev === label ? null : label));
  };

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchUserCart());
  }, [auth.jwt, dispatch]);

  useEffect(() => {
    if (isLarge) {
      setMobileMenuOpen(false);
      setExpandedMobileMenu(null);
    }
  }, [isLarge]);

  return (
    <Box sx={{ zIndex: 30 }} className="sticky top-0 left-0 right-0">
      <div className="border-b border-orange-500/20 bg-black text-orange-300">
        <div className="mx-auto flex max-w-[1560px] items-center justify-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] sm:text-xs">
          <LocalShipping sx={{ fontSize: 16 }} />
          Freeship với đơn hàng từ 300K
        </div>
      </div>

      <div className="border-b border-orange-500/20 bg-[#050505]/95 text-white backdrop-blur">
        <div className="mx-auto flex max-w-[1560px] items-center justify-between gap-3 px-4 py-4 lg:px-8 xl:px-10">
          <div className="flex items-center gap-2 lg:gap-3">
            {!isLarge && (
              <IconButton onClick={() => setMobileMenuOpen((prev) => !prev)}>
                {mobileMenuOpen ? <Close sx={{ color: "#fff" }} /> : <MenuIcon sx={{ color: "#fff" }} />}
              </IconButton>
            )}

            <button
              type="button"
              onClick={() => handleNavigate("/")}
              className="flex items-center gap-3 text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-400">
                <FitnessCenter sx={{ fontSize: 21 }} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-orange-400">
                  Fitness Equipment
                </p>
                <h1 className="text-base font-black uppercase tracking-[0.18em] text-white md:text-xl xl:text-2xl">
                  NHTHI FIT
                </h1>
              </div>
            </button>
          </div>

          <div className="hidden lg:flex items-center justify-center gap-0.5 self-stretch xl:gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="group relative flex h-full items-center py-6 -my-6">
                  <button
                    type="button"
                    className="flex items-center gap-0.5 px-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition hover:text-orange-400 xl:px-3 xl:text-[12px]"
                  >
                    {item.label}
                    <KeyboardArrowDown sx={{ fontSize: 17 }} />
                  </button>
                  <div className="invisible absolute left-0 top-full z-30 min-w-[250px] rounded-none border-t-2 border-orange-500 bg-[#111111] p-3 opacity-0 shadow-2xl shadow-black/50 transition duration-200 group-hover:visible group-hover:opacity-100">
                    {item.children.map((child) => (
                      <button
                        key={child.label}
                        type="button"
                        onClick={() => handleNavigate(child.path)}
                        className="flex w-full border-b border-white/5 px-3 py-3 text-left text-sm font-semibold text-slate-200 transition last:border-b-0 hover:bg-orange-500 hover:text-black"
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavigate(item.path!)}
                  className="px-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition hover:text-orange-400 xl:px-3 xl:text-[12px]"
                >
                  {item.label}
                </button>
              ),
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 lg:gap-2">
            {!showSearch && (
              <IconButton onClick={() => setShowSearch(true)} sx={iconButtonSx}>
                <Search sx={{ color: "#fff", fontSize: 22 }} />
              </IconButton>
            )}
            <SearchBar showSearch={showSearch} setShowSearch={setShowSearch} />

            {auth?.user ? (
              <Button
                className="min-w-0 rounded-full"
                onClick={handleClickAvatar}
                sx={{ color: "white", textTransform: "none", pl: 0.75, pr: 1.2 }}
              >
                <Avatar
                  sx={{ width: 34, height: 34 }}
                  src="https://i.pinimg.com/736x/cb/d4/45/cbd44516a552e11d908abf735786e497.jpg"
                />
                <span className="ml-2 hidden max-w-[92px] truncate text-sm font-semibold xl:block">
                  {auth.user?.fullName}
                </span>
              </Button>
            ) : (
              <div className="group relative hidden lg:block">
                <IconButton onClick={() => handleNavigate("/login")} sx={iconButtonSx}>
                  <PersonOutline sx={{ fontSize: 22 }} />
                </IconButton>
                <div className="pointer-events-none absolute right-0 top-[calc(100%+10px)] rounded-full border border-orange-500/20 bg-[#111111] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-200 opacity-0 transition duration-200 group-hover:opacity-100">
                 Tài khoản
                </div>
              </div>
            )}

            <IconButton onClick={() => handleNavigate("/message")} sx={iconButtonSx}>
              <ChatBubbleOutline sx={{ fontSize: 22, color: "#fff" }} />
            </IconButton>

            <IconButton onClick={() => handleNavigate("/wishlist")} sx={iconButtonSx}>
              <FavoriteBorder sx={{ fontSize: 22, color: "#fff" }} />
            </IconButton>

            <IconButton onClick={() => handleNavigate("/cart")} sx={iconButtonSx}>
              <Badge
                badgeContent={(cart.cart as any)?.totalItem || 0}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#f97316",
                    color: "#050505",
                    fontWeight: "bold",
                  },
                }}
                overlap="circular"
                max={99}
              >
                <AddShoppingCart className="cart-icon" data-cart-target="true" sx={{ fontSize: 22, color: "#fff" }} />
              </Badge>
            </IconButton>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-b border-orange-500/20 bg-[#0d0d0d] text-white lg:hidden">
          <div className="mx-auto flex max-w-[1560px] flex-col gap-2 px-4 py-4">
            {!auth?.user && (
              <button
                type="button"
                onClick={() => handleNavigate("/login")}
                className="border-b border-white/10 py-3 text-left text-sm font-bold uppercase tracking-[0.16em] text-white"
              >
                Tai khoan
              </button>
            )}
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="border-b border-white/10 pb-2">
                  <button
                    type="button"
                    onClick={() => toggleMobileSection(item.label)}
                    className="flex w-full items-center justify-between py-3 text-left text-sm font-bold uppercase tracking-[0.16em] text-white"
                  >
                    {item.label}
                    <KeyboardArrowDown
                      sx={{
                        fontSize: 20,
                        transform:
                          expandedMobileMenu === item.label
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </button>
                  {expandedMobileMenu === item.label && (
                    <div className="flex flex-col bg-white/5 px-2 py-2">
                      {item.children.map((child) => (
                        <button
                          key={child.label}
                          type="button"
                          onClick={() => handleNavigate(child.path)}
                          className="px-3 py-3 text-left text-sm font-medium text-slate-100 transition hover:bg-orange-500 hover:text-black"
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavigate(item.path!)}
                  className="border-b border-white/10 py-3 text-left text-sm font-bold uppercase tracking-[0.16em] text-white"
                >
                  {item.label}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </Box>
  );
};

export default Navbar;
