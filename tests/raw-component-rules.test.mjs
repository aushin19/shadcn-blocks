import assert from "node:assert/strict"
import test from "node:test"
import { Linter } from "eslint"

import rawComponents from "../scripts/eslint-plugin-raw-components.mjs"

const linter = new Linter({ configType: "flat" })
const config = [
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { rawComponents },
    rules: {
      "rawComponents/no-decorative-assets": "error",
      "rawComponents/no-non-shadcn-components": "error",
    },
  },
]

function lint(source) {
  return linter.verify(source, config, { filename: "registry/blocks/example.jsx" })
}

test("allows icon-only JSX from the configured Lucide library", () => {
  const messages = lint(`
    import { BookOpenIcon } from "lucide-react"
    export function Example() {
      return <BookOpenIcon aria-hidden="true" />
    }
  `)

  assert.deepEqual(messages, [])
})

test("rejects icon packages outside the configured Lucide library", () => {
  const messages = lint(`
    import { BookOpen } from "@heroicons/react/24/outline"
    export function Example() {
      return <BookOpen />
    }
  `)

  assert(messages.some((message) => message.messageId === "iconImport"))
})

test("rejects non-icon Lucide components in JSX", () => {
  const messages = lint(`
    import { Command } from "lucide-react"
    export function Example() {
      return <Command />
    }
  `)

  assert(messages.some((message) => message.messageId === "componentImport"))
})
