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
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrderStepper from "./OrderStepper";
import { Payments } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import {
  cancelOrder,
  fetchOrderById,
} from "../../../state/customer/orderSlice";
import { OrderStatus } from "../../../types/OrderType";
import CustomLoading from "../../components/CustomLoading/CustomLoading";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { order } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const currentOrder = order.currentOrder;

  const totalMrp =
    currentOrder?.orderItems?.reduce(
      (sum, item) => sum + (item.product?.mrpPrice || 0) * (item.quantity || 1),
      0
    ) || 0;

  const formatVND = (value: number | undefined) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);

  const handleCancelOrder = async () => {
    if (orderId) {
      setLoading(true);
      try {
        await dispatch(cancelOrder(Number(orderId))).unwrap();
        setSnackbar({
          open: true,
          message: "Hủy đơn hàng thành công!",
          severity: "success",
        });
      } catch (err: any) {
        setSnackbar({
          open: true,
          message:
            typeof err === "string" ? err : "Có lỗi xảy ra khi hủy đơn hàng!",
          severity: "error",
        });
      } finally {
        setLoading(false);
        setOpenConfirm(false);
      }
    }
  };

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(Number(orderId)));
    }
  }, [orderId, dispatch]);

  if (!currentOrder) {
    return (
      <Box className="min-h-[50vh] flex items-center justify-center text-sm text-slate-500">
        Đang tải thông tin đơn hàng...
      </Box>
    );
  }

  const canCancel =
    currentOrder.orderStatus === "PENDING" ||
    currentOrder.orderStatus === "PLACED";

  const discount = totalMrp - (currentOrder.totalPrice || 0);

  return (
    <Box className="space-y-5">
      {/* Header + thông tin chung */}
      <section className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm px-5 py-4 sm:px-6 sm:py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="font-semibold text-lg sm:text-xl text-slate-900">
            Đơn hàng #{currentOrder.id}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Ngày đặt:{" "}
            <span className="font-medium text-slate-800">
              {currentOrder.orderDate
                ? new Date(currentOrder.orderDate).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "Đang cập nhật"}
            </span>
          </p>
          <p className="text-xs text-slate-500">
            Tổng tiền:{" "}
            <span className="font-semibold text-sky-600">
              {formatVND(currentOrder.totalPrice)}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <Button
            variant="outlined"
            size="small"
            sx={{ textTransform: "none", borderRadius: "999px" }}
            onClick={() => navigate("/account/orders")}
          >
            Quay lại danh sách đơn hàng
          </Button>
        </div>
      </section>

      {/* Danh sách sản phẩm */}
      <section className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm p-4 sm:p-5 space-y-4">
        <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
          Sản phẩm trong đơn
        </h3>
        <Divider />
        <div className="space-y-3">
          {currentOrder.orderItems?.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-3 sm:p-4"
            >
              <div className="shrink-0 flex justify-center">
                <img
                  src={item.product?.images?.[0]}
                  alt={item.product?.title}
                  className="w-24 h-28 object-cover rounded-lg border border-slate-100"
                />
              </div>
              <div className="flex-1 text-sm space-y-1.5">
                <h1 className="font-semibold text-slate-900">
                  {item.product?.title}
                </h1>
                <p className="text-xs text-slate-500">
                  {item.product?.seller?.businessDetails?.businessName ||
                    "Nhà bán hàng"}
                </p>
                <p className="text-xs text-slate-500">
                  <span className="font-medium">Size:</span>{" "}
                  {item.size?.name || "Không có"}
                </p>
                <p className="text-xs text-slate-500">
                  <span className="font-medium">Số lượng:</span> {item.quantity}
                </p>
                <p className="text-xs text-slate-500">
                  <span className="font-medium">Giá:</span>{" "}
                  <span className="line-through text-slate-400 mr-1">
                    {formatVND(item.mrpPrice || 0)}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {formatVND(item.sellingPrice || 0)}
                  </span>
                </p>

                <div className="pt-2">
                  {item.review ? (
                    <Button
                      disabled
                      size="small"
                      variant="contained"
                      sx={{
                        backgroundColor: "#9ca3af",
                        color: "#fff",
                        textTransform: "none",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        px: 2,
                        "&:hover": {
                          backgroundColor: "#9ca3af",
                        },
                      }}
                    >
                      Đã đánh giá
                    </Button>
                  ) : (
                    <Button
                      disabled={currentOrder.orderStatus !== "DELIVERED"}
                      onClick={() =>
                        navigate(`/account/orders/${currentOrder.id}/review`, {
                          state: { orderItemId: item.id }, // 👈 truyền ID item cần đánh giá
                        })
                      }
                      size="small"
                      variant="outlined"
                      sx={{
                        textTransform: "none",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        px: 2.5,
                      }}
                    >
                      Viết đánh giá
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trạng thái đơn hàng */}
      <section className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm p-4 sm:p-5">
        <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-3">
          Trạng thái đơn hàng
        </h3>
        <OrderStepper
          orderStatus={currentOrder.orderStatus || OrderStatus.PENDING}
          deliveryDate={currentOrder.deliveryDate}
        />
      </section>

      {/* Địa chỉ giao hàng */}
      <section className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm p-4 sm:p-5 space-y-3">
        <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
          Địa chỉ giao hàng
        </h3>
        <Divider />
        <div className="text-sm space-y-2">
          <div className="flex flex-wrap gap-3 items-center font-medium text-slate-800">
            <p>{currentOrder.shippingAddress?.receiverName}</p>
            <Divider flexItem orientation="vertical" />
            <p>{currentOrder.shippingAddress?.phoneNumber}</p>
          </div>
          <p className="text-slate-600">
            {`${currentOrder.shippingAddress?.streetDetail}, ${currentOrder.shippingAddress?.ward}, ${currentOrder.shippingAddress?.district}, ${currentOrder.shippingAddress?.province}`}
          </p>
          {currentOrder.shippingAddress?.note && (
            <p className="text-xs text-slate-500">
              Ghi chú: {currentOrder.shippingAddress.note}
            </p>
          )}
        </div>
      </section>

      {/* Tổng quan thanh toán */}
      <section className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm overflow-hidden">
        <div className="space-y-4 pt-4 px-5">
          <div className="flex justify-between text-sm">
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">Tổng giá sản phẩm</p>
              <p className="text-xs text-slate-500">
                Bạn đã tiết kiệm
                <span className="text-emerald-600 font-medium text-xs mx-1">
                  {formatVND(discount)}
                </span>
                cho đơn hàng này.
              </p>
            </div>
            <p className="font-semibold text-sky-600">
              {formatVND(currentOrder.totalPrice)}
            </p>
          </div>

          <div className="bg-teal-50 px-5 py-2 text-xs font-medium flex items-center gap-3 rounded-xl">
            <Payments />
            <p className="text-slate-700">
              {currentOrder.paymentMethod === "COD"
                ? "Thanh toán khi nhận hàng (COD)"
                : "Thanh toán online"}
            </p>
          </div>
        </div>

        <Divider sx={{ mt: 3 }} />

        <div className="px-5 py-3 text-xs text-slate-600 flex flex-wrap gap-1">
          <span className="font-semibold">Đơn vị bán hàng:</span>{" "}
          <span>
            {
              currentOrder.orderItems?.[0]?.product?.seller?.businessDetails
                ?.businessName
            }
          </span>
        </div>

        <div className="px-5 pb-5 pt-2">
          <Button
            fullWidth
            variant="outlined"
            color="error"
            sx={{ py: "0.7rem", borderRadius: "999px", textTransform: "none" }}
            disabled={!canCancel}
            onClick={() => setOpenConfirm(true)}
          >
            Hủy đơn hàng
          </Button>
        </div>
      </section>

      {/* Dialog xác nhận hủy */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Bạn có chắc muốn hủy đơn hàng này?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sau khi hủy, bạn sẽ không thể khôi phục lại đơn hàng. Bạn vẫn muốn
            tiếp tục?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenConfirm(false)}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Không, quay lại
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
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderDetails;
