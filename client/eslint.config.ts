import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // generated output and build artifacts
  { ignores: ["dist/**", "bindings/**"] },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      globals: globals.browser,
    },
    plugins: {
      js,
      react: pluginReact,
    },
    extends: [
      ...tseslint.configs.recommended,
      pluginReact.configs.flat.recommended,
      "js/recommended",
      // automatic JSX runtime: no React import needed in scope
      pluginReact.configs.flat["jsx-runtime"],
    ],
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // TypeScript checks these itself; the core rules misfire on types
      "no-unused-vars": "off",
      "no-undef": "off",
      // props are typed with TypeScript
      "react/prop-types": "off",
    },
  },
  {
    // build config runs in Node
    files: ["*.config.{js,ts}"],
    languageOptions: { globals: globals.node },
  },
]);
