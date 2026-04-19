import React, { useEffect, useState } from "react";
import { FavoriteBorder } from "@mui/icons-material";
import { Alert, Button, Snackbar } from "@mui/material";
import WishlistProductCard from "./WishlistProductCard";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  addProductToWishlist,
  getWishlistByUser,
} from "../../../state/customer/wishlistSlice";
import { Product } from "../../../types/ProductType";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
          await dispatch(addProductToWishlist(item.id));
        }
      }
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Lỗi khi xóa tất cả:", error);
    }
  };

  const products = wishlist.wishlist?.products || [];

  return (
    <div className="min-h-screen bg-[#080808] px-5 py-8 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="rounded-[2rem] border border-orange-500/12 bg-[#101010] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8">
          <div className="flex flex-col gap-5 border-b border-orange-500/10 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-300">
                Danh sách yêu thích
              </p>
              <h1 className="mt-3 flex items-center gap-3 text-3xl font-black text-white md:text-4xl">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
                  <FavoriteBorder sx={{color:"#ffffff"}}/>
                </span>
                Sản phẩm đã lưu
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Hiện có{" "}
                <span className="font-bold text-white">{products.length}</span>{" "}
                sản phẩm trong danh sách yêu thích của bạn.
              </p>
            </div>

            <Button
              variant="outlined"
              disabled={products.length === 0}
              onClick={handleClearWishlist}
              sx={{
                borderRadius: "999px",
                borderColor: "rgba(249,115,22,0.35)",
                color: "#fb923c",
                fontWeight: 700,
                textTransform: "none",
                px: 2.5,
                py: 1,
                alignSelf: "flex-start",
                "&:hover": {
                  borderColor: "#fb923c",
                  backgroundColor: "rgba(249,115,22,0.08)",
                },
              }}
            >
              Xóa tất cả
            </Button>
          </div>

          <div className="mt-8">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {products.map((item: Product) => (
                  <WishlistProductCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-orange-500/15 bg-black/20 px-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-300">
                  <FavoriteBorder sx={{ fontSize: 34 }} />
                </div>
                <h3 className="mt-6 text-2xl font-black text-white">
                  Chưa có sản phẩm nào được lưu
                </h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                  Khi thấy sản phẩm phù hợp, bạn có thể lưu lại để xem sau hoặc so sánh trước khi mua.
                </p>
                <Button
                  variant="contained"
                  onClick={() => navigate("/products/all")}
                  sx={{
                    mt: 4,
                    borderRadius: "999px",
                    background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                    color: "#fff",
                    fontWeight: 800,
                    textTransform: "none",
                    px: 3,
                    py: 1.2,
                    boxShadow: "none",
                    "&:hover": {
                      background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                      boxShadow: "none",
                    },
                  }}
                >
                  Xem sản phẩm ngay
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: "0.8rem" }}>
          Đã xóa tất cả sản phẩm khỏi danh sách yêu thích.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Wishlist;