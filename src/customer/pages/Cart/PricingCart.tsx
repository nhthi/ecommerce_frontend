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
  couponCode?: string | null;
  couponDiscount?: number;
  selectedCartItemIds?: number[];
}

const PricingCart: React.FC<PricingCartProps> = ({
  shippingFee: shippingFeeProp,
  shippingLoading: shippingLoadingProp = false,
  readonly = false,
  couponCode = null,
  couponDiscount = 0,
  selectedCartItemIds = [],
}) => {
  const { cart, address } = useAppSelector((store) => store);
  const { isDark } = useSiteThemeMode();

  const selectedItems = useMemo(() => {
    const allItems = cart.cart?.cartItems || [];
    if (!selectedCartItemIds.length) return [];
    return allItems.filter((item: any) => selectedCartItemIds.includes(item.id));
  }, [cart.cart?.cartItems, selectedCartItemIds]);

  const totalMrp = useMemo(() => {
    return selectedItems.reduce(
      (sum: number, item: any) => sum + Number(item.mrpPrice || 0) * Number(item.quantity || 0),
      0
    );
  }, [selectedItems]);

  const totalSelling = useMemo(() => {
    return selectedItems.reduce(
      (sum: number, item: any) => sum + Number(item.sellingPrice || 0) * Number(item.quantity || 0),
      0
    );
  }, [selectedItems]);

  const discount = Math.max(totalMrp - totalSelling, 0);

  const selected = address?.selectedAddress;
  const isFreeShipping = totalSelling >= FREE_SHIPPING_THRESHOLD && totalSelling > 0;
  const useExternalShipping = shippingFeeProp !== undefined;

  const [internalShippingFee, setInternalShippingFee] = useState<number | null>(null);
  const [internalShippingLoading, setInternalShippingLoading] = useState(false);

  useEffect(() => {
    if (useExternalShipping || readonly) return;

    if (selectedItems.length === 0) {
      setInternalShippingFee(null);
      setInternalShippingLoading(false);
      return;
    }

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
        .catch(() => {
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
    selectedItems.length,
  ]);

  const finalShipping = isFreeShipping
    ? 0
    : useExternalShipping
    ? shippingFeeProp || 0
    : internalShippingFee ?? 0;

  const finalShippingLoading = useExternalShipping
    ? shippingLoadingProp
    : internalShippingLoading;

  const safeCouponDiscount = Math.max(couponDiscount, 0);

  const totalCouponPrice = useMemo(() => {
    return Math.max(totalSelling + finalShipping - safeCouponDiscount, 0);
  }, [totalSelling, finalShipping, safeCouponDiscount]);

  const remainingForFreeShip = Math.max(FREE_SHIPPING_THRESHOLD - totalSelling, 0);

  return (
    <div
      className={`mb-4 rounded-[1.5rem] border p-5 shadow-sm ${
        isDark
          ? "border-white/10 bg-[#111111] text-white"
          : "border-black/10 bg-white text-black"
      }`}
    >
      <div className={`border-b pb-4 ${isDark ? "border-white/10" : "border-black/10"}`}>
        <p className={`text-lg font-black uppercase tracking-tight ${isDark ? "text-white" : "text-black"}`}>
          Tổng kết đơn hàng
        </p>

        <p className={`mt-1 text-sm leading-6 ${isDark ? "text-white/70" : "text-black/60"}`}>
          {readonly
            ? "Xem trước giá trị đơn hàng hiện tại."
            : "Giá trị đơn hàng sẽ cập nhật theo các sản phẩm bạn đã chọn."}
        </p>

        {selectedItems.length === 0 ? (
          <div
            className={`mt-3 rounded-2xl border px-3.5 py-3 text-sm ${
              isDark
                ? "border-white/10 bg-white/[0.04] text-white/72"
                : "border-black/8 bg-black/[0.03] text-black/70"
            }`}
          >
            Chưa chọn sản phẩm nào
          </div>
        ) : isFreeShipping ? (
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
          value={`- ${formatPrice(discount)}`}
          isDark={isDark}
          valueClass={isDark ? "text-white" : "text-black"}
        />

        <div className="flex items-center justify-between gap-4">
          <span className={isDark ? "text-white/70" : "text-black/60"}>
            Vận chuyển
          </span>

          {selectedItems.length === 0 ? (
            <span
              className={`rounded-full border px-3 py-1 text-sm ${
                isDark
                  ? "border-white/10 bg-white/[0.05] text-white/68"
                  : "border-black/10 bg-black/[0.045] text-black/65"
              }`}
            >
              Chọn sản phẩm trước
            </span>
          ) : isFreeShipping ? (
            <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>
              Miễn phí
            </span>
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
          label={couponCode ? `Coupon (${couponCode})` : "Coupon"}
          value={safeCouponDiscount > 0 ? `- ${formatPrice(safeCouponDiscount)}` : "- 0đ"}
          isDark={isDark}
          valueClass={isDark ? "text-white" : "text-black"}
        />

        <Row
          label="Phí nền tảng"
          value="Miễn phí"
          isDark={isDark}
          valueClass={isDark ? "text-white" : "text-black"}
        />

        <div className={`mt-4 border-t pt-4 ${isDark ? "border-white/10" : "border-black/10"}`}>
          <div className="flex items-center justify-between">
            <span className="text-base font-bold">Tổng thanh toán</span>
            <span className="text-lg font-extrabold">{formatPrice(totalCouponPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RowProps {
  label: string;
  value: string;
  isDark: boolean;
  valueClass?: string;
}

const Row: React.FC<RowProps> = ({ label, value, isDark, valueClass }) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={isDark ? "text-white/70" : "text-black/60"}>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
};

export default PricingCart;