import React from "react";
import { NavLink } from "react-router-dom";
import { useShop } from "../../context/ShopContext";

export function Navigation() {
  const { isMenuOpen, setMenuOpen } = useShop();

  if (!isMenuOpen) return null;

  return (
    <nav className="navigation" onClick={() => setMenuOpen(false)}>
      <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link nav-link--active" : "nav-link")}>
        Home
      </NavLink>
      <NavLink to="/products" className={({ isActive }) => (isActive ? "nav-link nav-link--active" : "nav-link")}>
        Products
      </NavLink>
      <NavLink to="/cart" className={({ isActive }) => (isActive ? "nav-link nav-link--active" : "nav-link")}>
        Cart
      </NavLink>
      <NavLink to="/orders" className={({ isActive }) => (isActive ? "nav-link nav-link--active" : "nav-link")}>
        My Orders
      </NavLink>
    </nav>
  );
}
