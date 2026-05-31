import React from "react";
import { useShop } from "../../context/ShopContext";
import { CartItemList } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { Link } from "react-router-dom";

export function Cart() {
  const { cart, isCartOpen, setCartOpen } = useShop();

  if (!isCartOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-panel">
        <div className="cart-panel__header">
          <h2>Your Cart ({cart.items.length})</h2>
          <button onClick={() => setCartOpen(false)} className="cart-panel__close">
            ✕
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="cart-panel__empty">
            <p>Your cart is empty.</p>
            <Link to="/products" onClick={() => setCartOpen(false)}>
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <CartItemList items={cart.items} />
            <CartSummary />
            <Link
              to="/checkout"
              className="cart-panel__checkout-btn"
              onClick={() => setCartOpen(false)}
            >
              Proceed to Checkout
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
