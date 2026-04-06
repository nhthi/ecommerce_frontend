import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

type AdminMode = "dark" | "light";

interface AdminThemeContextValue {
  mode: AdminMode;
  toggleMode: () => void;
}

const STORAGE_KEY = "nhthi-admin-theme-mode";

const AdminThemeContext = createContext<AdminThemeContextValue | undefined>(undefined);

export const useAdminThemeMode = () => {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error("useAdminThemeMode must be used within AdminThemeProvider");
  }
  return context;
};

const AdminThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<AdminMode>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem(STORAGE_KEY) as AdminMode | null;
    return stored === "light" ? "light" : "dark";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#f97316" },
          background:
            mode === "dark"
              ? { default: "#090909", paper: "#141414" }
              : { default: "#f6f7fb", paper: "#ffffff" },
          text:
            mode === "dark"
              ? { primary: "#ffffff", secondary: "#cbd5e1" }
              : { primary: "#0f172a", secondary: "#475569" },
          divider: mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
        },
        shape: { borderRadius: 18 },
        typography: {
          fontFamily: "inherit",
          button: { textTransform: "none", fontWeight: 700 },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "dark" ? "rgba(255,255,255,0.03)" : "#ffffff",
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderColor: mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
              },
            },
          },
        },
      }),
    [mode]
  );

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    [mode]
  );

  return (
    <AdminThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AdminThemeContext.Provider>
  );
};

export default AdminThemeProvider;
