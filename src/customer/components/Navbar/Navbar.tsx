import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AddShoppingCart,
  FavoriteBorder,
  Search,
  Storefront,
  Close,
  ChatBubble,
} from "@mui/icons-material";
import CategorySheet from "./CategorySheet";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchUserProfile } from "../../../state/AuthSlice";
import { fetchAllCategory } from "../../../state/admin/adminCategorySlice";
import { fetchSellerProfile } from "../../../state/seller/sellerSlice";
import SearchBar from "./SearchBar";
import { fetchUserCart } from "../../../state/customer/cartSlice";

const Navbar = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [selectedCategory, setSelectedCategory] = useState("men");
  const [showCategory, setShowCategory] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const { auth, category, seller, cart } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();

  const level3Categories = category.categories.filter((cat) => cat.level === 1);

  const handleClickAvatar = () => {
    if (auth.user.role === "ROLE_ADMIN") {
      navigate("/admin");
    } else {
      navigate("/account");
    }
  };

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchUserCart());
  }, [auth.jwt]);

  const seller_jwt = localStorage.getItem("jwt_seller");
  useEffect(() => {
    if (seller_jwt) {
      dispatch(fetchSellerProfile());
    }
  }, [seller_jwt]);

  useEffect(() => {
    dispatch(fetchAllCategory());
  }, []);

  // Ref tìm kiếm
  const searchRef = useRef<HTMLDivElement | null>(null);

  // Ẩn ô tìm kiếm khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Box sx={{ zIndex: 2 }} className="sticky top-0 left-0 right-0 bg-white">
        <div className="flex items-center justify-between px-5 lg:px-20 h-[70px] border-b relative">
          {/* Logo + Categories */}
          <div className="flex items-center justify-between w-full lg:w-auto gap-9">
            <div className="flex items-center justify-between gap-2">
              {!isLarge && (
                <IconButton>
                  <MenuIcon />
                </IconButton>
              )}
              <h1
                onClick={() => navigate("/")}
                className="logo cursor-pointer text-lg md:text-2xl text-primary-color font-semibold"
              >
                NHTHI Shop
              </h1>
            </div>
            <ul className="hidden lg:flex items-center font-medium text-gray-800">
              {level3Categories.map((item, index) => (
                <li
                  className="mainCategory hover:text-primary-color cursor-pointer
                    hover:border-b-2 h-[70px] px-4 border-primary-color flex items-center"
                  key={index}
                  onMouseLeave={() => setShowCategory(false)}
                  onMouseEnter={() => {
                    setShowCategory(true);
                    setSelectedCategory(item.categoryId);
                  }}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Icons */}
          <div
            className="flex items-center gap-1 lg:gap-6 relative"
            ref={searchRef}
          >
            {/* Nút search hoặc input */}
            {/* Nút search và thanh tìm kiếm */}
            {!showSearch && (
              <IconButton onClick={() => setShowSearch(true)}>
                <Search />
              </IconButton>
            )}
            <SearchBar showSearch={showSearch} setShowSearch={setShowSearch} />

            {auth?.user ? (
              <Button
                className="flex items-center gap-2"
                onClick={handleClickAvatar}
              >
                <Avatar
                  sx={{ width: 29, height: 29 }}
                  src="https://i.pinimg.com/736x/cb/d4/45/cbd44516a552e11d908abf735786e497.jpg"
                />
                <h1 className="font-semibold hidden lg:block max-w-[100px] truncate">
                  {auth.user?.fullName}
                </h1>
              </Button>
            ) : (
              <Button onClick={() => navigate("/login")} variant="contained">
                Đăng nhập
              </Button>
            )}
            <IconButton onClick={() => navigate("/message")}>
              <ChatBubble
                className="text-primary-color"
                sx={{ fontSize: 29 }}
              />
            </IconButton>
            <IconButton onClick={() => navigate("/wishlist")}>
              <FavoriteBorder
                className="text-primary-color"
                sx={{ fontSize: 29 }}
              />
            </IconButton>

            <IconButton onClick={() => navigate("/cart")}>
              <Badge
                badgeContent={(cart.cart as any)?.totalItem || 0}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#ff4757",
                    color: "white",
                    fontWeight: "bold",
                  },
                }}
                overlap="circular"
                max={99} // nếu > 99 sẽ hiển thị "99+"
              >
                <AddShoppingCart
                  className="text-primary-color cart-icon"
                  sx={{ fontSize: 29 }}
                />
              </Badge>
            </IconButton>

            {seller.profile ? (
              <Button
                onClick={() => navigate("/seller")}
                startIcon={<Storefront />}
                variant="contained"
              >
                Cửa hàng
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/become-seller")}
                startIcon={<Storefront />}
                variant="outlined"
              >
                Đăng ký bán hàng
              </Button>
            )}
          </div>
        </div>

        {showCategory && (
          <div
            onMouseLeave={() => setShowCategory(false)}
            onMouseEnter={() => setShowCategory(true)}
            className="categorySheet absolute top-[4.41rem] left-20 right-20 border bg-slate-500"
          >
            <CategorySheet selectedCategory={selectedCategory} />
          </div>
        )}
      </Box>
    </>
  );
};

export default Navbar;
