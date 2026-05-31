import React, { useState } from "react";
import { savePaymentDetails } from "../../utils/storage";

interface Props {
  onPaymentReady: (data: { cardNumber: string; cardHolder: string; expiry: string; cvv: string }) => void;
}

export function PaymentForm({ onPaymentReady }: Props) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  function handleBlur() {
    if (saveCard && cardNumber && cardHolder && expiry && cvv) {
      // BUG SHF-10: Delegates to savePaymentDetails which writes full card details
      // including CVV to localStorage — accessible to any JS on this domain.
      savePaymentDetails({ cardNumber, cardHolder, expiry, cvv, billingAddress: "" });
    }
    if (cardNumber && cardHolder && expiry && cvv) {
      onPaymentReady({ cardNumber, cardHolder, expiry, cvv });
    }
  }

  return (
    <div className="payment-form">
      <h3>Payment Details</h3>
      <div className="payment-form__field">
        <label htmlFor="card-number">Card Number</label>
        <input
          id="card-number"
          type="text"
          maxLength={19}
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          onBlur={handleBlur}
        />
      </div>
      <div className="payment-form__field">
        <label htmlFor="card-holder">Card Holder</label>
        <input
          id="card-holder"
          type="text"
          placeholder="Jane Doe"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
          onBlur={handleBlur}
        />
      </div>
      <div className="payment-form__row">
        <div className="payment-form__field">
          <label htmlFor="expiry">Expiry</label>
          <input
            id="expiry"
            type="text"
            placeholder="MM/YY"
            maxLength={5}
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            onBlur={handleBlur}
          />
        </div>
        <div className="payment-form__field">
          <label htmlFor="cvv">CVV</label>
          <input
            id="cvv"
            type="text"
            placeholder="123"
            maxLength={4}
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            onBlur={handleBlur}
          />
        </div>
      </div>
      <label className="payment-form__save">
        <input
          type="checkbox"
          checked={saveCard}
          onChange={(e) => setSaveCard(e.target.checked)}
        />
        Save card for future purchases
      </label>
    </div>
  );
}
