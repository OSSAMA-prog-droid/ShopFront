import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { OrderHistoryPage } from "../pages/OrderHistoryPage";
import { ShopContext } from "../context/ShopContext";
import type { Cart, User } from "../types";

vi.mock("axios");

const baseCart: Cart = { items: [], couponCode: null, discount: 0 };

function renderWithUser(user: User | null) {
  const value = {
    cart: baseCart,
    user,
    isMenuOpen: false,
    isCartOpen: false,
    addToCart: vi.fn(),
    removeFromCart: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    setUser: vi.fn(),
    setMenuOpen: vi.fn(),
    setCartOpen: vi.fn(),
  };
  return render(
    <ShopContext.Provider value={value}>
      <OrderHistoryPage />
    </ShopContext.Provider>
  );
}

describe("OrderHistoryPage — SHF-04", () => {
  it("fetches orders when user transitions from null to authenticated", async () => {
    (axios.get as any).mockResolvedValue({
      data: { data: [{ id: "o1", total: 42, items: [] }] },
    });

    const { rerender } = renderWithUser(null);
    expect(axios.get).not.toHaveBeenCalled();

    rerender(
      <ShopContext.Provider
        value={{
          cart: baseCart,
          user: { id: "u1", email: "a@b.com", name: "A" } as User,
          isMenuOpen: false,
          isCartOpen: false,
          addToCart: vi.fn(),
          removeFromCart: vi.fn(),
          updateQuantity: vi.fn(),
          clearCart: vi.fn(),
          setUser: vi.fn(),
          setMenuOpen: vi.fn(),
          setCartOpen: vi.fn(),
        }}
      >
        <OrderHistoryPage />
      </ShopContext.Provider>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("userId=u1"));
  });
});
