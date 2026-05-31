import React from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { CartItemList } from "../components/Cart/CartItem";
import { CartSummary } from "../components/Cart/CartSummary";

export function CartPage() {
  const { cart } = useShop();

  if (cart.items.length === 0) {
    return (
      <main className="cart-page">
        <h1>Your Cart</h1>
        <p>Your cart is empty. <Link to="/products">Browse products</Link></p>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <h1>Your Cart</h1>
      <CartItemList items={cart.items} />
      <CartSummary />
      <Link to="/checkout" className="cart-page__checkout-btn">
        Proceed to Checkout
      </Link>
    </main>
  );
}
