import { plugin as shadcn } from "@shadcn/lint"
import tsParser from "@typescript-eslint/parser"
import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

import rawComponents from "./scripts/eslint-plugin-raw-components.mjs"
import { installedShadcnUiFiles } from "./scripts/shadcn-ui-files.mjs"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: installedShadcnUiFiles,
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { shadcn, rawComponents },
    settings: {
      shadcn: {
        ui: ["@/components/ui", "@/registry/ui"],
      },
    },
    rules: {
      "shadcn/no-restyle": ["error", {
        allow: ["layout", "spacing", "typography", "color"],
        message: "Use only static layout, spacing, typography, and design-token color utilities. Preserve component shape and effects.",
      }],
      "shadcn/no-raw-colors": "error",
      "shadcn/no-arbitrary-values": ["error", {
        allow: [
          "bg-(--*-*)",
          "border-(--*-*)",
          "fill-(--*-*)",
          "font-(--*-*)",
          "outline-(--*-*)",
          "ring-(--*-*)",
          "shadow-(--*-*)",
          "stroke-(--*-*)",
          "text-(color:--*-*)",
        ],
        message: "Use a component-local CSS variable alias that references an existing global token.",
      }],
      "shadcn/no-inline-styles": ["error", {
        allow: ["--*"],
        message: "Only local CSS variable aliases to existing global tokens may appear in a style object.",
      }],
      "shadcn/no-unknown-classes": "error",
      "shadcn/require-static-classes": "error",
      "rawComponents/local-token-aliases": "error",
    },
  },
  {
    files: [
      "app/**/*.{js,jsx,ts,tsx}",
      "components/**/*.{js,jsx,ts,tsx}",
      "registry/blocks/**/*.{js,jsx,ts,tsx}",
      "registry/ui/**/*.{js,jsx,ts,tsx}",
    ],
    ignores: [
      "app/layout.tsx",
      "components/theme-provider.tsx",
      ...installedShadcnUiFiles,
    ],
    plugins: { rawComponents },
    rules: {
      "rawComponents/no-visual-overrides": "error",
      "rawComponents/no-presentation-wrappers": "error",
      "rawComponents/no-decorative-assets": "error",
      "rawComponents/no-stylesheet-imports": "error",
    },
  },
  {
    files: [
      "components/**/*.{js,jsx,ts,tsx}",
      "registry/blocks/**/*.{js,jsx,ts,tsx}",
      "registry/ui/**/*.{js,jsx,ts,tsx}",
    ],
    ignores: [
      "components/theme-provider.tsx",
      ...installedShadcnUiFiles,
    ],
    plugins: { rawComponents },
    rules: {
      "rawComponents/no-non-shadcn-components": "error",
    },
  },
  {
    files: ["components/ui/carousel.tsx", "hooks/use-mobile.ts"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
])

export default eslintConfig
