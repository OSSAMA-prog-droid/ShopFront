import React, { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  loadMore: () => Promise<void>;
  hasMore: boolean;
  children: React.ReactNode;
  threshold?: number;
}

// BUG SHF-13: No in-flight guard on loadMore. When the IntersectionObserver fires
// and loadMore is triggered, a second intersection (e.g. fast scroll) can trigger
// loadMore again before the first Promise resolves. This sends parallel duplicate
// requests and often appends the same page of results twice, producing duplicate
// product cards in the list.
export function InfiniteScroll({ loadMore, hasMore, children, threshold = 200 }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  // BUG SHF-13: This loading flag is declared but never checked before calling loadMore.
  // A proper fix sets loading=true before the call and checks `if (loading) return` at
  // the top of the observer callback.
  const [loading, setLoading] = useState(false);

  const handleIntersect = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!entry.isIntersecting || !hasMore) return;
      // BUG SHF-13: Missing guard: if (loading) return;
      // Without it, multiple intersections before the first resolves fire parallel calls.
      setLoading(true);
      try {
        await loadMore();
      } finally {
        setLoading(false);
      }
    },
    [hasMore, loadMore] // BUG SHF-13: `loading` is missing from deps, so the stale closure
    // always sees loading=false and never short-circuits
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: `${threshold}px`,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect, threshold]);

  return (
    <div className="infinite-scroll">
      {children}
      <div ref={sentinelRef} className="infinite-scroll__sentinel" />
      {loading && <p className="infinite-scroll__loading">Loading more...</p>}
      {!hasMore && <p className="infinite-scroll__end">No more products.</p>}
    </div>
  );
}
