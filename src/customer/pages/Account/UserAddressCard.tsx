import React, { useState } from "react";
import { Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Chip, Tooltip } from "@mui/material";
import { Delete, StarBorder } from "@mui/icons-material";
import { Address } from "../../../types/UserType";

interface Props { item: Address; onDelete?: (id: number) => void; onSetDefault?: (id: number) => void; }

const UserAddressCard: React.FC<Props> = ({ item, onDelete, onSetDefault }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative flex flex-col gap-5 rounded-[1.8rem] border p-6 shadow-[0_18px_50px_rgba(0,0,0,0.16)] ${item.default ? "border-orange-400/40 bg-[#171717]" : "border-white/8 bg-[#141414]"}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-black text-white">{item.receiverName}</h2>
            {item.default && <Chip label="Mac dinh" sx={{ backgroundColor: "#f97316", color: "#050505", fontWeight: 800 }} size="small" />}
          </div>
          <p className="text-lg leading-8 text-slate-300">{item.streetDetail} - {item.ward}, {item.district}, {item.province}</p>
          <p className="text-lg text-slate-300">{item.phoneNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          {!item.default && <Button variant="outlined" startIcon={<StarBorder />} onClick={() => onSetDefault && onSetDefault(item.id || 0)} sx={{ borderRadius: "999px", textTransform: "none", fontWeight: 700, fontSize: "0.95rem", borderColor: "rgba(249,115,22,0.3)", color: "#fb923c", px: 2.5 }}>Dat mac dinh</Button>}
          <Tooltip title="Xoa dia chi"><IconButton color="error" onClick={() => setOpen(true)}><Delete /></IconButton></Tooltip>
        </div>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent><DialogContentText>Bạn có chắc muốn xóa địa chỉ này, hành động không thể hoàn tác.</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setOpen(false)}>Huy</Button><Button onClick={() => { if (onDelete) onDelete(item.id || 0); setOpen(false); }} color="error" variant="contained">Xoa</Button></DialogActions>
      </Dialog>
    </div>
  );
};

export default UserAddressCard;
