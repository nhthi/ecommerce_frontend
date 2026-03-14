import React, { useEffect, useState } from "react";
import { FavoriteBorder } from "@mui/icons-material";
import { Alert, Button, Divider, Snackbar } from "@mui/material";
import WishlistProductCard from "./WishlistProductCard";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  addProductToWishlist,
  getWishlistByUser,
} from "../../../state/customer/wishlistSlice";
import { Product } from "../../../types/ProductType";

const Wishlist = () => {
  const dispatch = useAppDispatch();
  const { wishlist } = useAppSelector((store) => store);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  useEffect(() => {
    dispatch(getWishlistByUser());
  }, [dispatch]);
  const handleClearWishlist = async () => {
    if (!wishlist.wishlist?.products.length) return;
    try {
      for (const item of wishlist.wishlist.products) {
        if (item.id) {
          await dispatch(addProductToWishlist(item.id)); // toggle remove
        }
      }
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Lỗi khi xóa tất cả:", error);
    }
  };

  const products = wishlist.wishlist?.products || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-5 sm:p-10 lg:px-32">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FavoriteBorder className="text-pink-500" />
            Danh sách yêu thích
          </h1>
          <p className="text-gray-500 mt-1">
            Bạn có {products.length} sản phẩm trong danh sách yêu thích.
          </p>
        </div>
        <Button
          variant="contained"
          color="error"
          disabled={products.length === 0}
          className="!capitalize"
          onClick={handleClearWishlist}
        >
          Xóa tất cả
        </Button>
      </div>

      <Divider className="mb-8" />
      <div className="mt-8">
        {/* DANH SÁCH SẢN PHẨM */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((item: Product) => (
              <WishlistProductCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="Empty Wishlist"
              className="w-32 mb-4 opacity-80"
            />
            <h3 className="text-lg font-semibold text-gray-700">
              Danh sách yêu thích của bạn đang trống!
            </h3>
            <p className="text-gray-500 mt-1">
              Hãy thêm một vài sản phẩm mà bạn yêu thích nhé 💖
            </p>
            <Button
              variant="contained"
              color="primary"
              className="mt-5 rounded-full px-6"
              href="/shop"
            >
              Khám phá ngay
            </Button>
          </div>
        )}
      </div>
      {/* Snackbar thông báo */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled">
          Đã xóa tất cả sản phẩm khỏi danh sách yêu thích!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Wishlist;
