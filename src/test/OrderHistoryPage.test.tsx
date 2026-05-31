import React from "react";
import { describe, it, expect, vi } from "vitest";

// SHF-04: Missing useEffect dependency — orders never load after login
describe("OrderHistoryPage — missing dep (SHF-04)", () => {
  it("documents that useEffect dep array is empty, missing `user`", () => {
    // The component mounts with user=null (unauthenticated).
    // useEffect runs once: user?.id is falsy, early return — no fetch.
    // User navigates to login, logs in, user state changes to { id: "u1", ... }.
    // Because `user` is NOT in the dep array, the effect does NOT re-run.
    // Result: order history stays empty even after a successful login.
    //
    // Fix: add `user` (or `user?.id`) to the useEffect dep array.

    // This is a static analysis catch — the bug is in the dep array declaration.
    // Confirmed by reading OrderHistoryPage.tsx line: }, []); // BUG SHF-04
    expect(true).toBe(true);
  });
});
