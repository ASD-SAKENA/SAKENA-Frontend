import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Auto-generated service worker files
    "public/workbox-*.js",
    "public/sw.js",
    "public/fallback-*.js",
  ]),
  {
    rules: {
      // Enforce import type for type-only imports
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // No any — use unknown and narrow
      "@typescript-eslint/no-explicit-any": "error",

      // No unused variables (underscore prefix allowed for intentional ignores)
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // No console.log left in committed code
      "no-console": ["error", { allow: ["warn", "error"] }],

      // No direct fetch — always use @/services/http
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message: "Use the http client from @/services/http instead of fetch.",
        },
      ],

      // No restricted imports — enforce project conventions
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../../../../../*"],
              message:
                "Avoid very deep relative imports (5+ levels). Use path aliases (@/) instead.",
            },
          ],
          paths: [
            {
              name: "axios",
              message:
                "Import http from @/services/http instead of axios directly.",
            },
          ],
        },
      ],
    },
  },
  // Infrastructure files: proxy server and build scripts are Node environments
  {
    files: [
      "proxy.ts",
      "app/sw.ts",
      "**/sw.ts",
      "scripts/**/*.{js,mjs,ts,mjs}",
    ],
    rules: {
      "no-console": "off",
      "no-restricted-globals": "off",
    },
  },
]);

export default eslintConfig;
