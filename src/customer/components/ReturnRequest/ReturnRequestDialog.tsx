import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Snackbar,
  TextField,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  clearReturnRequestState,
  createReturnRequest,
} from "../../../state/customer/returnRequestSlice";
import { uploadToCloundinary } from "../../../utils/uploadToCloudinary";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

interface ReturnRequestDialogProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
  orderItem: any | null;
}

const RETURN_REASONS = [
  { value: "Sản phẩm bị lỗi", label: "Sản phẩm bị lỗi" },
  { value: "Sản phẩm bị hư hỏng", label: "Sản phẩm bị hư hỏng" },
  { value: "Sản phẩm không đúng mô tả", label: "Sản phẩm không đúng mô tả" },
  { value: "Sản phẩm không giống hình ảnh", label: "Sản phẩm không giống hình ảnh" },
  { value: "Giao sai sản phẩm", label: "Giao sai sản phẩm" },
  { value: "Giao thiếu sản phẩm/phụ kiện", label: "Giao thiếu sản phẩm/phụ kiện" },
  { value: "Giao nhầm size", label: "Giao nhầm size" },
  { value: "Giao nhầm màu", label: "Giao nhầm màu" },
  { value: "Sản phẩm hết nhu cầu sử dụng", label: "Sản phẩm hết nhu cầu sử dụng" },
  { value: "Đặt nhầm sản phẩm", label: "Đặt nhầm sản phẩm" },
  { value: "Đặt nhầm size", label: "Đặt nhầm size" },
  { value: "Đặt nhầm màu", label: "Đặt nhầm màu" },
  { value: "Nhận hàng trễ hơn dự kiến", label: "Nhận hàng trễ hơn dự kiến" },
  { value: "Bao bì không nguyên vẹn", label: "Bao bì không nguyên vẹn" },
  { value: "Khác", label: "Khác" },
];

const ReturnRequestDialog: React.FC<ReturnRequestDialogProps> = ({
  open,
  onClose,
  orderId,
  orderItem,
}) => {
  const dispatch = useAppDispatch();
  const { actionLoading, error, success } = useAppSelector(
    (store) => store.returnRequestSlice
  );
const { isDark } = useSiteThemeMode();
  const [quantity, setQuantity] = useState(1);
  const [reasonCode, setReasonCode] = useState("DEFECTIVE");
  const [note, setNote] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open && orderItem) {
      setQuantity(1);
      setReasonCode("DEFECTIVE");
      setNote("");
      setImageUrls([]);
      setUploadingImage(false);
      setLocalError(null);
      dispatch(clearReturnRequestState());
    }
  }, [open, orderItem, dispatch]);

  useEffect(() => {
    if (error || success || localError) {
      setSnackbarOpen(true);
    }

    if (success) {
      const timer = setTimeout(() => {
        onClose();
        dispatch(clearReturnRequestState());
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [error, success, localError, onClose, dispatch]);

  const maxQuantity = orderItem?.quantity || 1;

  const refundPreview = useMemo(() => {
    const price = orderItem?.sellingPrice || 0;
    return price * quantity;
  }, [orderItem, quantity]);

  const formatVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);

  const handleChooseImages = () => {
    fileInputRef.current?.click();
  };

  const handleUploadImages = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);
      setLocalError(null);

      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const url = await uploadToCloundinary(file, "image");
        if (url) {
          uploadedUrls.push(url);
        }
      }

      if (uploadedUrls.length === 0) {
        setLocalError("Không thể tải ảnh minh chứng lên.");
        return;
      }

      setImageUrls((prev) => {
        const merged = [...prev, ...uploadedUrls];
        return Array.from(new Set(merged));
      });
    } catch (err) {
      setLocalError("Tải ảnh minh chứng thất bại.");
    } finally {
      setUploadingImage(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const handleRemoveImage = (url: string) => {
    setImageUrls((prev) => prev.filter((item) => item !== url));
  };

  const handleSubmit = async () => {
    if (!orderItem?.id) return;
  if (reasonCode === "Khác" && !note.trim()) {
    setLocalError("Vui lòng nhập lý do cụ thể khi chọn 'Khác'.");
    return;
  }
    await dispatch(
      createReturnRequest({
        orderId,
        orderItemId: orderItem.id,
        quantity,
        reasonCode,
        note,
        imageUrls,
      })
    );
  };

  const canSubmit =
    !!orderItem?.id &&
    quantity > 0 &&
    !!reasonCode &&
    !uploadingImage &&
    !actionLoading;

  return (
    <>
      <Dialog
        open={open}
        onClose={actionLoading || uploadingImage ? undefined : onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
  sx: {
    borderRadius: "1.5rem",
    backgroundColor: isDark ? "#141414" : "#ffffff",
    color: isDark ? "#fff" : "#0f172a",
    border: isDark
      ? "1px solid rgba(249,115,22,0.12)"
      : "1px solid rgba(15,23,42,0.08)",
    boxShadow: isDark
      ? "0 20px 60px rgba(0,0,0,0.18)"
      : "0 20px 60px rgba(15,23,42,0.08)",
      overflow: "visible",
      maxHeight: "none",
  },
}}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: "1.4rem" }}>
          Yêu cầu trả hàng
        </DialogTitle>

       <DialogContent
  dividers
  sx={{
    borderColor: "rgba(249,115,22,0.12)",
    overflowY: "visible",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    scrollbarWidth: "none",
  }}
>
          {orderItem && (
            <Box className="space-y-5">
              <div className="flex gap-4 rounded-2xl border border-white/8 bg-black/20 p-4">
                <img
                  src={orderItem.product?.images?.[0]}
                  alt={orderItem.product?.title}
                  className="h-24 w-20 rounded-xl border border-white/8 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-lg font-bold text-white">
                    {orderItem.product?.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Kích thước:{" "}
                    <span className="font-semibold text-white">
                      {orderItem.size?.name || "Không có"}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Đã mua:{" "}
                    <span className="font-semibold text-white">
                      {orderItem.quantity}
                    </span>
                  </p>
                  <p className="mt-2 text-base font-bold text-orange-400">
                    {formatVND(orderItem.sellingPrice || 0)}
                  </p>
                </div>
              </div>

              <TextField
                select
                fullWidth
                label="Lý do trả hàng"
                value={reasonCode}
                onChange={(e) => setReasonCode(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              >
                {RETURN_REASONS.map((reason) => (
                  <MenuItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                type="number"
                label="Số lượng trả"
                value={quantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (Number.isNaN(val)) return;
                  if (val < 1) {
                    setQuantity(1);
                    return;
                  }
                  if (val > maxQuantity) {
                    setQuantity(maxQuantity);
                    return;
                  }
                  setQuantity(val);
                }}
                inputProps={{ min: 1, max: maxQuantity }}
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />

              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Ghi chú"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
  reasonCode === "Khác"
    ? "Vui lòng mô tả lý do trả hàng..."
    : "Mô tả chi tiết tình trạng sản phẩm hoặc lý do trả hàng..."
}
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-400">
                    Ảnh minh chứng
                  </p>

                  <Button
                    variant="outlined"
                    onClick={handleChooseImages}
                    disabled={uploadingImage}
                    sx={outlineButtonSx}
                  >
                    {uploadingImage ? "Đang tải ảnh..." : "Chọn ảnh"}
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleUploadImages}
                />

                <p className="text-xs leading-6 text-slate-500">
                  Bạn có thể chọn một hoặc nhiều ảnh từ thiết bị. Ảnh sẽ được tải
                  lên Cloudinary và tự động đính kèm vào yêu cầu trả hàng.
                </p>

                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {imageUrls.map((url) => (
                      <div
                        key={url}
                        className="overflow-hidden rounded-2xl border border-white/8 bg-black/20"
                      >
                        <img
                          src={url}
                          alt="return-proof"
                          className="h-28 w-full object-cover"
                        />
                        <div className="p-2">
                          <Button
                            fullWidth
                            color="error"
                            size="small"
                            onClick={() => handleRemoveImage(url)}
                            sx={{ textTransform: "none", borderRadius: "999px" }}
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Divider sx={{ borderColor: "rgba(249,115,22,0.12)" }} />

              <div className="rounded-2xl bg-black/20 p-4">
                <p className="text-sm text-slate-400">Tiền hoàn dự kiến</p>
                <p className="mt-1 text-2xl font-black text-orange-400">
                  {formatVND(refundPreview)}
                </p>
                <p className="mt-2 text-xs leading-6 text-slate-500">
                  Giá trị hoàn tiền hiện được tính theo giá bán của sản phẩm nhân
                  với số lượng trả.
                </p>
              </div>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={onClose}
            disabled={actionLoading || uploadingImage}
            sx={ghostButtonSx}
          >
            Đóng
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!canSubmit}
            sx={primaryButtonSx}
          >
            {actionLoading ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={error || localError ? "error" : "success"}
          variant="filled"
          sx={{ borderRadius: "0.8rem" }}
        >
          {localError || error || success}
        </Alert>
      </Snackbar>
    </>
  );
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "1rem",
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.2)",
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.1)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(249,115,22,0.3)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#fb923c",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#94a3b8",
  },
  "& .MuiSvgIcon-root": {
    color: "#cbd5e1",
  },
};

const outlineButtonSx = {
  minWidth: 110,
  textTransform: "none",
  borderRadius: "999px",
  fontWeight: 700,
  borderColor: "rgba(249,115,22,0.3)",
  color: "#fb923c",
  "&:hover": {
    borderColor: "#fb923c",
    backgroundColor: "rgba(249,115,22,0.08)",
  },
};

const ghostButtonSx = {
  textTransform: "none",
  borderRadius: "999px",
  color: "#cbd5e1",
  px: 2.5,
};

const primaryButtonSx = {
  textTransform: "none",
  borderRadius: "999px",
  px: 3,
  py: 1.1,
  fontWeight: 800,
  backgroundColor: "#f97316",
  "&:hover": {
    backgroundColor: "#ea580c",
  },
};

export default ReturnRequestDialog;