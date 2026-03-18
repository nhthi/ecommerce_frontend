import {
  Button,
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

const accordionSx = {
  boxShadow: "none",
  backgroundColor: "rgba(255,255,255,0.02)",
  color: "white",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "16px",
  overflow: "hidden",
  "&::before": { display: "none" },
  "& .MuiAccordionSummary-root": {
    minHeight: 52,
    paddingInline: "14px",
  },
  "& .MuiAccordionSummary-content": {
    margin: "12px 0",
  },
  "& .MuiAccordionDetails-root": {
    paddingInline: "14px",
    paddingBottom: "14px",
    paddingTop: 0,
  },
};

const radioSx = {
  color: "rgba(255,255,255,0.28)",
  "&.Mui-checked": {
    color: "#f97316",
  },
};

const labelSx = {
  "& .MuiFormControlLabel-label": {
    fontSize: "14px",
    color: "rgba(255,255,255,0.84)",
  },
  borderRadius: "10px",
  alignItems: "flex-start",
  marginLeft: 0,
  marginRight: 0,
  paddingInline: "4px",
  paddingBlock: "2px",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.03)",
  },
};

const sectionTitleSx = {
  fontSize: 15,
  fontWeight: 800,
  color: "white",
};

const FilterSection = () => {
  const [expandColor, setExpandColor] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const updateFilterParams = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(name, value);
    } else {
      nextParams.delete(name);
    }
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const selectedColor = searchParams.get("color") || "";
  const selectedPrice = searchParams.get("price") || "";
  const selectedBrand = searchParams.get("brand") || "";
  const selectedDiscount = searchParams.get("discount") || "";

  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-orange-500/12 bg-[#121212] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
      <div className="border-b border-white/8 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300">
              Bộ lọc
            </p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-white">
              Bộ lọc sản phẩm
            </h2>
          </div>

          <Button
            size="small"
            onClick={clearAllFilters}
            sx={{
              textTransform: "none",
              minWidth: "fit-content",
              whiteSpace: "nowrap",
              px: 1.8,
              py: 0.7,
              borderRadius: "999px",
              fontWeight: 700,
              fontSize: "0.76rem",
              color: "#fdba74",
              border: "1px solid rgba(249,115,22,0.24)",
              backgroundColor: "rgba(249,115,22,0.06)",
              "&:hover": {
                backgroundColor: "rgba(249,115,22,0.12)",
                borderColor: "rgba(249,115,22,0.34)",
              },
            }}
          >
            Xóa tất cả
          </Button>
        </div>

        <p className="mt-2 text-sm leading-6 text-neutral-400">
          Chọn nhanh theo màu sắc, giá, thương hiệu và mức giảm giá.
        </p>
      </div>

      <div className="mt-4 space-y-3">
        <Accordion disableGutters defaultExpanded sx={accordionSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18, color: "#fdba74" }} />}>
            <FormLabel id="color" sx={sectionTitleSx}>
              Màu sắc
            </FormLabel>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup aria-labelledby="color" name="color" value={selectedColor} onChange={updateFilterParams}>
                {colors.slice(0, expandColor ? colors.length : 5).map((item) => (
                  <FormControlLabel
                    key={item.name}
                    value={item.name}
                    control={<Radio size="small" sx={radioSx} />}
                    sx={labelSx}
                    label={
                      <div className="flex items-center gap-3">
                        <p className="w-24 text-sm text-neutral-200">{item.name}</p>
                        <span
                          style={{ backgroundColor: item.hex }}
                          className={`h-5 w-5 rounded-full border ${item.name === "White" ? "border-slate-300" : "border-white/10"}`}
                        />
                      </div>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
            {colors.length > 5 && (
              <div className="pt-2">
                <Button
                  onClick={() => setExpandColor(!expandColor)}
                  sx={{
                    textTransform: "none",
                    color: "#fdba74",
                    fontSize: "12px",
                    fontWeight: 700,
                    borderRadius: "999px",
                    px: 1,
                    "&:hover": {
                      backgroundColor: "rgba(249,115,22,0.08)",
                      color: "#fb923c",
                    },
                  }}
                >
                  {expandColor ? "Thu gọn" : `+ ${colors.length - 5} màu khác`}
                </Button>
              </div>
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters sx={accordionSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18, color: "#fdba74" }} />}>
            <FormLabel id="price" sx={sectionTitleSx}>
              Khoảng giá
            </FormLabel>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup aria-labelledby="price" name="price" value={selectedPrice} onChange={updateFilterParams}>
                {prices.map((item) => (
                  <FormControlLabel
                    key={item.price}
                    value={item.value}
                    control={<Radio size="small" sx={radioSx} />}
                    label={item.price}
                    sx={labelSx}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters sx={accordionSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18, color: "#fdba74" }} />}>
            <FormLabel id="brand" sx={sectionTitleSx}>
              Thương hiệu
            </FormLabel>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup aria-labelledby="brand" name="brand" value={selectedBrand} onChange={updateFilterParams}>
                {brands.map((item) => (
                  <FormControlLabel
                    key={item.name}
                    value={item.value}
                    control={<Radio size="small" sx={radioSx} />}
                    label={item.name}
                    sx={labelSx}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters sx={accordionSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18, color: "#fdba74" }} />}>
            <FormLabel id="discount" sx={sectionTitleSx}>
              Mức giảm giá
            </FormLabel>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup aria-labelledby="discount" name="discount" value={selectedDiscount} onChange={updateFilterParams}>
                {discounts.map((item) => (
                  <FormControlLabel
                    key={item.name}
                    value={item.value}
                    control={<Radio size="small" sx={radioSx} />}
                    label={item.name}
                    sx={labelSx}
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