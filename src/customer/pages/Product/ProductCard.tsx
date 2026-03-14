import React, { useEffect, useState } from "react";
import "./ProductCard.css";
import { Button } from "@mui/material";
import {
  Favorite,
  FavoriteBorderOutlined,
  ModeComment,
} from "@mui/icons-material";
import { Product } from "../../../types/ProductType";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  addProductToWishlist,
  getWishlistByUser,
} from "../../../state/customer/wishlistSlice";
import { isWishlist } from "../../../utils/isWishlist";
import { formatCurrencyVND } from "../../../utils/formatCurrencyVND";
import ProductChatDialog from "./ProductChatDialog";

const ProductCard = ({ product }: { product: Product }) => {
  const [openChat, setOpenChat] = useState(false); // 👈 thêm state
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { wishlist } = useAppSelector((store) => store);
  useEffect(() => {
    let interval: any;
    if (isHovered) {
      interval = setInterval(() => {
        setCurrentImage((prevImage) => (prevImage + 1) % product.images.length);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
      interval = null;
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation(); // ⛔ chặn lan sự kiện click ra ngoài
    if (product.id) {
      await dispatch(addProductToWishlist(Number(product.id)));
    }
  };
  const handleOpenChat = (e: React.MouseEvent) => {
    e.stopPropagation(); // tránh click card -> navigate
    setOpenChat(true);
  };
  useEffect(() => {
    dispatch(getWishlistByUser());
  }, []);
  return (
    <>
      <div
        className="group px-4 relative"
        onClick={() =>
          navigate(
            `/product-details/${
              product.category?.categoryId
            }/${product.title.replaceAll("/", "_")}/${product.id}`
          )
        }
      >
        <div
          className="card shadow-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {product.images.map((item, index) => (
            <img
              className="card-media object-top"
              alt="product_card"
              src={item}
              style={{
                transform: `translateX(${(index - currentImage) * 100}%)`,
              }}
            />
          ))}
          {isHovered && (
            <div className="indicator flex flex-col items-center space-y-2">
              <div className="flex gap-3">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleWishlist}
                >
                  {isWishlist(
                    wishlist.wishlist?.products,
                    Number(product.id)
                  ) ? (
                    <Favorite sx={{ color: "#0097e6" }} />
                  ) : (
                    <FavoriteBorderOutlined sx={{ color: "#0097e6" }} />
                  )}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleOpenChat} // 👈 thêm
                >
                  <ModeComment sx={{ color: "#0097e6" }} />
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="details pt-3 space-y-1 group-hover-effect rounded-md">
          <div className="name">
            <h1>{product.seller?.businessDetails.businessName}</h1>
            <p>{product.title}</p>
          </div>
          <div className="price flex items-center gap-3">
            <span className="font-sans text-gray-800">
              {formatCurrencyVND(product.sellingPrice)}
            </span>
            <span className="thin-line-through text-gray-400">
              {formatCurrencyVND(product.mrpPrice)}
            </span>
            <span className="text-primary-color font-semibold">
              {product.discountPercent}%
            </span>
          </div>
        </div>
      </div>
      <ProductChatDialog
        open={openChat}
        onClose={() => setOpenChat(false)}
        productId={Number(product.id)}
        productTitle={product.title}
      />
    </>
  );
};

export default ProductCard;
