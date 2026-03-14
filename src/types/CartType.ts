import { Coupon } from "./CouponType";
import { Product, Size } from "./ProductType";
import { User } from "./UserType";

export interface CartItem {
  id: number;
  cart?: Cart;
  product: Product;
  size: Size;
  quantity: number;
  mrpPrice: number;
  sellingPrice: number;
  userId: number;
}

export interface Cart {
  id: number;
  user: User;
  cartItems: CartItem[];
  totalMrpPrice: number;
  totalSellingPrice: number;
  discount: number;
  totalItem: number;
  coupon?: Coupon | null;
  totalCouponPrice: number;
}
