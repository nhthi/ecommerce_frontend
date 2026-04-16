import React, { useState } from "react";
import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Tooltip,
} from "@mui/material";
import { Delete, StarBorder } from "@mui/icons-material";
import { Address } from "../../../types/UserType";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

interface Props {
  item: Address;
  onDelete?: (id: number) => void;
  onSetDefault?: (id: number) => void;
}

const UserAddressCard: React.FC<Props> = ({ item, onDelete, onSetDefault }) => {
  const [open, setOpen] = useState(false);
  const { isDark } = useSiteThemeMode();

  return (
    <div
      className={`relative flex flex-col gap-5 rounded-[1.8rem] border p-6 shadow-[0_18px_50px_rgba(0,0,0,0.16)] ${
        isDark
          ? item.default
            ? "border-orange-400/40 bg-[#171717]"
            : "border-white/8 bg-[#141414]"
          : item.default
          ? "border-orange-300 bg-orange-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              className={`text-2xl font-black ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {item.receiverName}
            </h2>

            {item.default && (
              <Chip
                label="Mặc định"
                size="small"
                sx={{
                  backgroundColor: "#f97316",
                  color: "#050505",
                  fontWeight: 800,
                }}
              />
            )}
          </div>

          <p
            className={`text-lg leading-8 ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {item.streetDetail} - {item.ward}, {item.district}, {item.province}
          </p>

          <p
            className={`text-lg ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {item.phoneNumber}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!item.default && (
            <Button
              variant="outlined"
              startIcon={<StarBorder />}
              onClick={() => onSetDefault && onSetDefault(item.id || 0)}
              sx={{
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.95rem",
                borderColor: "rgba(249,115,22,0.3)",
                color: "#fb923c",
                px: 2.5,
                backgroundColor: isDark ? "transparent" : "#fff",
                "&:hover": {
                  borderColor: "#f97316",
                  backgroundColor: isDark
                    ? "rgba(249,115,22,0.08)"
                    : "rgba(249,115,22,0.06)",
                },
              }}
            >
              Đặt mặc định
            </Button>
          )}

          <Tooltip title="Xóa địa chỉ">
            <IconButton
              color="error"
              onClick={() => setOpen(true)}
              sx={{
                backgroundColor: isDark
                  ? "rgba(239,68,68,0.08)"
                  : "rgba(239,68,68,0.06)",
                "&:hover": {
                  backgroundColor: isDark
                    ? "rgba(239,68,68,0.16)"
                    : "rgba(239,68,68,0.12)",
                },
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            backgroundColor: isDark ? "#111827" : "#ffffff",
            color: isDark ? "#ffffff" : "#0f172a",
            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(15,23,42,0.08)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Xác nhận xóa
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ color: isDark ? "#cbd5e1" : "#475569" }}>
            Bạn có chắc muốn xóa địa chỉ này, hành động không thể hoàn tác.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              color: isDark ? "#cbd5e1" : "#475569",
            }}
          >
            Hủy
          </Button>

          <Button
            onClick={() => {
              if (onDelete) onDelete(item.id || 0);
              setOpen(false);
            }}
            color="error"
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "999px",
              px: 2.5,
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserAddressCard;