/** @type {import("prettier").Config} */
const config = {
  // Core formatting
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: "all",
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,

  // JSX
  bracketSameLine: false,
  bracketSpacing: true,

  // Plugins
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],

  // tailwindcss plugin: point to the CSS entry that has @theme
  tailwindStylesheet: "./app/globals.css",

  // Import order — groups are separated by an empty line
  importOrder: [
    // React core — always first
    "^react$",
    "^react-dom$",
    "^react-dom/(.*)$",
    "^react/(.*)$",

    // Next.js
    "^next$",
    "^next/(.*)$",

    // Third-party packages
    "<THIRD_PARTY_MODULES>",

    // Internal — app layer (pages, config, global styles)
    "^@/app/(.*)$",

    // Internal — UI and components
    "^@/components/(.*)$",
    "^@/ui/(.*)$",

    // Internal — data layer
    "^@/queries/(.*)$",
    "^@/api/(.*)$",
    "^@/services/(.*)$",

    // Internal — state
    "^@/stores/(.*)$",
    "^@/hooks/(.*)$",

    // Internal — utilities and types
    "^@/providers/(.*)$",
    "^@/lib/(.*)$",
    "^@/schemas/(.*)$",
    "^@/types/(.*)$",

    // Relative imports last
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderCaseInsensitive: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
};

export default config;
