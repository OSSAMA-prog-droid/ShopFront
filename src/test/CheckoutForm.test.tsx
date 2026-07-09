import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("ax");
vi.mock("../context/ShopContext", () => ({
  useShop: () => ({
    cart: { items: [{ productId: "p1", variantId: null, name: "Widget", price: 9.99, quantity: 1, imageUrl: null }], couponCode: null, discount: 0 },
    user: { id: "u1", email: "test@example.com", name: "Test" },
    clearCart: vi.fn(),
  }),
}));
vi.mock("../components/Checkout/PaymentForm", () => ({
  PaymentForm: ({ onPaymentReady }: { onPaymentReady: (d: unknown) => void }) => (
    <button onClick={() => onPaymentReady({ cardNumber: "4111111111111111", cardHolder: "Test", expiry: "12/27", cvv: "123" })}>
      Set Payment
    </button>
  ),
}));
vi.mock("../components/Checkout/OrderSummary", () => ({
  OrderSummary: () => <div>Summary</div>,
}));

// SHF-07: No submit guard — double-click sends duplicate orders
describe("CheckoutForm — double submit (SHF-07)", () => {
  it("submit button is NOT disabled during submission (the bug)", async () => {
    const { CheckoutForm } = await import("../components/Checkout/CheckoutForm");
    render(<CheckoutForm />);

    const submitBtn = screen.getByRole("button", { name: /place order/i });

    // In the buggy code, `submitting` state is declared but never set to true.
    // The button is never disabled, so double-clicks fire multiple POST requests.
    expect(submitBtn).not.toBeDisabled(); // bug: should be disabled after first click
  });
});
