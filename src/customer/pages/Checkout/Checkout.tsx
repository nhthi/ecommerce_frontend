import {
  Alert,
  Box,
  Button,
  Divider,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Snackbar,
} from "@mui/material";
import React, { useState } from "react";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import {
  Add,
  AttachMoney,
  CreditCard,
  LocalAtm,
  Money,
} from "@mui/icons-material";
import PricingCart from "../Cart/PricingCart";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { Address } from "../../../types/UserType";
import {
  createOrder,
  getPaymentOrderStatus,
} from "../../../state/customer/orderSlice";
import CustomLoading from "../../components/CustomLoading/CustomLoading";
import { NavigateFunction, useNavigate } from "react-router-dom";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 600,
  width: "95%",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 0,
};

const paymentGatewayList = [
  {
    value: "COD",
    label: "Thanh toán khi nhận hàng",
    icon: <LocalAtm fontSize="large" className="text-indigo-500" />,
  },
  {
    value: "SEPAY",
    label: "Thanh toán Online",
    icon: <CreditCard fontSize="large" className="text-indigo-500" />,
  },
];

const Checkout = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [paymentGateway, setPaymentGateway] = useState<string>("COD");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "error",
  });

  const [remainingTime, setRemainingTime] = useState(180); // 3 phút = 180s
  const [paymentStatus, setPaymentStatus] = useState<
    "PENDING" | "SUCCESS" | "EXPIRED"
  >("PENDING");
  const [loading, setLoading] = useState(false);
  const [sepayInfo, setSepayInfo] = useState<any>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { auth, address } = useAppSelector((store) => store);
  const addresses: Address[] = auth.user?.addresses
    ? [...auth.user.addresses]
    : [];

  if (address.address) {
    addresses.push(address.address);
  }
  const activeAddresses = addresses.filter((addr) => addr.active === true);

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentGateway(e.target.value);
  };

  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  React.useEffect(() => {
    if (activeAddresses.length > 0 && !selectedId) {
      const defaultAddress = activeAddresses.find((a) => a.default);
      if (defaultAddress?.id) {
        setSelectedId(defaultAddress.id);
      }
    }
  }, [activeAddresses, selectedId]);

  const handleCheckout = async () => {
    if (!selectedId) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn địa chỉ giao hàng trước khi thanh toán!",
        severity: "error",
      });
      return;
    }

    const req: {
      addressId: Number;
      paymentGateway: string;
      navigate: NavigateFunction;
    } = {
      addressId: Number(selectedId),
      paymentGateway: paymentGateway,
      navigate,
    };

    try {
      setLoading(true);
      const res = await dispatch(createOrder(req)).unwrap();
      if (paymentGateway === "SEPAY") {
        setSepayInfo(res); // mở modal QR
      }
      if (paymentGateway === "COD") {
        setSnackbar({
          open: true,
          message: "Đặt hàng thành công. Thanh toán khi nhận hàng 🚚",
          severity: "success",
        });

        setTimeout(() => {
          navigate("/ordersuccess");
        }, 1200);
      }
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    if (!sepayInfo) return;

    setRemainingTime(180);
    setPaymentStatus("PENDING");
    setShowSuccessMessage(false);

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentStatus("EXPIRED");
          setSepayInfo(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sepayInfo]);

  React.useEffect(() => {
    if (!sepayInfo || paymentStatus !== "PENDING") return;

    const interval = setInterval(async () => {
      try {
        const res = await dispatch(
          getPaymentOrderStatus(sepayInfo.paymentOrderId),
        ).unwrap();

        if (res.status === "SUCCESS") {
          setPaymentStatus("SUCCESS");
          setShowSuccessMessage(true);
          clearInterval(interval);

          setTimeout(() => {
            // const orderId = sepayInfo.
            setSepayInfo(null);

            navigate("/ordersuccess");
          }, 3000); // chờ 2s cho user thấy success
        }

        if (res.status === "EXPIRED") {
          setPaymentStatus("EXPIRED");
          clearInterval(interval);
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [sepayInfo, paymentStatus]);
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 pt-10 px-4 sm:px-8 md:px-16 lg:px-28">
        {loading && <CustomLoading message="Đang xử lý..." />}

        <div className="max-w-6xl mx-auto mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Thanh toán</h1>
          <p className="text-sm text-slate-500 mt-1">
            Chọn địa chỉ giao hàng và phương thức thanh toán để hoàn tất đơn
            hàng.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6 lg:space-y-0 lg:grid grid-cols-3 lg:gap-8">
          {/* Cột trái: Địa chỉ */}
          <div className="col-span-2 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold text-slate-900 text-lg">
                Địa chỉ giao hàng
              </h2>

              <Button
                variant="outlined"
                onClick={() => setOpen(true)}
                sx={{
                  textTransform: "none",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                <Add sx={{ fontSize: 18, mr: 0.5 }} /> Thêm địa chỉ mới
              </Button>
            </div>

            <div className="text-xs sm:text-sm font-medium space-y-3">
              <p className="text-slate-600">Địa chỉ đã lưu</p>
              <div className="space-y-3">
                {activeAddresses.length > 0 ? (
                  [...activeAddresses]
                    .reverse()
                    .map((item: Address) => (
                      <AddressCard
                        key={item.id}
                        item={item}
                        selectedId={selectedId}
                        onSelect={handleSelect}
                      />
                    ))
                ) : (
                  <div className="text-xs text-slate-500">
                    Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới để tiếp tục.
                  </div>
                )}
              </div>
            </div>

            <div className="py-4 px-5 rounded-2xl border border-dashed border-slate-300 bg-white/70 flex items-center justify-between">
              <span className="text-sm text-slate-700">
                Bạn muốn giao đến địa chỉ khác?
              </span>
              <Button
                onClick={() => setOpen(true)}
                size="small"
                variant="text"
                sx={{ textTransform: "none", fontSize: "0.85rem" }}
              >
                Thêm địa chỉ mới
              </Button>
            </div>
          </div>

          {/* Cột phải: Thanh toán + tổng tiền */}
          <div className="space-y-4">
            {/* Phương thức thanh toán */}
            <div className="border border-slate-200 p-5 rounded-2xl bg-white/90 shadow-sm space-y-4">
              <h1 className="text-sky-700 font-semibold text-center">
                Chọn phương thức thanh toán
              </h1>
              <Divider />

              <RadioGroup
                aria-labelledby="payment-method"
                name="payment-method"
                onChange={handlePaymentChange}
                value={paymentGateway}
                className="space-y-4"
              >
                {/* NHÓM 1: Thanh toán online */}
                <div>
                  <div className="flex justify-between flex-wrap gap-3 flex-col">
                    {paymentGatewayList.map((item) => (
                      <FormControlLabel
                        key={item.value}
                        value={item.value}
                        labelPlacement="start"
                        className={`w-full rounded-xl border cursor-pointer transition-all bg-white px-4 py-3
        ${
          paymentGateway === item.value
            ? "border-sky-500 border-2 shadow-md"
            : "border-slate-200 hover:border-sky-300"
        }`}
                        control={<Radio />}
                        label={
                          <div className="flex items-center gap-3">
                            {/* Icon */}
                            <div className="text-xl">{item.icon}</div>

                            {/* Label */}
                            <span className="text-sm font-medium text-slate-700">
                              {item.label}
                            </span>
                          </div>
                        }
                        sx={{
                          m: 0,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <Divider />
              </RadioGroup>
            </div>
            {/* GIỎ HÀNG & NÚT THANH TOÁN */}
            <div className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm overflow-hidden">
              <PricingCart />
              <div className="p-5">
                <Button
                  onClick={handleCheckout}
                  fullWidth
                  variant="contained"
                  sx={{
                    py: "11px",
                    borderRadius: "999px",
                    textTransform: "none",
                    fontWeight: 600,
                    background:
                      "linear-gradient(135deg, rgb(16,185,129), rgb(59,130,246))",
                    boxShadow: "0 16px 35px rgba(16,185,129,0.45)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, rgb(5,150,105), rgb(37,99,235))",
                    },
                  }}
                >
                  Xác nhận & thanh toán
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL thêm địa chỉ */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <AddressForm onClose={() => setOpen(false)} />
        </Box>
      </Modal>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Modal open={!!sepayInfo} onClose={() => setSepayInfo(null)}>
        <Box
          sx={{
            ...modalStyle,
            p: 3,
            maxWidth: 420,
          }}
        >
          {showSuccessMessage ? (
            <>
              <div className="flex flex-col items-center justify-center py-6 space-y-3">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
                  alt="success"
                  className="w-20 h-20"
                />
                <h3 className="text-lg font-semibold text-green-600">
                  Thanh toán thành công 🎉
                </h3>
                <p className="text-sm text-slate-500 text-center">
                  Hệ thống đang chuyển bạn đến trang xác nhận đơn hàng...
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-center mb-3">
                Quét QR để chuyển khoản
              </h2>

              <img
                className="mx-auto w-56 h-56"
                alt="QR Payment"
                src={`https://qr.sepay.vn/img?acc=LOCSPAY000336637&bank=ACB&amount=${sepayInfo?.amount}&des=${sepayInfo?.paymentCode}`}
              />

              <Divider sx={{ my: 2 }} />

              <div className="text-sm space-y-1">
                <p>
                  <b>Ngân hàng:</b> {sepayInfo?.bankName}
                </p>
                <p>
                  <b>Số TK:</b> {sepayInfo?.accountNumber}
                </p>
                <p>
                  <b>Chủ TK:</b> {sepayInfo?.accountName}
                </p>
                <p className="text-red-600 font-semibold">
                  Nội dung: {sepayInfo?.paymentCode}
                </p>
                <p className="font-semibold">
                  Số tiền: {sepayInfo?.amount?.toLocaleString()} đ
                </p>
              </div>

              <Alert severity="info" sx={{ mt: 2 }}>
                Hệ thống sẽ tự động xác nhận sau khi bạn chuyển khoản.
              </Alert>

              <p className="text-center text-sm mt-2">
                Thời gian còn lại:{" "}
                <b className={remainingTime <= 30 ? "text-red-600" : ""}>
                  {Math.floor(remainingTime / 60)}:
                  {(remainingTime % 60).toString().padStart(2, "0")}
                </b>
              </p>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Checkout;
