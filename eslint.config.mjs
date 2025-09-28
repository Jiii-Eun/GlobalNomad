// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import { dirname } from "path";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  // 무시할 경로
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "storybook-static/**",
      "next-env.d.ts",
    ],
  },

  // ESLint 기본 규칙
  js.configs.recommended,

  // TypeScript 강화 규칙
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,

  // Next.js 규칙
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Storybook 규칙
  ...storybook.configs["flat/recommended"],

  // Prettier 충돌 방지
  eslintConfigPrettier,

  {
    plugins: {
      prettier,
      import: eslintPluginImport,
      "jsx-a11y": jsxA11y,
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      // Prettier
      "prettier/prettier": "error",

      // React
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",

      // Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // 접근성
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",

      // import 정렬
      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external"],
            ["internal"],
            ["parent", "sibling", "index"],
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-duplicates": "error",
      "import/newline-after-import": "error",
      "import/no-unresolved": "error",

      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { React: "writable" },
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
        typescript: { project: "./tsconfig.json" },
      },
    },
  },

  // 특수 파일 규칙
  {
    files: ["next-env.d.ts"],
    rules: { "@typescript-eslint/triple-slash-reference": "off" },
  },
];

export default config;
