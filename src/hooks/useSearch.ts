import { useState, useEffect } from "react";
import axios from "axios";
import { Product } from "../types";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

// BUG SHF-02: Race condition — no AbortController used.
// User types "cam" → request A fires. User types "camera" → request B fires.
// If request A is slower (cache miss) and arrives after B, it overwrites B's results.
// User sees results for "cam" even though they searched for "camera".
export function useSearch(query: string) {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    // No AbortController — previous in-flight request is never cancelled
    axios
      .get<{ data: Product[] }>(`${API}/products/search?q=${encodeURIComponent(query)}`)
      .then((res) => {
        setResults(res.data.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

    // No cleanup function to abort the request
  }, [query]);

  return { results, loading, error };
}
