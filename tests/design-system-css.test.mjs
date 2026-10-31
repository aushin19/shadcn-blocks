import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"

import { findDesignSystemCssViolations } from "../scripts/check-design-system-css.mjs"

const currentGlobalStyles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8")

test("allows the current shadcn token stylesheet", () => {
  assert.deepEqual(findDesignSystemCssViolations(currentGlobalStyles), [])
})

test("rejects custom component selectors", () => {
  const violations = findDesignSystemCssViolations(`${currentGlobalStyles}\n.card { background: red; }`)

  assert.ok(violations.some((violation) => violation.includes("Only :root and .dark token selectors")))
})

test("rejects non-token declarations in theme blocks", () => {
  const violations = findDesignSystemCssViolations(
    currentGlobalStyles.replace("@theme inline {", "@theme inline {\n  .button { color: red; }")
  )

  assert.ok(violations.some((violation) => violation.includes("@theme inline may contain design-token custom properties only")))
})

test("rejects new shared tokens in global CSS", () => {
  const violations = findDesignSystemCssViolations(
    currentGlobalStyles.replace("--background: oklch(1 0 0);", "--component-background: oklch(1 0 0);")
  )

  assert.ok(violations.some((violation) => violation.includes("is not an existing global token")))
})

test("rejects custom CSS in the global base layer", () => {
  const violations = findDesignSystemCssViolations(
    currentGlobalStyles.replace("@layer base {", "@layer base {\n  body { font-size: 18px; }")
  )

  assert.ok(violations.some((violation) => violation.includes("Use only the approved @apply utilities")))
})

test("rejects additional imports", () => {
  const violations = findDesignSystemCssViolations(`${currentGlobalStyles}\n@import "./components.css";`)

  assert.ok(violations.some((violation) => violation.includes("The import")))
})
