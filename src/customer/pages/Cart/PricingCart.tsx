import React from "react";
import { useAppSelector } from "../../../state/Store";

const PricingCart = () => {
  const { cart } = useAppSelector((store) => store);

  const totalMrp = cart.cart?.totalMrpPrice || 0;
  const totalSelling = cart.cart?.totalSellingPrice || 0;
  const totalCouponPrice = cart.cart?.totalCouponPrice || 0;

  const discount = totalMrp - totalSelling;
  const couponPercent = cart.cart?.coupon
    ? Number(cart.cart?.coupon?.discountPercentage)
    : 0;
  const couponValue = cart.cart?.coupon
    ? (totalSelling * couponPercent) / 100
    : 0;

  return (
    <div className="p-5 text-neutral-200">
      <div className="border-b border-white/8 pb-4">
        <p className="text-lg font-black uppercase tracking-tight text-white">
          Tổng kết đơn hàng
        </p>
        <p className="mt-1 text-sm leading-6 text-neutral-400">
          Kiểm tra lại giá trị đơn trước khi qua bước tiếp theo.
        </p>
      </div>

      <div className="space-y-3.5 py-5 text-[15px]">
        <div className="flex items-center justify-between gap-4">
          <span className="text-neutral-400">Tạm tính</span>
          <span className="font-semibold text-white">
            {totalMrp.toLocaleString()}đ
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-neutral-400">Giảm giá sản phẩm</span>
          <span className="font-semibold text-emerald-300">
            -{discount > 0 ? discount.toLocaleString() : 0}đ
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-neutral-400">Vận chuyển</span>
          <span className="font-semibold text-emerald-300">Miễn phí</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-neutral-400">Coupon</span>
          <span className="font-semibold text-emerald-300">
            {cart.cart?.coupon
              ? `- ${couponPercent}% (${couponValue.toLocaleString()}đ)`
              : "- 0đ"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-neutral-400">Phí nền tảng</span>
          <span className="font-semibold text-emerald-300">Miễn phí</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 border-t border-white/8 pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
            Tổng thanh toán
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            Đã tính khuyến mãi và coupon.
          </p>
        </div>
        <span className="text-3xl font-black tracking-tight text-orange-400">
          {totalCouponPrice.toLocaleString()}đ
        </span>
      </div>
    </div>
  );
};

export default PricingCart;