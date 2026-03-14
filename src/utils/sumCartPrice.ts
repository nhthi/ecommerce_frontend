import { CartItem } from "../types/CartType";

export const sumCartItemMrpPrice = (cartItems: CartItem[]): number => {
  console.log("cartItem", cartItems);

  return cartItems.reduce(
    (total, item) => total + item.mrpPrice * item.quantity,
    0
  );
};

export const sumCartItemSellingPrice = (cartItems: CartItem[]): number => {
  return cartItems.reduce(
    (total, item) => total + item.sellingPrice * item.quantity,
    0
  );
};
