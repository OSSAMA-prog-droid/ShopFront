import React from "react";
import { Link } from "react-router-dom";
import { useShop } from "../../context/ShopContext";

export function Header() {
  const { cart, user, setCartOpen, isMenuOpen, setMenuOpen } = useShop();
  const itemCount = cart.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          ShopFront
        </Link>

        <nav className="header__nav">
          <Link to="/products">Products</Link>
          {user ? (
            <>
              <Link to="/orders">My Orders</Link>
              <Link to="/account">{user.name ?? user.email}</Link>
            </>
          ) : (
            <Link to="/login">Sign In</Link>
          )}
        </nav>

        <div className="header__actions">
          <button
            onClick={() => setCartOpen(true)}
            className="header__cart-btn"
            aria-label="Open cart"
          >
            🛒{itemCount > 0 && <span className="header__cart-badge">{itemCount}</span>}
          </button>
          <button
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="header__menu-btn"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
