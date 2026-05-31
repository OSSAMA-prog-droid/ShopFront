import React from "react";
import { Cart } from "../../types";
import { calculateTotal } from "../../utils/price";

interface Props {
  cart: Cart;
}

export function OrderSummary({ cart }: Props) {
  const subtotal = calculateTotal(cart.items);
  const discount = cart.discount ?? 0;
  const total = subtotal - discount;

  return (
    <div className="order-summary">
      <h3 className="order-summary__title">Order Summary</h3>
      <ul className="order-summary__items">
        {cart.items.map((item, i) => (
          <li key={i} className="order-summary__item">
            <span>{item.name} × {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="order-summary__subtotal">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      {discount > 0 && (
        <div className="order-summary__discount">
          <span>Discount {cart.couponCode && `(${cart.couponCode})`}</span>
          <span>-${discount.toFixed(2)}</span>
        </div>
      )}
      <div className="order-summary__total">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
