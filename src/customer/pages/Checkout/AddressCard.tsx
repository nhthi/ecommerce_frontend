import { Radio } from "@mui/material";
import React from "react";

const AddressCard = () => {
  const handleChange = (e: any) => {};

  return (
    <div className="flex border rounded-md p-5">
      <div>
        <Radio
          checked={true}
          onChange={handleChange}
          value=""
          name="radio-button"
        />
      </div>
      <div className="space-y-3 pt-3">
        <h1>Thinh</h1>
        <p className="w-[320px]">Sa Dec city, Dong Thap province, VietNam.</p>
        <p>
          <strong>Mobile : </strong> 0387703391
        </p>
      </div>
    </div>
  );
};

export default AddressCard;
