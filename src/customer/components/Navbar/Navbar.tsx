import {
  Avatar,
  Box,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AddShoppingCart,
  FavoriteBorder,
  Search,
  Storefront,
} from "@mui/icons-material";
import CategorySheet from "./CategorySheet";
import { mainCategory } from "../../../data/category/mainCategory";

const Navbar = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [selectedCategory, setSelectedCategory] = useState("men");
  const [showCategory, setShowCategory] = useState(false);

  return (
    <>
      <Box sx={{ zIndex: 2 }} className="sticky top-0 left-0 right-0 bg-white">
        <div className="flex items-center justify-between px-5 lg:px-20 h-[70px] border-b">
          <div className="flex items-center justify-between w-full lg:w-auto gap-9">
            <div className="flex items-center justify-between gap-2">
              {!isLarge && (
                <IconButton>
                  <MenuIcon />
                </IconButton>
              )}
              <h1 className="logo cursor-pointer text-lg md:text-2xl text-primary-color font-semibold">
                NHTHI Shop
              </h1>
            </div>
            <ul className="flex items-center font-medium text-gray-800">
              {mainCategory.map((item, index) => (
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
          <div className="flex items-center gap-1 lg:gap-6">
            <IconButton>
              <Search />
            </IconButton>

            {false ? (
              <Button className="flex items-center gap-2">
                <Avatar
                  sx={{ width: 29, height: 29 }}
                  src="https://i.pinimg.com/736x/cb/d4/45/cbd44516a552e11d908abf735786e497.jpg"
                />
                <h1 className="font-semibold hidden lg:block">Thinh</h1>
              </Button>
            ) : (
              <Button variant="contained">Login</Button>
            )}

            <IconButton>
              <FavoriteBorder className="text-gray-700" sx={{ fontSize: 29 }} />
            </IconButton>
            <IconButton>
              <AddShoppingCart
                className="text-gray-700"
                sx={{ fontSize: 29 }}
              />
            </IconButton>
            {true && (
              <Button startIcon={<Storefront />} variant="outlined">
                Become Seller
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
