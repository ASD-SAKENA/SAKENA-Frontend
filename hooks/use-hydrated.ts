"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns `false` during SSR and the first client render, then `true` once the
 * component has hydrated. Use it to gate client-only reads (storage, `window`,
 * `matchMedia`, …) so the first client render matches the server and avoids a
 * hydration mismatch.
 *
 * @example
 * const hydrated = useHydrated();
 * const value = hydrated ? readClientOnlyValue() : fallback;
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
