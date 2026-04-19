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
import { smartSearchProduct } from "../../../state/customer/productSlice";
import { useParams, useSearchParams } from "react-router-dom";
import { Product as ProductType } from "../../../types/ProductType";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const ITEMS_PER_PAGE = 12;

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

  // FETCH DATA (KHÔNG dùng page backend)
  useEffect(() => {
    const [_, maxPrice] = searchParams.get("price")?.split("-") || [];
    const keywordQuery = searchParams.get("keyword");

    dispatch(
      smartSearchProduct({
        query: keywordQuery || "",
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        limit: 1000, // lấy nhiều để FE tự chia page
      })
    );
  }, [searchParams, category, sort, dispatch]);

  // FRONTEND PAGINATION
  const totalPages = Math.ceil((product.products?.length || 0) / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    let list = [...product.products];

    // SORT tại FE (nếu cần)
    if (sort === "price_low") {
      list.sort((a, b) => a.sellingPrice - b.sellingPrice);
    }
    if (sort === "price_high") {
      list.sort((a, b) => b.sellingPrice - a.sellingPrice);
    }

    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return list.slice(start, end);
  }, [product.products, page, sort]);

  return (
    <div className="min-h-screen bg-[#0b0b0b] px-4 pb-16 pt-8 sm:px-8 lg:px-12 xl:px-20">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="overflow-hidden rounded-[2rem] border border-orange-500/15 bg-[#101010] px-6 py-7">
          <div className="flex justify-between">
            <h1 className="text-3xl font-black text-white uppercase">{keyword}</h1>
            <div className="text-white">
              Page {page}/{totalPages || 1}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          
          {/* FILTER */}
          <section className="lg:sticky lg:top-24">
            <FilterSection />
          </section>

          <div className="space-y-5">

            {/* SORT */}
            <div className="flex justify-between rounded-[1.6rem] border border-white/10 bg-[#121212] px-4 py-3">
              <p className="text-neutral-300">
                {product.products.length || 0} ket qua
              </p>

              <FormControl size="small" sx={selectSx}>
                <Select value={sort} displayEmpty onChange={handleChange}>
                  <MenuItem value="">Mac dinh</MenuItem>
                  <MenuItem value="price_low">Gia thap den cao</MenuItem>
                  <MenuItem value="price_high">Gia cao den thap</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* LIST */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {paginatedProducts.map((item: ProductType) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </section>

            {/* EMPTY */}
            {product.products.length === 0 && (
              <div className="text-center text-white py-12">
                Khong tim thay ket qua
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center pt-4">
                <Pagination
                  page={page}
                  onChange={(e, value) => handlePageChange(value)}
                  count={totalPages}
                  shape="rounded"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: isDark ? "rgba(255,255,255,0.78)" : "#334155",
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#f97316 !important",
                      color: "#111",
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