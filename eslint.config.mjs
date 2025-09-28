// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import storybook from "eslint-plugin-storybook";
import prettier from "eslint-plugin-prettier";

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

  // Prettier 규칙 추가
  {
    plugins: { prettier },
    rules: {
      "prettier/prettier": "error", // 포맷팅을 ESLint 에러로 잡음
    },
  },
];

export default eslintConfig;
