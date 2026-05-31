import React, { createContext, useContext, useState, useCallback } from "react";
import { Cart, CartItem, User } from "../types";
import { saveCart, loadCart } from "../utils/storage";

// BUG SHF-09: All application state — cart, user, UI flags — lives in a single context.
// Every time an item is added to the cart, ALL components that consume ShopContext
// re-render, including the navigation, footer, product cards, and the checkout form.
// On a product listing page with 50 cards, adding to cart causes 50+ re-renders.
// Fix: split into CartContext + UserContext, or use useContextSelector.
interface ShopState {
  cart: Cart;
  user: User | null;
  isMenuOpen: boolean;
  isCartOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variantId: string | null) => void;
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  clearCart: () => void;
  setUser: (user: User | null) => void;
  setMenuOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
}

const ShopContext = createContext<ShopState | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(() => loadCart() ?? { items: [], couponCode: null, discount: 0 });
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.items.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      );
      const updated = existing
        ? prev.items.map((i) =>
            i.productId === item.productId && i.variantId === item.variantId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
        : [...prev.items, item];
      const next = { ...prev, items: updated };
      saveCart(next);
      return next;
    });
  }, []);

  const removeFromCart = useCallback((productId: string, variantId: string | null) => {
    setCart((prev) => {
      const next = { ...prev, items: prev.items.filter((i) => !(i.productId === productId && i.variantId === variantId)) };
      saveCart(next);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, variantId: string | null, quantity: number) => {
    setCart((prev) => {
      const next = {
        ...prev,
        items: prev.items.map((i) =>
          i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i
        ),
      };
      saveCart(next);
      return next;
    });
  }, []);

  const clearCartFn = useCallback(() => {
    setCart({ items: [], couponCode: null, discount: 0 });
  }, []);

  return (
    <ShopContext.Provider
      value={{
        cart, user, isMenuOpen, isCartOpen,
        addToCart, removeFromCart, updateQuantity,
        clearCart: clearCartFn, setUser, setMenuOpen, setCartOpen,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop(): ShopState {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
