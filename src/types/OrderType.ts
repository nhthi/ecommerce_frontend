import { Address, User } from "./UserType";
import { Product, Size } from "./ProductType";

export interface OrderState {
  orders: Order[];
  orderItem: OrderItem | null;
  currentOrder: Order | null;
  paymentOrder: any | null;
  loading: boolean;
  error: string | null;
  orderCancelled: boolean;
}

export interface Order {
  id: number;
  orderId: string;
  user: User;
  sellerId: number;
  orderItems: OrderItem[];
  orderDate: string;
  shippingAddress: Address;
  paymentDetails: any;
  paymentMethod?: string;
  paymentStatus?: string;
  // totalMrpPrice: number;
  // totalSellingPrice: number;
  totalPrice: number;
  discount?: number;
  orderStatus: OrderStatus;
  totalItem: number;
  deliveryDate?: string;
}
export interface Review {
  id: number; // Long -> number
  reviewText: string;
  rating: number;
  productImages: string[]; // danh sách URL ảnh
  createdAt: string;
  user?: User; // LocalDateTime -> string ISO
}
export interface MyReview {
  reviewId: number;
  reviewText: string;
  rating: number;
  productImages: string[];
  createdAt: string;
  productId: number | null;
  productTitle: string | null;
  productImage: string | null;
  orderItemId: number | null;
}
export interface OrderItem {
  id: number;
  product: Product;
  order: Order;
  size: Size;
  quantity: number;
  mrpPrice: number;
  sellingPrice: number;
  userId: number;
  review?: Review;
}

export enum OrderStatus {
  PENDING = "PENDING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  ARRIVING = "ARRIVING",
  PLACED = "PLACED",
  CONFIRMED = "CONFIRMED",
  PENDING_PAYMENT = "PENDING_PAYMENT",
}
