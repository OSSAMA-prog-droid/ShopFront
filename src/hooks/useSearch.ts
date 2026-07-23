import { useState, useEffect } from "react";
import axios from "axios";
import { Product } from "../types";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export function useSearch(query: string) {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    setLoading(true);
    setError(null);

    axios
      .get<{ data: Product[] }>(`${API}/products/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
      .then((res) => {
        setResults(res.data.data);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(err.message);
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setLoading(false);
      });

    return () => controller.abort();
  }, [query]);

  return { results, loading, error };
}