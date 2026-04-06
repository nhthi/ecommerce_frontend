import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import FilterSection from "./FilterSection";
import {
  FormControl,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchAllProducts } from "../../../state/customer/productSlice";
import { useParams, useSearchParams } from "react-router-dom";
import { Product as ProductType } from "../../../types/ProductType";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const SearchProduct = () => {
  const [sort, setSort] = useState<string>("");
  const [page, setPage] = useState(1);
  const { isDark } = useSiteThemeMode();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const product = useAppSelector((store) => store.product);
  const { category } = useParams();
  const keyword = searchParams.get("keyword") || "san pham";

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
        <div className="overflow-hidden rounded-[2rem] border border-orange-500/15 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_30%),linear-gradient(180deg,_#171717_0%,_#101010_100%)] px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:px-8 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <span className="inline-flex w-fit items-center rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-300">
                Search
              </span>
              <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">{keyword}</h1>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-center self-start lg:self-auto">
              <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Items</p>
              <p className="mt-1 text-2xl font-black text-white">{product.products.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <section className="lg:sticky lg:top-24">
            <FilterSection />
          </section>

          <div className="space-y-5">
            <div className="flex flex-col gap-3 rounded-[1.6rem] border border-white/10 bg-[#121212] px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-neutral-300">{product.products.length || 0} ket qua</p>

              <FormControl size="small" sx={selectSx}>
                <Select value={sort} displayEmpty onChange={handleChange}>
                  <MenuItem value="">Mac dinh</MenuItem>
                  <MenuItem value="price_low">Gia thap den cao</MenuItem>
                  <MenuItem value="price_high">Gia cao den thap</MenuItem>
                </Select>
              </FormControl>
            </div>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {product.products.map((item: ProductType) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </section>

            {product.products.length === 0 && (
              <div className="rounded-[1.6rem] border border-dashed border-white/10 bg-[#121212] px-6 py-12 text-center shadow-[0_16px_45px_rgba(0,0,0,0.24)]">
                <p className="text-2xl font-black tracking-tight text-white">Khong tim thay ket qua</p>
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
                      color: isDark ? "rgba(255,255,255,0.78)" : "#334155",
                      borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.12)",
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
