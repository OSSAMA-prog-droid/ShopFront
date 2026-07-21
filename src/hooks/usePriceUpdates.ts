import { useState, useEffect } from "react";

const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:4000";

export function usePriceUpdates(productId: string) {
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/prices/${productId}`);

    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data as string) as { price: number; change: "up" | "down" };
      setLivePrice(data.price);
      setPriceChange(data.change);
    };

    ws.onerror = () => {
      console.error(`[prices] WebSocket error for product ${productId}`);
    };

    return () => ws.close();
  }, [productId]);

  return { livePrice, priceChange };
}
