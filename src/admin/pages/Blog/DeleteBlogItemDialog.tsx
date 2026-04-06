import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface DeleteBlogItemDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteBlogItemDialog = ({
  open,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa mục này không?",
  onClose,
  onConfirm,
}: DeleteBlogItemDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background:
            "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
          color: "white",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.08)",
          minWidth: { xs: "92%", sm: 420 },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800 }}>{title}</DialogTitle>

      <DialogContent>
        <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 999,
            textTransform: "none",
            px: 2.5,
            color: "rgba(255,255,255,0.82)",
            borderColor: "rgba(255,255,255,0.12)",
          }}
        >
          Hủy
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            borderRadius: 999,
            textTransform: "none",
            px: 2.8,
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
          }}
        >
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteBlogItemDialog;