import React from "react";
import { Box } from "@mui/material";

interface TabPanelProps {
  value: number;
  index: number;
  children: React.ReactNode;
}

const DashboardTabPanel = ({ value, index, children }: TabPanelProps) => {
  if (value !== index) return null;
  return <Box sx={{ mt: 3 }}>{children}</Box>;
};

export default DashboardTabPanel;
