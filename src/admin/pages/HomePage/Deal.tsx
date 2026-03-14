import { Button } from "@mui/material";
import React from "react";
import DealTable from "./DealTable";
import DealCategory from "./DealCategory";
import CreateDealForm from "./CreateDealForm";

const tabs = ["Deals", "Category", "Create Deal"];
const Deal = () => {
  const [activeDeal, setActiveDeal] = React.useState("Deals");
  return (
    <div>
      <div className="flex gap-4 ">
        {tabs.map((item) => (
          <Button
            key={item}
            variant={`${activeDeal === item ? "contained" : "outlined"}`}
            color="primary"
            onClick={() => setActiveDeal(item)}
          >
            {item}
          </Button>
        ))}
      </div>
      <div className="mt-5">
        {activeDeal === "Deals" ? (
          <DealTable />
        ) : activeDeal === "Category" ? (
          <DealCategory />
        ) : (
          <div className="mt-5 flex flex-col justify-center items-center h-[70vh]">
            <CreateDealForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Deal;
