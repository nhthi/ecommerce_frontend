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

  return (
    <div
      className={`flex border rounded-2xl p-4 sm:p-5 bg-white/95 shadow-sm hover:shadow-md transition-all cursor-pointer gap-3
      ${
        item.id === selectedId
          ? "border-sky-500 ring-1 ring-sky-200"
          : "border-slate-200"
      }`}
      onClick={() => onSelect(item.id ? item.id : 0)}
    >
      <div className="pt-1">
        <Radio
          checked={item.id === selectedId}
          onChange={() => onSelect(item.id ? item.id : 0)}
          value={item.id}
          name="address-radio"
        />
      </div>

      <div className="space-y-1.5">
        <h1 className="font-semibold text-slate-900 flex items-center gap-2">
          {item.receiverName}
          {item.default && (
            <span className="text-[10px] uppercase tracking-wide bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
              Mặc định
            </span>
          )}
        </h1>

        <p className="text-sm text-slate-600 max-w-sm">{fullAddress}</p>

        <p className="text-sm text-slate-600">
          <span className="font-medium text-slate-700">Số điện thoại: </span>
          {item.phoneNumber}
        </p>

        {item.note && (
          <p className="text-xs text-slate-500">Ghi chú: {item.note}</p>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
