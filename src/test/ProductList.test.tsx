import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProductList } from "../components/Product/ProductList";
import { Product } from "../types";

vi.mock("../context/ShopContext", () => ({
  useShop: () => ({ addToCart: vi.fn(), removeFromCart: vi.fn(), updateQuantity: vi.fn() }),
}));
vi.mock("../hooks/useCart", () => ({
  useCartSync: () => ({ addToCartWithSync: vi.fn() }),
}));

const products: Product[] = [
  { id: "a", name: "Banana", price: 1.5, stock: 10, category: "fruit", description: null, imageUrl: null, variants: [] },
  { id: "b", name: "Apple",  price: 2.0, stock: 5,  category: "fruit", description: null, imageUrl: null, variants: [] },
  { id: "c", name: "Carrot", price: 0.9, stock: 20, category: "veg",   description: null, imageUrl: null, variants: [] },
];

// SHF-15: Filter/sort state not synced to URL
describe("ProductList — URL state not synced (SHF-15)", () => {
  it("filter change is in local state only — not reflected in URL", () => {
    render(
      <MemoryRouter>
        <ProductList products={products} userId={null} />
      </MemoryRouter>
    );

    const filterSelect = screen.getAllByRole("combobox")[0];
    fireEvent.change(filterSelect, { target: { value: "veg" } });

    // The URL has not changed — only component state changed.
    // window.location.search should be "" (no ?category=veg param).
    expect(window.location.search).toBe(""); // demonstrates the bug
    // Fix: use useSearchParams and write category/sort to URL params.
  });
});
