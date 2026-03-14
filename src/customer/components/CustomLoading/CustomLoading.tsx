import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const CustomLoading = ({ message = "Đang xử lý...", fullScreen = true }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" : "py-6"
      }`}
    >
      <CircularProgress color="primary" size={60} thickness={4} />
      <p className="text-white text-sm font-semibold mt-4">{message}</p>
    </div>
  );
};

export default CustomLoading;
