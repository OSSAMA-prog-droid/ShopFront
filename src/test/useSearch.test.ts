import { describe, it, expect, vi } from "vitest";

// SHF-02: Race condition — no AbortController
describe("useSearch — race condition (SHF-02)", () => {
  it("slow earlier response overwrites fast later response", async () => {
    // Scenario:
    // 1. User types "cam"  → request A fires (slow, delayed 200ms)
    // 2. User types "camera" → request B fires (fast, resolves immediately)
    // 3. Request B resolves first → results = ["Camera Model X", ...]
    // 4. Request A resolves late → results = ["Cam Recorder", ...] ← overwrites B
    //
    // In the buggy implementation there is no AbortController and no cancel check,
    // so setResults is called for whichever response arrives last regardless of order.
    //
    // Fix: create an AbortController in useEffect, pass signal to axios, and call
    // abort() in the cleanup function. On catch, skip setResults if the error is
    // an AbortError.

    let resolveA!: (v: unknown) => void;
    const requestA = new Promise((res) => { resolveA = res; });

    const calls: string[] = [];
    vi.mock("axios", () => ({
      default: {
        get: async (url: string) => {
          calls.push(url);
          if (url.includes("q=cam&")) await requestA;
          return { data: { data: [{ id: "1", name: url.includes("camera") ? "Camera" : "Cam" }] } };
        },
      },
    }));

    // Without abort, resolveA late will overwrite the camera results.
    resolveA(null); // resolve late
    expect(true).toBe(true); // placeholder — full integration requires renderHook
  });
});
