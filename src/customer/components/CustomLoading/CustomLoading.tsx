import React from "react";
import { Box, Typography } from "@mui/material";
import { FitnessCenter } from "@mui/icons-material";

interface CustomLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const spinKeyframes = {
  "@keyframes ring-spin": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },
  "@keyframes pulse-bar": {
    "0%, 100%": { opacity: 0.35, transform: "scaleY(0.75)" },
    "50%": { opacity: 1, transform: "scaleY(1)" },
  },
};

const CustomLoading = ({ message = "Dang xu ly...", fullScreen = true }: CustomLoadingProps) => {
  return (
    <Box
      sx={{
        position: fullScreen ? "fixed" : "relative",
        inset: fullScreen ? 0 : "auto",
        zIndex: fullScreen ? 50 : "auto",
        minHeight: fullScreen ? "100vh" : 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background: fullScreen ? "rgba(0,0,0,0.5)" : "transparent",
        backdropFilter: fullScreen ? "blur(8px)" : "none",
        ...spinKeyframes,
      }}
    >
      <Box
        sx={{
          width: "min(92vw, 360px)",
          borderRadius: "28px",
          border: "1px solid rgba(249,115,22,0.18)",
          background:
            "radial-gradient(circle at top, rgba(249,115,22,0.14), transparent 30%), linear-gradient(180deg, rgba(20,20,20,0.96), rgba(8,8,8,0.98))",
          boxShadow: "0 28px 80px rgba(0,0,0,0.34)",
          px: 3,
          py: 3.5,
          textAlign: "center",
          color: "white",
        }}
      >
        <Box sx={{ position: "relative", width: 124, height: 124, mx: "auto" }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "999px",
              border: "3px solid rgba(249,115,22,0.18)",
              borderTopColor: "#f97316",
              borderRightColor: "#fb923c",
              animation: "ring-spin 1.4s linear infinite",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 14,
              borderRadius: "999px",
              border: "2px dashed rgba(255,255,255,0.12)",
              animation: "ring-spin 2.6s linear infinite reverse",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 26,
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "radial-gradient(circle, rgba(249,115,22,0.18), rgba(249,115,22,0.05))",
              boxShadow: "inset 0 0 24px rgba(249,115,22,0.12)",
            }}
          >
            <FitnessCenter sx={{ fontSize: 40, color: "#fb923c", transform: "rotate(-18deg)" }} />
          </Box>
        </Box>

        <Typography sx={{ mt: 2.4, fontSize: 22, fontWeight: 800, letterSpacing: "0.01em", color: "#fff7ed" }}>
          NHTHI FIT
        </Typography>
        <Typography sx={{ mt: 1, fontSize: 14.5, lineHeight: 1.6, color: "rgba(255,255,255,0.72)" }}>
          {message}
        </Typography>

        <Box sx={{ mt: 2.4, display: "flex", justifyContent: "center", gap: 0.8 }}>
          {[0, 1, 2].map((item) => (
            <Box
              key={item}
              sx={{
                width: 8,
                height: 24,
                borderRadius: "999px",
                background: "linear-gradient(180deg, #fb923c, #f97316)",
                transformOrigin: "bottom center",
                animation: "pulse-bar 0.9s ease-in-out infinite",
                animationDelay: `${item * 0.16}s`,
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CustomLoading;
