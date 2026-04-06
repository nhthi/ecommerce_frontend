import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import FilterSection from "./FilterSection";
import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FilterAlt } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchAllProducts } from "../../../state/customer/productSlice";
import { useParams, useSearchParams } from "react-router-dom";
import { Product as ProductType } from "../../../types/ProductType";

const selectSx = {
  minWidth: 220,
  "& .MuiOutlinedInput-root": {
    borderRadius: "999px",
    color: "white",
    backgroundColor: "rgba(255,255,255,0.04)",
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.1)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(249,115,22,0.35)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#f97316",
    },
  },
  "& .MuiSvgIcon-root": {
    color: "rgba(255,255,255,0.65)",
  },
};

const SearchProduct = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [sort, setSort] = useState<string>("");
  const [page, setPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const product = useAppSelector((store) => store.product);
  const { category } = useParams();
  const keyword = searchParams.get("keyword") || "san pham";

  const handleChange = (e: any) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handlePageChange = (value: number) => {
    setPage(value);
  };

  useEffect(() => {
    const [minPrice, maxPrice] = searchParams.get("price")?.split("-") || [];
    const color = searchParams.get("color");
    const brand = searchParams.get("brand");
    const keywordQuery = searchParams.get("keyword");
    const minDiscount = searchParams.get("discount") ? Number(searchParams.get("discount")) : undefined;
    const pageNumber = page - 1;

    dispatch(
      fetchAllProducts({
        color: color || undefined,
        brand: brand || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minDiscount,
        pageNumber,
        category,
        keyword: keywordQuery || undefined,
        sort: sort || undefined,
      }),
    );
  }, [searchParams, page, category, sort, dispatch]);

  return (
    <div className="min-h-screen bg-[#0b0b0b] px-4 pb-16 pt-8 sm:px-8 lg:px-12 xl:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] border border-orange-500/15 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_30%),linear-gradient(180deg,_#171717_0%,_#101010_100%)] px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:px-8 lg:px-10">
          <div className="space-y-3">
            <span className="inline-flex w-fit items-center rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-300">
              Kết quả tìm kiếm
            </span>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">Ket qua cho: {keyword}</h1>
            <p className="max-w-2xl text-sm leading-6 text-neutral-300 sm:text-base">
              Tìm thấy {product.products.length || 0} sản phẩm phù hợp. Bạn thể lọc theo danh mục, giá, mức giảm và màu sắc.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <section className="hidden lg:block lg:sticky lg:top-24">
            <FilterSection />
          </section>

          <div className="space-y-5">
            <div className="flex flex-col gap-3 rounded-[1.8rem] border border-white/10 bg-[#121212] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                {!isLarge && (
                  <IconButton
                    onClick={() => setShowMobileFilter((prev) => !prev)}
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "999px",
                      color: "#fdba74",
                      border: "1px solid rgba(249,115,22,0.25)",
                      backgroundColor: "rgba(249,115,22,0.08)",
                    }}
                  >
                    <FilterAlt sx={{ fontSize: 20 }} />
                  </IconButton>
                )}
                <div>
                  <p className="text-lg font-black tracking-tight text-white">Danh sách tìm kiếm</p>
                  <p className="text-sm text-neutral-400">{product.products.length || 0} Kết quả đang hiển thị.</p>
                </div>
              </div>

              <FormControl size="small" sx={selectSx}>
                <Select value={sort} displayEmpty onChange={handleChange}>
                  <MenuItem value="">Mắc định</MenuItem>
                  <MenuItem value="price_low">Giá thấp đến cao</MenuItem>
                  <MenuItem value="price_high">Giá cao đến thấp</MenuItem>
                </Select>
              </FormControl>
            </div>

            {!isLarge && showMobileFilter && (
              <Box>
                <FilterSection />
              </Box>
            )}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {product.products.map((item: ProductType) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </section>

            {product.products.length === 0 && (
              <div className="rounded-[1.8rem] border border-dashed border-white/10 bg-[#121212] px-6 py-12 text-center shadow-[0_16px_45px_rgba(0,0,0,0.24)]">
                <p className="text-2xl font-black tracking-tight text-white">Không tìm thấy kết quả</p>
                <p className="mt-2 text-sm leading-6 text-neutral-400">Hãy thay đổi từ khóa tìm kiếm hoặc bộ lọc để xem thêm sản phẩm liên quan.</p>
              </div>
            )}

            {product.totalPages > 1 && (
              <div className="flex justify-center pt-4">
                <Pagination
                  page={page}
                  onChange={(e, value) => handlePageChange(value)}
                  count={product.totalPages}
                  shape="rounded"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "rgba(255,255,255,0.78)",
                      borderColor: "rgba(255,255,255,0.12)",
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#f97316 !important",
                      color: "#111111",
                      fontWeight: 800,
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProduct;
