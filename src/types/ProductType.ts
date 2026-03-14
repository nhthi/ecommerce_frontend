import { Review } from "./OrderType";
import { Seller } from "./SellerType";

export interface Product {
  id?: number;
  title: string;
  description: string;
  mrpPrice: number;
  sellingPrice: number;
  discountPercent: number;
  quantity: number;
  color: string;
  images: string[];
  numRatings?: number;
  category?: Category;
  seller?: Seller;
  createAt?: Date;
  sizes: Size[];
  reviews?: Review[];
}

interface Category {
  id?: number;
  name: string;
  categoryId: string;
  parentCategory?: Category;
  level: number;
}

export interface Size {
  id: number;
  name: string;
  quantity: number | string;
}
