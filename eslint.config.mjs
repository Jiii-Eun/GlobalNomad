// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginImport from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import storybook from "eslint-plugin-storybook";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js 기본 규칙
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 무시할 경로
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "storybook-static/**",
    ],
  },

  // Storybook 규칙
  ...storybook.configs["flat/recommended"],

  // Prettier 규칙
  {
    plugins: { prettier, import: eslintPluginImport },
    rules: {
      // prettier
      "prettier/prettier": "error",

      // import 정렬
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // node "fs", "path"
            "external", // npm 패키지
            "internal", // alias (@/components/* 등)
            ["parent", "sibling", "index"],
            "object", // import * as foo from "bar";
            "type", // import type { Foo } from "bar";
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
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];

export default eslintConfig;
