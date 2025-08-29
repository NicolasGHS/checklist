import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
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
      "plugin:react/jsx-runtime", // 👈 Voor automatic JSX runtime
    ],
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);
