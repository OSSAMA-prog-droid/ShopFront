import { describe, it, expect } from "vitest";
import * as storage from "../utils/storage";

// SHF-10: Payment details (card number, CVV, expiry) must never be persisted
// client-side. Guards against reintroducing savePaymentDetails/loadPaymentDetails.
describe("storage (SHF-10)", () => {
  it("does not expose any payment-persistence API", () => {
    expect((storage as Record<string, unknown>).savePaymentDetails).toBeUndefined();
    expect((storage as Record<string, unknown>).loadPaymentDetails).toBeUndefined();
  });
});
