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

// BUG SHF-10: Saves full payment details — including card number, CVV, and expiry —
// to localStorage. localStorage is accessible to any JavaScript on the page including
// third-party scripts (analytics, ads, chat widgets). A single XSS vulnerability
// anywhere on the domain can exfiltrate every saved card in the browser.
export interface SavedPayment {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  billingAddress: string;
}

export function savePaymentDetails(payment: SavedPayment): void {
  localStorage.setItem("shopfront_payment", JSON.stringify(payment));
}

export function loadPaymentDetails(): SavedPayment | null {
  try {
    const raw = localStorage.getItem("shopfront_payment");
    return raw ? (JSON.parse(raw) as SavedPayment) : null;
  } catch {
    return null;
  }
}
