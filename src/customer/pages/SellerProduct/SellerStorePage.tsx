import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Rating,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Tooltip,
  Button,
  Grid,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchProductBySellerId } from "../../../state/seller/sellerProductSlice";
import { fetchSellerById } from "../../../state/seller/sellerSlice";

// Fake type sản phẩm trong gian hàng
interface SellerProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

const fakeProducts: SellerProduct[] = [
  {
    id: 1,
    name: "Đầm lụa tay phồng cổ vuông sang trọng",
    image:
      "https://images.pexels.com/photos/6311576/pexels-photo-6311576.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 520000,
    originalPrice: 690000,
    category: "Đầm",
    rating: 4.7,
    reviewsCount: 128,
    isBestSeller: true,
  },
  {
    id: 2,
    name: "Áo sơ mi trắng cổ đức form rộng",
    image:
      "https://images.pexels.com/photos/10368564/pexels-photo-10368564.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 320000,
    originalPrice: 420000,
    category: "Áo",
    rating: 4.4,
    reviewsCount: 76,
    isNew: true,
  },
  {
    id: 3,
    name: "Quần tây ống suông cạp cao",
    image:
      "https://images.pexels.com/photos/7691089/pexels-photo-7691089.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 410000,
    category: "Quần",
    rating: 4.6,
    reviewsCount: 92,
  },
  {
    id: 4,
    name: "Chân váy chữ A xếp ly nhẹ",
    image:
      "https://images.pexels.com/photos/6311590/pexels-photo-6311590.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 360000,
    originalPrice: 450000,
    category: "Váy/Chân váy",
    rating: 4.3,
    reviewsCount: 54,
  },
  {
    id: 5,
    name: "Set vest công sở cao cấp",
    image:
      "https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 890000,
    originalPrice: 1_050_000,
    category: "Set đồ",
    rating: 4.9,
    reviewsCount: 201,
    isBestSeller: true,
  },
  {
    id: 6,
    name: "Áo len gân cổ tròn basic",
    image:
      "https://images.pexels.com/photos/10368508/pexels-photo-10368508.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 270000,
    category: "Áo",
    rating: 4.2,
    reviewsCount: 34,
    isNew: true,
  },
];

const formatVND = (value: number) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const SellerStorePage: React.FC = () => {
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const dispatch = useAppDispatch();
  const { sellerProduct, seller } = useAppSelector((store) => store);
  // Fake info nhà bán

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sort, setSort] = useState<string>("newest");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const categories = ["Tất cả", "Đầm", "Áo", "Quần", "Set đồ", "Điện thoại"];

  // Lọc + sắp xếp
  const filteredProducts = useMemo(() => {
    let list = [...sellerProduct.products];

    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(keyword));
    }

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category?.name === selectedCategory);
    }

    const min = minPrice ? Number(minPrice) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;
    if (min !== undefined) {
      list = list.filter((p) => p.sellingPrice >= min);
    }
    if (max !== undefined) {
      list = list.filter((p) => p.sellingPrice <= max);
    }

    switch (sort) {
      case "price_asc":
        list.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;
      case "price_desc":
        list.sort((a, b) => b.sellingPrice - a.sellingPrice);
        break;
      case "rating":
        list.sort((a, b) => Number(b.numRatings) - Number(a.numRatings));
        break;
      default:
      // "newest" – với fake data tạm để nguyên
    }

    return list;
  }, [
    search,
    selectedCategory,
    minPrice,
    maxPrice,
    sort,
    sellerProduct.products,
  ]);

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat === "Tất cả" ? "all" : cat);
  };

  const handleSortChange = (e: SelectChangeEvent<string>) => {
    setSort(e.target.value);
  };

  const handleClearFilter = () => {
    setSearch("");
    setSelectedCategory("all");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
  };

  useEffect(() => {
    const loadData = async () => {
      await dispatch(fetchProductBySellerId(Number(sellerId)));
      await dispatch(fetchSellerById(Number(sellerId)));
    };
    loadData();
  }, [sellerId, dispatch]);
  return (
    <Box className="px-4 lg:px-16 py-8 bg-slate-50 min-h-screen">
      {/* Header seller */}
      <Box
        mb={4}
        className="bg-white rounded-3xl shadow-md border border-slate-100 px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row items-start md:items-center gap-4"
      >
        <Box className="flex items-center gap-3 md:gap-4 flex-1">
          <div className="relative">
            <Avatar src={seller.profile?.avatar || ""}></Avatar>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
          </div>
          <Box>
            <Typography
              variant="h6"
              className="font-bold text-slate-900 tracking-wide"
            >
              {seller.profile?.businessDetails?.businessName || ""}
            </Typography>
            <Box className="flex flex-wrap items-center gap-2 mt-1 text-xs md:text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <StarIcon sx={{ fontSize: 16, color: "#facc15" }} />
                <span className="font-medium">{5}</span>
                <span>• Đánh giá tốt</span>
              </span>
              <span>• 1009 người theo dõi</span>
              <span>• {sellerProduct.products?.length || 0} sản phẩm</span>
            </Box>
            {/* <Typography
              variant="body2"
              className="text-slate-500 mt-1 max-w-xl"
            >
              {seller.profile.}
            </Typography> */}
            <Typography variant="caption" className="text-sky-600 mt-1 block">
              Thời gian phản hồi: {30} phút
            </Typography>
          </Box>
        </Box>

        <Box className="flex flex-col gap-2 w-full md:w-auto">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
              background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
            }}
          >
            Quay lại
          </Button>
          <Button
            variant="outlined"
            startIcon={<FavoriteBorderIcon />}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Theo dõi gian hàng
          </Button>
        </Box>
      </Box>

      {/* Thanh filter trên cùng */}
      <Box className="bg-white rounded-3xl shadow-sm border border-slate-100 px-4 py-4 md:px-6 md:py-5 mb-4">
        <Grid container spacing={2} alignItems="center">
          {/* Search */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm theo tên sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Price range */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box className="flex gap-2">
              <TextField
                size="small"
                label="Giá từ"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <TextField
                size="small"
                label="Đến"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </Box>
          </Grid>

          {/* Sort + Clear */}
          <Grid
            size={{ xs: 12, md: 4 }}
            className="flex gap-2 justify-start md:justify-end"
          >
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Sắp xếp</InputLabel>
              <Select value={sort} label="Sắp xếp" onChange={handleSortChange}>
                <MenuItem value="newest">Mới nhất</MenuItem>
                <MenuItem value="price_asc">Giá: Thấp → Cao</MenuItem>
                <MenuItem value="price_desc">Giá: Cao → Thấp</MenuItem>
                <MenuItem value="rating">Đánh giá cao</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="text"
              onClick={handleClearFilter}
              sx={{ textTransform: "none", fontSize: 13 }}
            >
              Xóa lọc
            </Button>
          </Grid>
        </Grid>

        {/* Category chips */}
        <Box className="flex flex-wrap gap-1.5 mt-4">
          {categories.map((cat) => {
            const isActive =
              selectedCategory === "all"
                ? cat === "Tất cả"
                : selectedCategory === cat;
            return (
              <Chip
                key={cat}
                label={cat}
                clickable
                color={isActive ? "primary" : "default"}
                variant={isActive ? "filled" : "outlined"}
                onClick={() => handleCategoryClick(cat)}
                sx={{
                  borderRadius: 999,
                  fontSize: 13,
                }}
              />
            );
          })}
        </Box>
      </Box>

      {/* Danh sách sản phẩm */}
      <Box className="mt-4">
        <Box className="flex items-center justify-between mb-3">
          <Typography variant="subtitle1" className="font-semibold">
            Sản phẩm ({filteredProducts.length})
          </Typography>
          <Typography variant="caption" className="text-slate-500">
            Nhấp vào sản phẩm để xem chi tiết
          </Typography>
        </Box>

        {filteredProducts.length === 0 ? (
          <Box className="bg-white rounded-3xl shadow-sm border border-slate-100 py-10 flex flex-col items-center justify-center gap-2">
            <LocalMallIcon sx={{ fontSize: 48, color: "#9ca3af" }} />
            <Typography variant="body1" className="font-medium text-slate-700">
              Không tìm thấy sản phẩm phù hợp
            </Typography>
            <Typography variant="body2" className="text-slate-500">
              Hãy thử từ khóa khác hoặc xóa bớt bộ lọc.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredProducts.map((item) => (
              <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3 }}>
                <Box
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() =>
                    navigate(
                      `/product-details/${item.category!.name}/${item.title}/${
                        item.id
                      }`
                    )
                  }
                >
                  <Box className="relative">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-56 object-cover"
                    />
                    <Box className="absolute top-2 left-2 flex flex-col gap-1">
                      <Chip
                        label="Mới"
                        size="small"
                        color="primary"
                        sx={{
                          borderRadius: 999,
                          fontSize: 11,
                          background:
                            "linear-gradient(135deg, #0ea5e9, #2563eb)",
                        }}
                      />
                      <Chip
                        label="Bán chạy"
                        size="small"
                        color="warning"
                        sx={{
                          borderRadius: 999,
                          fontSize: 11,
                        }}
                      />
                    </Box>
                  </Box>
                  <Box className="p-3 space-y-1">
                    <Tooltip title={item.title}>
                      <Typography
                        variant="body2"
                        className="font-semibold text-slate-900 line-clamp-2 h-10"
                      >
                        {item.title}
                      </Typography>
                    </Tooltip>

                    <Box className="flex items-center gap-1 text-xs text-slate-500">
                      <Rating
                        value={item.numRatings}
                        precision={0.1}
                        size="small"
                        readOnly
                      />
                      <span>{Number(item.numRatings).toFixed(1)}</span>
                      <span>
                        • {(item.reviews as any).length || 0} đánh giá
                      </span>
                    </Box>

                    <Box className="flex items-baseline gap-1">
                      <Typography
                        variant="subtitle1"
                        className="font-bold text-slate-900"
                      >
                        {formatVND(item.sellingPrice)}
                      </Typography>
                      {item.mrpPrice && (
                        <Typography
                          variant="caption"
                          className="line-through text-slate-400"
                        >
                          {formatVND(item.mrpPrice)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default SellerStorePage;
