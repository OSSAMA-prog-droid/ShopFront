import { Cart } from "../types";

export function saveCart(cart: Cart): void {
  localStorage.setItem("shopfront_cart", JSON.stringify(cart));
}

export function loadCart(): Cart | null {
  try {
    const raw = localStorage.getItem("shopfront_cart");
    return raw ? (JSON.parse(raw) as Cart) : null;
  } catch {
    return null;
  }
}

export function clearCart(): void {
  localStorage.removeItem("shopfront_cart");
}
