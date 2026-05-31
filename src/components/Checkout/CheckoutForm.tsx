import React, { useState } from "react";
import axios from "axios";
import { useShop } from "../../context/ShopContext";
import { Address } from "../../types";
import { PaymentForm } from "./PaymentForm";
import { OrderSummary } from "./OrderSummary";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

// BUG SHF-07: No in-flight guard on the submit handler.
// If the user double-clicks "Place Order" or the response is slow, two identical
// POST /checkout requests are sent. The server may create two orders and charge
// the card twice. Fix: set a `submitting` boolean and disable the button while
// the request is pending.
export function CheckoutForm() {
  const { cart, user, clearCart } = useShop();
  const [address, setAddress] = useState<Address>({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });
  const [payment, setPayment] = useState<{
    cardNumber: string;
    cardHolder: string;
    expiry: string;
    cvv: string;
  } | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // BUG SHF-07: This submitting flag exists but is never set to true before the
  // request fires, so the button is never actually disabled during submission.
  const [submitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // BUG SHF-07: Should be: if (submitting) return; setSubmitting(true);
    // Without this guard, rapid clicks send multiple concurrent POST requests.
    setError(null);
    try {
      await axios.post(`${API}/checkout`, {
        userId: user?.id,
        cart,
        address,
        payment,
      });
      clearCart();
      setOrderPlaced(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    }
  }

  if (orderPlaced) {
    return (
      <div className="checkout-success">
        <h2>Order placed successfully!</h2>
        <p>You'll receive a confirmation email shortly.</p>
      </div>
    );
  }

  return (
    <div className="checkout-layout">
      <form onSubmit={handleSubmit} className="checkout-form">
        <h2>Shipping Address</h2>
        <div className="checkout-form__field">
          <label htmlFor="line1">Address Line 1</label>
          <input
            id="line1"
            type="text"
            value={address.line1}
            onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))}
            required
          />
        </div>
        <div className="checkout-form__field">
          <label htmlFor="line2">Address Line 2</label>
          <input
            id="line2"
            type="text"
            value={address.line2 ?? ""}
            onChange={(e) => setAddress((a) => ({ ...a, line2: e.target.value }))}
          />
        </div>
        <div className="checkout-form__row">
          <div className="checkout-form__field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              value={address.city}
              onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
              required
            />
          </div>
          <div className="checkout-form__field">
            <label htmlFor="state">State</label>
            <input
              id="state"
              type="text"
              value={address.state}
              onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
              required
            />
          </div>
          <div className="checkout-form__field">
            <label htmlFor="postal">Postal Code</label>
            <input
              id="postal"
              type="text"
              value={address.postalCode}
              onChange={(e) => setAddress((a) => ({ ...a, postalCode: e.target.value }))}
              required
            />
          </div>
        </div>

        <PaymentForm onPaymentReady={setPayment} />

        {error && <p className="checkout-form__error">{error}</p>}

        <button
          type="submit"
          disabled={submitting} // BUG SHF-07: submitting is never true, button is never disabled
          className="checkout-form__submit"
        >
          {submitting ? "Placing order..." : "Place Order"}
        </button>
      </form>

      <OrderSummary cart={cart} />
    </div>
  );
}
