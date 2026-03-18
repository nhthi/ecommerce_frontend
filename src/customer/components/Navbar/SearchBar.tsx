import React, { useEffect, useRef, useState } from "react";
import { IconButton, TextField } from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ showSearch, setShowSearch }) => {
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

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

  return (
    <AnimatePresence>
      {showSearch && (
        <motion.div
          ref={searchRef}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-2 rounded-full border border-orange-500/30 bg-[#121212] px-3 py-1 shadow-lg shadow-black/30 w-[180px] sm:w-[250px]"
        >
          <Search sx={{ color: "#fb923c" }} />
          <TextField
            variant="standard"
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{ disableUnderline: true }}
            sx={{
              flex: 1,
              input: { padding: "4px 0", fontSize: "0.9rem", color: "#fff" },
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchValue.trim()) {
                navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
                setShowSearch(false);
              }
            }}
            autoFocus
          />
          <IconButton size="small" onClick={() => setShowSearch(false)}>
            <Close fontSize="small" sx={{ color: "#fff" }} />
          </IconButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchBar;
