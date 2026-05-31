import { describe, it, expect } from "vitest";
import { calculateTotal } from "../utils/price";
// calculateTotal is an alias for calculateCartTotal (see price.ts)
import { CartItem } from "../types";

// SHF-05: Floating point accumulation error
describe("calculateTotal (SHF-05)", () => {
  it("accumulates floating point error without rounding", () => {
    const items: CartItem[] = [
      { productId: "a", variantId: null, name: "A", price: 1.1, quantity: 1, imageUrl: null },
      { productId: "b", variantId: null, name: "B", price: 2.2, quantity: 1, imageUrl: null },
    ];

    const total = calculateTotal(items);

    // 1.1 + 2.2 = 3.3000000000000003 in IEEE 754
    // The buggy implementation returns the raw float — not 3.3
    expect(total).not.toBe(3.3);       // demonstrates the bug
    expect(total).toBeCloseTo(3.3, 10); // the value is close but not exact

    // A correct implementation would use Math.round(cents) / 100 to avoid drift
  });

  it("accumulates across many small prices", () => {
    const items: CartItem[] = Array.from({ length: 10 }, (_, i) => ({
      productId: `p${i}`,
      variantId: null,
      name: `P${i}`,
      price: 0.1,
      quantity: 1,
      imageUrl: null,
    }));

    const total = calculateTotal(items);
    // 0.1 * 10 = 0.9999999999999999 in IEEE 754
    expect(total).not.toBe(1.0); // demonstrates the bug
  });
});
