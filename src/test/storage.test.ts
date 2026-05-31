import { describe, it, expect, beforeEach } from "vitest";
import { savePaymentDetails, loadPaymentDetails } from "../utils/storage";

// SHF-10: Full payment details written to localStorage
describe("savePaymentDetails (SHF-10)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("writes card number, CVV, and expiry to localStorage in plaintext", () => {
    const payment = {
      cardNumber: "4111111111111111",
      cardHolder: "Jane Doe",
      expiry: "12/27",
      cvv: "123",
      billingAddress: "1 Main St",
    };

    savePaymentDetails(payment);

    const raw = localStorage.getItem("shopfront_payment");
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw!);
    // Bug: sensitive fields readable as plaintext — any JS on the page can access these
    expect(parsed.cardNumber).toBe("4111111111111111");
    expect(parsed.cvv).toBe("123");
    expect(parsed.expiry).toBe("12/27");
  });

  it("round-trips through loadPaymentDetails", () => {
    const payment = {
      cardNumber: "5500005555555559",
      cardHolder: "John Smith",
      expiry: "06/26",
      cvv: "321",
      billingAddress: "2 Oak Ave",
    };
    savePaymentDetails(payment);
    const loaded = loadPaymentDetails();
    expect(loaded).toEqual(payment);
  });
});
