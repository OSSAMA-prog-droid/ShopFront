import React, { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../types";
import { ProductList } from "../components/Product/ProductList";
import { ProductSearch } from "../components/Product/ProductSearch";
import { useShop } from "../context/ShopContext";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export function HomePage() {
  const { user } = useShop();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<{ data: Product[] }>(`${API}/products/featured`)
      .then((res) => setFeatured(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="home-page">
      <section className="home-page__hero">
        <h1>Welcome to ShopFront</h1>
        <p>Discover thousands of products at unbeatable prices.</p>
        <ProductSearch userId={user?.id ?? null} />
      </section>

      <section className="home-page__featured">
        <h2>Featured Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ProductList products={featured} userId={user?.id ?? null} />
        )}
      </section>
    </main>
  );
}
