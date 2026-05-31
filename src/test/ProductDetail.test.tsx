import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductDetail } from "../components/Product/ProductDetail";
import { Product } from "../types";

vi.mock("../hooks/useCart", () => ({
  useCartSync: () => ({ addToCartWithSync: vi.fn() }),
}));
vi.mock("../hooks/usePriceUpdates", () => ({
  usePriceUpdates: () => ({ livePrice: null, priceChange: null }),
}));

// SHF-08: dangerouslySetInnerHTML XSS
describe("ProductDetail — dangerouslySetInnerHTML XSS (SHF-08)", () => {
  it("renders raw HTML from the server including script tags", () => {
    const xssPayload = '<img src=x onerror="window.__xss=1">';
    const product: Product = {
      id: "p1",
      name: "Test Product",
      description: xssPayload,
      price: 9.99,
      stock: 5,
      category: "test",
      imageUrl: null,
      variants: [],
    };

    const { container } = render(<ProductDetail product={product} userId={null} />);

    // The bug: description is rendered via dangerouslySetInnerHTML.
    // The img tag with onerror is present in the DOM — a real browser would execute it.
    const imgEl = container.querySelector("img[onerror]");
    expect(imgEl).not.toBeNull(); // demonstrates the bug: malicious HTML is in the DOM
  });
});
