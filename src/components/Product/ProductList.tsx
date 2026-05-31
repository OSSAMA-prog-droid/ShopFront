import React, { useState } from "react";
import { Product } from "../../types";
import { ProductCard } from "./ProductCard";

interface Props {
  products: Product[];
  userId: string | null;
}

type SortKey = "price-asc" | "price-desc" | "name";

// BUG SHF-15: Filter and sort state lives only in component state — never synced to the URL.
// If the user selects "Price: Low to High" and shares the URL, the recipient sees the
// default sort. Browser back/forward also loses the selected filters. Deep-linking to a
// filtered view is impossible. Fix: use URLSearchParams via useSearchParams.
export function ProductList({ products, userId }: Props) {
  // BUG SHF-15: These should be read from / written to URL search params
  const [sort, setSort] = useState<SortKey>("name");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category ?? "other")))];

  const filtered = products.filter(
    (p) => categoryFilter === "all" || p.category === categoryFilter
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="product-list">
      <div className="product-list__controls">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="product-list__filter"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="product-list__sort"
        >
          <option value="name">Name (A–Z)</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="product-list__grid">
        {sorted.map((product) => (
          <ProductCard key={product.id} product={product} userId={userId} />
        ))}
      </div>

      {sorted.length === 0 && (
        <p className="product-list__empty">No products match your filters.</p>
      )}
    </div>
  );
}
