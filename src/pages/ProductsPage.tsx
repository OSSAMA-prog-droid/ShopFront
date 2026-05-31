import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Product } from "../types";
import { ProductList } from "../components/Product/ProductList";
import { InfiniteScroll } from "../components/shared/InfiniteScroll";
import { useShop } from "../context/ShopContext";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
const PAGE_SIZE = 20;

export function ProductsPage() {
  const { user } = useShop();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<{ data: Product[]; total: number }>(`${API}/products?page=1&limit=${PAGE_SIZE}`)
      .then((res) => {
        setProducts(res.data.data);
        setHasMore(res.data.data.length < res.data.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    const res = await axios.get<{ data: Product[]; total: number }>(
      `${API}/products?page=${nextPage}&limit=${PAGE_SIZE}`
    );
    setProducts((prev) => [...prev, ...res.data.data]);
    setPage(nextPage);
    setHasMore(products.length + res.data.data.length < res.data.total);
  }, [page, products.length]);

  if (loading) return <p>Loading products...</p>;

  return (
    <main className="products-page">
      <h1>All Products</h1>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
        <ProductList products={products} userId={user?.id ?? null} />
      </InfiniteScroll>
    </main>
  );
}
