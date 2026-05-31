import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Product } from "../types";
import { ProductDetail } from "../components/Product/ProductDetail";
import { useShop } from "../context/ShopContext";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

// BUG SHF-14: The fetchProduct async function inside useEffect has no try/catch.
// If the server returns a 404 or the network fails, the unhandled Promise rejection
// crashes the component silently — the user sees a blank page and the loading spinner
// stays on forever. Fix: wrap the async call in try/catch and set an error state.
export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useShop();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // BUG SHF-14: async IIFE with no try/catch — errors are swallowed silently
    (async () => {
      const res = await axios.get<{ data: Product }>(`${API}/products/${id}`);
      // If axios throws (404, network error, etc.) this line never runs,
      // loading stays true forever, and no error is shown to the user.
      setProduct(res.data.data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <p className="product-page__loading">Loading product...</p>;
  if (!product) return <p className="product-page__not-found">Product not found.</p>;

  return (
    <main className="product-page">
      <ProductDetail product={product} userId={user?.id ?? null} />
    </main>
  );
}
