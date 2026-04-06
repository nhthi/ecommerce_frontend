import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

type SiteMode = "dark" | "light";

interface SiteThemeContextValue {
  mode: SiteMode;
  isDark: boolean;
  toggleMode: () => void;
}

const STORAGE_KEY = "nhthi-site-theme-mode";
const SiteThemeContext = createContext<SiteThemeContextValue | undefined>(undefined);

export const useSiteThemeMode = () => {
  const context = useContext(SiteThemeContext);
  if (!context) {
    throw new Error("useSiteThemeMode must be used within SiteThemeProvider");
  }
  return context;
};

const SiteThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<SiteMode>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem(STORAGE_KEY) as SiteMode | null;
    return stored === "light" ? "light" : "dark";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.setAttribute("data-theme", mode);
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add(mode === "dark" ? "theme-dark" : "theme-light");
  }, [mode]);

  const isDark = mode === "dark";

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#f97316" },
          secondary: { main: isDark ? "#111827" : "#e2e8f0" },
          background: isDark
            ? { default: "#090909", paper: "#141414" }
            : { default: "#f6f7fb", paper: "#ffffff" },
          text: isDark
            ? { primary: "#ffffff", secondary: "#cbd5e1" }
            : { primary: "#0f172a", secondary: "#475569" },
          divider: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
        },
        shape: { borderRadius: 18 },
        typography: {
          fontFamily: "inherit",
          button: { textTransform: "none", fontWeight: 700 },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: isDark ? "#090909" : "#f6f7fb",
                color: isDark ? "#ffffff" : "#0f172a",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                backgroundColor: isDark ? "#141414" : "#ffffff",
                color: isDark ? "#ffffff" : "#0f172a",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: isDark ? "#141414" : "#ffffff",
                color: isDark ? "#ffffff" : "#0f172a",
                borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                backgroundColor: isDark ? "#141414" : "#ffffff",
                color: isDark ? "#ffffff" : "#0f172a",
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: isDark ? "#111111" : "#ffffff",
                color: isDark ? "#ffffff" : "#0f172a",
              },
            },
          },
          MuiMenu: {
            styleOverrides: {
              paper: {
                backgroundColor: isDark ? "#141414" : "#ffffff",
                color: isDark ? "#ffffff" : "#0f172a",
              },
            },
          },
          MuiPopover: {
            styleOverrides: {
              paper: {
                backgroundColor: isDark ? "#141414" : "#ffffff",
                color: isDark ? "#ffffff" : "#0f172a",
              },
            },
          },
          MuiAccordion: {
            styleOverrides: {
              root: {
                backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
                color: isDark ? "#ffffff" : "#0f172a",
                borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                color: isDark ? "#ffffff" : "#0f172a",
                backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
                "& fieldset": {
                  borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.12)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(249,115,22,0.35)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#f97316",
                },
              },
              input: {
                color: isDark ? "#ffffff" : "#0f172a",
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: isDark ? "#cbd5e1" : "#64748b",
                "&.Mui-focused": {
                  color: "#f97316",
                },
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              icon: {
                color: isDark ? "rgba(255,255,255,0.65)" : "#64748b",
              },
              select: {
                color: isDark ? "#ffffff" : "#0f172a",
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                color: isDark ? "#ffffff" : "#0f172a",
                borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                color: isDark ? "#ffffff" : "#0f172a",
              },
            },
          },
        },
      }),
    [isDark, mode]
  );

  const value = useMemo(
    () => ({
      mode,
      isDark,
      toggleMode: () => setMode((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    [isDark, mode]
  );

  return (
    <SiteThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SiteThemeContext.Provider>
  );
};

export default SiteThemeProvider;
