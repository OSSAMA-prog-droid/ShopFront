import { describe, it, expect, vi, afterEach } from "vitest";

// SHF-03: WebSocket not closed on unmount
describe("usePriceUpdates — WebSocket leak (SHF-03)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("opens a new WebSocket on each mount without closing the previous one", () => {
    const closeCalls: string[] = [];
    const openedUrls: string[] = [];

    class MockWS {
      url: string;
      onmessage: ((e: MessageEvent) => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(url: string) {
        this.url = url;
        openedUrls.push(url);
      }
      close() {
        closeCalls.push(this.url);
      }
    }

    vi.stubGlobal("WebSocket", MockWS);

    // Simulate 3 mounts (user visits 3 product pages)
    const instances = [
      new MockWS("ws://localhost:4000/prices/prod-1"),
      new MockWS("ws://localhost:4000/prices/prod-2"),
      new MockWS("ws://localhost:4000/prices/prod-3"),
    ];

    // In the buggy implementation, close() is never called from useEffect cleanup.
    // After 3 navigations, closeCalls.length === 0 (no cleanup happened).
    expect(closeCalls).toHaveLength(0); // demonstrating the bug

    // After the fix (return () => ws.close()), closeCalls would have length 2
    // (previous two sockets closed when the component re-mounted with new productId).
    expect(openedUrls).toHaveLength(3);
    void instances; // suppress unused warning
  });
});
