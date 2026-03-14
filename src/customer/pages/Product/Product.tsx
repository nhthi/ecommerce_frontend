import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import FilterSection from "./FilterSection";
import {
  Box,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
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

const Product = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [sort, setSort] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const product = useAppSelector((store) => store.product);
  const { category } = useParams();

  const handleSortChange = (e: any) => {
    setSort(e.target.value);
    setPage(1); // đổi sort thì quay về trang 1
  };

  const handlePageChange = (value: number) => {
    setPage(value);
  };

  useEffect(() => {
    const [minPrice, maxPrice] = searchParams.get("price")?.split("-") || [];
    const color = searchParams.get("color");
    const minDiscount = searchParams.get("discount")
      ? Number(searchParams.get("discount"))
      : undefined;
    const pageNumber = page - 1;

    const newFilter = {
      color: color || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minDiscount,
      pageNumber,
      category,
      sort,
    };
    console.log("filter", newFilter);

    dispatch(fetchAllProducts(newFilter));
  }, [searchParams, page, category, sort, dispatch]);

  const totalPages = product.totalPages || 1;

  return (
    <div className="mt-10 bg-slate-50 min-h-screen pb-16">
      {/* Tiêu đề */}
      <div className="px-4 lg:px-10 mb-4">
        <h1 className="text-2xl md:text-3xl text-center font-bold text-slate-800 pb-2 uppercase tracking-wide">
          Kết quả cho: {category}
        </h1>
        <p className="text-center text-xs md:text-sm text-slate-500">
          Tìm thấy{" "}
          <span className="font-semibold text-slate-700">
            {product.products.length || 0}
          </span>{" "}
          sản phẩm phù hợp
        </p>
      </div>

      <div className="lg:flex px-4 lg:px-10 gap-5">
        {/* Filter sidebar (desktop) */}
        <section className="filter_section hidden lg:block w-[22%] lg:sticky lg:top-24 self-start">
          <FilterSection />
        </section>

        {/* Danh sách + filter mobile */}
        <div className="w-full lg:w-[78%] space-y-5">
          {/* Thanh điều khiển trên */}
          <div className="flex justify-between items-center px-1 md:px-3 h-[52px]">
            {/* Mobile filter toggle */}
            <div className="flex items-center gap-2">
              {!isLarge && (
                <>
                  <IconButton
                    onClick={() => setShowMobileFilter((prev) => !prev)}
                    sx={{
                      borderRadius: "999px",
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <FilterAlt sx={{ fontSize: 20 }} />
                  </IconButton>
                  <span className="text-xs text-slate-600">
                    Bộ lọc nâng cao
                  </span>
                </>
              )}
            </div>

            {/* Sort */}
            <FormControl size="small" sx={{ width: "220px" }}>
              <InputLabel id="sort-label">Sắp xếp</InputLabel>
              <Select
                labelId="sort-label"
                id="sort-select"
                value={sort || ""}
                label="Sắp xếp"
                onChange={handleSortChange}
              >
                <MenuItem value={""}>Mặc định</MenuItem>
                <MenuItem value={"price_low"}>Giá: Thấp → Cao</MenuItem>
                <MenuItem value={"price_high"}>Giá: Cao → Thấp</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Filter mobile */}
          {!isLarge && showMobileFilter && (
            <Box className="mb-3">
              <FilterSection />
            </Box>
          )}

          <Divider />

          {/* Grid sản phẩm */}
          <section
            className="products_section grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          gap-y-5 gap-x-4 px-1 md:px-2 lg:px-0 justify-center"
          >
            {product.products.map((item: ProductType) => (
              <ProductCard key={item.id} product={item} />
            ))}

            {product.products.length === 0 && (
              <div className="col-span-full py-10 text-center text-sm text-slate-500">
                Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
              </div>
            )}
          </section>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-8">
              <Pagination
                page={page}
                onChange={(e, value) => handlePageChange(value)}
                count={totalPages}
                shape="rounded"
                color="primary"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
