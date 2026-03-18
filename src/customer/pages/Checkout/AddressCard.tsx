import { Radio } from "@mui/material";
import React from "react";
import { Address } from "../../../types/UserType";

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
  const fullAddress = `${item.streetDetail}, ${item.ward}, ${item.district}, ${item.province}`;
  const selected = item.id === selectedId;

  return (
    <div
      className={[
        "cursor-pointer rounded-[1.8rem] border p-5 transition-all duration-300",
        selected
          ? "border-orange-500/45 bg-[linear-gradient(180deg,_rgba(249,115,22,0.14),_rgba(255,255,255,0.02))] shadow-[0_18px_40px_rgba(249,115,22,0.12)]"
          : "border-white/10 bg-[#141414] hover:border-orange-500/20",
      ].join(" ")}
      onClick={() => onSelect(item.id ? item.id : 0)}
    >
      <div className="flex gap-3">
        <div className="pt-0.5">
          <Radio
            checked={selected}
            onChange={() => onSelect(item.id ? item.id : 0)}
            value={item.id}
            name="address-radio"
            sx={{
              color: "rgba(255,255,255,0.35)",
              "&.Mui-checked": { color: "#f97316" },
            }}
          />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-black tracking-tight text-white">
              {item.receiverName}
            </h2>
            {item.default && (
              <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-300">
                Mặc định
              </span>
            )}
          </div>

          <p className="text-[15px] leading-7 text-neutral-300">{fullAddress}</p>

          <p className="text-[15px] text-neutral-300">
            <span className="font-semibold text-white">Số điện thoại:</span>{" "}
            {item.phoneNumber}
          </p>

          {item.note && (
            <p className="text-sm leading-6 text-neutral-500">
              Ghi chú: {item.note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressCard;