"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * App theme provider. Drives the dashboard palette via a `data-theme`
 * attribute on <html> (dark default). The marketing/auth screens use their
 * own always-dark tokens, so they are unaffected by the toggle.
 */
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      themes={["dark", "light"]}
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
