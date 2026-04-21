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
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const OrderDetails = () => {
  const { isDark } = useSiteThemeMode();

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

  // const handleCustomerShipped = async (requestId: number) => {
  //   try {
  //     await dispatch(markReturnCustomerShipped(requestId)).unwrap();
  //     setSnackbar({
  //       open: true,
  //       message: "Đã cập nhật trạng thái khách gửi hàng trả.",
  //       severity: "success",
  //     });
  //   } catch (err: any) {
  //     setSnackbar({
  //       open: true,
  //       message:
  //         typeof err === "string"
  //           ? err
  //           : "Không thể cập nhật trạng thái trả hàng lúc này.",
  //       severity: "error",
  //     });
  //   }
  // };

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
      <Box
        className={`min-h-[50vh] flex items-center justify-center text-lg ${
          isDark ? "text-neutral-400" : "text-slate-600"
        }`}
      >
        Đang tải thông tin đơn hàng...
      </Box>
    );
  }

  const canCancel =
    currentOrder.orderStatus === "PENDING" || currentOrder.orderStatus === "PLACED";

  const canReturnByDate = isReturnAvailable(currentOrder.deliveryDate);

  const sectionClass = isDark
    ? "rounded-[1.8rem] border border-white/10 bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
    : "rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]";

  const softBoxClass = isDark
    ? "rounded-[1.2rem] bg-white/[0.03]"
    : "rounded-[1.2rem] bg-slate-50";

  const itemCardClass = isDark
    ? "flex flex-col gap-4 rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4 sm:flex-row"
    : "flex flex-col gap-4 rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-4 sm:flex-row";

  const dividerSx = {
    borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(148,163,184,0.28)",
  };

  const secondaryButtonSx = {
    textTransform: "none",
    borderRadius: "999px",
    fontSize: "0.95rem",
    fontWeight: 700,
    px: 2.5,
    borderColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(15,23,42,0.16)",
    color: isDark ? "#ffffff" : "#0f172a",
    backgroundColor: "transparent",
    "&:hover": {
      borderColor: isDark ? "rgba(255,255,255,0.32)" : "rgba(15,23,42,0.3)",
      backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.04)",
    },
  };

  const primaryButtonSx = {
    textTransform: "none",
    borderRadius: "999px",
    px: 2.5,
    fontWeight: 800,
    backgroundColor: isDark ? "#f3f4f6" : "#111827",
    color: isDark ? "#111827" : "#ffffff",
    "&:hover": {
      backgroundColor: isDark ? "#e5e7eb" : "#1f2937",
    },
  };

  return (
    <Box className="space-y-6">
      <section className={`${sectionClass} px-6 py-5 lg:px-7`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className={`text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
              Đơn hàng #{currentOrder.orderCode || currentOrder.orderCode}
            </h2>

            <p className={`mt-3 text-base leading-7 ${isDark ? "text-neutral-300" : "text-slate-600"}`}>
              Ngày đặt:{" "}
              <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                {currentOrder.orderDate
                  ? new Date(currentOrder.orderDate).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "Đang cập nhật"}
              </span>
            </p>

            <p className={`mt-1 text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
              {formatVND(pricing.totalPrice)}
            </p>

            {currentOrder.orderStatus === "DELIVERED" && (
              <p className={`mt-2 text-sm ${isDark ? "text-neutral-400" : "text-slate-500"}`}>
                Có thể trả hàng đến{" "}
                <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
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

      <section className={`${sectionClass} p-5 lg:p-6`}>
        <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
          Sản phẩm trong đơn
        </h3>
        <Divider sx={{ ...dividerSx, my: 3 }} />

        <div className="space-y-4">
          {currentOrder.orderItems?.map((item) => {
            const itemReturnRequest = returnRequestMap.get(item.id);
            const canCreateReturn =
              currentOrder.orderStatus === "DELIVERED" &&
              canReturnByDate &&
              !itemReturnRequest;

            return (
              <div key={item.id} className={itemCardClass}>
                <img
                  src={item.product?.images?.[0]}
                  alt={item.product?.title}
                  className={`h-32 w-24 rounded-xl object-cover ${
                    isDark ? "border border-white/8" : "border border-slate-200"
                  }`}
                />

                <div className="flex-1 space-y-2 text-base">
                  <h4 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {item.product?.title}
                  </h4>

                  <p className={isDark ? "text-slate-400" : "text-slate-500"}>
                    {item.product?.seller?.businessDetails?.businessName || "NHTHI Fit"}
                  </p>

                  <p className={isDark ? "text-slate-300" : "text-slate-600"}>
                    Kích thước:{" "}
                    <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {item.size?.name || "Không có"}
                    </span>
                  </p>

                  <p className={isDark ? "text-slate-300" : "text-slate-600"}>
                    Số lượng:{" "}
                    <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {item.quantity}
                    </span>
                  </p>

                  <p className={isDark ? "text-slate-300" : "text-slate-600"}>
                    Giá:{" "}
                    <span className={`mr-2 line-through ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      {formatVND(item.mrpPrice || 0)}
                    </span>
                    <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {formatVND(item.sellingPrice || 0)}
                    </span>
                  </p>

                  {itemReturnRequest && (
                    <div
                      className={`mt-3 rounded-2xl px-4 py-3 ${
                        isDark
                          ? "border border-white/10 bg-white/[0.04]"
                          : "border border-slate-200 bg-white"
                      }`}
                    >
                      <p className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        Yêu cầu trả hàng: {getReturnStatusLabel(itemReturnRequest.status)}
                      </p>
                      <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        Tiền hoàn dự kiến{" "}
                        <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                          {formatVND(itemReturnRequest.refundAmount || 0)}
                        </span>
                      </p>
                      {itemReturnRequest.note && (
                        <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Ghi chú: {itemReturnRequest.note}
                        </p>
                      )}
                    </div>
                  )}

                  {currentOrder.orderStatus === "DELIVERED" &&
                    !canReturnByDate &&
                    !itemReturnRequest && (
                      <div
                        className={`mt-3 rounded-2xl px-4 py-3 ${
                          isDark
                            ? "border border-white/10 bg-white/[0.04]"
                            : "border border-slate-200 bg-white"
                        }`}
                      >
                        <p className={`text-sm font-semibold ${isDark ? "text-neutral-200" : "text-slate-700"}`}>
                          Đã quá thời hạn 7 ngày kể từ ngày giao, sản phẩm này không còn hỗ trợ trả hàng.
                        </p>
                      </div>
                    )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    {item.review ? (
                      <Button
                        onClick={() =>
                          navigate(`/account/my-reviews`, {
                            state: { orderItemId: item.id, review: item.review },
                          })
                        }
                        variant="contained"
                        sx={primaryButtonSx}
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

                    {/* {itemReturnRequest?.status === "APPROVED" && (
                      <Button
                        variant="contained"
                        sx={primaryButtonSx}
                        onClick={() => handleCustomerShipped(itemReturnRequest.id)}
                      >
                        Tôi đã gửi hàng trả
                      </Button>
                    )} */}

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

      <section className={`${sectionClass} p-5 lg:p-6`}>
        <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
          Trạng thái đơn hàng
        </h3>
        <OrderStepper
          orderStatus={currentOrder.orderStatus || OrderStatus.PENDING}
          deliveryDate={currentOrder.deliveryDate}
        />
      </section>

      <section className={`${sectionClass} p-5 lg:p-6`}>
        <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
          Địa chỉ giao hàng
        </h3>
        <Divider sx={{ ...dividerSx, my: 3 }} />

        <div className={`space-y-3 text-base ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          <div className={`flex flex-wrap gap-4 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
            <p>{currentOrder.shippingAddress?.receiverName}</p>
            <p>{currentOrder.shippingAddress?.phoneNumber}</p>
          </div>

          <p>
            {`${currentOrder.shippingAddress?.streetDetail}, ${currentOrder.shippingAddress?.ward}, ${currentOrder.shippingAddress?.district}, ${currentOrder.shippingAddress?.province}`}
          </p>

          {currentOrder.shippingAddress?.note && (
            <p className={isDark ? "text-slate-400" : "text-slate-500"}>
              Ghi chú: {currentOrder.shippingAddress.note}
            </p>
          )}
        </div>
      </section>

      <section className={`${sectionClass} overflow-hidden`}>
        <div className="space-y-4 px-6 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                Tổng quan thanh toán
              </p>
              <p className={`mt-1 text-base ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Bạn tiết kiệm{" "}
                <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {formatVND(pricing.totalDiscount)}
                </span>{" "}
                cho đơn này.
              </p>
            </div>
            <p className={`text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
              {formatVND(pricing.totalPrice)}
            </p>
          </div>

          <div
            className={`mt-4 space-y-3 px-4 py-4 text-base ${
              isDark ? `${softBoxClass} text-slate-300` : `${softBoxClass} text-slate-600`
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <span className={isDark ? "text-slate-400" : "text-slate-500"}>Tổng giá gốc</span>
              <span>{formatVND(pricing.originalPrice)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className={isDark ? "text-slate-400" : "text-slate-500"}>Tổng tiền hàng</span>
              <span>{formatVND(pricing.subtotalPrice)}</span>
            </div>

            {pricing.productDiscount > 0 && (
              <div className="flex items-center justify-between gap-4">
                <span className={`flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                  <Discount sx={{ fontSize: 18 }} />
                  Giảm giá sản phẩm
                </span>
                <span className={isDark ? "text-white" : "text-slate-900"}>
                  -{formatVND(pricing.productDiscount)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <span className={`flex items-center gap-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                <LocalShipping sx={{ fontSize: 18 }} />
                Phí vận chuyển
              </span>
              <span>{formatVND(pricing.shippingFee)}</span>
            </div>

            {pricing.shippingFeeDiscount > 0 && (
              <div className="flex items-center justify-between gap-4">
                <span className={isDark ? "text-white" : "text-slate-900"}>Giảm phí vận chuyển</span>
                <span className={isDark ? "text-white" : "text-slate-900"}>
                  -{formatVND(pricing.shippingFeeDiscount)}
                </span>
              </div>
            )}

            {pricing.couponDiscount > 0 && (
              <div className="flex items-center justify-between gap-4">
                <span className={isDark ? "text-white" : "text-slate-900"}>Giảm giá từ mã khuyến mãi</span>
                <span className={isDark ? "text-white" : "text-slate-900"}>
                  -{formatVND(pricing.couponDiscount)}
                </span>
              </div>
            )}

            <Divider sx={dividerSx} />

            <div className={`flex items-center justify-between gap-4 text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              <span>Thành tiền</span>
              <span>{formatVND(pricing.totalPrice)}</span>
            </div>

            {pricing.finalShippingFee === 0 && pricing.shippingFee > 0 && (
              <div className={`text-right text-sm font-semibold ${isDark ? "text-neutral-200" : "text-slate-700"}`}>
                Bạn được miễn phí vận chuyển
              </div>
            )}
          </div>

          <div
            className={`flex items-center gap-3 px-4 py-3 text-base ${
              isDark ? `${softBoxClass} text-slate-300` : `${softBoxClass} text-slate-600`
            }`}
          >
            <Payments sx={{ color: isDark ? "#ffffff" : "#0f172a" }} />
            {currentOrder.paymentMethod === "COD"
              ? "Thanh toán khi nhận hàng (COD)"
              : "Thanh toán trực tuyến"}
          </div>
        </div>

        <Divider sx={{ ...dividerSx, mt: 3 }} />

        <div className={`px-6 py-4 text-base ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Đơn vị bán hàng:{" "}
          <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
            {currentOrder.orderItems?.[0]?.product?.seller?.businessDetails?.businessName ||
              "NHTHI Fit"}
          </span>
        </div>

        <div className="px-6 pb-6 pt-1">
          <Button
            fullWidth
            variant="outlined"
            sx={secondaryButtonSx}
            disabled={!canCancel}
            onClick={() => setOpenConfirm(true)}
          >
            Hủy đơn hàng
          </Button>
        </div>
      </section>

      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            backgroundColor: isDark ? "#171717" : "#ffffff",
            color: isDark ? "#ffffff" : "#0f172a",
            border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(148,163,184,0.2)",
          },
        }}
      >
        <DialogTitle sx={{ color: isDark ? "#fff" : "#0f172a" }}>
          Bạn chắc chắn muốn hủy đơn hàng này?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: isDark ? "rgba(255,255,255,0.7)" : "#475569" }}>
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
            autoFocus
            sx={{
              textTransform: "none",
              borderRadius: "999px",
              px: 2,
              backgroundColor: isDark ? "#f3f4f6" : "#111827",
              color: isDark ? "#111827" : "#ffffff",
              "&:hover": {
                backgroundColor: isDark ? "#e5e7eb" : "#1f2937",
              },
            }}
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

export default OrderDetails;