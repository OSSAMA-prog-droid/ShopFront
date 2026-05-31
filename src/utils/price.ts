import { CartItem } from "../types";

// BUG SHF-05: Standard floating point arithmetic. JavaScript uses IEEE 754 doubles.
// 3 items at £19.99 each = 3 * 19.99 = 59.970000000000006 not 59.97.
// A cart with mixed prices produces totals like £127.49000000000001.
// Shown directly in checkout — customers see wrong totals and abandon.
export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export const calculateTotal = calculateCartTotal;

export function calculateDiscount(total: number, discountPercent: number): number {
  return total * (discountPercent / 100);
}

export function formatPrice(amount: number, currency = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(amount);
}

export function calculateTax(subtotal: number, taxRate = 0.2): number {
  return subtotal * taxRate;
}
