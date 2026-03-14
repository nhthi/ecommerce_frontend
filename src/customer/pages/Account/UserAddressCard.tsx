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
import { Delete, Star, StarBorder } from "@mui/icons-material";
import { Address } from "../../../types/UserType";

interface Props {
  item: Address;
  onDelete?: (id: number) => void;
  onSetDefault?: (id: number) => void; // callback đặt mặc định
}

const UserAddressCard: React.FC<Props> = ({ item, onDelete, onSetDefault }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirmDelete = () => {
    if (onDelete) onDelete(item.id || 0);
    setOpen(false);
  };
  const handleSetDefault = () => {
    if (onSetDefault) onSetDefault(item.id || 0);
  };
  return (
    <div
      className={`relative transition-all duration-300 rounded-2xl border bg-white shadow-sm hover:shadow-md p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
        item.default ? "border-blue-500" : "border-gray-200"
      }`}
    >
      {/* Thông tin địa chỉ */}
      <div className="flex flex-col space-y-2 w-full sm:w-[70%]">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-lg text-gray-800">
            {item.receiverName}
          </h1>
          {item.default && (
            <Chip
              label="Mặc định"
              color="primary"
              size="small"
              className="text-white"
            />
          )}
        </div>

        <p className="text-gray-600 leading-6">
          📍 {item.streetDetail} - {item.ward}, {item.district}, {item.province}
        </p>
        <p className="text-gray-600">
          ☎️ <strong>{item.phoneNumber}</strong>
        </p>
      </div>

      {/* Hành động */}
      <div className="flex items-center gap-2 ml-auto">
        {!item.default && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<StarBorder />}
            onClick={() => onSetDefault && onSetDefault(item.id || 0)}
            sx={{
              borderRadius: "9999px",
              textTransform: "none",
            }}
          >
            Đặt làm mặc định
          </Button>
        )}

        <Tooltip title="Xóa địa chỉ">
          <IconButton color="error" onClick={handleOpen}>
            <Delete />
          </IconButton>
        </Tooltip>
      </div>

      {/* Modal xác nhận xóa */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc muốn xóa địa chỉ này không? Hành động này không thể hoàn
            tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserAddressCard;
