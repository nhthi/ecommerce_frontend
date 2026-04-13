import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { colors } from "../../../data/Filter/color";
import { prices } from "../../../data/Filter/price";
import { discounts } from "../../../data/Filter/discount";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchAllCategory } from "../../../state/admin/adminCategorySlice";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const FilterSection = () => {
  const dispatch = useAppDispatch();
  const { category } = useAppSelector((store) => store);
  const [searchParams, setSearchParams] = useSearchParams();
  const { isDark } = useSiteThemeMode();

  useEffect(() => {
    if (!category.categories?.length) {
      dispatch(fetchAllCategory());
    }
  }, [category.categories?.length, dispatch]);

  const productCategories = useMemo(
    () =>
      (category.categories || [])
        .filter((item) => item.level === 1)
        .map((item) => ({
          label: item.name || item.categoryId,
          value: item.name || item.categoryId,
        })),
    [category.categories]
  );

  const updateFilterValue = (name: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    const currentValue = searchParams.get(name) || "";

    if (currentValue === value) {
      nextParams.delete(name);
    } else if (value) {
      nextParams.set(name, value);
    } else {
      nextParams.delete(name);
    }

    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const selectedCategory = searchParams.get("keyword") || "";
  const selectedColor = searchParams.get("color") || "";
  const selectedPrice = searchParams.get("price") || "";
  const selectedDiscount = searchParams.get("discount") || "";

  const accordionSx = {
    boxShadow: "none",
    backgroundColor: "transparent",
    color: isDark ? "#ffffff" : "#0f172a",
    borderBottom: isDark
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid rgba(15,23,42,0.08)",
    "&::before": { display: "none" },
    "& .MuiAccordionSummary-root": {
      minHeight: 50,
      px: 0,
    },
    "& .MuiAccordionSummary-content": {
      my: 1.2,
    },
    "& .MuiAccordionDetails-root": {
      px: 0,
      pb: 1.4,
      pt: 0,
    },
  };

  const renderGroup = (
    title: string,
    items: { label: string; value: string }[],
    selectedValue: string,
    paramName: string,
    defaultExpanded = false
  ) => (
    <Accordion disableGutters defaultExpanded={defaultExpanded} sx={accordionSx}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#fb923c" }} />}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: isDark ? "#fdba74" : "#c2410c",
          }}
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={0.8}>
          {items.map((item) => {
            const active = selectedValue === item.value;
            return (
              <button
                key={`${paramName}-${item.value}`}
                type="button"
                onClick={() => updateFilterValue(paramName, item.value)}
                className={
                  active
                    ? "rounded-2xl bg-orange-500 px-4 py-3 text-left text-sm font-semibold text-black transition"
                    : isDark
                    ? "rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                    : "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                }
              >
                {item.label}
              </button>
            );
          })}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <div>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={1.2}
        sx={{ mb: 1.2 }}
      >
        <Button
          size="small"
          onClick={clearAllFilters}
          sx={{
            minWidth: "unset",
            textTransform: "none",
            borderRadius: "999px",
            px: 2,
            py: 0.75,
            fontWeight: 700,
            fontSize: 13,
            color: isDark ? "#fdba74" : "#c2410c",
            border: "1px solid rgba(249,115,22,0.24)",
            backgroundColor: "rgba(249,115,22,0.06)",
            "&:hover": {
              backgroundColor: "rgba(249,115,22,0.12)",
            },
          }}
        >
          Xóa bộ lọc
        </Button>
      </Stack>

      {renderGroup("Danh mục", productCategories, selectedCategory, "keyword", true)}
      {renderGroup(
        "Khoảng giá",
        prices.map((item) => ({ label: item.price, value: item.value })),
        selectedPrice,
        "price"
      )}
      {renderGroup(
        "Mức giảm giá",
        discounts.map((item) => ({ label: item.name, value: item.value })),
        selectedDiscount,
        "discount"
      )}
      {renderGroup(
        "Màu sắc",
        colors.slice(0, 10).map((item) => ({ label: item.name, value: item.name })),
        selectedColor,
        "color"
      )}
    </div>
  );
};

export default FilterSection;