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
  const [openChat, setOpenChat] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { wishlist } = useAppSelector((store) => store);

  useEffect(() => {
    let interval: any;
    if (isHovered && product.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImage((prevImage) => (prevImage + 1) % product.images.length);
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isHovered, product.images.length]);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.id) {
      await dispatch(addProductToWishlist(Number(product.id)));
    }
  };

  const handleOpenChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenChat(true);
  };

  useEffect(() => {
    dispatch(getWishlistByUser());
  }, [dispatch]);

  return (
    <>
      <div
        className="product-card group"
        onClick={() =>
          navigate(
            `/product-details/${product.category?.categoryId}/${product.title.replaceAll("/", "_")}/${product.id}`,
          )
        }
      >
        <div
          className="product-card__frame"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="product-card__media">
            {product.discountPercent > 0 && (
              <div className="product-card__badge">-{product.discountPercent}%</div>
            )}

            {product.images.map((item, index) => (
              <img
                key={`${product.id}-${index}`}
                className="product-card__image"
                alt={product.title}
                src={item}
                style={{
                  transform: `translateX(${(index - currentImage) * 100}%)`,
                }}
              />
            ))}

            <div className="product-card__overlay">
              <div className="product-card__actions">
                <Button className="product-card__icon-btn" onClick={handleWishlist}>
                  {isWishlist(wishlist.wishlist?.products, Number(product.id)) ? (
                    <Favorite sx={{ color: "#111111", fontSize: 18 }} />
                  ) : (
                    <FavoriteBorderOutlined sx={{ color: "#111111", fontSize: 18 }} />
                  )}
                </Button>
                <Button className="product-card__icon-btn" onClick={handleOpenChat}>
                  <ModeComment sx={{ color: "#111111", fontSize: 18 }} />
                </Button>
              </div>
            </div>
          </div>

          <div className="product-card__content">
            <div className="product-card__meta">
              <p className="product-card__brand">
                {product.seller?.businessDetails.businessName || "Fitness Store"}
              </p>
              <p className="product-card__title">{product.title}</p>
            </div>

            <div className="product-card__price-row">
              <span className="product-card__price">{formatCurrencyVND(product.sellingPrice)}</span>
              <span className="product-card__old-price">{formatCurrencyVND(product.mrpPrice)}</span>
            </div>
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

