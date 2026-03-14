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

const SearchProduct = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [sort, setSort] = useState();
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const product = useAppSelector((store) => store.product);
  const handleChange = (e: any) => {
    setSort(e.target.value);
  };
  const { category } = useParams();
  const handlePageChange = (value: number) => {
    setPage(value);
  };
  const keyword = searchParams.get("keyword");

  useEffect(() => {
    const [minPrice, maxPrice] = searchParams.get("price")?.split("-") || [];
    const color = searchParams.get("color");
    const keyword = searchParams.get("keyword");

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
      keyword,
      sort,
    };
    console.log("flter", newFilter);

    dispatch(fetchAllProducts(newFilter));
  }, [searchParams, page, category, sort]);
  return (
    <div className="-z-10 mt-10">
      <div className="px-4 lg:px-10 mb-4">
        <h1 className="text-2xl md:text-3xl text-center font-bold text-slate-800 pb-2 uppercase tracking-wide">
          Kết quả cho: {keyword}
        </h1>
        <p className="text-center text-xs md:text-sm text-slate-500">
          Tìm thấy{" "}
          <span className="font-semibold text-slate-700">
            {product.products.length || 0}
          </span>{" "}
          sản phẩm phù hợp
        </p>
      </div>
      <div className="lg:flex">
        <section className="filter_section hidden lg:block w-[20%]">
          <FilterSection />
        </section>
        <div className="w-full lg:w-[80%] space-y-5">
          <div className="flex justify-between items-center px-9 h-[40px]">
            <div className="relative w-[50%]">
              {!isLarge && (
                <IconButton>
                  <FilterAlt />
                </IconButton>
              )}
              {!isLarge && (
                <Box>
                  <FilterSection />
                </Box>
              )}
            </div>
            <FormControl size="small" sx={{ width: "200px" }}>
              <InputLabel id="demo-simple-select-label">Sort</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sort}
                label="Sort"
                onChange={handleChange}
              >
                <MenuItem value={"price_low"}>Price: Low - High</MenuItem>
                <MenuItem value={"price_high"}>Price: High - Low</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Divider />
          <section
            className="products_section grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          gap-y-5 px-5 justify-center"
          >
            {product.products.map((item: ProductType) => (
              <ProductCard product={item} />
            ))}
          </section>
          <div className="flex justify-center py-10">
            <Pagination
              onChange={(e, value) => handlePageChange(value)}
              count={product.totalPages}
              shape="rounded"
              color="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProduct;
