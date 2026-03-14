import { Cart } from "./CartType";

export interface Coupon {
  id?: number;
  code: string;
  discountPercentage: number;
  validityStartDate: string | null;
  validityEndDate: string | null;
  minimumOrderValue: number;
  maximumOrderValue: number;
  active?: boolean;
  quantity: number;
  name?: string;
}

export interface CouponState {
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
  cart: Cart | null;
  couponCreated: boolean;
  couponApplied: boolean;
}
