import { CheckCircleRounded } from "@mui/icons-material";
import { Radio } from "@mui/material";
import React from "react";
import { Address } from "../../../types/UserType";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

interface AddressCardProps {
  item: Address;
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  item,
  selectedId,
  onSelect,
}) => {
  const { isDark } = useSiteThemeMode();

  const id = item.id ?? 0;
  const selected = id === selectedId;

  const fullAddress = [
    item.streetDetail,
    item.ward,
    item.district,
    item.province,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(id);
        }
      }}
      className={[
        "group relative cursor-pointer overflow-hidden rounded-[1.6rem] border p-5 transition-all duration-200 ease-out",
        "focus:outline-none",
        selected
          ? isDark
            ? "border-white/20 bg-white/[0.06] shadow-sm"
            : "border-black/15 bg-black/[0.04] shadow-sm"
          : isDark
          ? "border-white/10 bg-[#111111] hover:border-white/16 hover:bg-[#151515]"
          : "border-black/10 bg-white hover:border-black/16 hover:bg-black/[0.02]",
      ].join(" ")}
      style={{
        boxShadow: selected
          ? isDark
            ? "0 10px 28px rgba(0,0,0,0.22)"
            : "0 10px 24px rgba(0,0,0,0.06)"
          : undefined,
      }}
    >
      <div className="relative flex gap-3">
        <div className="pt-0.5">
          <Radio
            checked={selected}
            onChange={() => onSelect(id)}
            onClick={(e) => e.stopPropagation()}
            value={id}
            name="address-radio"
            sx={{
              p: 0.5,
              color: isDark
                ? "rgba(255,255,255,0.30)"
                : "rgba(0,0,0,0.30)",
              transition: "all .2s ease",
              "&.Mui-checked": {
                color: isDark ? "#ffffff" : "#000000",
              },
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  className={`truncate text-[18px] font-black tracking-tight ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  {item.receiverName}
                </h2>

                {item.default && (
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                      isDark
                        ? "border-white/12 bg-white/[0.05] text-white"
                        : "border-black/10 bg-black/[0.04] text-black"
                    }`}
                  >
                    Mặc định
                  </span>
                )}
              </div>

              <p
                className={`mt-1 text-sm font-medium ${
                  isDark ? "text-white/65" : "text-black/60"
                }`}
              >
                {item.phoneNumber}
              </p>
            </div>

            <div
              className={[
                "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold transition-all duration-200",
                selected
                  ? isDark
                    ? "border-white/12 bg-white/[0.06] text-white"
                    : "border-black/10 bg-black/[0.04] text-black"
                  : isDark
                  ? "border-white/10 bg-white/[0.03] text-white/55 opacity-0 group-hover:opacity-100"
                  : "border-black/10 bg-black/[0.03] text-black/55 opacity-0 group-hover:opacity-100",
              ].join(" ")}
            >
              <CheckCircleRounded sx={{ fontSize: 15 }} />
              {selected ? "Đang chọn" : "Chọn"}
            </div>
          </div>

          <div
            className={`mt-3 rounded-2xl border px-4 py-3 ${
              isDark
                ? "border-white/8 bg-white/[0.03]"
                : "border-black/8 bg-black/[0.02]"
            }`}
          >
            <p
              className={`text-[14px] leading-6 ${
                isDark ? "text-white/78" : "text-black/72"
              }`}
            >
              {fullAddress || "Chưa có địa chỉ chi tiết"}
            </p>

            {item.note && (
              <p
                className={`mt-2 text-[13px] leading-6 ${
                  isDark ? "text-white/50" : "text-black/50"
                }`}
              >
                <span
                  className={`font-semibold ${
                    isDark ? "text-white/72" : "text-black/72"
                  }`}
                >
                  Ghi chú:
                </span>{" "}
                {item.note}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;