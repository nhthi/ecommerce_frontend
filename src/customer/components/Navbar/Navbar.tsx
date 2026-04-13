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
  DarkModeRounded,
  LightModeRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchUserProfile } from "../../../state/AuthSlice";
import SearchBar from "./SearchBar";
import { fetchUserCart } from "../../../state/customer/cartSlice";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

type NavChild = {
  label: string;
  path: string;
};

type NavItem = {
  label: string;
  path?: string;
  children?: NavChild[];
};

const Navbar = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isDark, toggleMode } = useSiteThemeMode();

  const { auth, cart } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();

  const iconButtonSx = {
    width: 40,
    height: 40,
    color: isDark ? "#fff" : "#0f172a",
    border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(15,23,42,0.10)",
    backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.75)",
    "&:hover": {
      backgroundColor: "rgba(249,115,22,0.1)",
      borderColor: "rgba(249,115,22,0.28)",
    },
  };

  const navItems = useMemo<NavItem[]>(() => [
  { label: "Trang chủ", path: "/" },
  { label: "Sản phẩm", path: "/products/all" },
  {
    label: "Dụng cụ",
    children: [
      { label: "Tạ và bánh tạ", path: "/search?keyword=ta" },
      { label: "Máy cardio", path: "/search?keyword=cardio" },
      { label: "Phụ kiện tập", path: "/search?keyword=phu%20kien%20tap%20gym" },
    ],
  },
  {
    label: "Blog",
    children: [
      { label: "Tất cả bài viết", path: "/blog" },
      { label: "Tập luyện", path: "/blog?category=Tap%20luyen" },
      { label: "Tin tức", path: "/blog?category=Tin%20tuc" },
    ],
  },
  { label: "Lịch tập", path: "/training" },
  {
    label: "Hỗ trợ",
    children: [
      { label: "Câu hỏi thường gặp", path: "/policy/faq" },
      { label: "Vận chuyển", path: "/policy/delivery" },
      { label: "Quy định đổi hàng", path: "/policy/exchange" },
      { label: "Chính sách thanh toán", path: "/policy/payment" },
    ],
  },
], []);
  const handleClickAvatar = () => {
    if (auth.user?.role === "ROLE_ADMIN" || auth.user?.role === "ROLE_STAFF") {
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
      <div className={isDark ? "border-b border-orange-500/20 bg-black text-orange-300" : "border-b border-orange-200 bg-orange-50 text-orange-700"}>
        <div className="mx-auto flex max-w-[1560px] items-center justify-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] sm:text-xs">
          <LocalShipping sx={{ fontSize: 16 }} />
          Freeship voi don hang tu 300K
        </div>
      </div>

      <div className={isDark ? "border-b border-orange-500/20 bg-[#050505]/95 text-white backdrop-blur" : "border-b border-slate-200 bg-white/95 text-slate-900 backdrop-blur shadow-sm"}>
        <div className="mx-auto flex max-w-[1560px] items-center justify-between gap-3 px-4 py-4 lg:px-8 xl:px-10">
          <div className="flex items-center gap-2 lg:gap-3">
            {!isLarge && (
              <IconButton onClick={() => setMobileMenuOpen((prev) => !prev)}>
                {mobileMenuOpen ? <Close sx={{ color: isDark ? "#fff" : "#0f172a" }} /> : <MenuIcon sx={{ color: isDark ? "#fff" : "#0f172a" }} />}
              </IconButton>
            )}

            <button type="button" onClick={() => handleNavigate("/")} className="flex items-center gap-3 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-400">
                <FitnessCenter sx={{ fontSize: 21 }} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-orange-400">Thiet bi tap luyen</p>
                <h1 className={isDark ? "text-base font-black uppercase tracking-[0.18em] text-white md:text-xl xl:text-2xl" : "text-base font-black uppercase tracking-[0.18em] text-slate-900 md:text-xl xl:text-2xl"}>NHTHI FIT</h1>
              </div>
            </button>
          </div>

          <div className="hidden lg:flex items-center justify-center gap-0.5 self-stretch xl:gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="group relative flex h-full items-center py-6 -my-6">
                  <button type="button" className={isDark ? "flex items-center gap-0.5 px-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition hover:text-orange-400 xl:px-3 xl:text-[12px]" : "flex items-center gap-0.5 px-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-900 transition hover:text-orange-500 xl:px-3 xl:text-[12px]"}>
                    {item.label}
                    <KeyboardArrowDown sx={{ fontSize: 17 }} />
                  </button>
                  <div className={isDark ? "invisible absolute left-0 top-full z-30 min-w-[250px] rounded-none border-t-2 border-orange-500 bg-[#111111] p-3 opacity-0 shadow-2xl shadow-black/50 transition duration-200 group-hover:visible group-hover:opacity-100" : "invisible absolute left-0 top-full z-30 min-w-[250px] rounded-none border-t-2 border-orange-500 bg-white p-3 opacity-0 shadow-2xl shadow-slate-200 transition duration-200 group-hover:visible group-hover:opacity-100"}>
                    {item.children.map((child) => (
                      <button key={child.label} type="button" onClick={() => handleNavigate(child.path)} className={isDark ? "flex w-full border-b border-white/5 px-3 py-3 text-left text-sm font-semibold text-slate-200 transition last:border-b-0 hover:bg-orange-500 hover:text-black" : "flex w-full border-b border-slate-100 px-3 py-3 text-left text-sm font-semibold text-slate-700 transition last:border-b-0 hover:bg-orange-500 hover:text-black"}>
                        {child.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button key={item.label} type="button" onClick={() => handleNavigate(item.path!)} className={isDark ? "px-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition hover:text-orange-400 xl:px-3 xl:text-[12px]" : "px-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-900 transition hover:text-orange-500 xl:px-3 xl:text-[12px]"}>
                  {item.label}
                </button>
              ),
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 lg:gap-2">
            <IconButton onClick={toggleMode} sx={iconButtonSx}>
              {isDark ? <LightModeRounded sx={{ fontSize: 22 }} /> : <DarkModeRounded sx={{ fontSize: 22 }} />}
            </IconButton>

            {!showSearch && (
              <IconButton onClick={() => setShowSearch(true)} sx={iconButtonSx}>
                <Search sx={{ fontSize: 22 }} />
              </IconButton>
            )}
            <SearchBar showSearch={showSearch} setShowSearch={setShowSearch} />

            {auth?.user ? (
              <Button className="min-w-0 rounded-full" onClick={handleClickAvatar} sx={{ color: isDark ? "white" : "#0f172a", textTransform: "none", pl: 0.75, pr: 1.2 }}>
                <Avatar sx={{ width: 34, height: 34 }} src="https://i.pinimg.com/736x/cb/d4/45/cbd44516a552e11d908abf735786e497.jpg" />
                <span className="ml-2 hidden max-w-[92px] truncate text-sm font-semibold xl:block">{auth.user?.fullName}</span>
              </Button>
            ) : (
              <div className="group relative hidden lg:block">
                <IconButton onClick={() => handleNavigate("/login")} sx={iconButtonSx}>
                  <PersonOutline sx={{ fontSize: 22 }} />
                </IconButton>
                <div className={isDark ? "pointer-events-none absolute right-0 top-[calc(100%+10px)] rounded-full border border-orange-500/20 bg-[#111111] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-200 opacity-0 transition duration-200 group-hover:opacity-100" : "pointer-events-none absolute right-0 top-[calc(100%+10px)] rounded-full border border-orange-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-600 opacity-0 transition duration-200 group-hover:opacity-100"}>
                  Tai khoan
                </div>
              </div>
            )}

            <IconButton onClick={() => handleNavigate("/support")} sx={iconButtonSx}>
              <ChatBubbleOutline sx={{ fontSize: 22 }} />
            </IconButton>

            <IconButton onClick={() => handleNavigate("/wishlist")} sx={iconButtonSx}>
              <FavoriteBorder sx={{ fontSize: 22 }} />
            </IconButton>

            <IconButton onClick={() => handleNavigate("/cart")} sx={iconButtonSx}>
              <Badge badgeContent={(cart.cart as any)?.totalItem || 0} sx={{ "& .MuiBadge-badge": { backgroundColor: "#f97316", color: "#050505", fontWeight: "bold" } }} overlap="circular" max={99}>
                <AddShoppingCart className="cart-icon" data-cart-target="true" sx={{ fontSize: 22 }} />
              </Badge>
            </IconButton>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={isDark ? "border-b border-orange-500/20 bg-[#0d0d0d] text-white lg:hidden" : "border-b border-slate-200 bg-white text-slate-900 lg:hidden"}>
          <div className="mx-auto flex max-w-[1560px] flex-col gap-2 px-4 py-4">
            {!auth?.user && (
              <button type="button" onClick={() => handleNavigate("/login")} className={isDark ? "border-b border-white/10 py-3 text-left text-sm font-bold uppercase tracking-[0.16em] text-white" : "border-b border-slate-200 py-3 text-left text-sm font-bold uppercase tracking-[0.16em] text-slate-900"}>
                Tai khoan
              </button>
            )}
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className={isDark ? "border-b border-white/10 pb-2" : "border-b border-slate-200 pb-2"}>
                  <button type="button" onClick={() => toggleMobileSection(item.label)} className={isDark ? "flex w-full items-center justify-between py-3 text-left text-sm font-bold uppercase tracking-[0.16em] text-white" : "flex w-full items-center justify-between py-3 text-left text-sm font-bold uppercase tracking-[0.16em] text-slate-900"}>
                    {item.label}
                    <KeyboardArrowDown sx={{ fontSize: 20, transform: expandedMobileMenu === item.label ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
                  </button>
                  {expandedMobileMenu === item.label && (
                    <div className={isDark ? "flex flex-col bg-white/5 px-2 py-2" : "flex flex-col bg-slate-50 px-2 py-2"}>
                      {item.children.map((child) => (
                        <button key={child.label} type="button" onClick={() => handleNavigate(child.path)} className={isDark ? "px-3 py-3 text-left text-sm font-medium text-slate-100 transition hover:bg-orange-500 hover:text-black" : "px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-orange-500 hover:text-black"}>
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button key={item.label} type="button" onClick={() => handleNavigate(item.path!)} className={isDark ? "border-b border-white/10 py-3 text-left text-sm font-bold uppercase tracking-[0.16em] text-white" : "border-b border-slate-200 py-3 text-left text-sm font-bold uppercase tracking-[0.16em] text-slate-900"}>
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

