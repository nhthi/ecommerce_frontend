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
import { Add, CreditCard, LocalAtm } from "@mui/icons-material";
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
  maxWidth: 680,
  width: "95%",
  bgcolor: "transparent",
  borderRadius: 0,
  boxShadow: "none",
  p: 0,
};

const paymentGatewayList = [
  {
    value: "COD",
    label: "Thanh toán khi nhận hàng",
    description: "Kiểm hàng và thanh toán khi shipper giao đơn.",
    icon: <LocalAtm fontSize="large" className="text-orange-400" />,
  },
  {
    value: "SEPAY",
    label: "Chuyển khoản QR",
    description: "Quét mã QR và hệ thống tự xác nhận đơn.",
    icon: <CreditCard fontSize="large" className="text-orange-400" />,
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

  const [remainingTime, setRemainingTime] = useState(180);
  const [paymentStatus, setPaymentStatus] = useState<
    "PENDING" | "SUCCESS" | "EXPIRED"
  >("PENDING");
  const [loading, setLoading] = useState(false);
  const [sepayInfo, setSepayInfo] = useState<any>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { auth, address, cart } = useAppSelector((store) => store);
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
        message: "Vui lòng ch?n d?a ch? giao hàng tru?c khi thanh toán.",
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
        setSepayInfo(res);
      }
      if (paymentGateway === "COD") {
        setSnackbar({
          open: true,
          message: "Ð?t hàng thành công. B?n s? thanh toán khi nh?n hàng.",
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
            setSepayInfo(null);
            navigate("/ordersuccess");
          }, 3000);
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
      <div className="min-h-screen bg-[#0b0b0b] px-4 pb-16 pt-8 sm:px-8 lg:px-16 xl:px-24">
        {loading && <CustomLoading message="Ðang x? lý don hàng..." />}

        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[2rem] border border-orange-500/15 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.2),_transparent_30%),linear-gradient(180deg,_#171717_0%,_#0f0f0f_100%)] px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:px-8 lg:px-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <span className="inline-flex w-fit items-center rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-300">
                  Checkout
                </span>
                <div className="space-y-2">
                  <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                    Hoàn tất đơn hàng
                  </h1>
                  <p className="max-w-xl text-sm leading-6 text-neutral-300 sm:text-base">
                    Chọn địa chỉ giao hàng, cách thanh toán và kiểm tra tổng tiền trước khi xác nhận.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-neutral-300">
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                    Địa chỉ
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">
                    {activeAddresses.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                    Tổng đơn
                  </p>
                  <p className="mt-2 text-2xl font-black text-orange-400">
                    {(cart.cart?.totalCouponPrice || 0).toLocaleString()}d
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex flex-col gap-3 rounded-[1.8rem] border border-orange-500/12 bg-[#121212] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.3)] sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300">
                  Giao hàng
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                  Địa chỉ giao hang
                </h2>
                <p className="mt-1 text-sm leading-6 text-neutral-400">
                  Chọn địa chỉ bạn muốn sử dụng cho đơn này
                </p>
              </div>

              <Button
                variant="outlined"
                onClick={() => setOpen(true)}
                sx={{
                  alignSelf: "flex-start",
                  textTransform: "none",
                  borderRadius: "999px",
                  px: 2.2,
                  py: 1,
                  fontWeight: 700,
                  color: "#fdba74",
                  borderColor: "rgba(249,115,22,0.3)",
                  "&:hover": {
                    borderColor: "#f97316",
                    backgroundColor: "rgba(249,115,22,0.08)",
                  },
                }}
              >
                <Add sx={{ fontSize: 18, mr: 0.5 }} /> Thêm địa chỉ mới
              </Button>
            </div>

            {activeAddresses.length > 0 ? (
              <div className="space-y-3">
                {[...activeAddresses].reverse().map((item: Address) => (
                  <AddressCard
                    key={item.id}
                    item={item}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.8rem] border border-dashed border-white/10 bg-[#121212] px-6 py-8 text-center shadow-[0_16px_45px_rgba(0,0,0,0.24)]">
                <p className="text-xl font-black tracking-tight text-white">
                  Chưa có địa chỉ giao hàng
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Thêm địa chỉ mới để tiếp tục sang bước thanh toán
                </p>
                <Button
                  onClick={() => setOpen(true)}
                  variant="contained"
                  sx={{
                    mt: 3,
                    textTransform: "none",
                    borderRadius: "999px",
                    px: 3,
                    py: 1.1,
                    fontWeight: 800,
                    color: "#111111",
                    background:
                      "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #fdba74 0%, #ea580c 100%)",
                    },
                  }}
                >
                  Thêm địa chỉ
                </Button>
              </div>
            )}

            <div className="rounded-[1.8rem] border border-white/10 bg-[#121212] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300">
                Thanh toán
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                Phuong thức thanh toán
              </h2>
              <p className="mt-1 text-sm leading-6 text-neutral-400">
                Chọn cách thanh toán phù hợp cho đơn hàng hiện tại.
              </p>

              <RadioGroup
                aria-labelledby="payment-method"
                name="payment-method"
                onChange={handlePaymentChange}
                value={paymentGateway}
                className="mt-5 space-y-3"
              >
                {paymentGatewayList.map((item) => (
                  <FormControlLabel
                    key={item.value}
                    value={item.value}
                    labelPlacement="start"
                    className={[
                      "m-0 w-full cursor-pointer rounded-[1.5rem] border px-4 py-4 transition-all",
                      paymentGateway === item.value
                        ? "border-orange-500/45 bg-orange-500/10"
                        : "border-white/10 bg-white/[0.02] hover:border-orange-500/20",
                    ].join(" ")}
                    control={
                      <Radio
                        sx={{
                          color: "rgba(255,255,255,0.35)",
                          "&.Mui-checked": { color: "#f97316" },
                        }}
                      />
                    }
                    label={
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/20">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-base font-black tracking-tight text-white">
                            {item.label}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-neutral-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    }
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  />
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[1.8rem] border border-orange-500/12 bg-[#121212] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <PricingCart />
              <div className="p-5 pt-0">
                <Button
                  onClick={handleCheckout}
                  fullWidth
                  variant="contained"
                  sx={{
                    py: "12px",
                    borderRadius: "999px",
                    textTransform: "none",
                    fontWeight: 800,
                    fontSize: "0.98rem",
                    color: "#111111",
                    background:
                      "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                    boxShadow: "0 18px 35px rgba(249,115,22,0.35)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #fdba74 0%, #ea580c 100%)",
                    },
                  }}
                >
                  Xác nhận và đặt hàng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
        <Box sx={modalStyle}>
          <div className="mx-auto w-[95%] max-w-[420px] rounded-[1.8rem] border border-orange-500/16 bg-[#111111] p-6 text-white shadow-[0_28px_80px_rgba(0,0,0,0.5)]">
            {showSuccessMessage ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/12">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
                    alt="success"
                    className="h-14 w-14"
                  />
                </div>
                <h3 className="mt-4 text-2xl font-black tracking-tight text-orange-300">
                  Thanh toán thành công
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Hệ thống đang chuyển bạn đến trang xác nhận đơn hàng
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300">
                    Thanh toán QR
                  </p>
                  <h2 className="text-2xl font-black tracking-tight text-white">
                    Quét QR để chuyển khoản
                  </h2>
                </div>

                <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-white/8 bg-white p-4">
                  <img
                    className="mx-auto h-56 w-56"
                    alt="QR Payment"
                    src={`https://qr.sepay.vn/img?acc=LOCSPAY000336637&bank=ACB&amount=${sepayInfo?.amount}&des=${sepayInfo?.paymentCode}`}
                  />
                </div>

                <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.08)" }} />

                <div className="space-y-2 text-sm text-neutral-300">
                  <p><b className="text-white">Ngân hàng:</b> {sepayInfo?.bankName}</p>
                  <p><b className="text-white">Số TK:</b> {sepayInfo?.accountNumber}</p>
                  <p><b className="text-white">Chủ TK:</b> {sepayInfo?.accountName}</p>
                  <p className="font-semibold text-orange-300">Nội dung: {sepayInfo?.paymentCode}</p>
                  <p className="text-base font-black text-white">Số tiền: {sepayInfo?.amount?.toLocaleString()} d</p>
                </div>

                <Alert severity="info" sx={{ mt: 2 }}>
                  Hệ thống sẽ tự động xác nhận sau khi giao dịch thành công.
                </Alert>

                <p className="mt-3 text-center text-sm text-neutral-400">
                  Thời gian còn lại:{" "}
                  <b className={remainingTime <= 30 ? "text-red-400" : "text-orange-300"}>
                    {Math.floor(remainingTime / 60)}:
                    {(remainingTime % 60).toString().padStart(2, "0")}
                  </b>
                </p>
              </>
            )}
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Checkout;

