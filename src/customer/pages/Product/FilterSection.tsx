import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useState } from "react";
import { colors } from "../../../data/Filter/color";
import { useSearchParams } from "react-router-dom";
import { prices } from "../../../data/Filter/price";
import { brands } from "../../../data/Filter/brand";
import { discounts } from "../../../data/Filter/discount";

const FilterSection = () => {
  const [expendColor, setExpendColor] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const handleColorToggle = () => {
    setExpendColor(!expendColor);
  };

  const updateFilterParams = (e: any) => {
    const { value, name } = e.target;
    if (value) {
      searchParams.set(name, value);
    } else {
      searchParams.delete(name);
    }
    setSearchParams(searchParams);
  };

  // const clearAllFilters = () => {
  //   searchParams.forEach((value: any, key: any) => {
  //     searchParams.delete(key);
  //   });
  //   setSearchParams(searchParams);
  // };
  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    setSearchParams(newParams);
  };
  return (
    <div className="-z-50 space-y-5 bg-white">
      <div className="flex items-center justify-between h-[40px] px-9 lg:border-r">
        <p className="text-lg font-semibold">Filters</p>
        <Button
          size="small"
          className="text-primary-color cursor-pointer font-semibold"
          onClick={clearAllFilters}
        >
          Clear all
        </Button>
      </div>
      <Divider />
      <div className="px-9 space-y-6">
        <section className="border-b">
          <FormControl>
            <FormLabel
              className="text-2xl font-semibold"
              id="color"
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#0097e6",
                pb: "14px",
              }}
            >
              Color
            </FormLabel>
            <RadioGroup
              aria-labelledby="color"
              defaultValue=""
              name="color"
              onChange={updateFilterParams}
            >
              {colors
                .slice(0, expendColor ? colors.length : 5)
                .map((item, index) => (
                  <FormControlLabel
                    value={item.name}
                    control={<Radio />}
                    label={
                      <div className="flex items-center gap-3">
                        <p>{item.name}</p>
                        <p
                          style={{ backgroundColor: item.hex }}
                          className={`h-5 w-5 rounded-full ${
                            item.name === "White" ? "border border-2" : ""
                          }`}
                        ></p>
                      </div>
                    }
                  />
                ))}
            </RadioGroup>
          </FormControl>
          <div>
            <Button
              sx={{ color: "GrayText" }}
              className="hover:text-primary-color"
              onClick={handleColorToggle}
            >
              {expendColor ? "Hide" : `+ ${colors.length - 5} more`}
            </Button>
          </div>
        </section>

        <section className="border-b">
          <FormControl>
            <FormLabel
              className="text-2xl font-semibold"
              id="price"
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#0097e6",
                pb: "14px",
              }}
            >
              Price
            </FormLabel>
            <RadioGroup
              aria-labelledby="price"
              defaultValue=""
              name="price"
              onChange={updateFilterParams}
            >
              {prices.map((item, index) => (
                <FormControlLabel
                  value={item.value}
                  key={item.price}
                  control={<Radio size="small" />}
                  label={item.price}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>

        <section className="border-b">
          <FormControl>
            <FormLabel
              className="text-2xl font-semibold"
              id="brand"
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#0097e6",
                pb: "14px",
              }}
            >
              Brand
            </FormLabel>
            <RadioGroup
              aria-labelledby="brand"
              defaultValue=""
              name="brand"
              onChange={updateFilterParams}
            >
              {brands.map((item, index) => (
                <FormControlLabel
                  value={item.value}
                  key={item.name}
                  control={<Radio size="small" />}
                  label={item.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>

        <section className="border-b">
          <FormControl>
            <FormLabel
              className="text-2xl font-semibold"
              id="discount"
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#0097e6",
                pb: "14px",
              }}
            >
              Discount
            </FormLabel>
            <RadioGroup
              aria-labelledby="discount"
              defaultValue=""
              name="discount"
              onChange={updateFilterParams}
            >
              {discounts.map((item, index) => (
                <FormControlLabel
                  value={item.value}
                  key={item.name}
                  control={<Radio size="small" />}
                  label={item.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>
      </div>
    </div>
  );
};

export default FilterSection;
