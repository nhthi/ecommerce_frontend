import React from "react";
import { Product } from "../../../types/ProductType";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Close, ShoppingCartOutlined } from "@mui/icons-material";
import { addProductToWishlist } from "../../../state/customer/wishlistSlice";
import { useAppDispatch } from "../../../state/Store";
import { useNavigate } from "react-router-dom";

interface Props {
  item: Product;
}

const WishlistProductCard: React.FC<Props> = ({ item }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleRemoveFromWishlist = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    if (item.id) {
      await dispatch(addProductToWishlist(Number(item.id)));
    }
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log("Thêm vào giỏ hàng:", item.title);
    // TODO: gọi API addToCart sau
  };

  return (
    <div
      onClick={() =>
        navigate(
          `/product-details/${item.category?.name}/${item.title}/${item.id}`
        )
      }
      className="relative group bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer w-full max-w-[270px]"
    >
      {/* Nút xóa */}
      <div className="absolute top-2 right-2 z-10">
        <Tooltip title="Xóa khỏi danh sách yêu thích" arrow>
          <IconButton
            size="small"
            onClick={handleRemoveFromWishlist}
            className="bg-white/80 hover:bg-white"
          >
            <Close fontSize="small" className="text-gray-600" />
          </IconButton>
        </Tooltip>
      </div>

      {/* Ảnh sản phẩm */}
      <div className="w-full aspect-[3/4] overflow-hidden">
        <img
          src={item.images[0]}
          alt={item.title}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Nội dung */}
      <div className="p-4 space-y-2">
        <p className="font-medium text-gray-800 truncate">{item.title}</p>

        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-primary-color">
            {item.sellingPrice ? item.sellingPrice.toLocaleString() : 0}₫
          </span>
          <span className="text-sm line-through text-gray-400">
            ${item.mrpPrice ? item.mrpPrice.toLocaleString() : 0}₫
          </span>
          <span className="text-xs text-green-600 font-medium">
            -{item.discountPercent}%
          </span>
        </div>

        {/* Nút hành động */}
        <Button
          onClick={handleAddToCart}
          variant="outlined"
          fullWidth
          startIcon={<ShoppingCartOutlined />}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 500,
            mt: 1,
            borderColor: "#2196f3",
            "&:hover": { backgroundColor: "#2196f3", color: "#fff" },
          }}
        >
          Thêm vào giỏ hàng
        </Button>
      </div>
    </div>
  );
};

export default WishlistProductCard;
