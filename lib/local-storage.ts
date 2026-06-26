/** Safe wrapper around localStorage — handles SSR and SecurityError transparently. */
export const ls = {
  get(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  set(key: string, value: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore SecurityError in sandboxed contexts
    }
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

/**
 * Zustand-compatible StateStorage adapter.
 * Pass to createJSONStorage: `storage: createJSONStorage(() => persistStorage)`
 */
export const persistStorage = {
  getItem: (key: string) => ls.get(key),
  setItem: (key: string, value: string) => ls.set(key, value),
  removeItem: (key: string) => ls.remove(key),
};
