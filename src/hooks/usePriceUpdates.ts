import { useState, useEffect } from "react";

const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:4000";

// BUG SHF-03: WebSocket connection is opened on mount but never closed on unmount.
// Every time the user navigates to a product page and back, a new WebSocket is opened.
// After visiting 10 products, there are 10 active WebSocket connections all receiving
// price updates and calling setState on unmounted components — causing React's
// "Can't perform a state update on an unmounted component" warning and a memory leak.
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

    // BUG: No cleanup — ws.close() is never called when the component unmounts
    // return () => ws.close(); ← this line is missing
  }, [productId]);

  return { livePrice, priceChange };
}
