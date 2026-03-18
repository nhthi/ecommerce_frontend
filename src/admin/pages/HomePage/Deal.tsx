import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import DealTable from "./DealTable";
import DealCategory from "./DealCategory";
import CreateDealForm from "./CreateDealForm";

const tabs = ["Deals", "Category", "Create Deal"];

const Deal = () => {
  const [activeDeal, setActiveDeal] = React.useState("Deals");

  return (
    <Box className="space-y-5 text-white">
      <Paper
        elevation={0}
        sx={{
          borderRadius: "28px",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
          boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
          p: { xs: 3, lg: 4 },
        }}
      >
        <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography fontSize={28} fontWeight={800}>Home banners va deal</Typography>
            <Typography sx={{ mt: 0.8, color: "rgba(255,255,255,0.62)", fontSize: 14.5 }}>
              Quan ly khoi khuyen mai tren trang chu theo mot giao dien gon va dong bo voi theme admin.
            </Typography>
          </Box>
          <Chip label="Home management" variant="outlined" sx={{ color: "#fff7ed", borderColor: "rgba(249,115,22,0.28)" }} />
        </Stack>
        <Stack direction="row" spacing={1.2} flexWrap="wrap" sx={{ mt: 2.5 }}>
          {tabs.map((item) => (
            <Button
              key={item}
              variant={activeDeal === item ? "contained" : "outlined"}
              onClick={() => setActiveDeal(item)}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                px: 2.4,
                color: activeDeal === item ? "white" : "#fff7ed",
                borderColor: "rgba(255,255,255,0.12)",
                background: activeDeal === item ? "linear-gradient(135deg, #f97316, #ea580c)" : "transparent",
              }}
            >
              {item}
            </Button>
          ))}
        </Stack>
      </Paper>

      {activeDeal === "Deals" ? <DealTable /> : activeDeal === "Category" ? <DealCategory /> : <CreateDealForm />}
    </Box>
  );
};

export default Deal;
