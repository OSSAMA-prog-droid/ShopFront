import React from "react";
import { Navigate } from "react-router-dom";
import { CheckoutForm } from "../components/Checkout/CheckoutForm";
import { useShop } from "../context/ShopContext";

export function CheckoutPage() {
  const { cart } = useShop();

  if (cart.items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <main className="checkout-page">
      <h1>Checkout</h1>
      <CheckoutForm />
    </main>
  );
}
