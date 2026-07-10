import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Product } from "../types";
import { ProductDetail } from "../components/Product/ProductDetail";
import { useShop } from "../context/ShopContext";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useShop();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await axios.get<{ data: Product }>(`${API}/products/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Product not found.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p className="product-page__loading">Loading product...</p>;
  if (error || !product) return <p className="product-page__not-found">Product not found.</p>;

  return (
    <main className="product-page">
      <ProductDetail product={product} userId={user?.id ?? null} />
    </main>
  );
}
