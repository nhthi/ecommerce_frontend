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
      event.target.value = "";
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

  const titleColor = isDark ? "#ffffff" : "#0f172a";
  const textColor = isDark ? "#cbd5e1" : "#475569";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const innerBorderColor = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(15,23,42,0.08)";
  const subCardBg = isDark ? "rgba(0,0,0,0.2)" : "#f8fafc";

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
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxHeight: "90vh",
            overflow: "hidden",
            m: 1.5,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 900,
            fontSize: "1.4rem",
            flexShrink: 0,
            borderBottom: `1px solid ${innerBorderColor}`,
          }}
        >
          Yêu cầu trả hàng
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            borderColor: innerBorderColor,
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            px: 3,
            py: 2.5,
            "&::-webkit-scrollbar": {
              width: 8,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.16)"
                : "rgba(15,23,42,0.18)",
              borderRadius: "999px",
            },
          }}
        >
          {orderItem && (
            <Box className="space-y-5">
              <div
                className="flex gap-4 rounded-2xl p-4"
                style={{
                  border: `1px solid ${innerBorderColor}`,
                  backgroundColor: subCardBg,
                }}
              >
                <img
                  src={orderItem.product?.images?.[0]}
                  alt={orderItem.product?.title}
                  className="h-24 w-20 rounded-xl object-cover"
                  style={{ border: `1px solid ${innerBorderColor}` }}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className="line-clamp-2 text-lg font-bold"
                    style={{ color: titleColor }}
                  >
                    {orderItem.product?.title}
                  </p>
                  <p className="mt-1 text-sm" style={{ color: mutedColor }}>
                    Kích thước:{" "}
                    <span className="font-semibold" style={{ color: titleColor }}>
                      {orderItem.size?.name || "Không có"}
                    </span>
                  </p>
                  <p className="mt-1 text-sm" style={{ color: mutedColor }}>
                    Đã mua:{" "}
                    <span className="font-semibold" style={{ color: titleColor }}>
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
                sx={fieldSx(isDark)}
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
                sx={fieldSx(isDark)}
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
                sx={fieldSx(isDark)}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p
                    className="text-sm font-bold uppercase tracking-[0.12em]"
                    style={{ color: mutedColor }}
                  >
                    Ảnh minh chứng
                  </p>

                  <Button
                    variant="outlined"
                    onClick={handleChooseImages}
                    disabled={uploadingImage}
                    sx={outlineButtonSx(isDark)}
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

                <p className="text-xs leading-6" style={{ color: mutedColor }}>
                  Bạn có thể chọn một hoặc nhiều ảnh từ thiết bị. Ảnh sẽ được tải
                  lên Cloudinary và tự động đính kèm vào yêu cầu trả hàng.
                </p>

                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {imageUrls.map((url) => (
                      <div
                        key={url}
                        className="overflow-hidden rounded-2xl"
                        style={{
                          border: `1px solid ${innerBorderColor}`,
                          backgroundColor: subCardBg,
                        }}
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

              <div
                className="rounded-2xl p-4"
                style={{ backgroundColor: subCardBg }}
              >
                <p className="text-sm" style={{ color: mutedColor }}>
                  Tiền hoàn dự kiến
                </p>
                <p className="mt-1 text-2xl font-black text-orange-400">
                  {formatVND(refundPreview)}
                </p>
                <p className="mt-2 text-xs leading-6" style={{ color: mutedColor }}>
                  Giá trị hoàn tiền hiện được tính theo giá bán của sản phẩm nhân
                  với số lượng trả.
                </p>
              </div>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            flexShrink: 0,
            borderTop: `1px solid ${innerBorderColor}`,
          }}
        >
          <Button
            onClick={onClose}
            disabled={actionLoading || uploadingImage}
            sx={ghostButtonSx(isDark)}
          >
            Đóng
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!canSubmit}
            sx={primaryButtonSx}
          >
            <span className="text-slate-100">{actionLoading ? "Đang gửi..." : "Gửi yêu cầu"}</span>
            
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

const fieldSx = (isDark: boolean) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "1rem",
    color: isDark ? "#fff" : "#0f172a",
    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "#f8fafc",
    "& fieldset": {
      borderColor: isDark
        ? "rgba(255,255,255,0.1)"
        : "rgba(15,23,42,0.12)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(249,115,22,0.3)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#fb923c",
    },
  },
  "& .MuiInputLabel-root": {
    color: isDark ? "#94a3b8" : "#64748b",
  },
  "& .MuiSvgIcon-root": {
    color: isDark ? "#cbd5e1" : "#475569",
  },
});

const outlineButtonSx = (isDark: boolean) => ({
  minWidth: 110,
  textTransform: "none",
  borderRadius: "999px",
  fontWeight: 700,
  borderColor: "rgba(249,115,22,0.3)",
  color: "#fb923c",
  backgroundColor: "transparent",
  "&:hover": {
    borderColor: "#fb923c",
    backgroundColor: isDark ? "rgba(249,115,22,0.08)" : "rgba(249,115,22,0.06)",
  },
});

const ghostButtonSx = (isDark: boolean) => ({
  textTransform: "none",
  borderRadius: "999px",
  color: isDark ? "#cbd5e1" : "#475569",
  px: 2.5,
});

const primaryButtonSx = {
  textTransform: "none",
  borderRadius: "999px",
  px: 3,
  py: 1.1,
  fontWeight: 800,
  backgroundColor: "#f97316",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "#ea580c",
    boxShadow: "none",
  },
};

export default ReturnRequestDialog;