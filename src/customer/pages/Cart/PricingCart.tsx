import React, { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../../state/Store";
import { api } from "../../../config/Api";
import { useSiteThemeMode } from "../../../Theme/SiteThemeProvider";

const FREE_SHIPPING_THRESHOLD = 300000;

const formatPrice = (value: number) => `${value.toLocaleString()}đ`;

interface PricingCartProps {
  shippingFee?: number;
  shippingLoading?: boolean;
  readonly?: boolean;
}

const PricingCart: React.FC<PricingCartProps> = ({
  shippingFee: shippingFeeProp,
  shippingLoading: shippingLoadingProp = false,
  readonly = false,
}) => {
  const { cart, address } = useAppSelector((store) => store);
  const { isDark } = useSiteThemeMode();

  const totalMrp = cart.cart?.totalMrpPrice || 0;
  const totalSelling = cart.cart?.totalSellingPrice || 0;
  const discount = Math.max(totalMrp - totalSelling, 0);

  const couponPercent = cart.cart?.coupon
    ? Number(cart.cart?.coupon?.discountPercentage)
    : 0;

  const couponValue = cart.cart?.coupon
    ? (totalSelling * couponPercent) / 100
    : 0;

  const selected = address?.selectedAddress;
  const isFreeShipping = totalSelling >= FREE_SHIPPING_THRESHOLD;
  const useExternalShipping = shippingFeeProp !== undefined;

  const [internalShippingFee, setInternalShippingFee] = useState<number | null>(
    null
  );
  const [internalShippingLoading, setInternalShippingLoading] = useState(false);

  useEffect(() => {
    if (useExternalShipping || readonly) return;

    if (isFreeShipping) {
      setInternalShippingFee(0);
      setInternalShippingLoading(false);
      return;
    }

    if (!selected?.districtId || !selected?.wardCode) {
      setInternalShippingFee(null);
      setInternalShippingLoading(false);
      return;
    }

    setInternalShippingLoading(true);

    const timer = setTimeout(() => {
      api
        .post("/api/shipping/fee", {
          toDistrictId: selected.districtId,
          toWardCode: selected.wardCode,
        })
        .then((res) => {
          setInternalShippingFee(res.data?.data?.total ?? 0);
        })
        .catch((err) => {
          console.error("Lỗi tính phí ship", err);
          setInternalShippingFee(0);
        })
        .finally(() => {
          setInternalShippingLoading(false);
        });
    }, 250);

    return () => clearTimeout(timer);
  }, [
    selected?.districtId,
    selected?.wardCode,
    isFreeShipping,
    useExternalShipping,
    readonly,
  ]);

  const finalShipping = isFreeShipping
    ? 0
    : useExternalShipping
    ? shippingFeeProp || 0
    : internalShippingFee ?? 0;

  const finalShippingLoading = useExternalShipping
    ? shippingLoadingProp
    : internalShippingLoading;

  const totalCouponPrice = useMemo(() => {
    return Math.max(totalSelling + finalShipping - couponValue, 0);
  }, [totalSelling, finalShipping, couponValue]);

  const remainingForFreeShip = Math.max(
    FREE_SHIPPING_THRESHOLD - totalSelling,
    0
  );

  return (
    <div
      className={`mb-4 rounded-[1.5rem] border p-5 shadow-sm ${
        isDark
          ? "border-white/10 bg-[#111111] text-white"
          : "border-black/10 bg-white text-black"
      }`}
    >
      <div
        className={`border-b pb-4 ${
          isDark ? "border-white/10" : "border-black/10"
        }`}
      >
        <p className={`text-lg font-black uppercase tracking-tight ${isDark ? "text-white" : "text-black"}`}>
          Tổng kết đơn hàng
        </p>

        <p
          className={`mt-1 text-sm leading-6 ${
            isDark ? "text-white/70" : "text-black/60"
          }`}
        >
          {readonly
            ? "Xem trước giá trị đơn hàng hiện tại."
            : "Giá trị đơn hàng sẽ tự cập nhật theo địa chỉ giao hàng đã chọn."}
        </p>

        {isFreeShipping ? (
          <div
            className={`mt-3 inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] ${
              isDark
                ? "border-white/12 bg-white/[0.06] text-white"
                : "border-black/10 bg-black/[0.045] text-black"
            }`}
          >
            Đơn hàng đã được miễn phí vận chuyển
          </div>
        ) : (
          <div
            className={`mt-3 rounded-2xl border px-3.5 py-3 text-sm ${
              isDark
                ? "border-white/10 bg-white/[0.04] text-white/72"
                : "border-black/8 bg-black/[0.03] text-black/70"
            }`}
          >
            Mua thêm{" "}
            <span className={`font-bold ${isDark ? "text-white" : "text-black"}`}>
              {formatPrice(remainingForFreeShip)}
            </span>{" "}
            để được miễn phí vận chuyển
          </div>
        )}
      </div>

      <div className="space-y-3.5 py-5 text-[15px]">
        <Row
          label="Tạm tính"
          value={formatPrice(totalMrp)}
          isDark={isDark}
          valueClass={isDark ? "text-white" : "text-black"}
        />

        <Row
          label="Giảm giá sản phẩm"
          value={`-${formatPrice(discount)}`}
          isDark={isDark}
          valueClass={isDark ? "text-white" : "text-black"}
        />

        <div className="flex items-center justify-between gap-4">
          <span className={isDark ? "text-white/70" : "text-black/60"}>
            Vận chuyển
          </span>

          {isFreeShipping ? (
            <div className="flex items-center gap-2">
              <span className={isDark ? "text-sm text-white/35 line-through" : "text-sm text-black/35 line-through"}>
                50.000đ
              </span>
              <span
                className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                  isDark
                    ? "border-white/12 bg-white/[0.06] text-white"
                    : "border-black/10 bg-black/[0.045] text-black"
                }`}
              >
                Miễn phí
              </span>
            </div>
          ) : readonly ? (
            <span
              className={`rounded-full border px-3 py-1 text-sm ${
                isDark
                  ? "border-white/10 bg-white/[0.05] text-white/68"
                  : "border-black/10 bg-black/[0.045] text-black/65"
              }`}
            >
              Tính ở bước thanh toán
            </span>
          ) : !selected?.districtId || !selected?.wardCode ? (
            <span
              className={`rounded-full border px-3 py-1 text-sm ${
                isDark
                  ? "border-white/10 bg-white/[0.05] text-white/68"
                  : "border-black/10 bg-black/[0.045] text-black/65"
              }`}
            >
              Chọn địa chỉ để tính
            </span>
          ) : finalShippingLoading ? (
            <div
              className={`h-6 w-28 animate-pulse rounded-full ${
                isDark ? "bg-white/10" : "bg-black/10"
              }`}
            />
          ) : (
            <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>
              {finalShipping === 0 ? "Miễn phí" : formatPrice(finalShipping)}
            </span>
          )}
        </div>

        <Row
          label="Coupon"
          value={
            cart.cart?.coupon
              ? `- ${couponPercent}% (${formatPrice(couponValue)})`
              : "- 0đ"
          }
          isDark={isDark}
          valueClass={isDark ? "text-white" : "text-black"}
        />

        <Row
          label="Phí nền tảng"
          value="Miễn phí"
          isDark={isDark}
          valueClass={isDark ? "text-white" : "text-black"}
        />
      </div>

      <div
        className={`flex items-end justify-between gap-4 border-t pt-4 ${
          isDark ? "border-white/10" : "border-black/10"
        }`}
      >
        <div>
          <p className={isDark ? "text-[11px] uppercase tracking-[0.2em] text-white/45" : "text-[11px] uppercase tracking-[0.2em] text-black/45"}>
            Tổng thanh toán
          </p>
          <p className={isDark ? "mt-1 text-sm text-white/70" : "mt-1 text-sm text-black/60"}>
            Đã tính giảm giá, coupon và phí vận chuyển.
          </p>
        </div>

        <span className={`text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-black"}`}>
          {formatPrice(totalCouponPrice)}
        </span>
      </div>
    </div>
  );
};

const Row = ({
  label,
  value,
  valueClass,
  isDark,
}: {
  label: string;
  value: string;
  valueClass?: string;
  isDark: boolean;
}) => (
  <div className="flex items-center justify-between gap-4">
    <span className={isDark ? "text-white/70" : "text-black/60"}>{label}</span>
    <span className={`font-semibold ${valueClass}`}>{value}</span>
  </div>
);

export default PricingCart;