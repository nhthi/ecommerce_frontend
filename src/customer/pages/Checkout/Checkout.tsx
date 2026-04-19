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
import React, { useEffect, useMemo, useState } from "react";
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
import { setSelectedAddress } from "../../../state/customer/addressSlice";
import CustomLoading from "../../components/CustomLoading/CustomLoading";
import { useNavigate } from "react-router-dom";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";
import { api } from "../../../config/Api";

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
    icon: <LocalAtm fontSize="large" />,
  },
  {
    value: "SEPAY",
    label: "Thanh toán trực tuyến",
    description: "Quét mã QR và hệ thống tự xác nhận đơn.",
    icon: <CreditCard fontSize="large" />,
  },
];

const FREE_SHIPPING_THRESHOLD = 300000;

const Checkout = () => {
  const [open, setOpen] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState("COD");
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [shippingLoading, setShippingLoading] = useState(false);
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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isDark } = useSiteThemeMode();
  const { auth, address, cart } = useAppSelector((store) => store);

  const activeAddresses = useMemo(() => {
    const merged = [
      ...(auth.user?.addresses || []),
      ...(address.address ? [address.address] : []),
      ...address.addresses,
    ];

    const deduped = merged.filter(
      (addr, index, self) =>
        addr?.id &&
        self.findIndex((item) => item.id === addr.id) === index
    );

    return deduped.filter((addr) => addr.active === true);
  }, [auth.user?.addresses, address.address, address.addresses]);

  const selectedId = address.selectedAddress?.id ?? null;

  useEffect(() => {
    const selected = address.selectedAddress;
    const totalSelling = cart.cart?.totalSellingPrice || 0;
    const isFreeShipping = totalSelling >= FREE_SHIPPING_THRESHOLD;

    if (isFreeShipping) {
      setShippingFee(0);
      setShippingLoading(false);
      return;
    }

    if (!selected?.districtId || !selected?.wardCode) {
      setShippingFee(0);
      setShippingLoading(false);
      return;
    }

    setShippingLoading(true);

    const timer = setTimeout(() => {
      api
        .post("/api/shipping/fee", {
          toDistrictId: selected.districtId,
          toWardCode: selected.wardCode,
        })
        .then((res) => {
          setShippingFee(res.data?.data?.total ?? 0);
        })
        .catch((err) => {
          console.error("Lỗi tính phí ship", err);
          setShippingFee(0);
        })
        .finally(() => {
          setShippingLoading(false);
        });
    }, 250);

    return () => clearTimeout(timer);
  }, [
    address.selectedAddress?.districtId,
    address.selectedAddress?.wardCode,
    cart.cart?.totalSellingPrice,
  ]);

  useEffect(() => {
    if (activeAddresses.length === 0) return;

    if (!address.selectedAddress?.id) {
      const defaultAddress =
        activeAddresses.find((a) => a.default) || activeAddresses[0];

      if (defaultAddress) {
        dispatch(setSelectedAddress(defaultAddress));
      }
      return;
    }

    const stillExists = activeAddresses.some(
      (item) => item.id === address.selectedAddress?.id
    );

    if (!stillExists) {
      const fallback =
        activeAddresses.find((a) => a.default) || activeAddresses[0] || null;

      if (fallback) {
        dispatch(setSelectedAddress(fallback));
      }
    }
  }, [activeAddresses, address.selectedAddress, dispatch]);

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentGateway(e.target.value);
  };

  const handleSelect = (item: Address) => {
    dispatch(setSelectedAddress(item));
  };

  const handleCheckout = async () => {
    if (!selectedId) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn địa chỉ giao hàng trước khi thanh toán.",
        severity: "error",
      });
      return;
    }

    const req = {
      addressId: Number(selectedId),
      paymentGateway,
      shippingFee,
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
          message: "Đặt hàng thành công. Bạn sẽ thanh toán khi nhận hàng.",
          severity: "success",
        });

        setTimeout(() => {
          navigate("/ordersuccess");
        }, 1200);
      }
    } catch (error: any) {
      console.error("Create order error:", error);
      setSnackbar({
        open: true,
        message: typeof error === "string" ? error : "Đặt hàng thất bại",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  useEffect(() => {
    if (!sepayInfo || paymentStatus !== "PENDING") return;

    const interval = setInterval(async () => {
      try {
        const res = await dispatch(
          getPaymentOrderStatus(sepayInfo.paymentOrderId)
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
  }, [dispatch, navigate, paymentStatus, sepayInfo]);

  return (
    <>
      <div
        className={`min-h-screen px-4 pb-16 pt-8 transition-colors duration-300 sm:px-8 lg:px-16 xl:px-24 ${
          isDark ? "bg-[#0f0f0f]" : "bg-[#f6f6f6]"
        }`}
      >
        {loading && <CustomLoading message="Đang xử lý đơn hàng..." />}

        <div className="mx-auto max-w-7xl">
          <div
            className={`overflow-hidden rounded-[2rem] border px-6 py-8 shadow-sm sm:px-8 lg:px-10 ${
              isDark
                ? "border-white/10 bg-[#111111]"
                : "border-black/10 bg-white"
            }`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <span
                  className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] ${
                    isDark
                      ? "border-white/12 bg-white/[0.05] text-white"
                      : "border-black/10 bg-black/[0.04] text-black"
                  }`}
                >
                  Thanh toán
                </span>

                <div className="space-y-2">
                  <h1
                    className={`text-3xl font-black uppercase tracking-tight sm:text-4xl ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    Hoàn tất đơn hàng
                  </h1>
                  <p
                    className={`max-w-xl text-sm leading-6 sm:text-base ${
                      isDark ? "text-white/70" : "text-black/60"
                    }`}
                  >
                    Chọn địa chỉ giao hàng, cách thanh toán và kiểm tra tổng tiền
                    trước khi xác nhận.
                  </p>
                </div>
              </div>

              <div
                className={`grid grid-cols-2 gap-3 text-sm ${
                  isDark ? "text-white/70" : "text-black/70"
                }`}
              >
                <div
                  className={`rounded-2xl border px-4 py-3 ${
                    isDark
                      ? "border-white/10 bg-white/[0.04]"
                      : "border-black/10 bg-black/[0.03]"
                  }`}
                >
                  <p
                    className={`text-[11px] uppercase tracking-[0.22em] ${
                      isDark ? "text-white/45" : "text-black/45"
                    }`}
                  >
                    Địa chỉ
                  </p>
                  <p
                    className={`mt-2 text-2xl font-black ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    {activeAddresses.length}
                  </p>
                </div>

                <div
                  className={`rounded-2xl border px-4 py-3 ${
                    isDark
                      ? "border-white/10 bg-white/[0.04]"
                      : "border-black/10 bg-black/[0.03]"
                  }`}
                >
                  <p
                    className={`text-[11px] uppercase tracking-[0.22em] ${
                      isDark ? "text-white/45" : "text-black/45"
                    }`}
                  >
                    Tổng đơn
                  </p>
                  <p
                    className={`mt-2 text-2xl font-black ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    {(cart.cart?.totalCouponPrice || 0).toLocaleString()}đ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
          <div className="space-y-4 lg:col-span-2">
            <div
              className={`flex flex-col gap-3 rounded-[1.8rem] border p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between ${
                isDark
                  ? "border-white/10 bg-[#111111]"
                  : "border-black/10 bg-white"
              }`}
            >
              <div>
                <p
                  className={`text-[11px] font-bold uppercase tracking-[0.24em] ${
                    isDark ? "text-white/45" : "text-black/45"
                  }`}
                >
                  Giao hàng
                </p>
                <h2
                  className={`mt-2 text-2xl font-black tracking-tight ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Địa chỉ giao hàng
                </h2>
                <p
                  className={`mt-1 text-sm leading-6 ${
                    isDark ? "text-white/65" : "text-black/60"
                  }`}
                >
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
                  color: isDark ? "#ffffff" : "#000000",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.14)"
                    : "rgba(0,0,0,0.14)",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: isDark
                      ? "rgba(255,255,255,0.28)"
                      : "rgba(0,0,0,0.28)",
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.04)",
                    boxShadow: "none",
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
                    onSelect={() => handleSelect(item)}
                  />
                ))}
              </div>
            ) : (
              <div
                className={`rounded-[1.8rem] border px-6 py-8 text-center shadow-sm ${
                  isDark
                    ? "border-dashed border-white/10 bg-[#111111]"
                    : "border-dashed border-black/10 bg-white"
                }`}
              >
                <p
                  className={`text-xl font-black tracking-tight ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Chưa có địa chỉ giao hàng
                </p>
                <p
                  className={`mt-2 text-sm leading-6 ${
                    isDark ? "text-white/65" : "text-black/60"
                  }`}
                >
                  Thêm địa chỉ mới để tiếp tục sang bước thanh toán
                </p>
                <Button
                  onClick={() => setOpen(true)}
                  variant="outlined"
                  sx={{
                    mt: 3,
                    textTransform: "none",
                    borderRadius: "999px",
                    px: 3,
                    py: 1.1,
                    fontWeight: 800,
                    color: isDark ? "#ffffff" : "#000000",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.14)"
                      : "rgba(0,0,0,0.14)",
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: isDark
                        ? "rgba(255,255,255,0.28)"
                        : "rgba(0,0,0,0.28)",
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(0,0,0,0.04)",
                      boxShadow: "none",
                    },
                  }}
                >
                  Thêm địa chỉ
                </Button>
              </div>
            )}

            <div
              className={`rounded-[1.8rem] border p-5 shadow-sm ${
                isDark
                  ? "border-white/10 bg-[#111111]"
                  : "border-black/10 bg-white"
              }`}
            >
              <p
                className={`text-[11px] font-bold uppercase tracking-[0.24em] ${
                  isDark ? "text-white/45" : "text-black/45"
                }`}
              >
                Thanh toán
              </p>
              <h2
                className={`mt-2 text-2xl font-black tracking-tight ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                Phương thức thanh toán
              </h2>
              <p
                className={`mt-1 text-sm leading-6 ${
                  isDark ? "text-white/65" : "text-black/60"
                }`}
              >
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
                    className={`m-0 w-full cursor-pointer rounded-[1.5rem] border px-4 py-4 transition-all ${
                      paymentGateway === item.value
                        ? isDark
                          ? "border-white/18 bg-white/[0.06]"
                          : "border-black/16 bg-black/[0.04]"
                        : isDark
                        ? "border-white/10 bg-white/[0.02] hover:border-white/16"
                        : "border-black/10 bg-black/[0.02] hover:border-black/16"
                    }`}
                    control={
                      <Radio
                        sx={{
                          color: isDark
                            ? "rgba(255,255,255,0.35)"
                            : "rgba(0,0,0,0.35)",
                          "&.Mui-checked": {
                            color: isDark ? "#ffffff" : "#000000",
                          },
                        }}
                      />
                    }
                    label={
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                            isDark
                              ? "bg-white/[0.05] text-white"
                              : "bg-black/[0.04] text-black"
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <p
                            className={`text-base font-black tracking-tight ${
                              isDark ? "text-white" : "text-black"
                            }`}
                          >
                            {item.label}
                          </p>
                          <p
                            className={`mt-1 text-sm leading-6 ${
                              isDark ? "text-white/65" : "text-black/60"
                            }`}
                          >
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
            <div
              className={`overflow-hidden rounded-[1.8rem] border shadow-sm ${
                isDark
                  ? "border-white/10 bg-[#111111]"
                  : "border-black/10 bg-white"
              }`}
            >
              <PricingCart
                shippingFee={shippingFee}
                shippingLoading={shippingLoading}
              />
              <div className="p-5 pt-0">
                <Button
                  onClick={handleCheckout}
                  fullWidth
                  variant="outlined"
                  disabled={!selectedId || loading}
                  sx={{
                    py: "12px",
                    borderRadius: "14px",
                    textTransform: "none",
                    fontWeight: 800,
                    fontSize: "0.98rem",
                    // color: isDark ? "#ffffff" : "#000000",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.16)"
                      : "rgba(0,0,0,0.14)",
                    // backgroundColor: "transparent",
                    boxShadow: "none",
                    // "&:hover": {
                    //   borderColor: isDark
                    //     ? "rgba(255,255,255,0.28)"
                    //     : "rgba(0,0,0,0.28)",
                    //   backgroundColor: isDark
                    //     ? "rgba(255,255,255,0.04)"
                    //     : "rgba(0,0,0,0.04)",
                    //   boxShadow: "none",
                    // },
                    background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                      color: "#fff",
                      "&:hover": {
                        background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                        boxShadow: "none",
                      },
                    "&.Mui-disabled": {
                      color: isDark
                        ? "rgba(255,255,255,0.35)"
                        : "rgba(0,0,0,0.35)",
                      borderColor: isDark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  {!selectedId ? "Chọn địa chỉ để tiếp tục" : "Xác nhận và đặt hàng"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
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
          <div
            className={`mx-auto w-[95%] max-w-[420px] rounded-[1.8rem] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.25)] ${
              isDark
                ? "border border-orange-500/16 bg-[#111111] text-white"
                : "border border-slate-200 bg-white text-slate-900"
            }`}
          >
            {showSuccessMessage ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-full ${
                    isDark ? "bg-orange-500/12" : "bg-orange-100"
                  }`}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
                    alt="success"
                    className="h-14 w-14"
                  />
                </div>
                <h3 className="mt-4 text-2xl font-black tracking-tight text-orange-400">
                  Thanh toán thành công
                </h3>
                <p className={`mt-2 text-sm leading-6 ${isDark ? "text-neutral-400" : "text-slate-600"}`}>
                  Hệ thống đang chuyển bạn đến trang xác nhận đơn hàng
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-400">
                    Thanh toán trực tuyến
                  </p>
                  <h2 className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                    Quét QR để chuyển khoản
                  </h2>
                </div>

                <div
                  className={`mt-5 overflow-hidden rounded-[1.5rem] border p-4 ${
                    isDark ? "border-white/8 bg-white" : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <img
                    className="mx-auto h-56 w-56"
                    alt="QR Payment"
                    src={`https://qr.sepay.vn/img?acc=LOCSPAY000336637&bank=ACB&amount=${sepayInfo?.amount}&des=${sepayInfo?.paymentCode}`}
                  />
                </div>

                <Divider
                  sx={{
                    my: 3,
                    borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
                  }}
                />

                <div className={`space-y-2 text-sm ${isDark ? "text-neutral-300" : "text-slate-600"}`}>
                  <p>
                    <b className={isDark ? "text-white" : "text-slate-900"}>Ngân hàng:</b>{" "}
                    {sepayInfo?.bankName}
                  </p>
                  <p>
                    <b className={isDark ? "text-white" : "text-slate-900"}>Số TK:</b>{" "}
                    {sepayInfo?.accountNumber}
                  </p>
                  <p>
                    <b className={isDark ? "text-white" : "text-slate-900"}>Chủ TK:</b>{" "}
                    {sepayInfo?.accountName}
                  </p>
                  <p className="font-semibold text-orange-400">Nội dung: {sepayInfo?.paymentCode}</p>
                  <p className={`text-base font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                    Số tiền: {sepayInfo?.amount?.toLocaleString()}đ
                  </p>
                </div>

                <Alert severity="info" sx={{ mt: 2 }}>
                  Hệ thống sẽ tự động xác nhận sau khi giao dịch thành công.
                </Alert>

                <p className={`mt-3 text-center text-sm ${isDark ? "text-neutral-400" : "text-slate-600"}`}>
                  Thời gian còn lại:{" "}
                  <b className={remainingTime <= 30 ? "text-red-400" : "text-orange-400"}>
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