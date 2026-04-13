import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Snackbar,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Payments, LocalShipping, Discount } from "@mui/icons-material";
import OrderStepper from "./OrderStepper";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { cancelOrder, fetchOrderById } from "../../../state/customer/orderSlice";
import { OrderStatus } from "../../../types/OrderType";
import CustomLoading from "../../components/CustomLoading/CustomLoading";
import ReturnRequestDialog from "../../components/ReturnRequest/ReturnRequestDialog";
import {
  fetchMyReturnRequests,
  markReturnCustomerShipped,
} from "../../../state/customer/returnRequestSlice";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const dispatch = useAppDispatch();

  const { order, returnRequestSlice } = useAppSelector((store) => store);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState<any | null>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const currentOrder = order.currentOrder;

  const formatVND = (value: number | undefined) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(Number(orderId)));
      dispatch(fetchMyReturnRequests());
    }
  }, [orderId, dispatch]);

  const handleCancelOrder = async () => {
    if (!orderId) return;

    setLoading(true);
    try {
      await dispatch(cancelOrder(Number(orderId))).unwrap();
      setSnackbar({
        open: true,
        message: "Hủy đơn hàng thành công.",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: typeof err === "string" ? err : "Không thể hủy đơn hàng lúc này.",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setOpenConfirm(false);
    }
  };

  const handleOpenReturnDialog = (item: any) => {
    setSelectedOrderItem(item);
    setReturnDialogOpen(true);
  };

  const handleCustomerShipped = async (requestId: number) => {
    try {
      await dispatch(markReturnCustomerShipped(requestId)).unwrap();
      setSnackbar({
        open: true,
        message: "Đã cập nhật trạng thái khách gửi hàng trả.",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message:
          typeof err === "string"
            ? err
            : "Không thể cập nhật trạng thái trả hàng lúc này.",
        severity: "error",
      });
    }
  };

  const pricing = useMemo(() => {
    const originalPrice = currentOrder?.originalPrice || 0;
    const subtotalPrice = currentOrder?.subtotalPrice || 0;
    const shippingFee = currentOrder?.shippingFee || 0;
    const shippingFeeDiscount = currentOrder?.shippingFeeDiscount || 0;
    const couponDiscount = currentOrder?.couponDiscount || 0;
    const totalPrice = currentOrder?.totalPrice || 0;

    const productDiscount = Math.max(0, originalPrice - subtotalPrice);
    const finalShippingFee = Math.max(0, shippingFee - shippingFeeDiscount);
    const totalDiscount = productDiscount + shippingFeeDiscount + couponDiscount;

    return {
      originalPrice,
      subtotalPrice,
      shippingFee,
      shippingFeeDiscount,
      couponDiscount,
      totalPrice,
      productDiscount,
      finalShippingFee,
      totalDiscount,
    };
  }, [currentOrder]);

  const returnRequestMap = useMemo(() => {
    const map = new Map<number, any>();
    returnRequestSlice.myRequests.forEach((request) => {
      request.items?.forEach((item) => {
        map.set(item.orderItemId, request);
      });
    });
    return map;
  }, [returnRequestSlice.myRequests]);

  const isReturnAvailable = (deliveryDate?: string) => {
    if (!deliveryDate) return false;

    const delivered = new Date(deliveryDate);
    if (Number.isNaN(delivered.getTime())) return false;

    const deadline = new Date(delivered);
    deadline.setDate(deadline.getDate() + 7);

    return new Date() <= deadline;
  };

  const getReturnDeadlineText = (deliveryDate?: string) => {
    if (!deliveryDate) return "Không xác định";

    const delivered = new Date(deliveryDate);
    if (Number.isNaN(delivered.getTime())) return "Không xác định";

    const deadline = new Date(delivered);
    deadline.setDate(deadline.getDate() + 7);

    return deadline.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!currentOrder) {
    return (
      <Box className="min-h-[50vh] flex items-center justify-center text-lg text-slate-400">
        Đang tải thông tin đơn hàng...
      </Box>
    );
  }

  const canCancel =
    currentOrder.orderStatus === "PENDING" || currentOrder.orderStatus === "PLACED";

  const canReturnByDate = isReturnAvailable(currentOrder.deliveryDate);

  return (
    <Box className="space-y-6">
      <section className="rounded-[1.8rem] border border-orange-500/12 bg-[#141414] px-6 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] lg:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-black text-white">
              Đơn hàng #{currentOrder.orderId || currentOrder.id}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-300">
              Ngày đặt:{" "}
              <span className="font-semibold text-white">
                {currentOrder.orderDate
                  ? new Date(currentOrder.orderDate).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "Đang cập nhật"}
              </span>
            </p>
            <p className="mt-1 text-2xl font-black text-orange-400">
              {formatVND(pricing.totalPrice)}
            </p>

            {currentOrder.orderStatus === "DELIVERED" && (
              <p className="mt-2 text-sm text-slate-400">
                Có thể trả hàng đến{" "}
                <span className="font-semibold text-white">
                  {getReturnDeadlineText(currentOrder.deliveryDate)}
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outlined"
              size="small"
              sx={secondaryButtonSx}
              onClick={() => navigate("/account/orders")}
            >
              Quay lại danh sách đơn hàng
            </Button>

            <Button
              variant="outlined"
              size="small"
              sx={secondaryButtonSx}
              onClick={() => navigate("/account/return-requests")}
            >
              Yêu cầu trả hàng của tôi
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-[1.8rem] border border-orange-500/12 bg-[#141414] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] lg:p-6">
        <h3 className="text-2xl font-black text-white">Sản phẩm trong đơn</h3>
        <Divider sx={{ borderColor: "rgba(249,115,22,0.12)", my: 3 }} />

        <div className="space-y-4">
          {currentOrder.orderItems?.map((item) => {
            const itemReturnRequest = returnRequestMap.get(item.id);
            const canCreateReturn =
              currentOrder.orderStatus === "DELIVERED" &&
              canReturnByDate &&
              !itemReturnRequest;

            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-[1.4rem] border border-white/6 bg-black/20 p-4 sm:flex-row"
              >
                <img
                  src={item.product?.images?.[0]}
                  alt={item.product?.title}
                  className="h-32 w-24 rounded-xl border border-white/6 object-cover"
                />

                <div className="flex-1 space-y-2 text-base">
                  <h4 className="text-xl font-bold text-white">
                    {item.product?.title}
                  </h4>

                  <p className="text-slate-400">
                    {item.product?.seller?.businessDetails?.businessName || "NHTHI Fit"}
                  </p>

                  <p className="text-slate-300">
                    Kích thước:{" "}
                    <span className="font-semibold text-white">
                      {item.size?.name || "Không có"}
                    </span>
                  </p>

                  <p className="text-slate-300">
                    Số lượng:{" "}
                    <span className="font-semibold text-white">{item.quantity}</span>
                  </p>

                  <p className="text-slate-300">
                    Giá:{" "}
                    <span className="mr-2 text-slate-500 line-through">
                      {formatVND(item.mrpPrice || 0)}
                    </span>
                    <span className="font-semibold text-orange-400">
                      {formatVND(item.sellingPrice || 0)}
                    </span>
                  </p>

                  {itemReturnRequest && (
                    <div className="mt-3 rounded-2xl border border-orange-500/15 bg-orange-500/8 px-4 py-3">
                      <p className="text-sm font-bold text-orange-300">
                        Yêu cầu trả hàng: {getReturnStatusLabel(itemReturnRequest.status)}
                      </p>
                      <p className="mt-1 text-sm text-slate-300">
                        Tiền hoàn dự kiến{" "}
                        <span className="font-semibold text-white">
                          {formatVND(itemReturnRequest.refundAmount || 0)}
                        </span>
                      </p>
                      {itemReturnRequest.note && (
                        <p className="mt-1 text-sm text-slate-400">
                          Ghi chú: {itemReturnRequest.note}
                        </p>
                      )}
                    </div>
                  )}

                  {currentOrder.orderStatus === "DELIVERED" && !canReturnByDate && !itemReturnRequest && (
                    <div className="mt-3 rounded-2xl border border-red-500/15 bg-red-500/8 px-4 py-3">
                      <p className="text-sm font-semibold text-red-300">
                        Đã quá thời hạn 7 ngày kể từ ngày giao, sản phẩm này không còn hỗ trợ trả hàng.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    {item.review ? (
                      <Button
                        onClick={() =>
                          navigate(`/account/orders/${currentOrder.id}/review-detail`, {
                            state: { orderItemId: item.id, review: item.review },
                          })
                        }
                        variant="contained"
                        sx={{
                          backgroundColor: "#4b5563",
                          color: "#fff",
                          textTransform: "none",
                          borderRadius: "999px",
                          fontSize: "0.9rem",
                          px: 2.5,
                          "&:hover": { backgroundColor: "#374151" },
                        }}
                      >
                        Xem đánh giá
                      </Button>
                    ) : (
                      <Button
                        disabled={currentOrder.orderStatus !== "DELIVERED"}
                        onClick={() =>
                          navigate(`/account/orders/${currentOrder.id}/review`, {
                            state: { orderItemId: item.id },
                          })
                        }
                        variant="outlined"
                        sx={secondaryButtonSx}
                      >
                        Viết đánh giá
                      </Button>
                    )}

                    {canCreateReturn && (
                      <Button
                        variant="outlined"
                        sx={secondaryButtonSx}
                        onClick={() => handleOpenReturnDialog(item)}
                      >
                        Yêu cầu trả hàng
                      </Button>
                    )}

                    {itemReturnRequest?.status === "APPROVED" && (
                      <Button
                        variant="contained"
                        sx={primaryButtonSx}
                        onClick={() => handleCustomerShipped(itemReturnRequest.id)}
                      >
                        Tôi đã gửi hàng trả
                      </Button>
                    )}

                    {itemReturnRequest && (
                      <Button
                        variant="outlined"
                        sx={secondaryButtonSx}
                        onClick={() => navigate("/account/return-requests")}
                      >
                        Theo dõi trả hàng
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[1.8rem] border border-orange-500/12 bg-[#141414] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] lg:p-6">
        <h3 className="text-2xl font-black text-white">Trạng thái đơn hàng</h3>
        <OrderStepper
          orderStatus={currentOrder.orderStatus || OrderStatus.PENDING}
          deliveryDate={currentOrder.deliveryDate}
        />
      </section>

      <section className="rounded-[1.8rem] border border-orange-500/12 bg-[#141414] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] lg:p-6">
        <h3 className="text-2xl font-black text-white">Địa chỉ giao hàng</h3>
        <Divider sx={{ borderColor: "rgba(249,115,22,0.12)", my: 3 }} />

        <div className="space-y-3 text-base text-slate-300">
          <div className="flex flex-wrap gap-4 font-semibold text-white">
            <p>{currentOrder.shippingAddress?.receiverName}</p>
            <p>{currentOrder.shippingAddress?.phoneNumber}</p>
          </div>

          <p>
            {`${currentOrder.shippingAddress?.streetDetail}, ${currentOrder.shippingAddress?.ward}, ${currentOrder.shippingAddress?.district}, ${currentOrder.shippingAddress?.province}`}
          </p>

          {currentOrder.shippingAddress?.note && (
            <p className="text-slate-400">
              Ghi chú: {currentOrder.shippingAddress.note}
            </p>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.8rem] border border-orange-500/12 bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <div className="space-y-4 px-6 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-lg font-black text-white">Tổng quan thanh toán</p>
              <p className="mt-1 text-base text-slate-400">
                Bạn tiết kiệm{" "}
                <span className="font-semibold text-orange-300">
                  {formatVND(pricing.totalDiscount)}
                </span>{" "}
                cho đơn này.
              </p>
            </div>
            <p className="text-3xl font-black text-orange-400">
              {formatVND(pricing.totalPrice)}
            </p>
          </div>

          <div className="mt-4 space-y-3 rounded-[1.2rem] bg-black/20 px-4 py-4 text-base text-slate-300">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Tổng giá gốc</span>
              <span>{formatVND(pricing.originalPrice)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Tổng tiền hàng</span>
              <span>{formatVND(pricing.subtotalPrice)}</span>
            </div>

            {pricing.productDiscount > 0 && (
              <div className="flex items-center justify-between gap-4 text-green-400">
                <span className="flex items-center gap-2">
                  <Discount sx={{ fontSize: 18 }} />
                  Giảm giá sản phẩm
                </span>
                <span>-{formatVND(pricing.productDiscount)}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-slate-400">
                <LocalShipping sx={{ fontSize: 18 }} />
                Phí vận chuyển
              </span>
              <span>{formatVND(pricing.shippingFee)}</span>
            </div>

            {pricing.shippingFeeDiscount > 0 && (
              <div className="flex items-center justify-between gap-4 text-green-400">
                <span>Giảm phí vận chuyển</span>
                <span>-{formatVND(pricing.shippingFeeDiscount)}</span>
              </div>
            )}

            {pricing.couponDiscount > 0 && (
              <div className="flex items-center justify-between gap-4 text-green-400">
                <span>Giảm giá từ mã khuyến mãi</span>
                <span>-{formatVND(pricing.couponDiscount)}</span>
              </div>
            )}

            <Divider sx={{ borderColor: "rgba(249,115,22,0.12)" }} />

            <div className="flex items-center justify-between gap-4 text-lg font-bold text-white">
              <span>Thành tiền</span>
              <span className="text-orange-400">{formatVND(pricing.totalPrice)}</span>
            </div>

            {pricing.finalShippingFee === 0 && pricing.shippingFee > 0 && (
              <div className="text-right text-sm font-semibold text-green-400">
                Bạn được miễn phí vận chuyển
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 rounded-[1.2rem] bg-black/20 px-4 py-3 text-base text-slate-300">
            <Payments sx={{ color: "#fb923c" }} />
            {currentOrder.paymentMethod === "COD"
              ? "Thanh toán khi nhận hàng (COD)"
              : "Thanh toán trực tuyến"}
          </div>
        </div>

        <Divider sx={{ mt: 3, borderColor: "rgba(249,115,22,0.12)" }} />

        <div className="px-6 py-4 text-base text-slate-400">
          Đơn vị bán hàng:{" "}
          <span className="font-semibold text-white">
            {currentOrder.orderItems?.[0]?.product?.seller?.businessDetails?.businessName ||
              "NHTHI Fit"}
          </span>
        </div>

        <div className="px-6 pb-6 pt-1">
          <Button
            fullWidth
            variant="outlined"
            color="error"
            sx={{
              py: "0.95rem",
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "1rem",
            }}
            disabled={!canCancel}
            onClick={() => setOpenConfirm(true)}
          >
            Hủy đơn hàng
          </Button>
        </div>
      </section>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Bạn chắc chắn muốn hủy đơn hàng này?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sau khi hủy, đơn hàng sẽ không thể khôi phục lại.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenConfirm(false)}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Không
          </Button>
          <Button
            onClick={handleCancelOrder}
            color="error"
            autoFocus
            sx={{ textTransform: "none" }}
          >
            Đồng ý hủy
          </Button>
        </DialogActions>
      </Dialog>

      <ReturnRequestDialog
        open={returnDialogOpen}
        onClose={() => setReturnDialogOpen(false)}
        orderId={Number(orderId)}
        orderItem={selectedOrderItem}
      />

      {loading && <CustomLoading message="Đang hủy đơn hàng..." />}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: "0.8rem" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const getReturnStatusLabel = (status?: string) => {
  switch (status) {
    case "REQUESTED":
      return "Đã gửi yêu cầu";
    case "APPROVED":
      return "Đã duyệt";
    case "REJECTED":
      return "Bị từ chối";
    case "CUSTOMER_SHIPPED":
      return "Khách đã gửi hàng trả";
    case "RECEIVED":
      return "Shop đã nhận hàng trả";
    case "REFUNDED":
      return "Đã hoàn tiền";
    case "COMPLETED":
      return "Hoàn tất";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return "Đang xử lý";
  }
};

const secondaryButtonSx = {
  textTransform: "none",
  borderRadius: "999px",
  fontSize: "0.95rem",
  fontWeight: 700,
  borderColor: "rgba(249,115,22,0.3)",
  color: "#fb923c",
  px: 2.5,
  "&:hover": {
    borderColor: "#fb923c",
    backgroundColor: "rgba(249,115,22,0.08)",
  },
};

const primaryButtonSx = {
  textTransform: "none",
  borderRadius: "999px",
  px: 2.5,
  fontWeight: 800,
  backgroundColor: "#f97316",
  "&:hover": {
    backgroundColor: "#ea580c",
  },
};

export default OrderDetails;