import { Product } from "../types/ProductType";

export const isWishlist = (
  products: Product[] | undefined,
  productId: number
): boolean => {
  if (!products || products.length === 0) return false;
  return products.some((item) => item.id === productId);
};
