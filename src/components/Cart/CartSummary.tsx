import React from "react";
import { useShop } from "../../context/ShopContext";
import { calculateTotal } from "../../utils/price";

export function CartSummary() {
  const { cart } = useShop();
  const total = calculateTotal(cart.items);
  const discount = cart.discount ?? 0;
  const finalTotal = total - discount;

  return (
    <div className="cart-summary">
      <div className="cart-summary__row">
        <span>Subtotal</span>
        <span>${total.toFixed(2)}</span>
      </div>
      {discount > 0 && (
        <div className="cart-summary__row cart-summary__row--discount">
          <span>Discount {cart.couponCode && `(${cart.couponCode})`}</span>
          <span>-${discount.toFixed(2)}</span>
        </div>
      )}
      <div className="cart-summary__row cart-summary__row--total">
        <span>Total</span>
        <span>${finalTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
