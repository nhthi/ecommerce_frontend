import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";
import { colors } from "../../../data/Filter/color";
import { useSearchParams } from "react-router-dom";
import { prices } from "../../../data/Filter/price";
import { brands } from "../../../data/Filter/brand";
import { discounts } from "../../../data/Filter/discount";

const FilterSection = () => {
  const [expandColor, setExpandColor] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const updateFilterParams = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (value) {
      searchParams.set(name, value);
    } else {
      searchParams.delete(name);
    }
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    setSearchParams(newParams);
  };

  const selectedColor = searchParams.get("color") || "";
  const selectedPrice = searchParams.get("price") || "";
  const selectedBrand = searchParams.get("brand") || "";
  const selectedDiscount = searchParams.get("discount") || "";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between h-[48px] px-5 border-b border-slate-100 bg-slate-50/70">
        <div>
          <p className="text-sm font-semibold text-slate-800 tracking-wide">
            Bộ lọc
          </p>
          <p className="text-[11px] text-slate-500">Thu hẹp kết quả tìm kiếm</p>
        </div>
        <Button
          size="small"
          onClick={clearAllFilters}
          sx={{
            textTransform: "none",
            color: "#0097e6",
            fontWeight: 500,
            fontSize: "12px",
          }}
        >
          Xóa tất cả
        </Button>
      </div>

      {/* Body */}
      <div className="px-3 py-2 text-sm">
        {/* Màu sắc */}
        <Accordion
          disableGutters
          defaultExpanded
          sx={{ boxShadow: "none", "&::before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
          >
            <FormLabel
              id="color"
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Màu sắc
            </FormLabel>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                aria-labelledby="color"
                name="color"
                value={selectedColor}
                onChange={updateFilterParams}
              >
                {colors
                  .slice(0, expandColor ? colors.length : 5)
                  .map((item) => (
                    <FormControlLabel
                      key={item.name}
                      value={item.name}
                      control={<Radio size="small" />}
                      label={
                        <div className="flex items-center gap-3">
                          <p className="w-24 text-sm text-slate-700">
                            {item.name}
                          </p>
                          <span
                            style={{ backgroundColor: item.hex }}
                            className={`h-5 w-5 rounded-full border ${
                              item.name === "White"
                                ? "border-slate-300"
                                : "border-slate-200"
                            }`}
                          ></span>
                        </div>
                      }
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontSize: "13px",
                        },
                      }}
                    />
                  ))}
              </RadioGroup>
            </FormControl>
            {colors.length > 5 && (
              <div className="pt-1">
                <Button
                  onClick={() => setExpandColor(!expandColor)}
                  sx={{
                    textTransform: "none",
                    color: "GrayText",
                    fontSize: "12px",
                    "&:hover": {
                      color: "#0097e6",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  {expandColor ? "Thu gọn" : `+ ${colors.length - 5} màu khác`}
                </Button>
              </div>
            )}
          </AccordionDetails>
        </Accordion>

        <Divider />

        {/* Khoảng giá */}
        <Accordion
          disableGutters
          sx={{ boxShadow: "none", "&::before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
          >
            <FormLabel
              id="price"
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Khoảng giá
            </FormLabel>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                aria-labelledby="price"
                name="price"
                value={selectedPrice}
                onChange={updateFilterParams}
              >
                {prices.map((item) => (
                  <FormControlLabel
                    key={item.price}
                    value={item.value}
                    control={<Radio size="small" />}
                    label={item.price}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: "13px",
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        <Divider />

        {/* Thương hiệu */}
        <Accordion
          disableGutters
          sx={{ boxShadow: "none", "&::before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
          >
            <FormLabel
              id="brand"
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Thương hiệu
            </FormLabel>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                aria-labelledby="brand"
                name="brand"
                value={selectedBrand}
                onChange={updateFilterParams}
              >
                {brands.map((item) => (
                  <FormControlLabel
                    key={item.name}
                    value={item.value}
                    control={<Radio size="small" />}
                    label={item.name}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: "13px",
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        <Divider />

        {/* Giảm giá */}
        <Accordion
          disableGutters
          sx={{ boxShadow: "none", "&::before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
          >
            <FormLabel
              id="discount"
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Mức giảm giá
            </FormLabel>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                aria-labelledby="discount"
                name="discount"
                value={selectedDiscount}
                onChange={updateFilterParams}
              >
                {discounts.map((item) => (
                  <FormControlLabel
                    key={item.name}
                    value={item.value}
                    control={<Radio size="small" />}
                    label={item.name}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: "13px",
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default FilterSection;
