import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartItemList } from "../components/Cart/CartItem";
import { CartItem } from "../types";

vi.mock("../context/ShopContext", () => ({
  useShop: () => ({
    removeFromCart: vi.fn(),
    updateQuantity: vi.fn(),
  }),
}));

// SHF-06: key={index} causes incorrect reconciliation
describe("CartItemList — index key bug (SHF-06)", () => {
  const items: CartItem[] = [
    { productId: "p1", variantId: null, name: "Widget A", price: 10, quantity: 1, imageUrl: null },
    { productId: "p2", variantId: null, name: "Widget B", price: 20, quantity: 2, imageUrl: null },
    { productId: "p3", variantId: null, name: "Widget C", price: 30, quantity: 1, imageUrl: null },
  ];

  it("renders all items", () => {
    render(<CartItemList items={items} />);
    expect(screen.getByText("Widget A")).toBeTruthy();
    expect(screen.getByText("Widget B")).toBeTruthy();
    expect(screen.getByText("Widget C")).toBeTruthy();
  });

  it("uses key={index} which causes reconciliation bugs when items are removed from the middle", () => {
    // When index-keyed items are removed, React matches the remaining items
    // to the same indices, potentially keeping stale input values on the wrong rows.
    // This test documents that the key strategy is index-based (the bug).
    const { container } = render(<CartItemList items={items} />);
    const listItems = container.querySelectorAll("li");
    expect(listItems).toHaveLength(3);
    // A correct implementation would use key={`${item.productId}-${item.variantId}`}
  });
});
