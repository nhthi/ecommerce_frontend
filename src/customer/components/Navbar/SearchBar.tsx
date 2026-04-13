import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { Close, Search, History, NorthEast } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  clearSearchHistory,
  deleteSearchKeyword,
  fetchRecentSearches,
  fetchSearchSuggestions,
  saveSearchHistory,
  setGuestRecentSearches,
} from "../../../state/customer/searchSlice";
import {
  clearLocalSearchHistory,
  deleteLocalSearchKeyword,
  getLocalSearchHistory,
  saveLocalSearchHistory,
} from "../../../utils/searchHistory";

interface SearchBarProps {
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const QUICK_SUGGESTIONS = [
  "whey",
  "creatine",
  "pre workout",
  "mass",
  "ta",
  "banh ta",
  "may cardio",
  "phu kien tap gym",
  "gang tay tap gym",
  "day keo",
  "xa don",
  "lich tap",
  "ao tap gym",
  "quan tap gym",
  "binh nuoc tap gym",
];

const SearchBar: React.FC<SearchBarProps> = ({
  showSearch,
  setShowSearch,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { auth, searchSlice } = useAppSelector((store) => store);
  const isLoggedIn = !!auth?.user;

  const { suggestions, recentSearches } = searchSlice;

  const normalizeText = (value: string) => value.trim().toLowerCase();

  useEffect(() => {
    if (!showSearch) return;

    if (isLoggedIn) {
      dispatch(fetchRecentSearches());
    } else {
      dispatch(setGuestRecentSearches(getLocalSearchHistory()));
    }
  }, [showSearch, isLoggedIn, dispatch]);

  useEffect(() => {
    if (!showSearch) return;

    const keyword = searchValue.trim();

    const timeout = setTimeout(() => {
      if (keyword.length >= 2) {
        dispatch(fetchSearchSuggestions(keyword));
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchValue, showSearch, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowSearch]);

  useEffect(() => {
    setHighlightIndex(-1);
  }, [searchValue, showSearch]);

  const guestMatchedSuggestions = useMemo(() => {
    const keyword = normalizeText(searchValue);

    if (!keyword) return QUICK_SUGGESTIONS.slice(0, 8);

    return QUICK_SUGGESTIONS.filter((item) =>
      normalizeText(item).includes(keyword)
    ).slice(0, 8);
  }, [searchValue]);

  const guestMatchedHistory = useMemo(() => {
    const keyword = normalizeText(searchValue);

    if (!keyword) return recentSearches;

    return recentSearches.filter((item: string) =>
      normalizeText(item).includes(keyword)
    );
  }, [recentSearches, searchValue]);

  const displayHistory: string[] = isLoggedIn
    ? recentSearches
    : guestMatchedHistory;

  const displaySuggestions: string[] =
    searchValue.trim().length >= 2
      ? suggestions.popularKeywords?.length > 0
        ? suggestions.popularKeywords
        : guestMatchedSuggestions
      : guestMatchedSuggestions;

  const combinedOptions = useMemo(() => {
    const items: string[] = [];

    displayHistory.forEach((item: string) => {
      if (!items.some((x) => normalizeText(x) === normalizeText(item))) {
        items.push(item);
      }
    });

    displaySuggestions.forEach((item: string) => {
      if (!items.some((x) => normalizeText(x) === normalizeText(item))) {
        items.push(item);
      }
    });

    return items.slice(0, 10);
  }, [displayHistory, displaySuggestions]);

  const handleSaveHistory = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    if (isLoggedIn) {
      dispatch(saveSearchHistory(trimmed));
    } else {
      saveLocalSearchHistory(trimmed);
      dispatch(setGuestRecentSearches(getLocalSearchHistory()));
    }
  };

  const handleSearch = (keyword?: string) => {
    const finalKeyword = (keyword ?? searchValue).trim();
    if (!finalKeyword) return;

    handleSaveHistory(finalKeyword);
    setShowSearch(false);
    navigate(`/search?keyword=${encodeURIComponent(finalKeyword)}`);
  };

  const handleSelectSuggestion = (value: string) => {
    setSearchValue(value);
    handleSearch(value);
  };

  const handleDeleteHistory = (keyword: string) => {
    if (isLoggedIn) {
      dispatch(deleteSearchKeyword(keyword));
    } else {
      deleteLocalSearchKeyword(keyword);
      dispatch(setGuestRecentSearches(getLocalSearchHistory()));
    }
  };

  const handleClearAllHistory = () => {
    if (isLoggedIn) {
      dispatch(clearSearchHistory());
    } else {
      clearLocalSearchHistory();
      dispatch(setGuestRecentSearches([]));
    }
  };

  const showDropdown =
    displayHistory.length > 0 ||
    displaySuggestions.length > 0 ||
    searchValue.trim().length > 0;

  return (
    <AnimatePresence>
      {showSearch && (
        <motion.div
          ref={searchRef}
          initial={{ opacity: 0, scale: 0.96, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -6 }}
          transition={{ duration: 0.16 }}
          className="relative"
        >
          <Box
            sx={{
              width: { xs: 250, sm: 290, md: 330 },
            }}
            className="relative"
          >
            <div className="flex items-center gap-2 rounded-full border border-orange-500/30 bg-[#121212] px-3 py-1 shadow-lg shadow-black/30">
              <Search sx={{ color: "#fb923c", fontSize: 20 }} />

              <TextField
                variant="standard"
                placeholder="Tìm sản phẩm..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                InputProps={{ disableUnderline: true }}
                sx={{
                  flex: 1,
                  input: {
                    padding: "6px 0",
                    fontSize: "0.92rem",
                    color: "#fff",
                  },
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setHighlightIndex((prev) =>
                      prev < combinedOptions.length - 1 ? prev + 1 : prev
                    );
                  }

                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setHighlightIndex((prev) => (prev > 0 ? prev - 1 : 0));
                  }

                  if (e.key === "Enter") {
                    e.preventDefault();

                    if (highlightIndex >= 0 && combinedOptions[highlightIndex]) {
                      handleSelectSuggestion(combinedOptions[highlightIndex]);
                    } else if (searchValue.trim()) {
                      handleSearch();
                    }
                  }

                  if (e.key === "Escape") {
                    setShowSearch(false);
                  }
                }}
                autoFocus
              />

              <IconButton size="small" onClick={() => setShowSearch(false)}>
                <Close fontSize="small" sx={{ color: "#fff" }} />
              </IconButton>
            </div>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.14 }}
                  className="absolute right-0 top-[calc(100%+10px)] z-[100] w-full overflow-hidden rounded-3xl border border-orange-500/25 bg-[#121212] shadow-2xl shadow-black/50"
                >
                  <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

                  <div
                    className="max-h-[380px] overflow-y-auto px-3 py-3 [&::-webkit-scrollbar]:hidden"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {displayHistory.length > 0 && (
                      <div className="mb-4">
                        <div className="mb-2 flex items-center justify-between">
                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.72)",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                            }}
                          >
                            Lịch sử tìm kiếm
                          </Typography>

                          <button
                            type="button"
                            onClick={handleClearAllHistory}
                            className="text-[11px] font-semibold text-orange-400 hover:underline"
                          >
                            Xóa tất cả
                          </button>
                        </div>

                        <div className="space-y-1">
                          {displayHistory.map((item: string, index: number) => {
                            const optionIndex = combinedOptions.findIndex(
                              (x) => normalizeText(x) === normalizeText(item)
                            );

                            return (
                              <div
                                key={`history-${item}-${index}`}
                                className={`flex items-center justify-between rounded-xl px-2 py-2 transition ${
                                  highlightIndex === optionIndex
                                    ? "bg-white/10"
                                    : "hover:bg-white/5"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleSelectSuggestion(item)}
                                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                                >
                                  <History
                                    sx={{
                                      color: "rgba(255,255,255,0.58)",
                                      fontSize: 18,
                                    }}
                                  />
                                  <span className="truncate text-sm text-white">
                                    {item}
                                  </span>
                                </button>

                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteHistory(item)}
                                  sx={{
                                    color: "rgba(255,255,255,0.55)",
                                    "&:hover": { color: "#fff" },
                                  }}
                                >
                                  <Close sx={{ fontSize: 16 }} />
                                </IconButton>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {displaySuggestions.length > 0 && (
                      <div>
                        <Typography
                          sx={{
                            mb: 1.2,
                            color: "rgba(255,255,255,0.72)",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                          }}
                        >
                          Gợi ý tìm kiếm
                        </Typography>

                        <div className="space-y-1">
                          {displaySuggestions.map((item: string, index: number) => {
                            const optionIndex = combinedOptions.findIndex(
                              (x) => normalizeText(x) === normalizeText(item)
                            );

                            return (
                              <button
                                key={`suggest-${item}-${index}`}
                                type="button"
                                onClick={() => handleSelectSuggestion(item)}
                                className={`flex w-full items-center justify-between rounded-xl px-2 py-2 text-left transition ${
                                  highlightIndex === optionIndex
                                    ? "bg-orange-500/12"
                                    : "hover:bg-white/5"
                                }`}
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <Search
                                    sx={{
                                      color: "#fb923c",
                                      fontSize: 18,
                                    }}
                                  />
                                  <span className="truncate text-sm text-white">
                                    {item}
                                  </span>
                                </div>

                                <NorthEast
                                  sx={{
                                    color: "rgba(255,255,255,0.5)",
                                    fontSize: 16,
                                  }}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {displayHistory.length === 0 &&
                      displaySuggestions.length === 0 &&
                      searchValue.trim() && (
                        <button
                          type="button"
                          onClick={() => handleSearch()}
                          className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left transition hover:bg-white/5"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <Search
                              sx={{
                                color: "#fb923c",
                                fontSize: 18,
                              }}
                            />
                            <span className="truncate text-sm text-white">
                              Tìm kiếm "{searchValue}"
                            </span>
                          </div>
                          <NorthEast
                            sx={{
                              color: "rgba(255,255,255,0.5)",
                              fontSize: 16,
                            }}
                          />
                        </button>
                      )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchBar;