import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import FilterSection from "./FilterSection";
import {
  Button,
  Collapse,
  FormControl,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { AutoAwesome, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchAllProducts } from "../../../state/customer/productSlice";
import { Product as ProductType } from "../../../types/ProductType";
import { getWishlistByUser } from "../../../state/customer/wishlistSlice";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";
import { fetchRecommendations, RecommendedProductDto } from "../../../state/customer/recommendationSlice";
import { formatCurrencyVND } from "../../../utils/formatCurrencyVND";

const sourceLabelMap: Record<string, string> = {
  GUEST_POPULAR: "Phổ biến",
  USER_CF: "Dành riêng cho bạn",
  CONTENT_PURCHASE: "Liên quan đến mua sắm",
  CONTENT_CART: "Liên quan đến giỏ hàng",
  FALLBACK: "Gợi ý",
};

const ITEMS_PER_PAGE = 12;

const Product = () => {
  const [sort, setSort] = useState<string>("");
  const [page, setPage] = useState(1);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const { isDark } = useSiteThemeMode();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { product, recommendationSlice, auth } = useAppSelector((store) => store);
  const { category } = useParams();
  const keyword = searchParams.get("keyword") || "";

  const selectSx = useMemo(
    () => ({
      minWidth: 210,
      "& .MuiOutlinedInput-root": {
        borderRadius: "999px",
        color: isDark ? "#ffffff" : "#0f172a",
        backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#ffffff",
        "& fieldset": {
          borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.12)",
        },
        "&:hover fieldset": {
          borderColor: "rgba(249,115,22,0.35)",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#f97316",
        },
      },
      "& .MuiSvgIcon-root": {
        color: isDark ? "rgba(255,255,255,0.65)" : "#64748b",
      },
    }),
    [isDark]
  );

  const recommendationButtonSx = useMemo(
    () => ({
      borderRadius: "999px",
      px: 2,
      color: isDark ? "#ffffff" : "#0f172a",
      borderColor: isDark ? "rgba(249,115,22,0.25)" : "rgba(249,115,22,0.28)",
      backgroundColor: showRecommendations
        ? isDark
          ? "rgba(249,115,22,0.12)"
          : "rgba(249,115,22,0.08)"
        : "transparent",
    }),
    [isDark, showRecommendations]
  );

  const handleSortChange = (e: any) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handlePageChange = (value: number) => {
    setPage(value);
  };

  // Fetch data (KHÔNG dùng page backend)
  useEffect(() => {
    const [minPrice, maxPrice] = searchParams.get("price")?.split("-") || [];
    const color = searchParams.get("color");
    const brand = searchParams.get("brand");
    const keywordQuery = searchParams.get("keyword");
    const minDiscount = searchParams.get("discount")
      ? Number(searchParams.get("discount"))
      : undefined;

    const fetchData = async () => {
      await dispatch(getWishlistByUser());
      await dispatch(
        fetchAllProducts({
          color: color || undefined,
          brand: brand || undefined,
          keyword: keywordQuery || undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          minDiscount,
          sort: sort || undefined,
        })
      );
    };
    fetchData();
  }, [searchParams, category, sort, dispatch]);

  useEffect(() => {
    dispatch(fetchRecommendations(auth.user?.id ?? null));
  }, [dispatch, auth.user?.id]);

  // Frontend pagination
  const totalPages = Math.ceil((product.products?.length || 0) / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return product.products.slice(start, end);
  }, [product.products, page]);

  const heading = keyword || (category ? `${category}` : "Tat ca san pham");
  const recommendations = (recommendationSlice.recommendations?.items || []).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0b0b0b] px-4 pb-16 pt-8 sm:px-8 lg:px-12 xl:px-20">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="overflow-hidden rounded-[2rem] border border-orange-500/15 bg-[#101010] px-6 py-7">
          <div className="flex justify-between">
            <h1 className="text-3xl font-black text-white">{heading}</h1>
            <div className="text-white">
              Page {page}/{totalPages || 1}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <FilterSection />

          <div>
            {/* SORT + ACTION */}
            <div className="flex justify-between mb-4">
              <p className="text-white">{product.products.length} sản phẩm</p>
                <Button
                  variant="outlined"
                  startIcon={<AutoAwesome />}
                  endIcon={showRecommendations ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  onClick={() => setShowRecommendations((prev) => !prev)}
                  sx={recommendationButtonSx}
                >
                  Xem gợi ý dành cho bạn
                </Button>
              <FormControl size="small" sx={selectSx}>
                <Select value={sort} displayEmpty onChange={handleSortChange}>
                  <MenuItem value="">Mặc định</MenuItem>
                  <MenuItem value="price_low">Giá thấp đến cao</MenuItem>
                  <MenuItem value="price_high">Giá cao đến thấp</MenuItem>
                </Select>
              </FormControl>
            </div>
 <Collapse in={showRecommendations} timeout={280} unmountOnExit>
              <section className="overflow-hidden rounded-[1.7rem] my-4 border border-orange-500/15 bg-[linear-gradient(135deg,rgba(249,115,22,0.12),rgba(255,255,255,0.02))] px-4 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:px-5">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300">Recommendation</p>
                    <h2 className="mt-2 text-2xl font-black text-white">Danh sách gợi ý dành cho bạn</h2>
                  </div>
                  
                </div>

                {recommendationSlice.loading ? (
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-6 py-10 text-center text-slate-300">
                    Đang tải gợi ý...
                  </div>
                ) : recommendations.length === 0 ? (
                  <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-white/[0.03] px-6 py-10 text-center text-slate-300">
                    Chưa có gợi ý phù hợp
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {recommendations.map((item: RecommendedProductDto) => (
                      <button
                        key={item.productId}
                        type="button"
                        onClick={() => navigate(`/product-details/${item.title.replaceAll("/", "_")}/${item.productId}`)}
                        className="group overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#101010] text-left transition duration-300 hover:-translate-y-1 hover:border-orange-400/35 hover:shadow-[0_20px_40px_rgba(249,115,22,0.12)]"
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-white/[0.04]">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <div className="mb-3 inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-300">
                            {sourceLabelMap[item.source] || "Goi y"}
                          </div>
                          <h3 className="min-h-[3.2rem] text-sm font-black leading-6 text-white">{item.title}</h3>
                          <div className="mt-4 flex items-end justify-between gap-3">
                            <div>
                              <p className="text-base font-black text-orange-400">{formatCurrencyVND(item.sellingPrice)}</p>
                              <p className="mt-1 text-xs text-slate-500 line-through">{formatCurrencyVND(item.mrpPrice)}</p>
                            </div>
                            {/* <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                              Score {item.score.toFixed(1)}
                            </div> */}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </Collapse>
            {/* PRODUCT LIST */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {paginatedProducts.map((item: ProductType) => (
                <ProductCard key={item.id} product={item} />
              ))}

              {product.products.length === 0 && (
                <div className="col-span-full text-center text-white">
                  Không có sản phẩm
                </div>
              )}
            </section>

            {/* PAGINATION */}
            <div className="flex justify-center pt-6">
              <Pagination
                page={page}
                onChange={(e, value) => handlePageChange(value)}
                count={totalPages || 1}
                shape="rounded"
                sx={{
                  "& .Mui-selected": {
                    backgroundColor: "#f97316 !important",
                    color: "#111",
                    fontWeight: 800,
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;