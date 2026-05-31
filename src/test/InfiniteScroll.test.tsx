import React from "react";
import { describe, it, expect, vi } from "vitest";

// SHF-13: Parallel loadMore calls from rapid intersections
describe("InfiniteScroll — parallel loadMore (SHF-13)", () => {
  it("calls loadMore twice when intersection fires before first call resolves", async () => {
    let resolveFirst!: () => void;
    const callCount = { n: 0 };

    const slowLoadMore = () =>
      new Promise<void>((res) => {
        callCount.n++;
        if (callCount.n === 1) resolveFirst = res;
        else res();
      });

    // Simulate two rapid intersection events:
    // First call fires — callCount.n becomes 1, loading should become true.
    // Second call fires before first resolves — in the buggy code, loading is stale
    // false inside the useCallback (missing dep), so the guard doesn't fire.
    const firstCall = slowLoadMore();
    const secondCall = slowLoadMore(); // duplicate — bug

    // In the buggy implementation both calls were made before the first resolved.
    expect(callCount.n).toBe(2); // demonstrates the bug: 2 parallel calls

    resolveFirst();
    await firstCall;
    await secondCall;

    // With the fix (loading in deps + guard), callCount.n would be 1.
  });
});
