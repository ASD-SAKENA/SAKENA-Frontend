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
      // app/** (routes and their page-local components) is deliberately out
      // of scope for this unit-test pass - it's covered in the next,
      // integration-test stage instead. Including it here would just dilute
      // the number with files nothing was ever meant to touch yet.
      include: [
        "components/**/*.{ts,tsx}",
        "api/**/*.ts",
        "queries/**/*.ts",
        "schemas/**/*.ts",
        "stores/**/*.ts",
        "hooks/**/*.ts",
        "lib/**/*.ts",
        "services/**/*.ts",
      ],
      exclude: ["**/*.test.{ts,tsx}", "**/*.d.ts", "ui/**", ".next/**"],
    },
  },
});
