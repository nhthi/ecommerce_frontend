import { Product } from "./ProductType";
import { User } from "./UserType";

export interface Wishlist {
  id: number;
  user: User;
  products: Product[];
}

export interface WishlistState {
  wishlist: Wishlist | null;
  loading: boolean;
  error: string | null;
}

export interface AddProductToWishlistPayLoad {
  wishlistId: number;
  productId: number;
}
