import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: [
        "app/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "api/**/*.ts",
        "queries/**/*.ts",
        "schemas/**/*.ts",
        "stores/**/*.ts",
        "hooks/**/*.ts",
        "lib/**/*.ts",
      ],
      exclude: ["**/*.test.{ts,tsx}", "**/*.d.ts", "ui/**", ".next/**"],
    },
  },
});
