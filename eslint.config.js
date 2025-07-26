import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: { js },
    extends: ["js/recommended", "prettier"],
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "warn",
      eqeqeq: ["error", "always"],
      curly: "error",
      "prefer-const": "error",
      "arrow-spacing": ["error", { before: true, after: true }],
      "object-curly-spacing": ["error", "always"],
      semi: ["error", "always"],
      quotes: ["error", "single", { avoidEscape: true }],
      "comma-dangle": ["error", "only-multiline"],
    },
  },
]);
