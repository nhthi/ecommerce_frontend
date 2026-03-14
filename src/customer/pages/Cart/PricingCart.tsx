import React from "react";
import { useAppSelector } from "../../../state/Store";

const PricingCart = () => {
  const { cart } = useAppSelector((store) => store);

  // Dữ liệu an toàn (fallback nếu chưa có cart)
  const totalMrp = cart.cart?.totalMrpPrice || 0;
  const totalSelling = cart.cart?.totalSellingPrice || 0;
  const totalCouponPrice = cart.cart?.totalCouponPrice || 0;

  const discount = totalMrp - totalSelling;
  const shipping = 0;
  const couponPercent = cart.cart?.coupon
    ? Number(cart.cart?.coupon?.discountPercentage)
    : 0;
  const couponValue = cart.cart?.coupon
    ? (totalSelling * couponPercent) / 100
    : 0;

  return (
    <div>
      {/* Header */}
      <div className="px-5 pt-4 pb-2 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-800">Tóm tắt đơn hàng</p>
        <p className="text-xs text-slate-500">
          Kiểm tra lại chi tiết trước khi thanh toán.
        </p>
      </div>

      {/* Thông tin giá */}
      <div className="space-y-3 p-5 border-b border-slate-100 text-sm text-slate-700">
        <div className="flex justify-between items-center">
          <span>Tạm tính</span>
          <span>{totalMrp.toLocaleString()}₫</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Giảm giá sản phẩm</span>
          <span className="text-emerald-600">
            -{discount > 0 ? discount.toLocaleString() : 0}₫
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>Phí vận chuyển</span>
          <span className="text-emerald-600 font-medium">Miễn phí</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Mã giảm giá</span>
          <span className="text-emerald-600">
            {cart.cart?.coupon
              ? `- ${couponPercent}% ( ${couponValue.toLocaleString()}₫ )`
              : "- 0₫"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>Phí nền tảng</span>
          <span className="text-emerald-600 font-medium">Miễn phí</span>
        </div>
      </div>

      {/* Tổng tiền */}
      <div className="flex justify-between items-center px-5 py-4 font-semibold text-base sm:text-lg text-slate-900">
        <span>Tổng cộng</span>
        <span className="text-sky-600">
          {totalCouponPrice.toLocaleString()}₫
        </span>
      </div>
    </div>
  );
};

export default PricingCart;
