"use client";

import { type RefObject, useEffect, useRef } from "react";

interface Options {
  /** Whether there is another page to fetch. */
  hasMore: boolean;
  /** True while a fetch is already in flight (prevents duplicate fetches). */
  isLoading: boolean;
  /** Called when the sentinel scrolls into view and a fetch is allowed. */
  onLoadMore: () => void;
  /** Scroll container to observe within. Defaults to the viewport when omitted. */
  rootRef?: RefObject<Element | null>;
  /** Root margin so we prefetch slightly before the sentinel is visible. */
  rootMargin?: string;
}

/**
 * Returns a ref to attach to a sentinel element at the bottom of a scroll
 * container. When the sentinel intersects `rootRef` (or the viewport) and
 * `hasMore` is true and no fetch is in flight, `onLoadMore` fires.
 */
export function useInfiniteScroll<T extends HTMLElement = HTMLDivElement>({
  hasMore,
  isLoading,
  onLoadMore,
  rootRef,
  rootMargin = "200px",
}: Options) {
  const sentinelRef = useRef<T | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { root: rootRef?.current ?? null, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isLoading, rootMargin, onLoadMore, rootRef]);

  return sentinelRef;
}
