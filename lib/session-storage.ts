/** Safe wrapper around sessionStorage — handles SSR and SecurityError transparently. */
export const ss = {
  get(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },

  set(key: string, value: string): void {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // ignore SecurityError / quota in sandboxed contexts
    }
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};
