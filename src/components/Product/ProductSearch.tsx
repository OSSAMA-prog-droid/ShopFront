import React, { useState, useCallback } from "react";
import { useSearch } from "../../hooks/useSearch";
import { ProductCard } from "./ProductCard";

interface Props {
  userId: string | null;
}

// BUG SHF-11: The onSubmit handler is wrapped in useCallback with an empty dep array.
// This means it permanently captures the query value from the first render (empty string).
// Typing in the input updates local state but the submitted search never changes —
// every search submits "" — unless the parent re-mounts the component.
export function ProductSearch({ userId }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");

  const { results, loading, error } = useSearch(query);

  // BUG SHF-11: useCallback with [] dep array — onSubmit captures the stale
  // inputValue from first render. Should be [inputValue] or no useCallback at all.
  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setQuery(inputValue); // inputValue is stale here — always ""
    },
    [] // missing inputValue dependency
  );

  return (
    <div className="product-search">
      <form onSubmit={onSubmit} className="product-search__form">
        <input
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search products..."
          className="product-search__input"
        />
        <button type="submit" className="product-search__btn">
          Search
        </button>
      </form>

      {loading && <p className="product-search__loading">Searching...</p>}
      {error && <p className="product-search__error">{error}</p>}

      {results.length > 0 && (
        <div className="product-search__results">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} userId={userId} />
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <p className="product-search__empty">No products found for "{query}".</p>
      )}
    </div>
  );
}
