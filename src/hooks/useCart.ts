import { useEffect, useRef } from "react";
import { useShop } from "../context/ShopContext";
import axios from "axios";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

// BUG SHF-01: Stale closure in the auto-save interval.
// The cart value captured by the setInterval callback is the initial empty cart
// from the first render. No matter how many items the user adds, the interval
// always POSTs the initial empty cart to the server — silently discarding changes.
//
// BUG SHF-12: Optimistic cart update is never rolled back on API failure.
// addToCart() updates local state immediately (good) but if the server rejects
// the add (out of stock, session expired), the item stays in the UI cart.
// Users see an item in their cart that they can't actually buy.
export function useCartSync(userId: string | null) {
  const { cart, addToCart, removeFromCart } = useShop();
  const cartRef = useRef(cart);

  // cartRef is updated but the interval callback still captures the stale `cart`
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  useEffect(() => {
    if (!userId) return;

    // Captures `cart` from the initial render — never updates
    const interval = setInterval(async () => {
      try {
        await axios.post(`${API}/cart/sync`, { userId, cart });
      } catch {
        // silently ignore
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [userId]); // cart intentionally omitted — causes stale closure bug

  async function addToCartWithSync(item: Parameters<typeof addToCart>[0]) {
    // Optimistic update
    addToCart(item);

    try {
      await axios.post(`${API}/cart/add`, { userId, item });
    } catch {
      // BUG SHF-12: Should call removeFromCart here to roll back the optimistic update.
      // Instead the item stays in the local cart showing a state the server doesn't have.
      console.error("Failed to sync cart add — local state not rolled back");
    }
  }

  return { addToCartWithSync };
}
